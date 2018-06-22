  var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage= 1
var page_total= 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_list:[],
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    that.setData({
      key: wx.getStorageSync('key')
    })
    wx.request({
      url: http +'/index.php?model=member_refund&fun=get_refund_list', //仅为示例，并非真实的接口地址
      data: {
        key:that.data.key,
        curpage: 1,
        page: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        page_total = res.data.page_total
        that.setData({
          data_list: res.data.datas.refund_list
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
  again_buy:function(e){
    var that=this
    wx.showModal({
      title: '提示',
      content: '是否确认再次购买该商品',
      success: function (res) {
        if (res.confirm) {
            var flag=true;
           var arrAjax= e.target.dataset.zbuy.split(",")
           console.log(arrAjax)
           for (var i = 0; i < arrAjax.length;i++){

             wx.request({
               url: http + '/index.php?model=member_cart&fun=cart_add', //仅为示例，并非真实的接口地址
               method:"POST",
               data: {
                 quantity:1,
                 key: that.data.key,
                 goods_id:arrAjax[i] 
               },
               header: {
                 'content-type': 'application/json' // 默认值
               },
               success: function (res) {
                 console.log(res.data)
                 if (res.data.code!=200){
                   flag = false
                  }


               },
               fail:function(){
                 flag=false
               }
             })

          }
              if(flag){
                wx.showToast({
                  title: '以加入购物车',
                  icon: 'success',
                  duration: 2000
                })
              }



        } else if (res.cancel) {
        
        }
      }
    })


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    curpage++
    if (curpage > page_total){
        return false
    }
    
    wx.request({
      url: http + '/index.php?model=member_refund&fun=get_refund_list', //仅为示例，并非真实的接口地址
      data: {
        key:that.data.key,
        curpage: curpage,
        page: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        page_total = res.data.page_total
        that.setData({
          data_list: that.data.data_list.concat(res.data.datas.refund_list) 
        })
      }
    })


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})