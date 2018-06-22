Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['箱包', '办公用品', '装修材料', '电脑配件'],
    index:"",
    // 是否需要发票
    need_invi:false,
    // 发票类型
    invoice_Type:false,

  },
  ge:function(){
    this.setData({
      invoice_Type: false
    })
  },
  dw: function () {
    this.setData({
      invoice_Type: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
    // 不需要发票切换
  no_need_invi:function(){
    var that=this;
      this.setData({
        need_invi:false,
      })

  }, 

  // 需要发票切换
  _need_invi: function () {
    var that = this;
    this.setData({
      need_invi: true,
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