import * as PIXI from "pixi.js";
import { ref, inject } from "vue";
import bus from "@/lib/bus";
import { ElMessage } from "element-plus";
export default function () {
  // 元素池
  const elementPool = inject<any>("elementPool");
  // 当前元素
  const currentElement = inject<any>("currentElement");
  // 画布控制器
  const controller = ref<any>(null);
  // 初始化画布控制器
  bus.on("initByCanvas", (_controller) => {
    controller.value = _controller;
  });

  // 图片转为PIXI可用格式
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
    this.scale.x *= 1.05;
    this.scale.y *= 1.05;

    currentElement.value = element;
    app.stage.on("pointermove", onDragMove);
  }

  function onDragEnd(this: any) {
    selectedTarget.alpha = 1;

    this.scale.x /= 1.05;
    this.scale.y /= 1.05;
    app.stage.off("pointermove", onDragMove);
  }

  function onDragMove(this: any, event: any) {
    selectedTarget.parent.toLocal(
      event.data.global,
      null,
      selectedTarget.position
    );
  }

  const pendingTextTemp = "测试文本,请删除";

  // 添加文本
  const addText = (
    pendingText: string = pendingTextTemp,
    pendingTextStyle: any,
    id?: string
  ) => {
    const text = controller.value.text();

    text.init(pendingText, {
      id: id || undefined,
      zIndex: elementPool.value.length + 1,
      style: pendingTextStyle,
      dragEvent: subscribeDragEvent,
    });

    elementPool.value.push(text);

    currentElement.value = text;
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

  return {
    addText,
    getFileToUrl,
    subscribeDragEvent,
  };
}
