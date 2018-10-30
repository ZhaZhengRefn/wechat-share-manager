type Args = any[];
type Func = () => any;
interface InterfaceEvent {
  on(type: string, fn: Func): void;
  emit(type: string, ...args: Args): void;
}
interface FunctionMap {
  [prop: string]: [];
}

export default class Event implements InterfaceEvent {
  private events: FunctionMap;
  private stack: FunctionMap;

  constructor() {
    this.events = {};
    this.stack = {};
  }

  public on(type: string, fn: Func): void {
    // 立即触发已被emit的事件
    const stack: Args[] = this.stack[type];
    if (Array.isArray(stack)) {
      stack.forEach((args: Args) => {
        try {
          fn.call(this, ...args);
        } catch (error) {
          console.log(error);
        }
      });
      delete this.stack[type];
    }
    // 订阅事件
    let events: Func[] = this.events[type];
    if (Array.isArray(events)) {
      events = [];
    }
    events.push(fn);
  }

  public emit(type: string, ...args: Args): void {
    if (!Array.isArray(this.events[type])) {
      let stack: Args[] = this.stack[type];
      if (!Array.isArray(this.stack[type])) {
        stack = [];
      }
      stack.push(args);
      return;
    }
    // 触发事件回调
    const fns: Func[] = this.events[type];
    fns.forEach((fn: Func) => {
      try {
        fn.call(this, ...args);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
