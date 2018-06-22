var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "",
    data_list:"",
    is_kong:false
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
      key: wx.getStorageSync('dl_key')
    })
    // wx.request({
    //   url: http +'/index.php?model=member_pointorder&fun=orderlist', //仅为示例，并非真实的接口地址
    //   method:"POST",
    //   data: {
    //     key:that.data.key 
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     wx.hideLoading()
    //     console.log(res.data)
    //     that.setData({
    //       data_list: res.data.datas.order_list

    //     })
    //     if (res.data.datas.order_list.length<=0){
    //         that.setData({
    //             is_kong:true
    //         })
    //   }else{
    //       that.setData({
    //           is_kong:false
    //       })
    //   }



    //   }


    // })
    wx.request({
      url: new_http +'/hyapi/user/getbalancelist?common_param={"shop_id":0,"page_index":1,"page_size":""}&token='+that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()

        console.log(res.data)
        if(res.data.errcode!='0'){
            that.setData({
              is_kong: true
            })
        }else{
          if (res.data.data.data.length<=0){
            that.setData({
              is_kong: true
            })
            return false
          }


            for(var i=0;i<res.data.data.data.length;i++){
              res.data.data.data[i].create_time = that.fmtDate(res.data.data.data[i].create_time)
            }
            that.setData({
              data_list:res.data.data.data,
              is_kong:false
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
  fmtDate: function (timeStamp) {
    // return timeStamp
    var date = new Date(timeStamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D;
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