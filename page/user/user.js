

  var app= getApp()
  var http = app.globalData.https
  var new_http = app.globalData.new_http
  var appid = app.globalData.appid
  var secret = app.globalData.secret
  var loginObj= {}
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    user_name:false,
    user_image:false,
    has_image:false,
    is_login:false,
    st:"请点击此处授权",
    member_data:0,
    key:false,
    collec_nb:0,
    poin_:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  login_:function(e){
      // 获取用户信息
    wx.showLoading({
      title: '加载中',
    })

      console.log(e)
      var that=this;
      var info_json =JSON.parse(e.detail.rawData);
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求

            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',

              success: function (res) {
                // openid获取成功
                console.log(res.data)
                // 请求自己的登录接口
                wx.request({
                  url: new_http + '/hyapi/user/wxlogin?common_param={"openid":"' + res.data.openid +'","unionid":"wxunionid_t1","userinfo":'+e.detail.rawData+'}', //仅为示例，并非真实的接口地址
                  header:{
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    that.setData({
                      key:res.data.data.token,
                      expire:res.data.data.expire,
                      user_image: info_json.avatarUrl,
                      user_name: info_json.nickName
                    })
                    console.log(res.data)
                    wx.setStorageSync('dl_key', res.data.data.token);
                    wx.setStorageSync('expire', res.data.data.expire);
                    wx.setStorageSync('user_image', info_json.avatarUrl);
                    wx.setStorageSync('user_name', info_json.nickName);
                    that.get_jf();
                    that.get_sc();
                    wx.hideLoading()
                  }
                })
              }
            })




          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
  },
  get_sc:function(){
      var that=this;
      wx.request({
        url: new_http + '/hyapi/user/getpoint?common_param={"shop_id":0}&token=' + that.data.key, //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.errcode == '0') {
            that.setData({
              poin_: res.data.data
            })
          }
        }
      })
  },
  get_jf:function(){
    var that=this;
    wx.request({
      url: new_http + '/hyapi/user/getcollectgoodslist?common_param={"page_index":1,"page_size":""}&token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          that.setData({
            collec_nb: res.data.data.data.length
          })
        }
      }
    })
  },
  onLoad: function (options) {
    
    var that = this;
    that.setData({
      key: wx.getStorageSync('dl_key')||false
    })
    that.get_jf();
    that.get_sc();


    if(that.data.key){
        that.setData({
          user_image: wx.getStorageSync('user_image'),
          user_name: wx.getStorageSync('user_name')
        })
    }


    
    // var d = wx.getStorageSync('use') || false;
    // console.log(d)
    // if (d != false) {
    //   console.log("进入")
    //   that.setData({
    //     user_name: d.name,
    //     user_image: d.img,
    //     has_image: true

    //   })
    // }
      var that=this;
    // wx.request({
    //   url: http +'/index.php?model=member_index', //仅为示例，并非真实的接口地址
    //   data: {
    //     key: that.data.key
       
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       member_data: res.data.datas.member_info

    //     })
    //   }
    // })
  },
  deng:function(){
    var that=this
    console.log(1)
    wx.login({
      success: function (res) {

        wx.request({
          url: http + '/index.php?model=login&fun=get_openid', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 200) {
              var oid = res.data.datas.data             
              wx.openSetting({
                success: (res) => {

                  res.authSetting = {
                    "scope.userInfo": true
                  }
                  that.setData({
                    st: "以授权请再次点击即可登录"
                  })

                }
              })
              wx.getUserInfo({
                success: function (res) {
                  console.log(res)
                  var userInfo = res.userInfo
                  var nickName = userInfo.nickName
                  var avatarUrl = userInfo.avatarUrl
                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                  var province = userInfo.province
                  var city = userInfo.city
                  var country = userInfo.country
                  var infoArr = [avatarUrl, gender, province, city, country]
                  loginObj.name = nickName
                  loginObj.img = avatarUrl
                  that.setData({
                    user_name: nickName,
                    user_image: avatarUrl,
                    has_image: true
                  })
                  var lb = {}
                  var logokey = wx.getStorageSync('key');
                 
                
                
                    lb = {
                      openid: oid,
                      user_info: infoArr,
                      nickname: nickName,
                      client: 'miniapp'
                    }
                  

                  wx.request({
                    url: http + '/index.php?model=login&fun=auto', //仅为示例，并非真实的接口地址
                    method: 'POST',
                    data: lb,
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      console.log(res.data)
                      if (res.data.code == 200) {

                        wx.setStorageSync('key', res.data.datas.key)

                        wx.setStorageSync('use', loginObj)
                        that.setData({
                          key: wx.getStorageSync('key')
                        })
                        wx.request({
                          url: http + '/index.php?model=member_index', //仅为示例，并非真实的接口地址
                          data: {
                            key: that.data.key

                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success: function (res) {
                            console.log(res.data)
                            that.setData({
                              member_data: res.data.datas.member_info

                            })
                          }
                        })

                      }

                    },
                    fail: function () {
                      console.log("失败")
                    }
                  })
                }
              })










            }
          },
          fail: function () {
            console.log("失败")
          }
        })


      
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log()
    var that = this;
    that.get_jf();
    that.get_sc();






	// that.setData({
  //     key: wx.getStorageSync('dl_key') || false
  //   })
  // var d = wx.getStorageSync('use') || false;
  //   console.log(d)
  //   if (d != false) {
  //     console.log("进入")
  //     that.setData({
  //       user_name: d.name,
  //       user_image: d.img,
  //       has_image: true

  //     })
  //   }
  //   wx.request({
  //     url: http + '/index.php?model=member_index', //仅为示例，并非真实的接口地址
  //     data: {
  //       key: that.data.key

  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       that.setData({
  //         member_data: res.data.datas.member_info

  //       })
  //     }
  //   })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
  tip_login:function(){
    wx.showToast({
      title: '请授权登录后才可以查看',
      icon: 'none',
      duration: 3000
    })
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