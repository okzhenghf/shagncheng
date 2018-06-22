var app = getApp();
var http = app.globalData.https;
var flag=false;
var history=[];
var arrstr=""
Page({

  /**
   * 页面的初始数据
   */
  data: {
      searchVal:"",
      hot_key:[],
      his_list:[]
  },

  get_val:function(e){
    this.setData({
      searchVal:e.detail.value
    })
  },
 
  to_list:function(){
    var that = this
    
    if (that.data.searchVal.length<=0){
      wx.showToast({
        title: '请填写搜索关键字',
        icon: 'none',
        duration: 3000
      })
          return false;
    }
    wx.navigateTo({
      url: '../product_list/product_list?keyword=' + that.data.searchVal
    })
 



  },


  //  清空历史记录
  clear_his:function(){
    wx.removeStorageSync('key_ser');
    this.setData({
      his_list:[]

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
    wx.request({
      url: http+'/index.php?model=index&fun=search_key_list', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
         
        that.setData({
          hot_key: res.data.datas.list
        })
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
    var that = this;
    history = wx.getStorageSync("key_ser") || []
    that.setData({
      his_list: history
    })
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