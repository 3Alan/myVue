class Watcher {
  constructor(vm, prop, callback) {
    this.vm = vm;
    this.prop = prop;
    this.callback = callback;
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
    const value = this.vm.$data[this.prop];
    Dep.target = null;
    return value;
  }
}