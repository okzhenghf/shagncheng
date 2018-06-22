var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage = 1
var page_total = 0



Page({

  /**
   * 页面的初始数据
   */
  data: {
     pgoods:[],
     total_poin:"",
     has_mo:true,
     address:{},
     address_id:false,
     get_val:"",
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
      url: http +'/index.php?model=pointcart&fun=step2', //仅为示例，并非真实的接口地址
      method:"POST",
      data: {
        key:that.data.key
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          pgoods: res.data.datas.pointprod_arr.pointprod_list,
          total_poin: res.data.datas.pointprod_arr.pgoods_pointall,
          
        })
        if (res.data.datas.default.length<=0){
              that.setData({
                has_mo:false
              })
        }else{
          that.setData({
            has_mo: true,
            address: res.data.datas.default,
            address_id: res.data.datas.default.address_id
          })
        }

      }
    })
  },
  get_input:function(e){
    
    this.setData({
      get_val: e.detail.value
    })
  },
  submit_:function(){



   var that=this
    wx.showModal({
      title: '提示',
      content: '确认提交订单',
      success: function (res) {
        if (res.confirm) {
          if (that.data.address_id==false){
            wx.showToast({
              title: '请填写收货地址',
              icon: 'none',
              duration: 2000
            })
            return false
            }
          if (that.data.get_val==""){
            wx.showToast({
              title: '请填写订单留言',
              icon: 'none',
              duration: 2000
            })
            return false
          }
          wx.request({
            url: http +'/index.php?model=pointcart&fun=step3', //仅为示例，并非真实的接口地址
            method:"POST",
            data: {
              key: that.data.key,
              pcart_message: that.data.get_val,
              address_id: that.data.address_id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.code==400){
                wx.showToast({
                  title: '订单提交失败',
                  icon: 'none',
                  duration: 2000
                })
              }else if(res.data.code==200){
                wx.showToast({
                  title: '提交成功',
                  icon: 'none',
                  duration: 2000
                })
               setTimeout(function(){
                 wx.redirectTo({
                   url: '../../poin/Poin_record/Poin_record'
                 })
               },2000)
              }
            }
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      url: http + '/index.php?model=pointcart&fun=step2', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        key: that.data.key
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          pgoods: res.data.datas.pointprod_arr.pointprod_list,
          total_poin: res.data.datas.pointprod_arr.pgoods_pointall,

        })
        if (res.data.datas.default.length <= 0) {
          that.setData({
            has_mo: false
          })
        } else {
          that.setData({
            has_mo: true,
            address: res.data.datas.default,
            address_id: res.data.datas.default.address_id
          })
        }

      }
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