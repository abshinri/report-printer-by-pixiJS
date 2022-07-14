import * as PIXI from "pixi.js";
import Element from "./element";
export default class Text extends Element {
  text = "";
  style = {
    fill: "#000000",
    fontWeight: "normal",
    fontFamily: "微软雅黑",
    fontStyle: "normal",
    fontSize: 24,
    textBaseline: "alphabetic",
    lineHeight: "",
    letterSpacing: 0,
    leading: 0,
    padding: 0,
    breakWords: true,
    wordWrap: true,
    wordWrapWidth: 320,
    align: "left",
  };
  type = "text";
  typeCn = "文本";

  constructor(app: any) {
    super(app);
  }

  reset(scale = 1) {
    const x = this.sprite.x * scale;
    const y = this.sprite.y * scale;
    this.style.fontSize = this.style.fontSize * scale;
    this.style.wordWrapWidth = this.style.wordWrapWidth * scale;
    this.sprite.destroy();
    this.apply({
      x,
      y,
      id: this.id,
      zIndex: this.zIndex,
      style: this.style,
      dragEvent: this.dragEvent,
    });
  }

  apply(option: any) {
    this.id = option?.id || "text-" + this.getRandomId();

    this.zIndex = option?.zIndex || 0;
    this.dragEvent = option?.dragEvent || null;

    this.sprite = new PIXI.Text(
      this.text,
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
