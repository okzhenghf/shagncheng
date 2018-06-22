var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    toggolse_vo:false,
    yong_list:[],
    wu_list:[],
    y_all:false,
    w_all: false,
    key:""
  },
  toggolse_you:function(){
      this.setData({
        toggolse_vo:false

      })
  },
  toggolse_wu: function () {
    this.setData({
      toggolse_vo: true

    })
  },
  toggle_yall:function(){
    var yall = !this.data.y_all
    this.setData({
      y_all: yall
    })
    var ck_y_all = this.data.yong_list;

    for (var i = 0; i < ck_y_all.length;i++ ){
      ck_y_all[i].c = yall
    }
    this.setData({
      yong_list: ck_y_all
    })
  },
  wtoggle_yall: function () {
    var yall = !this.data.w_all
    this.setData({
      w_all: yall
    })
    var ck_y_all = this.data.wu_list;

    for (var i = 0; i < ck_y_all.length; i++) {
      ck_y_all[i].c = yall
    }
    this.setData({
      wu_list: ck_y_all
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  fmtDate: function (timeStamp){
    // return timeStamp
    var date = new Date(timeStamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
   var  Y = date.getFullYear() + '-';
    var  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var  D = date.getDate() + ' ';
   var   h = date.getHours() + ':';
    var  m = date.getMinutes() + ':';
    var  s = date.getSeconds();
    return Y + M + D;
  },
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var that=this
    that.setData({
      key: wx.getStorageSync('dl_key')
    })
    //  获取有效优惠价
    wx.request({
      url: new_http + '/hyapi/user/getunusedcouponlist?common_param={"shop_id":"0"}&token='+that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data.errcode=='0'){      
          for (var i = 0; i < res.data.data.length;i++){
            res.data.data[i].money = parseFloat(res.data.data[i].money);
            res.data.data[i].end_time =that.fmtDate(res.data.data[i].end_time)
          }


        that.setData({
          yong_list:res.data.data
        })
        }
        console.log(res.data)
      }
    })



      // 获取无效优惠价
    wx.request({
      url: new_http + '/hyapi/user/getoutdatecouponlist?common_param={"shop_id":"0"}&token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.errcode == '0') {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].money = parseFloat(res.data.data[i].money);
            res.data.data[i].end_time = that.fmtDate(res.data.data[i].end_time)
          }


          that.setData({
            wu_list: res.data.data
          })
        }
        console.log(res.data)
      }
    })



    // wx.request({
    //   url: http +'/index.php?model=member_voucher&fun=voucher_list', //仅为示例，并非真实的接口地址
    //   data: {
    //     key:that.data.key,
    //     curpage:1,
    //     page:100
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     wx.hideLoading()
        
    //     console.log(res.data)
    //     that.setData({
    //       yong_list: res.data.datas.voucher_list.weishiyong,
    //       wu_list: res.data.datas.voucher_list.yishiyong
    //     })
    //   }
    // })  
  },
  toggle_c:function(e){
    var that=this;
    var yarr = this.data.yong_list
    yarr[e.target.dataset.index].c =!this.data.yong_list[e.target.dataset.index].c
    var quan=true;
    for (var i = 0; i<yarr.length;i++ ){
      if (yarr[i].c!=true){
          that.setData({
            y_all:false
          })
          quan=false
        }
    }
    if (quan){
      that.setData({

        y_all: true
      })
    }
    this.setData({
      yong_list: yarr
    })
  },
  toggle_c_w: function (e) {
    var that = this;
    var yarr = this.data.wu_list
    yarr[e.target.dataset.index].c = !this.data.wu_list[e.target.dataset.index].c
    var quan = true;
    for (var i = 0; i < yarr.length; i++) {
      if(yarr[i].c!=true) {
        that.setData({
          w_all: false
        })
        quan = false
      }
    }
    console.log(quan)
    if (quan) {
      that.setData({

        w_all: true
      })
    }
    this.setData({
      wu_list: yarr
    })
  },
  toggle_z: function (e) {
    var that = this;
    var yarr = this.data.yong_list
    yarr[e.target.dataset.index].z = !this.data.yong_list[e.target.dataset.index].z
    this.setData({
      yong_list: yarr
    })
  },
  toggle_z_w: function (e) {
    var that = this;
    var yarr = this.data.wu_list
    yarr[e.target.dataset.index].z = !this.data.wu_list[e.target.dataset.index].z
    this.setData({
      wu_list: yarr
    })
  },
  del_y:function(){
      var that=this;
      var arr=[];
      var all_false=false;
      for (var i = 0; i < that.data.yong_list.length;i++ ){
        if (that.data.yong_list[i].c==true){
          arr.push(that.data.yong_list[i].voucher_id)
          all_false = true
          
          }

        }

      if (all_false==false){
        wx.showToast({
          title: '请选择需要删除的优惠卷',
          icon: 'none',
          duration: 2000
        })
          return false
      }
      console.log(arr.join(","))  
      wx.showModal({
        title: '提示',
        content: '确认删除选中的优惠卷',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: http +'/index.php?model=member_voucher&fun=voucher_edit', //仅为示例，并非真实的接口地址
              method:"POST",
              data: {
                key: that.data.key,
                voucher_id: arr.join(",")
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data)
                
                wx.request({
                  url: http + '/index.php?model=member_voucher&fun=voucher_list', //仅为示例，并非真实的接口地址
                  data: {
                    key: that.data.key,
                    curpage: 1,
                    page: 100
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    console.log(res.data)
                    that.setData({
                      yong_list: res.data.datas.voucher_list.weishiyong,
                      wu_list: res.data.datas.voucher_list.yishiyong
                    })
                  }
                }) 
              }
            })

          } 
        }
      })
  },
  del_w: function () {
    var that = this;
    var arr = [];
    var all_false = false;
    for (var i = 0; i < that.data.wu_list.length; i++) {
      if (that.data.wu_list[i].c == true) {
        arr.push(that.data.wu_list[i].voucher_id)
        all_false = true

      }

    }

    if (all_false == false) {
      wx.showToast({
        title: '请选择需要删除的优惠卷',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    console.log(arr.join(","))
    wx.showModal({
      title: '提示',
      content: '确认删除选中的优惠卷',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: http + '/index.php?model=member_voucher&fun=voucher_edit', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
              key: that.data.key,
              voucher_id: arr.join(",")
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
             
              wx.request({
                url: http + '/index.php?model=member_voucher&fun=voucher_list', //仅为示例，并非真实的接口地址
                data: {
                  key:that.data.key,
                  curpage: 1,
                  page: 100
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log(res.data)
                  that.setData({
                    yong_list: res.data.datas.voucher_list.weishiyong,
                    wu_list: res.data.datas.voucher_list.yishiyong
                  })
                }
              }) 
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
    var that = this
    // wx.request({
    //   url: http + '/index.php?model=member_voucher&fun=voucher_list', //仅为示例，并非真实的接口地址
    //   data: {
    //     key: that.data.key,
    //     curpage: 1,
    //     page: 100
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       yong_list: res.data.datas.voucher_list.weishiyong,
    //       wu_list: res.data.datas.voucher_list.yishiyong
    //     })
    //   }
    // })  
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