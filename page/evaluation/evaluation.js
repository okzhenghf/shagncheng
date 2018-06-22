  var app = getApp()
  var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage= 1
var total_page= 0;
  var hasmore
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tp: new_http,
    t1:"../../images/value_add.png",
    t2: "../../images/value_add.png",
    t3: "../../images/value_add.png",
    t4: "../../images/value_add.png",
    t5: "../../images/value_add.png",
    lxx:"../../images/nxx.jpg",
    anxx:"../../images/anx_03.jpg",
    shu:5,
    el_data:[],
    order_id:"",
    key:""
  },
  toggle_start:function(e){
    var that=this
    var arr = that.data.el_data;
    arr[e.target.dataset.i].shu=e.target.dataset.index;
    this.setData({
      el_data: arr


    })
  },
  get_area:function(e){
      console.log(e)
      var arr = this.data.el_data;
      arr[e.target.dataset.i].area=e.detail.value;
      this.setData({
        el_data:arr
      })
  },
  check_image1: function (e) {
    var i= e.target.dataset.i

    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        var arr = that.data.el_data
        arr[i].t1 = tempFilePaths

        wx.uploadFile({
          url: http + '/index.php?model=sns_album&fun=file_upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          method: "POST",
          formData: {
            key:that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(JSON.parse(res.data))
            arr[i].up_img[arr[i].up_img.length] = JSON.parse(res.data).datas.file_name
            console.log(arr[i].up_img)
            that.setData({
              el_data: arr
            })
          }
        })
      
       
      }
    })
  },
  check_image2: function (e) {
    var i = e.target.dataset.i
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        var arr = that.data.el_data
        arr[i].t2 = tempFilePaths
        wx.uploadFile({
          url: http + '/index.php?model=sns_album&fun=file_upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          method: "POST",
          formData: {
            key:that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(JSON.parse(res.data))
            arr[i].up_img[arr[i].up_img.length] = JSON.parse(res.data).datas.file_name
            console.log(arr[i].up_img)
            that.setData({
              el_data: arr
            })
          }
        })

        that.setData({
          el_data: arr

        })
      }
    })
  },
  check_image3: function (e) {
    var i = e.target.dataset.i
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        var arr = that.data.el_data
        arr[i].t3 = tempFilePaths
        wx.uploadFile({
          url: http + '/index.php?model=sns_album&fun=file_upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          method: "POST",
          formData: {
            key: that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(JSON.parse(res.data))
            arr[i].up_img[arr[i].up_img.length] = JSON.parse(res.data).datas.file_name
            console.log(arr[i].up_img)
            that.setData({
              el_data: arr
            })
          }
        })
        that.setData({
          el_data: arr

        })
      }
    })
  },
  check_image4: function (e) {
    var i = e.target.dataset.i
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        var arr = that.data.el_data
        arr[i].t4 = tempFilePaths
        wx.uploadFile({
          url: http + '/index.php?model=sns_album&fun=file_upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          method: "POST",
          formData: {
            key:that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(JSON.parse(res.data))
            arr[i].up_img[arr[i].up_img.length] = JSON.parse(res.data).datas.file_name
            console.log(arr[i].up_img)
            that.setData({
              el_data: arr
            })
          }
        })    
        that.setData({
          el_data: arr

        })
      }
    })
  },

  check_image5: function (e) {
    var i = e.target.dataset.i
    console.log(i)
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("成功")
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        var arr = that.data.el_data
        arr[i].t5 = tempFilePaths
        wx.uploadFile({
          url: http + '/index.php?model=sns_album&fun=file_upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          method: "POST",
          formData: {
            key: that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(JSON.parse(res.data))
            arr[i].up_img[arr[i].up_img.length] = JSON.parse(res.data).datas.file_name
            console.log(arr[i].up_img)
            that.setData({
              el_data: arr
            })
          }
        })
               
        that.setData({
          el_data:arr

        })
      }
    })
  },

  submit_:function(){
  


   var that=this;
   var obj = {}   
   var json_data=[];
   for (var i = 0; i < that.data.el_data.length;i++){
     var mei_data={}
     mei_data.is_anonymous=false;
     mei_data.scores = that.data.el_data[i].shu;
     mei_data.explain_type=1;
     mei_data.order_id = that.data.el_data[i].order_id;
     mei_data.order_goods_id = that.data.el_data[i].order_goods_id;
     mei_data.content = that.data.el_data[i].area;
     mei_data.imas=that.data.el_data[i].up_img.join(',');
     json_data.push(mei_data)
    }
   console.log(JSON.stringify(json_data))
   wx.showLoading({
     title: '加载中',
   })
    wx.request({
      url: new_http+'/hyapi/order/addgoodsevaluate?common_param={"order_id":'+ that.data.order_id+',"evaluate":'+JSON.stringify(json_data)+'}&token='+that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data)
        if(res.data.errcode=='0'){
          wx.showToast({
            title: '发表评价成功',
            icon: 'success',
            duration: 1000
          })

              setTimeout(function(){
        wx.redirectTo({
          url: '../order_list/order_list'
        })
      },2000)
        }
      }
    })
  //  var goods_arr=[]
  //  for (var i = 0; i < that.data.el_data.length;i++){
  //    that.data.el_data[i].all_data.comment = that.data.el_data[i].area
  //    that.data.el_data[i].all_data.score = that.data.el_data[i].shu
  //    that.data.el_data[i].all_data.evaluate_image = that.data.el_data[i].up_img
  //    goods_arr[that.data.el_data[i].rec_id] = that.data.el_data[i].all_data
  //   }
  //  obj.key =that.data.key,
  //    obj.order_id = that.data.order_id,
  //    obj.goods = goods_arr
  //  console.log(that.data.el_data)
  //  console.log(obj)
   console.log(that.data.el_data)
    // wx.request({
    //   url: http +'/index.php?model=member_evaluate&fun=save', //仅为示例，并非真实的接口地址
    //   data: obj,
    //   method:"POST",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     if(res.data.code==200){
    //       wx.showToast({
    //         title: '发表评价成功',
    //         icon: 'success',
    //         duration: 1000
    //       })
    //     }
    //   setTimeout(function(){
    //     // wx.redirectTo({
    //     //   url: '../order_list/order_list'
    //     // })


    //   },2000)

    //   }
    // })


//     evaluate=[{
//       is_anonymous
// }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })



    var that=this;
    that.setData({
      order_id:options.order_id
    })
    that.setData({
      key: wx.getStorageSync('dl_key')
    })
    var n = options.order_id
    wx.request({
      url: new_http +'/hyapi/order/getdetail?common_param={"order_id":'+n+'}&token='+that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
          if(res.data.errcode=='0'){
            for (var i = 0; i < res.data.data.order_goods.length;i++){
              res.data.data.order_goods[i].shu=5
              res.data.data.order_goods[i].t1="../../images/value_add.png"
              res.data.data.order_goods[i].t2 = "../../images/value_add.png"
              res.data.data.order_goods[i].t3 = "../../images/value_add.png"
              res.data.data.order_goods[i].t4 = "../../images/value_add.png"
              res.data.data.order_goods[i].t5 = "../../images/value_add.png"
              res.data.data.order_goods[i].area = ""
              res.data.data.order_goods[i].all_data={}
              res.data.data.order_goods[i].up_img=[]
      }

            
            that.setData({
              el_data:res.data.data.order_goods
            })
          }
          wx.hideLoading();
      }
    })


    // wx.request({
    //   url: http + '/index.php?model=member_evaluate&fun=index', //仅为示例，并非真实的接口地址
    //   data: {
    //     key: that.data.key,
    //     order_id: n
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method:"GET",
    //   success: function (res) {
        

    //   for(var i=0;i<res.data.datas.order_goods.length;i++){
    //     res.data.datas.order_goods[i].shu=5
    //     res.data.datas.order_goods[i].t1="../../images/value_add.png"
    //     res.data.datas.order_goods[i].t2 = "../../images/value_add.png"
    //     res.data.datas.order_goods[i].t3 = "../../images/value_add.png"
    //     res.data.datas.order_goods[i].t4 = "../../images/value_add.png"
    //     res.data.datas.order_goods[i].t5 = "../../images/value_add.png"
    //     res.data.datas.order_goods[i].area = ""
    //     res.data.datas.order_goods[i].all_data={}
    //     res.data.datas.order_goods[i].up_img=[]
    //   }
        
    //   console.log(res.data.datas.order_goods)

    //   that.setData({
    //     el_data: res.data.datas.order_goods
    //   })
    //   }
    // })
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
    
  }
})