interface InterfaceEvent {
  on(type: string, fn: () => any): void;
  emit(type: string, ...args: any[]): void;
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

  public on(type: string, fn: () => any): void {
    // 立即触发已被emit的事件
    const stack: any[] = this.stack[type];
    if (Array.isArray(stack)) {
      const remains = stack;
      remains.forEach((args: any[]) => {
        try {
          fn.call(this, ...args);
        } catch (error) {
          console.log(error);
        }
      });
      delete this.stack[type];
    }
    // 订阅事件
    let events: Array<() => any> = this.events[type];
    if (Array.isArray(events)) {
      events = [];
    }
    events.push(fn);
  }

  public emit(type: string, ...args: any[]): void {
    if (!Array.isArray(this.events[type])) {
      let stack: any[][] = this.stack[type];
      if (!Array.isArray(this.stack[type])) {
        stack = [];
      }
      stack.push(args);
      return;
    }
    // 触发事件回调
    const fns: Array<() => any> = this.events[type];
    fns.forEach((fn: () => any) => {
      try {
        fn.call(this, ...args);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
