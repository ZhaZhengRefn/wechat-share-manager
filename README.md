# wechat-share-manager
管理微信全局默认分享与局部页面自定义分享

# 用法
## 依赖
这个插件依赖于:
1. 首先您需要保证已经初始化js-sdk。即[步骤三，通过config接口注入权限认证](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)
2. 使用Vue与Vue Router

## 语法
```js
yarn add wechat-share-manager
```

```js
// 初始化js-sdk后，在入口文件处初始化默认分享
import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入weixin-js-sdk或者通过script标签全局引入
import wx from 'weixin-js-sdk'
// ...初始化router
const router = new VueRouter([{
  name: 'index',
  path: '/index',
}])
import Share from 'wechat-share-manager'
const share = new Share(Vue, router, wx)
share.init({
  title: 'foo',
  desc: 'bar',
  imgUrl: 'http://via.placeholder.com/350x350',
  link: 'https://github.com/ZhaZhengRefn/wechat-share-manager',
})
```

```js
// 单个路由页面的自定义分享
// 例如，可以在某个钩子函数中初始化。本插件会保证自定义分享会在默认分享初始化后再初始化。
// ...
mounted() {
  this.$initShare({
    title: 'custom-foo',
    desc: 'custom-bar',
    imgUrl: 'http://via.placeholder.com/350x350',
    link: 'https://github.com/ZhaZhengRefn/wechat-share-manager',  
  })
}
// ...
```

```js
// 也可以传入回调函数，自定义分享流程
mounted() {
  this.$initShare(() => {
    wx.ready(() => {
      wx.onMenuShareTimeline(timeLineShareConfigObj);
      wx.onMenuShareAppMessage(AppMessageShareConfigObj);
    });    
  })  
}
```
