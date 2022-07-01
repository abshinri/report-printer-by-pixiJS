import * as PIXI from "pixi.js";
export default class Text {
  sprite: any = {};
  app: any = {};
  layer: any = {};
  text = "";
  id = "";
  type = "文本";

  style = {
    fontFamily: "微软雅黑",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: ["#ffffff", "#00ff99"], // gradient
    stroke: "#4a1850",
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: "round",
  };

  // 生成随机id
  getRandomId() {
    return (Math.random() + new Date().getTime()).toString(32).slice(0, 8);
  }

  constructor(app: any, layer: any) {
    this.app = app;
    this.layer = layer;
  }

  init(text: string, option: any) {
    this.id = "text-" + this.getRandomId();

    this.text = text;
    this.sprite = new PIXI.Text(
      text,
      new PIXI.TextStyle(option?.style || this.style)
    );
    this.sprite.anchor.set(0.5);
    this.sprite.x = option?.x || this.app.screen.width / 2;
    this.sprite.y = option?.y || this.app.screen.height / 2;

    this.sprite.buttonMode = true;

    this.sprite.width = option?.width || this.sprite.width;
    this.sprite.height = option?.height || this.sprite.height;
    this.sprite.zIndex = option?.zIndex || this.sprite.zIndex;

    this.app.stage.addChild(this.sprite);
  }

  reset() {
    this.app.stage.addChild(this.sprite);
  }

  // 重设大小坐标等
  set(option: any) {
    this.sprite.x = option?.x || this.sprite.x;
    this.sprite.y = option?.y || this.sprite.y;
    this.sprite.width = option?.width || this.sprite.width;
    this.sprite.height = option?.height || this.sprite.height;
    this.sprite.zIndex = option?.zIndex || this.sprite.zIndex;
  }
}
