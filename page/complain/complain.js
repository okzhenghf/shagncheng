var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ly: [],
    yy:"",
    area_val:"",
    m1:"../../images/value_add.png",
    m2:"../../images/value_add.png",
    m3:"../../images/value_add.png",
    order_id:"",
    goods_id:"",
    p1:"",
    p2: "",
    p3:"",
    yy_arr:[],
    yy_id:"",
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        order_id: options.order_id,
        goods_id: options.goods_id
      })
    console.log(options)
  var that=this
  that.setData({
    key: wx.getStorageSync('key')
  })
    wx.request({
      url: http +'/index.php?model=member_complain&fun=complain_new', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        order_id: options.order_id,
        goods_id: options.goods_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
          var arr=[]
          var f=[]
        console.log(res.data.datas.list)
        if(res.data.code==200){
          for (var i = 0; i < res.data.datas.list.length; i++) {

            arr.push(res.data.datas.list[i].complain_subject_content)
            f.push(res.data.datas.list[i].complain_subject_id) 
          }
          that.setData({
            ly: arr,
            yy_arr:f
          })

        }else if(res.data.code==400){
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 3000
          })

        }
       


      }
    })

    
  },
  get_area:function(e){
      console.log(e.detail.value)
      this.setData({
        area_val: e.detail.value
      })

  },
  bindPickerChange:function(e){
    var that=this
    var list = this.data.ly
    this.setData({
      yy: list[e.detail.value],
      yy_id: that.data.yy_arr[e.detail.value]
    })

  },
  submit_:function(){
    var that=this
        if(that.data.yy==""){
          wx.showToast({
            title: '请选择投诉主题',
            icon: 'none',
            duration: 2000
          })
          return false
        } 
        if (that.data.area_val==""){
          wx.showToast({
            title: '请填写投诉内容',
            icon: 'none',
            duration: 2000
          })
          return false
        }
      
     
         var   obj = {
            key: that.data.key,
            order_id: that.data.order_id,
            order_goods_id: that.data.goods_id,
            complain_subject_content: that.data.yy,
            input_complain_content: that.data.area_val,
            input_complain_pic1: that.data.p1,
            input_complain_pic2: that.data.p2,
            input_complain_pic3: that.data.p3,
            reason_id:that.data.yy_id
           }

     

         console.log(obj)


        wx.request({
          url: http +'/index.php?model=member_complain&fun=complain_save', //仅为示例，并非真实的接口地址
          data: obj,
          method:"POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            if(res.data.code==200){
              wx.showToast({
                title: '投诉成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function(){

                wx.redirectTo({
                  url: '../order_list/order_list'
                })
              },2000)

            }else{
              wx.showToast({
                title: '投诉失败',
                icon: 'success',
                duration: 2000
              })
              
            }

          }
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
        that.setData({
          m1: tempFilePaths
        })
        wx.uploadFile({
          url: http + '/index.php?model=member_complain&fun=upload_pic', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'input_complain_pic1',
          method: "POST",
          formData: {
            key: that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(data)
            that.setData({
              p1: JSON.parse(res.data).datas.file_name
            })
          }
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
        that.setData({
          m2: tempFilePaths
        })
        wx.uploadFile({
          url: http + '/index.php?model=member_complain&fun=upload_pic', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'input_complain_pic2',
          method: "POST",
          formData: {
            key:that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(data)
            that.setData({
              p2: JSON.parse(res.data).datas.file_name
            })
          }
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
        that.setData({
          m3: tempFilePaths
        })
        wx.uploadFile({
          url: http + '/index.php?model=member_complain&fun=upload_pic', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'input_complain_pic3',
          method: "POST",
          formData: {
            key: that.data.key,
          },
          success: function (res) {
            var data = res.data
            //do something
            console.log(data)
            that.setData({
              p3: JSON.parse(res.data).datas.file_name
            })
          }
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