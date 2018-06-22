var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var new_http = app.globalData.new_http
Page({

  /**
   * 页面的初始数据
   */
 
  data: {
    tp:new_http,
    s: true,
    banner: [],
    dcur: 1,
    toggle_price: true,
    show_more: false,
    liang: 100,
    banner_list:{},
    mbA_list: [],
    all_data: [],
    shi_data:"",
    feng_data:"",
    miao_data:"",
    days:0,
    hours:0,
    minutes:0,
    seconds:0,
    banner_data:[],
    jz_data:'00:00:00',
    xs_data:[],
    tp:new_http,
  },
  onPullDownRefresh: function () {
    console.log(12)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  more_one: function () {
    var that = this
    this.setData({
      show_more: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {




  },
  qk:function(){
    wx.clearStorageSync()
    console.log(1)
  },
  zero: function (n) {
    var that=this
    n = Math.abs(parseInt(n, 10));
    if (n <= 9) {
      n = "0" + n;
    }
    return String(n);
  },
  runTime: function (now, start, end,shi) {
    var shi_arr=[]
    var that=this
    var t;
    now = parseInt(now);
    start = parseInt(start);
    end = parseInt(end);
    if (now < start && now < end) {
      t = start; // 未开始
    } else if (now > start && now < end) {
      t = end; // 进行中
    } else if (now > start && now > end) {
      return false; // 已结束
    } else if (now === start || now === end) {
      // 刷新页面 location.reload();
      console.log('刷新页面')
      return false;
    }
    var differ = Math.abs(now - t);
   var  hour = that.zero(Math.floor(differ / 3600));
    var min = that.zero(Math.floor(differ % 3600 / 60));
    var sec = that.zero(Math.floor(differ % 60));
    that.setData({
      shi_data: hour,
      feng_data: min,
      miao_data: sec
    })
    
    now++;
    setTimeout(function () {
     that.runTime(now, start, end);
    }, 1000);
  },
  formatDateTime: function (timeStamp) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  onLoad: function () {
      // 请求轮播图数据
    var that=this;
    wx.request({
      url: new_http +'/hyapi/platform/getadslist?common_param={"ap_id":"1105"}', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
   
        that.setData({
          banner_data:res.data.data.adv_list
        })
      }
    })


    // 请求限时抢购数据
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);  
    wx.request({
      url: new_http + '/hyapi/goods/getdiscountgoodslist', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.errcode=='0'){
          
          that.setData({
            jz_data:that.formatDateTime(res.data.data.data[0].end_time),
            xs_data:res.data.data.data
          })
        }
      }
    })






    if (!wx.getStorageSync('dl_key')){
      wx.showToast({
        title: '请前往个人中心登录',
        icon: 'none',
        duration: 2000
      })
    }
     
   


    







    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //         },
    //         fail: function () {
    //           console.log(123)
    //         }
    //       })
    //     }
    //   }
    // })

    if (!wx.getStorageSync('dl_key')){
      wx.request({
        url: new_http + '/hyapi/user/login?common_param={"username":"test1","password":"123456"}&session=123456', //仅为示例，并非真实的接口地址
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.errmsg == "success") {
            wx.setStorageSync('dl_key', res.data.data.token)
          }
        }
      }) 

    }


   
    var that = this;
        // 请求接口权限
   







    wx.request({
      url: http + '/index.php?model=index&fun=index', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)

      
        for (var i = 0; i < res.data.datas.length; i++) {
          if (res.data.datas[i].goods2) {
            that.runTime(res.data.datas[i].goods2.now, res.data.datas[i].goods2.start, res.data.datas[i].goods2.end)
          }
        }
        that.setData({
          all_data: res.data.datas
        })
      }
    })

    // 登陆
  

    // var islogin = wx.getStorageSync('key');
    // if (!islogin) {
    //   console.log("登陆")
    //   wx.login({
    //     success: function (res) {
    //     console.log(res.code)
    //       wx.request({
    //         url: http + '/index.php?model=login&fun=get_openid', //仅为示例，并非真实的接口地址
    //         method: 'POST',
    //         data: { code: res.code},
    //         header: {
    //           'content-type': 'application/json' // 默认值
    //         },
    //         success: function (res) {
    //           if (res.data.code == 200) {
    //             var oid = res.data.datas.data
    //             wx.getUserInfo({
    //               success: function (res) {
    //                 console.log(res)
    //                 var userInfo = res.userInfo
    //                 var nickName = userInfo.nickName
    //                 var avatarUrl = userInfo.avatarUrl
    //                 var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //                 var province = userInfo.province
    //                 var city = userInfo.city
    //                 var country = userInfo.country
    //                 var infoArr = [avatarUrl, gender, province, city, country]
    //                 var lb = {}
    //                 loginObj.name = nickName
    //                 loginObj.img = avatarUrl
    //                 wx.setStorageSync('use', loginObj)
    //                 var logokey = wx.getStorageSync('key');
    //                   lb = {
    //                     openid: oid,
    //                     user_info: infoArr,
    //                     nickname: nickName,
    //                     client: 'miniapp'
    //                   }
    //                 console.log(lb)
    //                 wx.request({
    //                   url: http + '/index.php?model=login&fun=auto', //仅为示例，并非真实的接口地址
    //                   method: 'POST',
    //                   data: lb,
    //                   header: {
    //                     'content-type': 'application/json' // 默认值
    //                   },
    //                   success: function (res) {
    //                     console.log(res.data)
    //                     if (res.data.code == 200) {
    //                       wx.setStorageSync('key', res.data.datas.key)
    //                     }
    //                   },
    //                   fail: function () {
    //                     console.log("失败")
    //                   }
    //                 })
    //               }
    //             })
    //           }
    //         },
    //         fail: function () {
    //           console.log("失败")
    //         }
    //       })    
    //     }
    //   });
    // }
    // 登陆结束
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    var that=this
    // wx.request({
    //   url: http + '/index.php?model=index&fun=index', //仅为示例，并非真实的接口地址
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)


    //     for (var i = 0; i < res.data.datas.length; i++) {
    //       if (res.data.datas[i].goods2) {
    //         that.runTime(res.data.datas[i].goods2.now, res.data.datas[i].goods2.start, res.data.datas[i].goods2.end)
    //       }
    //     }
    //     that.setData({
    //       all_data: res.data.datas
    //     })
    //     wx.stopPullDownRefresh()
    //   }
    // })


    // var islogin = wx.getStorageSync('key');
    // if (!islogin) {
    //   console.log("登陆")
    //   wx.login({
    //     success: function (res) {
    //       console.log(res.code)
    //       wx.request({
    //         url: http + '/index.php?model=login&fun=get_openid', //仅为示例，并非真实的接口地址
    //         method: 'POST',
    //         data: { code: res.code },
    //         header: {
    //           'content-type': 'application/json' // 默认值
    //         },
    //         success: function (res) {
    //           console.log(123)
    //           console.log(res)
    //           if (res.data.code == 200) {
    //             var oid = res.data.datas.data
    //             wx.getUserInfo({
    //               success: function (res) {
    //                 console.log(res)
    //                 var userInfo = res.userInfo
    //                 var nickName = userInfo.nickName
    //                 var avatarUrl = userInfo.avatarUrl
    //                 var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //                 var province = userInfo.province
    //                 var city = userInfo.city
    //                 var country = userInfo.country
    //                 var infoArr = [avatarUrl, gender, province, city, country]
    //                 var lb = {}
    //                 loginObj.name = nickName
    //                 loginObj.img = avatarUrl
    //                 wx.setStorageSync('use', loginObj)
    //                 var logokey = wx.getStorageSync('key');
    //                 lb = {
    //                   openid: oid,
    //                   user_info: infoArr,
    //                   nickname: nickName,
    //                   client: 'miniapp'
    //                 }
    //                 console.log(lb)
    //                 wx.request({
    //                   url: http + '/index.php?model=login&fun=auto', //仅为示例，并非真实的接口地址
    //                   method: 'POST',
    //                   data: lb,
    //                   header: {
    //                     'content-type': 'application/json' // 默认值
    //                   },
    //                   success: function (res) {
    //                     console.log(res.data)
    //                     if (res.data.code == 200) {
    //                       wx.setStorageSync('key', res.data.datas.key)
    //                     }
    //                   },
    //                   fail: function () {
    //                     console.log("失败")
    //                   }
    //                 })
    //               }
    //             })
    //           }
    //         },
    //         fail: function () {
    //           console.log("失败")
    //         }
    //       })
    //     }
    //   });
    // }
    





    wx.request({
      url: new_http + '/hyapi/user/login?common_param={"username":"test1","password":"123456"}&session=123456', //仅为示例，并非真实的接口地址
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errmsg == "success") {
          wx.setStorageSync('dl_key', res.data.data.token)
        }

        wx.stopPullDownRefresh()
      }
    }) 


   
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
 
  }


})