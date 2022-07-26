import * as PIXI from "pixi.js";
import { ref, inject } from "vue";
import bus from "@/lib/bus";
import { ElMessage } from "element-plus";
import png_aim_red from "@/assets/aim_red.png";
import png_aim_green from "@/assets/aim_green.png";
export default function () {
  // 元素池
  const elementPool = inject<any>("elementPool");
  // 当前元素
  const currentElements = inject<any>("currentElements");
  // 打印参数
  const printingParameters = inject<any>("printingParameters");
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
          
          container: controller.value.containers.content,
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
  function onDragAnchorStart(this: any, event: any, element: any) {
    console.log("anchor start");
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

  const getAnchorPoint = (x: number, y: number, type: string) => {
    let aim = new Image();
    aim.src = type === "red" ? png_aim_red : png_aim_green;

    const sprite = PIXI.Sprite.from(aim);
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;

    sprite.buttonMode = true;

    sprite.width = 100;
    sprite.height = 100;

    sprite.interactive = true;
    sprite.on("pointerdown", onDragAnchorStart);
    sprite.on("pointerup", onDragAnchorEnd);
    sprite.on("pointerupoutside", onDragAnchorMove);
    return sprite;
  };

  // 增加定位锚点
  const addAnchorPoint = () => {
    const anchorPoint_a = getAnchorPoint(0, 0, "red");
    controller.value.app.stage.addChild(anchorPoint_a);
    const anchorPoint_b = getAnchorPoint(
      controller.value.app.screen.width,
      controller.value.app.screen.height,
      "red"
    );
    controller.value.app.stage.addChild(anchorPoint_b);
    printingParameters.value.anchorPoints.a = anchorPoint_a;
    printingParameters.value.anchorPoints.b = anchorPoint_b;
  };

  //  增加矫正锚点
  const addFixedPoint = () => {
    const anchorPoint_a = getAnchorPoint(
      controller.value.app.screen.width,
      0,
      "green"
    );
    controller.value.app.stage.addChild(anchorPoint_a);
    const anchorPoint_b = getAnchorPoint(
      0,
      controller.value.app.screen.height,
      "green"
    );
    controller.value.app.stage.addChild(anchorPoint_b);
    printingParameters.value.fixedPoints.a = anchorPoint_a;
    printingParameters.value.fixedPoints.b = anchorPoint_b;
  };

  // 计算矫正参数
  const getAdjustParam = (removePoints: boolean = false) => {
    if (
      !(
        printingParameters.value.anchorPoints.a &&
        printingParameters.value.anchorPoints.b &&
        printingParameters.value.fixedPoints.a &&
        printingParameters.value.fixedPoints.b
      )
    ) {
      return {
        anchorPoints: { a: null, b: null },
        fixedPoints: { a: null, b: null },
        x: 0,
        y: 0,
        scale: 1,
      };
    }
    const rectOnCanvasWidth = Math.abs(
      printingParameters.value.anchorPoints.a.x -
        printingParameters.value.anchorPoints.b.x
    );
    const rectOnCanvasHeight = Math.abs(
      printingParameters.value.anchorPoints.a.y -
        printingParameters.value.anchorPoints.b.y
    );
    const rectOnCanvasSize = rectOnCanvasWidth * rectOnCanvasHeight;
    const rectOnPrintWidth = Math.abs(
      printingParameters.value.fixedPoints.a.x -
        printingParameters.value.fixedPoints.b.x
    );
    const rectOnPrintHeight = Math.abs(
      printingParameters.value.fixedPoints.a.y -
        printingParameters.value.fixedPoints.b.y
    );
    const rectOnPrintSize = rectOnPrintWidth * rectOnPrintHeight;
    const result = {
      x:
        printingParameters.value.fixedPoints.a.x -
        printingParameters.value.anchorPoints.a.x,
      y:
        printingParameters.value.fixedPoints.a.y -
        printingParameters.value.anchorPoints.a.y,
      scale: rectOnPrintSize / rectOnCanvasSize,
    };
    printingParameters.value = {
      ...printingParameters.value,
      ...result,
    };

    // 清除锚点精灵图
    if (removePoints) {
      controller.value.app.stage.removeChild(
        printingParameters.value.anchorPoints.a
      );
      controller.value.app.stage.removeChild(
        printingParameters.value.anchorPoints.b
      );
      controller.value.app.stage.removeChild(
        printingParameters.value.fixedPoints.a
      );
      controller.value.app.stage.removeChild(
        printingParameters.value.fixedPoints.b
      );
    }

    return printingParameters.value;
  };

  return {
    pxToMm,
    pxToCm,
    mmToPx,
    cmToPx,
    addAnchorPoint,
    addFixedPoint,
    getAdjustParam,
    activeElement,
    deactiveElement,
    getFileToUrl,
    subscribeDragEvent,
  };
}
