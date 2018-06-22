var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var p1="";
var p2 = "";
var p3 = "";


Page({
  /**
   * 页面的初始数据
   */
  data: {
    ly: [],
    yy:"",
    m1:"../../images/value_add.png",
    m2:"../../images/value_add.png",
    m3:"../../images/value_add.png",
    all_data:{},
    sm:"",
    reason_id:false,
    order_id:"",
    order_goods_id:"",
    key:""
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id,
      order_goods_id: options.order_goods_id

    })
    var that=this
    that.setData({
      key: wx.getStorageSync('key')
    })
    wx.request({
      url: http +'/index.php?model=member_refund&fun=refund_form', //仅为示例，并非真实的接口地址
      data: {
        key:that.data.key,
        order_goods_id: options.order_goods_id,
        order_id: options.order_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var arr=[];
        for (var i = 0; i < res.data.datas.reason_list.length;i++ ){
          arr.push(res.data.datas.reason_list[i].reason_info)

        }
        that.setData({
          ly:arr,
          all_data:res.data.datas
        })


      }
    })





  },
  get_area:function(e){
     
    this.setData({
      sm: e.detail.value
    })

  },
  bindPickerChange:function(e){
    var that=this
    var list = this.data.ly
    this.setData({
      yy: list[e.detail.value]
    })
    // console.log(this.data.all_data.reason_list[e.detail.value].reason_id)
    that.setData({
      reason_id: this.data.all_data.reason_list[e.detail.value].reason_id
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
          filePath: tempFilePaths ,
          name: 'refund_pic',
          method:"POST",
          formData: {
            key: that.data.key,
            order_id: that.data.order_id,
            order_goods_id: that.data.order_goods_id
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
            key:that.data.key,
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
            key:that.data.key,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  submit_:function(){
     
    var that=this;
    if(that.data.sm==""){
      wx.showToast({
        title: '请填写退货说明',
        icon: 'none',
        duration: 2000
      })
      return false;

    }
    if (that.data.reason_id==false){
      wx.showToast({
        title: '请选择退货原因',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    // var obj={}
    
    //     var n1= "refund_pic["+0+"]"
    //     obj[n1] = p1 == "" ? "" : p1

    //     var n2 = "refund_pic["+1+"]"
    //     obj[n2] = p2 == "../../images/value_add.png" ? "" : p2
        
    //     var n3 = "refund_pic["+2+"]"
    //     obj[n3] = p3 == "../../images/value_add.png" ? "" : p3
    //     obj.key ="51233c07f6a7c2546af803839d25f1c3"
    //     obj.order_id = that.data.order_id
    //     obj.order_goods_id = that.data.order_goods_id
    //     obj.reason_id = that.data.reason_id
    //     obj.refund_amount = that.data.all_data.goods.goods_pay_price
    //     obj.goods_num = that.data.all_data.goods.goods_num
    //     obj.buyer_message = that.data.sm
    //     obj.refund_type=2
    // console.log(obj)
   

    var i_arr=[]
    i_arr[0] = p1 == "" ? "" : p1
    i_arr[1] = p2 == "" ? "" : p2
    i_arr[3] = p3 == "" ? "" : p3

    wx.request({
      url: http +'/index.php?model=member_refund&fun=refund_post', //仅为示例，并非真实的接口地址
      data: {
        key:that.data.key,
        order_id: that.data.order_id,
        order_goods_id: that.data.order_goods_id,
        reason_id: that.data.reason_id,
        refund_amount: that.data.all_data.goods.goods_pay_price,
        goods_num: that.data.all_data.goods.goods_num,
        buyer_message: that.data.sm,
        refund_type: 2,
        refund_pic:i_arr


      },
      method:"POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==200){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../order_list/order_list'
            })
          },1000)

        }
      }
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
  onShareAppMessage: function(){
    
  }
})