/* 
实现一个数据监听器，当数据变化时，通过dep.notify()通知相关订阅者
 */
function defineReactive(data, key, value) {
  observer(value);
  const dep = new Dep();
  Object.defineProperty(data, key, { // Object.defineProperty(reactiveData, title
    get: function() {
      if(Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set: function(newValue) {
      if(value !== newValue) {
        value = newValue;
        dep.notify();
      }
    }
  });
}

function observer(data) {
  if(!data || typeof data !== 'object') {
    return;
  }
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key]); // defineReactive(reactiveData, title, reactiveData[title]);
  });
}


// Dep可以理解为订阅者组织，里面有所有的订阅者
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    console.log('触发notify');
    
    // 通知Watcher更新视图
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}

Dep.target = null;