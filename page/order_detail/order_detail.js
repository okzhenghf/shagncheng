
  var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage= 1
var total_page= 0;
  var hasmore
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    tp: new_http,
    order_info:{},
    zp_show:true,
    key:"",
    order_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that=this
    this.setData({
      key: wx.getStorageSync('dl_key'),
      order_id: options.order_id
    })
    console.log(that.data.order_id)


    wx.request({
      url: new_http + '/hyapi/order/getdetail?common_param={"order_id":"' + that.data.order_id+'"}&token='+that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      if(res.data.errcode=='0'){

        

          res.data.data.create_time =that.formatDateTime(res.data.data.create_time);
          res.data.data.finishtime = that.formatDateTime(res.data.data.finish_time);
          res.data.data.consigntime = that.formatDateTime(res.data.data.consign_time);
          res.data.data.paytime = that.formatDateTime(res.data.data.pay_time);
          res.data.data.address = res.data.data.address.replace(/&nbsp;/g, "\n");
        
        
          that.setData({
            order_info:res.data.data
          })
      }

      }
    })


    // wx.request({
    //   url: http +'/index.php?model=member_order&fun=order_info', //仅为示例，并非真实的接口地址
    //   data: {
    //     key: that.data.key,
    //     order_id: options.order_id
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       order_info:res.data.datas.order_info
    //     })
    //     if (res.data.datas.order_info.zengpin_list.length>0){
    //         that.setData({
    //           zp_show:true
    //         })
    //     }else{
    //       that.setData({
    //         zp_show: false
    //       })
    //     }

    //   }
    // })
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
  pay_order: function (e) {
    var that=this
    wx.request({
      url: http + '/index.php?model=member_payment&fun=pay_miniapp', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        pay_sn: e.target.dataset.pay_sn,
        rcb_pay: 0,
        password: "",
        pd_pay: 0,
        payment_code: "wxpay_mini",
        inajax: 1
      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {

            wx.showToast({
              title: '支付操作完成！如果您的订单状态没有改变，请耐心等待支付网关的返回结果。',
              icon: 'none',
              duration: 2000
            })
           
            wx.request({
              url: http + '/index.php?model=member_order&fun=order_info', //仅为示例，并非真实的接口地址
              data: {
                key: that.data.key,
                order_id: that.data.order_id
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data)
                that.setData({
                  order_info: res.data.datas.order_info
                })
                if (res.data.datas.order_info.zengpin_list.length > 0) {
                  that.setData({
                    zp_show: true
                  })
                } else {
                  that.setData({
                    zp_show: false
                  })
                }

              }
            })
          
          },
          'fail': function (res) {


            console.log(res)
            wx.showToast({
              title: '对不起，支付未完成或失败！',
              icon: 'none',
              duration: 2000
            })
        
          }
        })
      }
    })


  },
  again_buy:function(e){
    var that=this
      wx.showModal({
        title: '提示',
        content: '是否确认再次购买该商品',
        success: function (res) {
          if (res.confirm) {
            var flag = true;
            var arrAjax = e.target.dataset.cid.split(",")
            console.log(arrAjax)
            for (var i = 0; i < arrAjax.length; i++) {

              wx.request({
                url: http + '/index.php?model=member_cart&fun=cart_add', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                  quantity: 1,
                  key: that.data.key,
                  goods_id: arrAjax[i]
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log(res.data)
                  if (res.data.code != 200) {
                    flag = false
                  }


                },
                fail: function () {
                  flag = false
                }
              })

            }
            if (flag) {
              wx.showToast({
                title: '以加入购物车',
                icon: 'success',
                duration: 2000
              })
            }



          } else if (res.cancel) {

          }
        }
      })


    },
  cancel_order: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认取消该订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: http + '/index.php?model=member_order&fun=order_cancel', //仅为示例，并非真实的接口地址
            method: "POST",

            data: {
              order_id: e.target.dataset.order_id,
              key: that.data.key,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              wx.showToast({
                title: '以完成取消',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function(){
                wx.redirectTo({
                  url: '../order_list/order_list'
                })
              },1000)

            }
          })




        }
      }
    })



  },
  sureorder: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: http + '/index.php?model=member_order&fun=order_receive', //仅为示例，并非真实的接口地址
            data: {
              key: that.data.key,
              order_id: e.target.dataset.order_id
            },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              wx.showToast({
                title: '交易已完成',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../order_list/order_list'
                })
              }, 1000)
            }
          })
        }
      }
    })


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