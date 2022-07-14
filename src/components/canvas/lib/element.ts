interface LooseObject {
  [key: string]: any;
}
// 元素池
export default class Element implements LooseObject {
  sprite: any = null;
  app: any = null;
  id = "";
  zIndex = NaN;
  dragEvent: any = null;
  type = "element";

  // 生成随机id
  getRandomId() {
    return (Math.random() + new Date().getTime()).toString(32).slice(0, 8);
  }

  constructor(app: any) {
    this.app = app;
  }

  // 数据预转到资源池
  init(id?: string, option?: any) {
    this.id = id || "element-" + this.getRandomId();
    // 动态添加option属性到this上
    if (option) {
      for (const key in option) {
        if (option.hasOwnProperty(key)) {
          (<any>this)[key] = option[key];
        }
      }
    }
    return this;
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
    this.sprite = null;
  }
}
