App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
   globalData: {
     appid: 'wxe14b2061adc7c448',//appid需自己提供，此处的appid我随机编写    
     secret: 'f751490c37dc5f7bd30f12190b96009f',//secret需自己提供，此处的secret我随机编写   
    openid: '你好', //自定义  
    https: "https://xcx.mqu.cn/miniapp",
    new_http:"http://192.168.0.8",
    is_login:function(){
 

    }
  }
})
