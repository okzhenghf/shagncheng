var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage = 1
var total_page = 0;
var u_sheng = "";
var u_shi = "";
var u_qu = "";
var u_sheng_id = "";
var u_shi_id = "";
var u_qu_id = "";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: "",
    address_info: {},
    true_name: "",
    mob_phone: "",
    address: "",
    zipcode: "",
    sheng_arr: [],
    shi_arr: [],
    qu_arr: [],
    shi_id: "",
    sheng_id: "",
    qu_id: "",
    address_id: "",
    sheng_show: false,
    shi_show: false,
    qu_show: false,
    bj_show: false,
    sheng_name: "",
    shi_name: "",
    qu_name: "",
    region: "",
    key: "",
    address_data:[],
    ad_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad: function (options) {
   
    // 请求省
    var that = this
    that.setData({
      key: wx.getStorageSync('dl_key'),
      ad_id:options.address_id,
      
    })
    console.log(options.address_id)

    var that = this;
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function(){
      wx.hideLoading();
    },1000)
    wx.request({
      
      url: new_http + '/hyapi/user/getexpressaddresslist?token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
        if (res.data.errcode == '0') {
          // arr[i] = arr[i].replace(/&nbsp;/g, "\n")

          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].address_info = res.data.data[i].address_info.replace(/&nbsp;/g, " ")
          }
          that.setData({
            address_data: res.data.data
          })
          for (var i = 0; i < that.data.address_data.length; i++) {
            if (that.data.address_data[i].id == options.address_id) {
              console.log(that.data.address_data[i])
              that.setData({
                true_name: that.data.address_data[i].consigner,
                mob_phone: that.data.address_data[i].mobile,
                region:that.data.address_data[i].address_info,
                address:that.data.address_data[i].address,
                zipcode:that.data.address_data[i].zip_code,
                sheng_id:that.data.address_data[i].province,
                shi_id:that.data.address_data[i].city,
                qu_id:that.data.address_data[i].district
              })
            }
          }
        } else {
          that.setData({
            address_data:[]
          })
        }
        console.log(that.data.address_data)
      }
    })
    wx.request({
      url: new_http + '/hyapi/address/getprovincelist?common_param={"area_id":0}', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          that.setData({
            sheng_arr: res.data.data
          })
        }
      }
    })


  },
  show_sheng: function () {
    this.setData({
      sheng_show: true,
      bj_show: true
    })
  },
  sheng_cl: function (e) {
    var that = this
    console.log(e.target.dataset.area_id)
    console.log(e.target.dataset.area_name)
    this.setData({
      sheng_id: e.target.dataset.area_id,
      sheng_name: e.target.dataset.area_name
    })

    wx.request({
      url: new_http + '/hyapi/address/getcitylist?common_param={"province_id":' + e.target.dataset.area_id + '}', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          shi_arr: res.data.data
        })
      }
    })
    that.setData({
      sheng_show: false,
      shi_show: true,
      qu_show: false
    })
  },
  shi_cl: function (e) {
    var that = this
    console.log(e.target.dataset.area_id)
    console.log(e.target.dataset.area_name)
    this.setData({
      shi_id: e.target.dataset.area_id,
      shi_name: e.target.dataset.area_name
    })

    wx.request({
      url: new_http + '/hyapi/address/getdistrictlist?common_param={"city_id":' + e.target.dataset.area_id + '}', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          qu_arr: res.data.data
        })
      }
    })
    that.setData({
      sheng_show: false,
      shi_show: false,
      qu_show: true
    })
  },
  qu_cl: function (e) {
    console.log(e.target.dataset.area_name)
    var all_name = this.data.sheng_name + " " + this.data.shi_name + " " + e.target.dataset.area_name
    this.setData({
      qu_id: e.target.dataset.area_id,
      qu_name: e.target.dataset.area_name,
      region: all_name
    })
    this.setData({
      sheng_show: false,
      shi_show: false,
      qu_show: false,
      bj_show: false
    })
  },
  close_: function () {
    this.setData({
      sheng_show: false,
      shi_show: false,
      qu_show: false,
      bj_show: false
    })
  },
  set_name: function (e) {
    this.setData({
      true_name: e.detail.value
    })
  },
  set_phone: function (e) {
    this.setData({
      mob_phone: e.detail.value
    })
  },
  set_hao: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  set_code: function (e) {
    this.setData({
      zipcode: e.detail.value
    })
  },
  submit_: function () {
    var that = this

    if (that.data.true_name == "") {
      wx.showToast({
        title: '收货人不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    var pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (!pattern.test(that.data.mob_phone) || that.data.mob_phone == "") {
      wx.showToast({
        title: '请填写有效的手机号',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (that.data.region == "") {
      wx.showToast({
        title: '请选择地区信息',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    var zz = /^[1-9]\d{5}$/
    if (!zz.test(that.data.zipcode)) {
      wx.showToast({
        title: '请填写正确的邮政编码',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url: new_http + '/hyapi/user/updateexpressaddress?common_param={"consigner":"' + that.data.true_name + '","id":"'+that.data.ad_id+'","mobile":"' + that.data.mob_phone + '","address":"' + that.data.address + '","province":"' + that.data.sheng_id + '","city":"' + that.data.shi_id + '","district":"' + that.data.qu_id + '","zipcode":"' + that.data.zipcode + '","phone":"' + that.data.mob_phone + '"}&token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          wx.hideLoading();
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../order_address_list/order_address_list'
            })
          }, 1000)
        }

      }
    })

    // wx.request({
    //   url: http + '/index.php?model=member_address&fun=address_add', //仅为示例，并非真实的接口地址
    //   method: "POST",
    //   data: {
    //     key:that.data.key,
    //     true_name: that.data.true_name,
    //     area_id: that.data.qu_id,
    //     city_id: that.data.shi_id,
    //     area_info: that.data.region,
    //     address: that.data.address,
    //     tel_phone: that.data.mob_phone,
    //     mob_phone: that.data.mob_phone,
    //     zipcode: that.data.zipcode,
    //     is_default: 1,
    //     address_id: that.data.address_id,
    //     mob_phone: that.data.mob_phone,
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {

    //     if (res.data.code == 200) {
    //       wx.showToast({
    //         title: '新增成功',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //         setTimeout(function(){
    //           wx.navigateTo({
    //             url: '../order_address_list/order_address_list'
    //           })
    //         },1000)
    //     }
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
  bindRegionChange: function (e) {

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