  var app= getApp()
  var http = app.globalData.https
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    toggle_show:100,
    one_class:[],
    child_class:[],
    is_loadding:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })


  var that=this;
    wx.request({
      url: 'http://192.168.0.8/hyapi/goodscategory/getgoodscategorylistbyparentid?common_param={"pid":0}', //仅为示例，并非真实的接口地址
    
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          one_class: res.data.data
        })

          wx.hideLoading()
          that.setData({
            is_loadding:false
          })
        console.log(that.data.one_class)
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
    
  },
  show_all:function(e){
      var that=this;

      console.log(e.target.dataset.gcid)
  
    // if (that.data.toggle_show == e.target.dataset.index){
    //   that.setData({
    //     toggle_show: 100
    //   })
    // }else{
  
    // }

     
      wx.request({
        url: 'http://192.168.0.8/hyapi/goodscategory/getgoodscategorylistbyparentid?common_param={"pid":' + e.target.dataset.gcid+'}', //品牌推荐
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
        if(res.data.errcode!="0"){
          wx.showToast({
            title: '该分类下没有更多分类',
            icon: 'none',
            duration: 2000
          })
        }else{
          that.setData({
            toggle_show: e.target.dataset.index,
            child_class: res.data.data
          })
        }




          
        }
      })


        // 请求子分类数据
  
      // 品牌推荐





  }
})