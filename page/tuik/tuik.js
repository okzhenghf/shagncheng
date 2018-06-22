var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var p1 = "";
var p2 = "";
var p3 = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ly: ["不能按时发货", "认为是假货", "保质期不符", "商品破损、有污渍","效果不好不喜欢"],
    yy:"",
    m1:"../../images/value_add.png",
    m2:"../../images/value_add.png",
    m3:"../../images/value_add.png",
    goods_data:[],
    money_all:0,
     order_id: "",
     area:"",
     key:""
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_id: options.order_id
    })
    var that=this
    that.setData({
      key: wx.getStorageSync('key')
    })
    wx.request({
      url: http +'/index.php?model=member_refund&fun=refund_all_form', //仅为示例，并非真实的接口地址
      data: {
        key:that.data.key,
        order_id: options.order_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==200){
        that.setData({
          goods_data:res.data.datas.goods_list,
          money_all:res.data.datas.order.allow_refund_amount
        })

        }




      }
    })
  },
  get_area:function(e){
     
      this.setData({
        area: e.detail.value

      })
  },
  bindPickerChange:function(e){
    var list = this.data.ly
    this.setData({
      yy: list[e.detail.value]
    })

  },
  check_image1:function(){
    var that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: http + '/index.php?model=member_refund&fun=upload_pic', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'refund_pic',
          method: "POST",
          formData: {
            key:that.data.key,
            order_id: that.data.order_id,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(JSON.parse(res.data))
            p1 = JSON.parse(res.data).datas.file_name
          }
        })
        that.setData({
          m1: tempFilePaths
        })


      }
    })
  },
  check_image2: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: http + '/index.php?model=member_refund&fun=upload_pic', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'refund_pic',
          method: "POST",
          formData: {
            key: that.data.key,
            order_id: that.data.order_id,
            order_goods_id: that.data.order_goods_id
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(JSON.parse(res.data))
            p2 = JSON.parse(res.data).datas.file_name
          }
        })
        that.setData({
          m2: tempFilePaths
        })
      }
    })
  },
  check_image3: function () {
    var that = this;
    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: http + '/index.php?model=member_refund&fun=upload_pic', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'refund_pic',
          method: "POST",
          formData: {
            key: that.data.key,
            order_id: that.data.order_id,
            order_goods_id: that.data.order_goods_id
          },
          success: function (res) {
            var data = res.data
            //do something
            p3 = JSON.parse(res.data).datas.file_name
            console.log(JSON.parse(res.data))
          }
        })
        that.setData({
          m3: tempFilePaths
        })
      }
    })
  },
  submit_:function(){
    var that=this
    var i_arr = []
    i_arr[0] = p1;
    i_arr[1] = p2;
    i_arr[2] = p3;
    if (that.data.area==""){
      wx.showToast({
        title: '请填写退款原因',
        icon: 'none',
        duration: 2000
      })
      return false
        }

    wx.request({
      url: http +'/index.php?model=member_refund&fun=refund_all_post', //仅为示例，并非真实的接口地址
      method:"POST",
      data: {
        key: that.data.key,
        order_id: that.data.order_id,
        buyer_message:that.data.area,
        refund_pic:i_arr
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.showLoading({
          title: '提交中',
        })

        setTimeout(function(){
          wx.hideLoading()
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        },1000)
        setTimeout(function(){
          url: '../order_list/order_list'

        },2000)
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
  onShareAppMessage: function(){
    
  }
})