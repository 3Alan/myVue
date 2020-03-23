class Compile {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.fragment = null;
    this.init();
  }
  init() {
    // 为了提高性能
    this.fragment = this.nodeFragment(this.el);
    this.compileNode(this.fragment);
    this.el.appendChild(this.fragment);
  }
  nodeFragment(el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while(child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  }
  compileNode(fragment) {
    let childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {

      if (this.isElementNode(node)) {
        this.compile(node);
      }

      let reg = /\{\{(.*)\}\}/;
      let text = node.textContent;



      if (reg.test(text)) {
        let prop = reg.exec(text)[1];
        this.compileText(node, prop); //替换模板
      }

      //编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileNode(node);
      }
    });
  }

  compile(node) {
    /* 便利dom节点的属性看是否有v-model指令 */
    let nodeAttrs = node.attributes;
    [...nodeAttrs].forEach(attr => {
      let name = attr.name;
      if (this.isDirective(name)) {
        let value = attr.value;
        if (name === "v-model") {
          this.compileModel(node, value);
        } 
        // else if (name === "v-on"){
          
        // }
      }
    });
  }

  compileModel(node, prop) {
    let val = this.vm.$data[prop];
    this.updateModel(node, val);

    new Watcher(this.vm, prop, (value) => {
      this.updateModel(node, value);
    });

    // 监听input时间并且将用户输入的值更新到$data中
    node.addEventListener('input', e => {
      let newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      this.vm.$data[prop] = newValue;
    });
  }

  compileText(node, prop) {
    let text = this.vm.$data[prop];
    this.updateView(node, text);
    new Watcher(this.vm, prop, (value) => {
      this.updateView(node, value);
    });
  }

  compileEvent(node, vm, exp, dir) {
    var eventType = dir.split(':')[1];
    var cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
        node.addEventListener(eventType, cb.bind(vm), false);
    }
  } 

  updateModel(node, value) {
    node.value = typeof value == 'undefined' ? '' : value;
  }

  updateView(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  }

  // 判断属性是否为指令
  isDirective(attr) {
    return attr.indexOf('v-') !== -1;
  }

  isTextNode(node) {
    return node.nodeType === 3;
  }

  isElementNode(node) {
    return node.nodeType === 1;
  }
}