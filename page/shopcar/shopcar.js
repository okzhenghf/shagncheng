var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nt: new_http,
    hui: false,
    all_chk: true,
    total_: 0,
    key:"",
    goods_list: [

    ],
    is_kong: false,
    key:""
  },

  // 封装计算总额方法
  total_money: function () {

    var that = this;
    var total_list = that.data.goods_list;
    var total_qian = 0;
    for (var i = 0; i < total_list.length; i++) {
      if (total_list[i].chk) {
        total_qian += total_list[i].num * total_list[i].price
      }
    }
    console.log(total_qian)
    that.setData({
      total_: total_qian.toFixed(2)
    })

  },

  // 切换购物车商品选中状态
  toggle_chk: function (e) {
    var index = e.target.dataset.index;
    var list = this.data.goods_list;
    //  goods_list[]
    list[index].chk = !this.data.goods_list[index].chk
    this.setData({
      goods_list: list
    })

    var that = this;
    // 判断是否选中
    for (var i = 0; i < list.length; i++) {
      if (list[i].chk == false) {
        that.setData({
          all_chk: false

        })
      }
    }

    // 判断是否全部选中
    var flag = true;
    for (var i = 0; i < list.length; i++) {
      if (list[i].chk == false) {
        flag = false;
      }
    }
    if (flag) {
      that.setData({
        all_chk: true

      })
    }

    // 判断是否全部没选中
    var all_no_chk = true;
    for (var i = 0; i < list.length; i++) {
      if (list[i].chk == true) {
        all_no_chk = false;
      }
    }
    if (all_no_chk) {
      this.setData({
        hui: true
      })
    } else {
      this.setData({
        hui: false
      })
    }

    this.total_money();
  },

  // 全选
  all_: function () {
    this.setData({
      all_chk: true
    })

    var list = this.data.goods_list;
    //  goods_list[]
    for (var i = 0; i < list.length; i++) {
      list[i].chk = true
    }


    this.setData({
      goods_list: list,
        hui:false
      
    })




    this.total_money();
  },
  // 增加
  add: function (e) {
    var that=this
    var index = e.target.dataset.index;
    var list = this.data.goods_list;
    list[index].num++
    if (list[index].goods_num > list[index].max_buy) {
      list[index].num--
      wx.showToast({
        title: '已超过库存或限购数量',
        icon: 'none',
        duration: 2000
      })

      return false;
    }

    wx.request({
      url: new_http + '/hyapi/cart/setnum?common_param={"cart_id":"' + e.target.dataset.cart_id+'","num":"' + list[index].num+'"}&token='+that.data.key, //仅为示例，并非真实的接口地址
      method:"POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })




    this.setData({
      goods_list: list
    })

    console.log(list)
    this.total_money();

  },

  // 减
  down: function (e) {
    var that=this
    var index = e.target.dataset.index;
    var list = this.data.goods_list;
    if (list[index].num == 1) {
      wx.showToast({
        title: '不能低于最低限',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
  
    list[index].num--
    wx.request({
      url: new_http + '/hyapi/cart/setnum?common_param={"cart_id":"' + e.target.dataset.cart_id + '","num":"' + list[index].num + '"}&token=' + that.data.key, //仅为示例，并非真实的接口地址
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    this.setData({
      goods_list: list
    })
    this.total_money();
  },
  // 删除
  del: function (e) {
    var index = e.target.dataset.index;
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除该商品',
      success: function (res) {
        if (res.confirm) {

          wx.request({
            url: new_http+ '/hyapi/cart/remove?common_param={"cart_ids":"'+e.target.dataset.cart_id+'"}&token='+that.data.key, //仅为示例，并非真实的接口地址
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

              console.log(res.data)
              if(res.data.errcode=='0'){
               
                wx.request({
                  url: new_http + '/hyapi/cart/get?token=' + that.data.key, //仅为示例，并非真实的接口地址
                  method: "POST",
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    console.log(res.data)
                    if (res.data.errcode == '0') {
                      that.setData({
                        goods_list: res.data.data
                      })
                    }
                    if (res.data.errcode != '0') {
                      that.setData({
                        is_kong: true,
                        goods_list: []

                      })
                    } else {
                      for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].chk = true
                      }
                      that.setData({
                        goods_list: res.data.data,
                        // total_: res.data.datas.sum,
                        is_kong: false
                      })
                    }
                    that.total_money()
                    wx.hideLoading()


                  }
                })
                wx.showToast({
                  title: '已删除',
                  icon: 'none',
                  duration: 2000
                })


              }

             
            }
          })








        } else if (res.cancel) {

        }
      }
    })

  },







  // 支付
  pay: function () {
    var that=this
    var chk_arr=[]
    console.log(that.data.goods_list)
    for (var i = 0; i < that.data.goods_list.length;i++){
      if (that.data.goods_list[i].chk==true){
            chk_arr.push(that.data.goods_list[i].cart_id + "|" + that.data.goods_list[i].num) 
        }
      }
    console.log(chk_arr.join(","))
   
    // wx.navigateTo({
    //   url: '../order/order_table/order_table?ifcart=1&cart_id='+chk_arr.join(",")
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    var that = this
    that.setData({
      key: wx.getStorageSync('dl_key')
    })
    if(!that.data.key){
        that.setData({
          is_kong: true,
        })
      return false
    }







    wx.request({
      url: new_http + '/hyapi/cart/get?token='+that.data.key, //仅为示例，并非真实的接口地址
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.errcode=='0'){
            that.setData({
              goods_list:res.data.data
            })
          }
        if (res.data.errcode != '0') {
          that.setData({
            is_kong: true,
            goods_list: []

          })
        } else {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].chk = true
          }
          that.setData({
            goods_list: res.data.data,
            // total_: res.data.datas.sum,
            is_kong: false
          })
        }
        console.log(that.data.goods_list)
        that.total_money()
        wx.hideLoading()


      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.total_money();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      url: new_http + '/hyapi/cart/get?token=' + that.data.key, //仅为示例，并非真实的接口地址
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          that.setData({
            goods_list: res.data.data
          })
        }
        if (res.data.errcode !='0') {
          that.setData({
            is_kong: true,
            goods_list: []

          })
        } else {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].chk = true
          }
          that.setData({
            goods_list: res.data.data,
            // total_: res.data.datas.sum,
            is_kong: false
          })
        }
        that.total_money()
        wx.hideLoading()


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
