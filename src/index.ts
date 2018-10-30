declare global {
  interface Window {
    wx: InterfaceWechat;
  }
}
import Event from './lib/event-emitter';

type Warning = (msg: string) => void;
type HasProp = (target: object, property: string) => boolean;
type CheckKey = (keys: string[] | string, params: object) => boolean;
type Format = (config: InterfaceConfig) => InterfaceConfig;

interface InterfaceConfig {
  title: string;
  link: string;
  imgUrl: string;
  desc: string;
}
interface InterfaceShare {
  init(conf: object): void;
}
interface InterfaceRouter {
  beforeEach(thunk: ((to: object, from: object, next: (() => any)) => any));
}
interface InterfaceWechat {
  ready(callback: () => any): void;
  onMenuShareAppMessage(config: InterfaceConfig): void;
  onMenuShareTimeline(config: InterfaceConfig): void;
}

// 简单工具函数
const warning: Warning =
  (msg: string): void => console.warn(`[global-wechat-share]: ${msg}`);
const hasProp: HasProp =
  (target: object, property: string): boolean => Object.prototype.hasOwnProperty.call(target, property);

// 事件中心
const event = new Event();

// 常量
const HAS_RUN_DEFAULT_SHARE = `hasRunDefaultShare-`;

// 检验参数包
const checkKey: CheckKey =
 (keys: string[] | string, params: object) => {
  if (typeof keys === 'string') {
    keys = keys.split(',').map((key: string): string => key.trim());
  } else if (!Array.isArray(keys)) {
    warning(`keys must be a comma-separated set of Strings or an Array!`);
  }
  return keys.every((key: string): boolean => hasProp(params, key));
};

// 格式化参数包，过滤无用参数并校验
const format: Format = (config: InterfaceConfig): InterfaceConfig => {
  const nodeEnv: string = process.env.NODE_ENV || 'production';
  if (nodeEnv !== 'production') {
    const c: boolean = checkKey('title, link, imgUrl, desc', config);
    if (!c) {
      warning(`default-config should contains these keys: ` + 'title, link, imgUrl, desc');
    }
  }
  const { title, link, imgUrl, desc } = config;
  return { title, link, imgUrl, desc };
};

export default class Share implements InterfaceShare {
  private defaultConfig: InterfaceConfig | null;
  private customConfig: InterfaceConfig | null;
  private router: object;
  private uid: number;
  private isDebug: boolean;
  private wx: InterfaceWechat;

  constructor(Vue, router, wx, options: { isDebug?: boolean } = {}) {
    const self = this;
    this.defaultConfig = null;
    this.customConfig = null;
    this.router = router;
    this.uid = 0;
    this.isDebug = options.isDebug || false;
    this.wx = wx || window.wx;

    // 挂载全局方法$initShare，传入自定义分享配置 或 回调函数
    // 用于在每页初始化默认分享后再覆盖自定义分享
    function initShare(arg: (() => any)): void;
    function initShare(arg: InterfaceConfig): void;
    function initShare(arg): void {
      let callback: () => any = () => {};
      if (Object.prototype.toString.call(arg) === '[object Object]') {
        self.customConfig = format(arg);
        callback = () => {
          self.wx.ready(() => {
            self.wx.onMenuShareAppMessage((self.customConfig as InterfaceConfig));
            self.wx.onMenuShareTimeline((self.customConfig as InterfaceConfig));
          });
        };
      } else if (typeof arg === 'function') {
        callback = arg;
      }
      if (self.isDebug) {
        console.log(`on uid: `, self.uid);
      }
      event.on(HAS_RUN_DEFAULT_SHARE + self.uid, callback);
    }
    Vue.prototype.$initShare = initShare;
  }

  public init(defaultConfig: InterfaceConfig): void {
    this.defaultConfig = format(defaultConfig);

    this.initHook();
  }

  // 初始化钩子
  private initHook() {
    const self = this;
    const router = this.router;
    const config: InterfaceConfig = {
      ...(this.defaultConfig as InterfaceConfig),
    };

    const runDefaultShare: (conf: InterfaceConfig) => Promise<void> =
      (conf: InterfaceConfig) => new Promise((resolve, reject) => {
        this.wx.ready(() => {
          this.wx.onMenuShareAppMessage(conf);
          this.wx.onMenuShareTimeline(conf);
          resolve();
        });
      });

    const markAsRan: (uid: number) => Promise<void> =
      (uid: number) => new Promise((resolve, reject) => {
        if (this.isDebug) {
          console.log(`emit uid:`, uid);
        }
        event.emit(HAS_RUN_DEFAULT_SHARE + uid);
      });

    // 首次运行默认分享
    runDefaultShare(config).then(() => markAsRan(self.uid));

    (router as InterfaceRouter).beforeEach(function runShare(to, from, next) {
      self.uid++;

      runDefaultShare(config).then(() => markAsRan(self.uid));

      next();
    });
  }
}
