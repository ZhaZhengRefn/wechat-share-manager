interface Config {
  title: string;
  link: string;
  imgUrl: string;
  desc: string;
}

type Warning = (msg: string) => void;
type HasProp = (target: object, property: string) => boolean;
type CheckKey = (keys: string[] | string, params: object) => boolean;
type Format = (config: Config) => Config;

const warning: Warning =
  (msg: string): void => console.warn(`[global-wechat-share]: ${msg}`);
const hasProp: HasProp =
  (target: object, property: string): boolean => Object.prototype.hasOwnProperty.call(target, property);

/**
 * 检验参数包
 * @param {键名} keys
 * @param {参数包} params
 */
const checkKey: CheckKey =
 (keys: string[] | string, params: object) => {
  if (typeof keys === 'string') {
    keys = keys.split(',').map((key: string): string => key.trim());
  } else if (!Array.isArray(keys)) {
    warning(`keys must be a comma-separated set of Strings or an Array!`);
  }
  return keys.every((key: string): boolean => hasProp(params, key));
};

/**
 * 格式化参数包，过滤无用参数并校验
 * @param {参数包} config
 */
const format: Format = (config: Config): Config => {
  if (process.env.NODE_ENV !== 'production') {
    const c: boolean = checkKey('title, link, imgUrl, desc', config);
    if (!c) {
      warning(`default-config should contains these keys: ` + 'title, link, imgUrl, desc');
    }
  }
  const { title, link, imgUrl, desc } = config;
  return { title, link, imgUrl, desc };
};
