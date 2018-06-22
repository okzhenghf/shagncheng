
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
      wu_data:{},
      list:[],
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
      url: http +'/index.php?model=member_order&fun=search_deliver', //仅为示例，并非真实的接口地址
      method:"POST",
      data: {
        key:that.data.key,
        order_id: options.order_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==200){
          that.setData({
            wu_data: res.data.datas
          })
          var arr = res.data.datas.deliver_info
          // console.log(arr.length)
          for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace(/&nbsp;/g, "\n")

          }
          console.log(arr)
          that.setData({
            list: arr
          })
        }else if(res.data.code==400){
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          })
            setTimeout(function(){
              wx.redirectTo({
                url: '../order_list/order_list'
              })
            },2000)

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