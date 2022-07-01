import * as PIXI from "pixi.js";
export default function () {
  // 图片转为PIXI可用格式
  const getFileToUrl = (event: any, cb: any) => {
    const files = event.target.files;
    let filename = files[0].name;
    if (filename.lastIndexOf(".") <= 0) {
      return alert("请选择正确的图片文件");
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
  function onDragStart(this: any, event: any) {

    this.alpha = 0.5;
    selectedTarget = this;
    this.scale.x *= 1.05;
    this.scale.y *= 1.05;

    app.stage.on("pointermove", onDragMove);
  }

  function onDragEnd(this: any) {
    selectedTarget.alpha = 1;

    this.scale.x /= 1.05;
    this.scale.y /= 1.05;
    app.stage.off("pointermove", onDragMove);
  }

  function onDragMove(this: any, event: any) {
    selectedTarget.parent.toLocal(event.data.global, null, selectedTarget.position);
  }

  // 注册点击事件
  const subscribeDragEvent = (element: any) => {
    app = element.app;
    element.sprite.interactive = true;
    element.sprite.on("pointerdown", onDragStart);
    element.sprite.on("pointerup", onDragEnd);
    element.sprite.on("pointerupoutside", onDragEnd);
  };

  return {
    getFileToUrl,
    subscribeDragEvent,
  };
}
