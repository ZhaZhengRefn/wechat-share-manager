type IWarn = (msg: string) => void;

const warning: IWarn = (msg: string): void => console.warn(`[global-wechat-share]: ${msg}`);

export default class Share {
  constructor() {
    warning('');
  }
}
