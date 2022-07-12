import { Cache } from "./cache";
import { reactive, watch } from "vue";

class WatchService {
  constructor() {
    // this.obj = this.caches.elementPool.isEmpty ? { id: undefined, name: undefined } : this.caches.elementPool.json;
  }

  /**
   * 创建缓存对象Storage
   */
  caches: any = {
    canvasName: new Cache("canvasName"),
    elementPool: new Cache("elementPool"),
  };

  /**
   * 响应式对象用于watch（可从缓存读取）
   */
  obj = reactive<any>({
    canvasName: this.caches.canvasName.value,
    elementPool: this.caches.elementPool.isEmpty
      ? { id: undefined, name: undefined }
      : this.caches.elementPool.json,
  });

  /**
   * 注册事件watch（可缓存监听对象）
   */
  events = {
    canvasName: (callback?: any) => this.setWatch("canvasName", callback),
    elementPool: (callback?: any) => this.setWatch("elementPool", callback, true),
  };

  /**
   * 设置对象监听事件，缓存监听对象
   * @param key 对应obj对象属性
   * @param isJson 是否是json对象,是则JSON.stringify
   * @param callback 回调函数，有参数（current, prev）
   */
  private setWatch(key: string, callback?: any, isJson?: boolean) {
    watch(
      () => this.obj[key],
      (current, prev) => {
        if (this.caches[key]) {
          this.caches[key].setValue(
            !isJson ? current : JSON.stringify(current)
          ); // 缓存
        }
        callback && callback(current, prev);
      }
    );
  }
}

const watchServ = new WatchService();

export default watchServ;
