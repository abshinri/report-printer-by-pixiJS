import * as PIXI from "pixi.js";
import Element from "./element";
export default class Image extends Element {
  url = "";
  type = "图片";

  constructor(app: any, containers: any) {
    super(app, containers);
  }

  reset(option: any) {
    const x = (this.sprite.x + (option?.adjust?.x ?? 0)) * (option?.scale ?? 1);
    const y = (this.sprite.y + (option?.adjust?.y ?? 0)) * (option?.scale ?? 1);
    const width = this.sprite.width * (option.scale ?? 1);
    const height = this.sprite.height * (option.scale ?? 1);
    this.sprite.destroy();
    this.apply(this.url, {
      x,
      y,
      width,
      height,
      id: this.id,
      zIndex: this.zIndex,
      dragEvent: this.dragEvent,
    });
  }

  apply(url: string, option: any) {
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

    option?.container
      ? option?.container.addChild(this.sprite)
      : this.containers.content.addChild(this.sprite);
    if (this.dragEvent != null) {
      this.dragEvent(this);
    }
  }
}
