var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage = 1
var total_page = 0;
var hasmore


Page({

  /**
   * 页面的初始数据
   */
  data: {
    vou_list:[],
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      key: wx.getStorageSync('key')
    })
    wx.request({
      url: http+'/index.php?model=voucher&fun=voucher_tpl_list', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        store_id: 1,
        gettype: "free",
        curpage: 1,
        page:100
      },
      method:"POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          vou_list: res.data.datas.voucher_list

        })
      }
    })


  },
  getFreeVoucher:function(e){
    var that=this
    wx.request({
      url: http +'/index.php?model=member_voucher&fun=voucher_freeex', //仅为示例，并非真实的接口地址
      method:"POST",
      data: {
        key:that.data.key,
        tid:e.target.dataset.gid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code==200){
          wx.showToast({
            title: '已领取',
            icon: 'success',
            duration: 2000
          })
          wx.request({
            url: http + '/index.php?model=voucher&fun=voucher_tpl_list', //仅为示例，并非真实的接口地址
            data: {
              key:that.data.key,
              store_id: 1,
              gettype: "free",
              curpage: 1,
              page: 100
            },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              that.setData({
                vou_list: res.data.datas.voucher_list

              })
            }
          })
        }else{
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          })
        }




      }
    })
  },
  show_z:function(e){
      console.log(1)
    var arr = this.data.vou_list
    arr[e.target.dataset.index].z = !this.data.vou_list[e.target.dataset.index].z
    this.setData({
      vou_list:arr

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