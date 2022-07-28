import * as PIXI from "pixi.js";
import { ref, inject } from "vue";
import bus from "@/lib/bus";
import { ElMessage } from "element-plus";
import png_aim_red_a from "@/assets/aim_red_a.png";
import png_aim_red_b from "@/assets/aim_red_b.png";
import png_aim_green_a from "@/assets/aim_green_a.png";
import png_aim_green_b from "@/assets/aim_green_b.png";
export default function () {
  // 元素池
  const elementPool = inject<any>("elementPool");
  // 当前元素
  const currentElements = inject<any>("currentElements");
  // 矫正参数
  const adjustPointsGroup = inject<any>("adjustPointsGroup");
  // 画布控制器
  const controller = ref<any>(null);
  // 初始化画布控制器
  bus.on("initByCanvas", (_controller) => {
    controller.value = _controller;
  });

  /** 像素转为mm*/
  let mmDiv: any = document.createElement("div");
  mmDiv.id = "mm";
  mmDiv.style.width = "1mm";
  document.querySelector("body")?.appendChild(mmDiv);
  // 原生方法获取浏览器对元素的计算值
  let mmUnit: any = document.getElementById("mm")?.getBoundingClientRect();

  // 删除mm元素
  document.querySelector("body")?.removeChild(mmDiv);

  const pxToMm = (px: number, float: number = 5) => {
    return parseFloat((px / mmUnit.width).toFixed(float));
  };

  const pxToCm = (px: number, float: number = 5) => {
    return parseFloat((pxToMm(px) / 10).toFixed(float));
  };

  const mmToPx = (mm: number, float: number = 2) => {
    return parseFloat((mm * mmUnit.width).toFixed(float));
  };

  const cmToPx = (cm: number, float: number = 2) => {
    return parseFloat(mmToPx(cm * 10).toFixed(float));
  };
  /** 图片转为PIXI可用格式*/
  const getFileToUrl = (event: any, cb: any) => {
    const files = event.target.files;
    if (!files[0]) {
      ElMessage.error("请选择图片");
      cb(false);
    }
    let filename = files[0].name;
    if (filename.lastIndexOf(".") <= 0) {
      ElMessage.error("请选择正确的图片文件");
      cb(false);
    }
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      // 获取图片长宽
      const img: any = new Image();
      img.src = fileReader.result;

      img.onload = () => {
        cb(fileReader.result, img);
      };
    });
    fileReader.readAsDataURL(files[0]);
  };

  let app: any;
  let selectedTarget: any;
  function onDragStart(this: any, event: any, element: any) {
    this.alpha = 0.5;
    selectedTarget = this;

    currentElements.value = [element];
    bus.emit("updateCurrentElements");
    bus.emit("updateCurrentTextStyle");
    app.stage.on("pointermove", onDragMove);
  }

  function onDragEnd(this: any) {
    selectedTarget.alpha = 1;

    app.stage.off("pointermove", onDragMove);
  }

  function onDragMove(this: any, event: any) {
    selectedTarget.parent.toLocal(
      event.data.global,
      null,
      selectedTarget.position
    );
  }

  /** 激活元素*/
  const activeElement = (id: string, option: any = {}) => {
    elementPool.value.find((element: any, index: number) => {
      if (element.id === id) {
        element.apply({
          id: id,
          zIndex: index,
          dragEvent: subscribeDragEvent,
          ...option,
        });
      }
    });
  };

  /** 失活元素 */
  const deactiveElement = (id: string) => {
    elementPool.value.find((element: any) => {
      if (element.id === id) {
        element.remove();
      }
    });
  };

  // 注册点击事件
  const subscribeDragEvent = (element: any) => {
    app = element.app;
    element.sprite.interactive = true;
    element.sprite.on("pointerdown", function (event: any) {
      onDragStart.call(element.sprite, event, element);
    });
    element.sprite.on("pointerup", onDragEnd);
    element.sprite.on("pointerupoutside", onDragEnd);
  };

  /** 添加定位锚点 */

  let selectedAnchor: any;
  function onDragAnchorStart(this: any, event: any) {
    this.alpha = 0.5;
    selectedAnchor = this;
    controller.value.app.stage.on("pointermove", onDragAnchorMove);
  }

  function onDragAnchorEnd(this: any) {
    selectedAnchor.alpha = 1;
    controller.value.app.stage.off("pointermove", onDragAnchorMove);
  }

  function onDragAnchorMove(this: any, event: any) {
    selectedAnchor.parent.toLocal(
      event.data.global,
      null,
      selectedAnchor.position
    );
  }

  /** 转换出锚点精灵图
   * 需要注意的是所有的B锚点坐标不能小于A锚点,矫正锚点拖动后需要实时算出矫正数据*/
  const getAnchorPoint = (x: number, y: number, type: string, ext?: any) => {
    let aim = new Image();
    aim.src = type;

    const sprite = PIXI.Sprite.from(aim);
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;

    sprite.buttonMode = true;

    sprite.width = controller.value.app.renderer.width / 5;
    sprite.height = sprite.width;

    sprite.interactive = true;
    sprite.on("pointerdown", onDragAnchorStart);
    sprite.on("pointerup", onDragAnchorEnd);
    sprite.on("pointerupoutside", onDragAnchorEnd);
    return sprite;
  };

  // 增加定位锚点
  const addAnchorPoint = () => {
    if (
      adjustPointsGroup.value.anchorPoints.a != null &&
      adjustPointsGroup.value.anchorPoints.b != null
    ) {
      adjustPointsGroup.value.anchorPoints.a.x = 0;
      adjustPointsGroup.value.anchorPoints.a.y = 0;
      adjustPointsGroup.value.anchorPoints.b.x =
        controller.value.app.screen.width;
      adjustPointsGroup.value.anchorPoints.b.y =
        controller.value.app.screen.height;
    } else {
      adjustPointsGroup.value.anchorPoints.a = null;
      adjustPointsGroup.value.anchorPoints.b = null;

      const anchorPoint_a = getAnchorPoint(0, 0, png_aim_red_a);
      controller.value.app.stage.addChild(anchorPoint_a);
      const anchorPoint_b = getAnchorPoint(
        controller.value.app.screen.width,
        controller.value.app.screen.height,
        png_aim_red_b,
        "isAnchorB"
      );
      controller.value.app.stage.addChild(anchorPoint_b);
      adjustPointsGroup.value.anchorPoints.a = anchorPoint_a;
      adjustPointsGroup.value.anchorPoints.b = anchorPoint_b;
    }
  };
  // 恢复定位点
  const restoreAnchorPoint = () => {
    if (adjustPointsGroup.value.anchorPoints.a) {
      controller.value.app.stage.addChild(
        adjustPointsGroup.value.anchorPoints.a
      );
    }
    if (adjustPointsGroup.value.anchorPoints.b) {
      controller.value.app.stage.addChild(
        adjustPointsGroup.value.anchorPoints.b
      );
    }
    if (adjustPointsGroup.value.fixedPoints.a) {
      controller.value.app.stage.addChild(
        adjustPointsGroup.value.fixedPoints.a
      );
    }
    if (adjustPointsGroup.value.fixedPoints.b) {
      controller.value.app.stage.addChild(
        adjustPointsGroup.value.fixedPoints.b
      );
    }
  };
  //  增加矫正锚点
  const addFixedPoint = () => {
    if (
      adjustPointsGroup.value.fixedPoints.a != null &&
      adjustPointsGroup.value.fixedPoints.b != null
    ) {
      adjustPointsGroup.value.fixedPoints.a.x = 0;
      adjustPointsGroup.value.fixedPoints.a.y = 0;
      adjustPointsGroup.value.fixedPoints.b.x =
        controller.value.app.screen.width;
      adjustPointsGroup.value.fixedPoints.b.y =
        controller.value.app.screen.height;
    } else {
      adjustPointsGroup.value.fixedPoints.a = null;
      adjustPointsGroup.value.fixedPoints.b = null;

      const fixedPoint_a = getAnchorPoint(0, 0, png_aim_green_a, "isFixedA");
      controller.value.app.stage.addChild(fixedPoint_a);
      const fixedPoint_b = getAnchorPoint(
        controller.value.app.screen.width,
        controller.value.app.screen.height,
        png_aim_green_b,
        "isFixedB"
      );
      controller.value.app.stage.addChild(fixedPoint_b);
      adjustPointsGroup.value.fixedPoints.a = fixedPoint_a;
      adjustPointsGroup.value.fixedPoints.b = fixedPoint_b;
    }
  };

  const cleanFixedPoint = () => {
    if (
      adjustPointsGroup.value.anchorPoints.a != null &&
      adjustPointsGroup.value.anchorPoints.b != null
    ) {
      adjustPointsGroup.value.anchorPoints.a.destroy();
      adjustPointsGroup.value.anchorPoints.a = null;
      adjustPointsGroup.value.anchorPoints.b.destroy();
      adjustPointsGroup.value.anchorPoints.b = null;
    }

    if (
      adjustPointsGroup.value.fixedPoints.a != null &&
      adjustPointsGroup.value.fixedPoints.b != null
    ) {
      adjustPointsGroup.value.fixedPoints.a.destroy();
      adjustPointsGroup.value.fixedPoints.a = null;
      adjustPointsGroup.value.fixedPoints.b.destroy();
      adjustPointsGroup.value.fixedPoints.b = null;
    }
  };

  // 计算矫正参数
  const getAdjustParam = (removePoints: boolean = false) => {
    if (
      !(
        adjustPointsGroup.value.anchorPoints.a &&
        adjustPointsGroup.value.anchorPoints.b &&
        adjustPointsGroup.value.fixedPoints.a &&
        adjustPointsGroup.value.fixedPoints.b
      )
    ) {
      return {
        anchorPoints: { a: null, b: null },
        fixedPoints: { a: null, b: null },
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      };
    }
    const rectOnCanvasWidth = Math.abs(
      adjustPointsGroup.value.anchorPoints.a.x -
        adjustPointsGroup.value.anchorPoints.b.x
    );
    const rectOnCanvasHeight = Math.abs(
      adjustPointsGroup.value.anchorPoints.a.y -
        adjustPointsGroup.value.anchorPoints.b.y
    );
    // const rectOnCanvasSize = rectOnCanvasWidth * rectOnCanvasHeight;
    const rectOnPrintWidth = Math.abs(
      adjustPointsGroup.value.fixedPoints.a.x -
        adjustPointsGroup.value.fixedPoints.b.x
    );
    const rectOnPrintHeight = Math.abs(
      adjustPointsGroup.value.fixedPoints.a.y -
        adjustPointsGroup.value.fixedPoints.b.y
    );
    // const rectOnPrintSize = rectOnPrintWidth * rectOnPrintHeight;
    const result = {
      x:
        adjustPointsGroup.value.fixedPoints.a.x -
        adjustPointsGroup.value.anchorPoints.a.x,
      y:
        adjustPointsGroup.value.fixedPoints.a.y -
        adjustPointsGroup.value.anchorPoints.a.y,
      scaleX: rectOnPrintWidth / rectOnCanvasWidth,
      scaleY: rectOnPrintHeight / rectOnCanvasHeight,
    };
    adjustPointsGroup.value = {
      ...adjustPointsGroup.value,
      ...result,
    };

    // 清除锚点精灵图
    if (removePoints) {
      controller.value.app.stage.removeChild(
        adjustPointsGroup.value.anchorPoints.a
      );
      controller.value.app.stage.removeChild(
        adjustPointsGroup.value.anchorPoints.b
      );
      controller.value.app.stage.removeChild(
        adjustPointsGroup.value.fixedPoints.a
      );
      controller.value.app.stage.removeChild(
        adjustPointsGroup.value.fixedPoints.b
      );
    }

    return adjustPointsGroup.value;
  };

  return {
    pxToMm,
    pxToCm,
    mmToPx,
    cmToPx,
    addAnchorPoint,
    addFixedPoint,
    cleanFixedPoint,
    restoreAnchorPoint,
    getAdjustParam,
    activeElement,
    deactiveElement,
    getFileToUrl,
    subscribeDragEvent,
  };
}
