class myVue{
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = document.querySelector(options.el); // 挂载的节点

    /* vm.$data.props 可以用 vm.props来替代*/
    Object.keys(this.$data).forEach(key => {
      this.ProxyData(key);
    });
    this.init();
  }
  init() {
    observer(this.$data);
    new Compile(this);
  }

  ProxyData(key) {
    Object.defineProperty(this, key, {
      get: function () {
        return this.$data[key];
      },
      set: function (value) {
        this.$data[key] = value;
      }
    })
  }
}