Page({

  /**
   * 页面的初始数据
   */
  data: {
    chk:0,
    juan_data:[],
    zhang:0,
    youhui:0.00,
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
      this.setData({
          juan_data: wx.getStorageSync('use_jian')

      })
      console.log(that.data.juan_data)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  ck_juan:function(e){
      // console.log(e)
    var that=this
  





      this.setData({
        chk: e.target.dataset.index,
        zhang:1,
        youhui: that.data.juan_data[e.target.dataset.index].voucher_price
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