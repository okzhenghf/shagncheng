Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden_list:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  zh:function(){
    console.log(1)
    this.setData({
      hidden_list: true

    })

  },
  co:function(){
    var that=this;
    wx.showToast({
      title: '已删除',
      icon: 'success',
      duration: 2000,
      success:function(){
        that.setData({
          hidden_list: true
        })
      }
    })
  },

  // 展示编辑删除按钮
  show_list:function(){
    // console.log(1)
    this.setData({
      hidden_list:false

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
    // 设置为默认地址
  set_address:function(){
    wx.showLoading({
      title: "正在设置为默认地址"
    })
    setTimeout(function(){
      wx.hideLoading({
       

      })

      wx.showToast({
        title: '完成',
        icon: 'success',
        duration: 2000
      })
    },1000)

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