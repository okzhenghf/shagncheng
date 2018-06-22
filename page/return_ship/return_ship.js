// page/return_ship/return_ship.js
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
    wuliu_obj: [],
    wuliu_arr: [],
    wuliu_id: "",
    wuliu_txt: "",
    get_val: "",
    return_id: "",
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      return_id: options.return_id
    })
    console.log(options)
    wx.request({
      url: http + '/index.php?model=member_return&fun=ship_form', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        return_id: options.return_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          var arr = []
          for (var i = 0; i < res.data.datas.express_list.length; i++) {
            arr.push(res.data.datas.express_list[i].express_name)
          }
          that.setData({
            wuliu_arr: arr,
            wuliu_obj: res.data.datas.express_list
          })



        }


      }
    })


  },
  get_val: function (e) {
    this.setData({
      get_val: e.detail.value
    })
    console.log(e.detail.value)
  },
  bindPickerChange: function (e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      wuliu_id: that.data.wuliu_obj[e.detail.value].express_id,
      wuliu_txt: that.data.wuliu_obj[e.detail.value].express_name

    })
  },
  submit_: function () {
    var that = this
    if (that.data.wuliu_txt == "" || that.data.get_val == "") {
      wx.showToast({
        title: '请完善您的表单',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    wx.request({
      url: http + '/index.php?model=member_return&fun=ship_post', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        key: that.data.key,
        express_id: that.data.wuliu_id,
        invoice_no: that.data.get_val,
        return_id: that.data.return_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
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