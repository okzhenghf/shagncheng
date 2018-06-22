
var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_poin:0,
    use_poin:0,
    page_total:0,
    data_list:[],
    key:"",
    reutnr_page:'',
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
 
    wx.request({
      url: new_http +'/hyapi/user/getpoint?common_param={"shop_id":0}&token='+that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.errcode=='0'){
          that.setData({
            my_poin:res.data.data
          })
        }
      }
    })

    wx.request({
      url: new_http +'/hyapi/user/getpointlist?common_param={"shop_id":0,"page_index":1,"page_size":6}&token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          for(var i=0;i<res.data.data.data.length;i++){
            res.data.data.data[i].create_time = that.fmtDate(res.data.data.data[i].create_time);
            res.data.data.data[i].number = parseFloat(res.data.data.data[i].number);
          }

          that.setData({
            data_list: res.data.data.data,
            reutnr_page:res.data.data.page_count
          })
          wx.hideLoading()
        }
      }
    })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    curpage=1
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
    var that = this;

    curpage++
    
    if (curpage > that.data.reutnr_page){
      curpage--
      return false
    }    
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: new_http + '/hyapi/user/getpointlist?common_param={"shop_id":0,"page_index":' + curpage+',"page_size":6}&token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          for (var i = 0; i < res.data.data.data.length; i++) {
            res.data.data.data[i].create_time = that.fmtDate(res.data.data.data[i].create_time);
            res.data.data.data[i].number = parseFloat(res.data.data.data[i].number);
          }

          that.setData({
            data_list: that.data.data_list.concat(res.data.data.data),
            reutnr_page: res.data.data.page_count
          })
          wx.hideLoading()
        }
      }
    })


    
    // console.log("curpage=" + curpage)
    // console.log("that.data.page_total=" + that.data.page_total)
    // if (curpage > that.data.page_total){
    //   return false
    // } 

    // wx.request({
    //   url: http + '/index.php?model=member_points&fun=pointslog', //仅为示例，并非真实的接口地址
    //   data: {
    //     key: that.data.key,
    //     curpage: curpage,
    //     page: 10
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
        
    //     that.setData({
    //       data_list: that.data.data_list.concat(res.data.datas.log_list)
    //     })
    //   }
    // })


    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})