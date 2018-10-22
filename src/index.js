import wx from 'weixin-js-sdk'
import Event from './lib/event-emitter'

const HAS_RUN_DEFAULT_SHARE = 'hasRunDefaultShare-'
// notice: 事件中心有个特性。在监听事件之前触发事件，事件中心会先缓存这个事件，并在监听的时候以触发时的参数立即触发。
const event = new Event()

const warning = msg => console.warn(`[global-wechat-share]: ${msg}`)
const hasProp = (...args) => Object.prototype.hasOwnProperty.call(...args)

/**
 * 检验参数包
 * @param {键名} keys 
 * @param {参数包} params 
 */
const checkKey = function(keys, params) {
  if (params == null || typeof params !== 'object') return false
  if (!Array.isArray(keys)) {
    if (typeof keys !== 'string') {
      warning(`keys must be a comma-separated set of Strings or an Array!`)
    }
    keys = keys.split(',').map(key => key.trim())
  }
  return keys.every(key => hasProp(params, key))
}

/**
 * 格式化参数包，过滤无用参数并校验
 * @param {参数包} config 
 */
const format = function(config) {
  if (process.env.NODE_ENV !== 'production') {
    const c = checkKey('title, link, imgUrl, desc', config)
    if (!c) {
      warning(`default-config should contains these keys: ` + 'title, link, imgUrl, desc')
    }
  }
  const { title, link, imgUrl, desc } = config
  return { title, link, imgUrl, desc }
}

class Share {
  constructor(Vue, router) {
    let _self = this

    this.defaultConfig = null
    this.customConfig = null
    this._Vue = Vue
    this.router = router
    this._uid = 0

    // 挂载全局方法$initShare，传入自定义分享配置
    // 用于在每页初始化默认分享后再覆盖自定义分享
    this._Vue.prototype.$initShare = function(arg) {
      let callback = () => {}
      if (Object.prototype.toString.call(arg) === '[object Object]') {
        _self.customConfig = format(arg)
        callback = () => {
          wx.ready(() => {
            wx.onMenuShareAppMessage(_self.customConfig)
            wx.onMenuShareTimeline(_self.customConfig)
          })
        }        
      } else if(typeof arg === 'function') {
        callback = arg
      }
      event.on(HAS_RUN_DEFAULT_SHARE + _self._uid, callback.call(_self))
    }
  }

  /**
   * 对外暴露的接口。传入默认分享参数，初始化beforeEach钩子
   * @param {Object} defaultConfig 
   */
  init(defaultConfig) {
    this.defaultConfig = format(defaultConfig)

    this._initHook()
  }

  /**
   * 初始化beforeEach钩子
   */
  _initHook() {
    let _self = this
    const router = this.router
    const config = {
      ...this.defaultConfig,
    }

    const runDefaultShare = conf => {
      return new Promise((resolve, reject) => {
        wx.ready(() => {
          wx.onMenuShareAppMessage(conf)
          wx.onMenuShareTimeline(conf)
          resolve()
        })
      })
    }    
    const markAsRan = uid => {
      return new Promise((resolve, reject) => {
        event.emit(HAS_RUN_DEFAULT_SHARE + uid)
      })
    }

    // 首次运行默认分享
    runDefaultShare(config)
    .then(() => {
      return markAsRan(_self._uid)
    })

    // 每页切换中使用默认分享
    router.beforeEach(function(to, from, next){
      // uid标记一次路由的生命周期: beforeEach => run default share => run custom share 
      _self._uid++

      runDefaultShare(config)
      .then(() => {
        return markAsRan(_self._uid)
      })

      next()
    })
  }
}

module.exports = Share