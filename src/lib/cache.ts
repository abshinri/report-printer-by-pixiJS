export class Cache {
  key: string;
  storage: Storage;
  constructor(key: string, type = "session") {
    this.key = key;
    this.storage = type == "session" ? sessionStorage : localStorage;
  }
  get isEmpty(): boolean {
    return this.value == null;
  }
  get value(): string | null {
    return this.storage.getItem(this.key);
  }
  get json() {
    return this.isEmpty
      ? null
      : JSON.parse(this.storage.getItem(this.key) as string);
  }
  setValue(v: any) {
    if (v == null) {
      this.remove();
      return;
    }
    this.storage.setItem(this.key, v);
  }
  remove() {
    this.storage.removeItem(this.key);
  }
}
