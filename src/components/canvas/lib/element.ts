import * as PIXI from "pixi.js";
export default class Element {
  sprite: any = {};
  app: any = {};
  layer: any = {};
  id = "";
  zIndex = 0;
  dragEvent:any = null;

  // 生成随机id
  getRandomId() {
    return (Math.random() + new Date().getTime()).toString(32).slice(0, 8);
  }

  constructor(app: any, layer: any) {
    this.app = app;
    this.layer = layer;
  }

  // 重设大小坐标等
  set(option: any) {
    this.sprite.x = option?.x || this.sprite.x;
    this.sprite.y = option?.y || this.sprite.y;
    this.sprite.width = option?.width || this.sprite.width;
    this.sprite.height = option?.height || this.sprite.height;
    this.sprite.zIndex = option?.zIndex || this.sprite.zIndex;
  }

  remove() {
    this.sprite.destroy();
  }
}
