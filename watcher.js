class Watcher {
  constructor(vm, prop, callback) {
    this.vm = vm;
    this.prop = prop;
    this.callback = callback;
    // 初始化的时候this.get()触发了Observer中的get，这时订阅者被添加到了Dep中
    this.value = this.get();
  }
  update() {
    const value = this.vm.$data[this.prop];
    const oldValue = this.value;
    if (value !== oldValue) {
      this.value = value;
      this.callback(value);
    }
  }
  get() {
    Dep.target = this;
    const value = this.vm.$data[this.prop]; // 这一步很关键，触发了Observer中的get
    Dep.target = null;
    return value;
  }
}