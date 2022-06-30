import * as PIXI from "pixi.js";
export default class Image {
  sprite: any = {};
  app: any = {};
  url = "";
  id = "";

  constructor(app: any) {
    this.app = app;
    // 生成随机ID
    this.id =
      "image-" +
      (Math.random() + new Date().getTime()).toString(32).slice(0, 8);
  }

  init(url: string, option: any) {
    this.url = url;
    this.sprite = PIXI.Sprite.from(url);
    this.sprite.anchor.set(0.5);
    this.sprite.x = option?.x || this.app.screen.width / 2;
    this.sprite.y = option?.y || this.app.screen.height / 2;

    this.sprite.width = option?.width || this.sprite.width;
    this.sprite.height = option?.height || this.sprite.height;
    this.sprite.zIndex = option?.zIndex || this.sprite.zIndex;

    this.app.stage.addChild(this.sprite);
  }

  reset() {
    console.log("reset");
    console.log(this.sprite);
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
