type Args = any[];
type Func = () => any;
interface InterfaceEvent {
  on(type: string, fn: Func): void;
  emit(type: string, ...args: Args): void;
}
interface InterfaceFunctionMap {
  [prop: string]: [];
}

export default class Event implements InterfaceEvent {
  private events: InterfaceFunctionMap;
  private stack: InterfaceFunctionMap;

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
    if (!Array.isArray(this.events[type])) {
      this.events[type] = [];
    }
    (this.events[type] as Func[]).push(fn);
  }

  public emit(type: string, ...args: Args): void {
    if (!Array.isArray(this.events[type])) {
      if (!Array.isArray(this.stack[type])) {
        this.stack[type] = [];
      }
      (this.stack[type] as Args[]).push(args);
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
