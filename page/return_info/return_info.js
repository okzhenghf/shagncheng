var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pic_list:[],
    return_info:{},
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    that.setData({
      key: wx.getStorageSync('key')
    })
    wx.request({
      url: http +'/index.php?model=member_return&fun=get_return_info', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        return_id: options.refund_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          pic_list:res.data.datas.pic_list,
          return_info: res.data.datas.return_info
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  look_img:function(e){
    var that=this
    // console.log()
    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: that.data.pic_list // 需要预览的图片http链接列表
    })
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