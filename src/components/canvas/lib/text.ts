import * as PIXI from "pixi.js";
import Element from "./element";
export default class Text extends Element {
  text = "";
  style = {
    fontFamily: "微软雅黑",
    fontSize: 24,
    breakWords: true,
    wordWrap: true,
    wordWrapWidth: 320,
    align: "left",
  };
  type = "文本";

  constructor(app: any, layer: any) {
    super(app, layer);
  }

  reset(scale = 1) {
    const x = this.sprite.x * scale;
    const y = this.sprite.y * scale;
    this.style.fontSize = this.style.fontSize * scale;
    this.style.wordWrapWidth = this.style.wordWrapWidth * scale;
    this.sprite.destroy();
    this.init(this.text, {
      x,
      y,
      id: this.id,
      zIndex: this.zIndex,
      style: this.style,
      dragEvent: this.dragEvent,
    });
  }

  init(text: string, option: any) {
    this.id = option?.id || "text-" + this.getRandomId();

    this.text = text;

    this.zIndex = option?.zIndex || 0;
    this.dragEvent = option?.dragEvent || null;

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
    if (this.dragEvent != null) {
      this.dragEvent(this);
    }
  }
}
