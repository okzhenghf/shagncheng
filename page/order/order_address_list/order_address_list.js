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
    address_data:[],
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var that=this;
    that.setData({
      key: wx.getStorageSync('dl_key')
    })
    this.get_addlist();




  },
  get_addlist:function(){
    var that=this;
    wx.request({
      url: new_http + '/hyapi/user/getexpressaddresslist?token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          // arr[i] = arr[i].replace(/&nbsp;/g, "\n")

          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].address_info = res.data.data[i].address_info.replace(/&nbsp;/g, " ")
          }
          that.setData({
            address_data: res.data.data
          })
        } else {
          that.setData({
            address_data: []
          })
        }
        console.log(that.data.address_data)
      }
    })
  },
  zh:function(){
    console.log(1)
    this.setData({
      hidden_list: true

    })

  },
  co:function(){
    var that=this;
    wx.showToast({
      title: '已删除',
      icon: 'success',
      duration: 2000,
      success:function(){
        that.setData({
          hidden_list: true
        })
      }
    })
  },

  // 展示编辑删除按钮
 


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
    this.get_addlist();
    // wx.request({
    //   url: http + '/index.php?model=member_address&fun=address_list', //仅为示例，并非真实的接口地址
    //   method: "POST",
    //   data: {
    //     key: that.data.key

    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       address_data: res.data.datas.address_list

    //     })
    //   }
    // })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
    // 设置为默认地址
  set_address:function(e){
      var that=this
      console.log(e.target.dataset.index)
    wx.showActionSheet({
      itemList: ['设为默认地址', '编辑', '删除'],
      success: function (res) {
        console.log(res.tapIndex)
        // 设为默认地址
        if (res.tapIndex==0){
          wx.request({
            url: new_http + '/hyapi/user/setdefaultexpressaddress?common_param={"id":"' + e.target.dataset.index+'"}&token='+that.data.key, //仅为示例，并非真实的接口地址
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              if(res.data.errcode=='0'){
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                that.get_addlist();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
            
        } else if (res.tapIndex == 1){
              // 编辑
          wx.navigateTo({
            url: '../order_address_edit/order_address_edit?address_id=' +e.target.dataset.index
          })

        } else if (res.tapIndex == 2){
            // 删除
          wx.request({
            url: new_http + '/hyapi/user/removeexpressaddress?common_param={"id":"' + e.target.dataset.index + '"}&token=' + that.data.key, //仅为示例，并非真实的接口地址
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.errcode=='0') {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                that.get_addlist();
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 2000
                })
              }



            }
          })


        }








      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
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