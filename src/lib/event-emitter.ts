interface InterfaceEvent {
  on(type: string, fn: () => {}): void;
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
    if (Array.isArray(this.events[type])) {
      this.events[type] = [];
    }
    (this.events[type] as Array<() => {}>).push(fn);
  }

  public emit(type: string, ...args: any[]): void {
    const fns: Array<() => {}> = this.events[type];
    fns.forEach((fn: () => {}) => {
      try {
        fn.call(this, ...args);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
