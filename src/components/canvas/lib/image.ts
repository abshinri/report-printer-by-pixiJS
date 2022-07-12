import * as PIXI from "pixi.js";
import Element from "./element";
export default class Image extends Element {
  url = "";
  type = "图片";

  constructor(app: any, layer: any) {
    super(app, layer);
  }

  reset(scale = 1) {
    const x = this.sprite.x * scale;
    const y = this.sprite.y * scale;
    const width = this.sprite.width * scale;
    const height = this.sprite.height * scale;
    this.sprite.destroy();
    this.init(this.url, {
      x,
      y,
      width,
      height,
      id: this.id,
      zIndex: this.zIndex,
      style: this.style,
      dragEvent: this.dragEvent,
    });
  }

  init(url: string, option: any) {
    this.id = "image-" + this.getRandomId();

    this.url = url;

    this.zIndex = option?.zIndex || 0;
    this.dragEvent = option?.dragEvent || null;

    this.sprite = PIXI.Sprite.from(url);
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
