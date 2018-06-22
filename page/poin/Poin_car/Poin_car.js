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
    hui: false,
    all_chk: true,
    total_: 0,
    goods_list: [

    ],
    is_kong: false,
    key:"",
    js:true
  },

  // 封装计算总额方法
  total_money: function () {

    var that = this;
    var total_list = that.data.goods_list;
    var total_qian = 0;
    for (var i = 0; i < total_list.length; i++) {
      
      total_qian += total_list[i].pgoods_choosenum * total_list[i].pgoods_points
     
    }
    console.log(total_qian)
    that.setData({
      total_: total_qian
    })

  },

  // 增加
  add: function (e) {

    var that=this
    that.setData({
      js:true
    })
    var index = e.target.dataset.index;
    var list = this.data.goods_list;
    list[index].pgoods_choosenum++
    this.setData({
      goods_list: list
    })
    wx.request({
      url: http +'/index.php?model=pointcart&fun=update', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        pc_id: e.target.dataset.cart_id,
        quantity: list[index].pgoods_choosenum,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code==400){
          that.setData({
            js:false
          })
         
          wx.showToast({
            title:"已超出限制数量",
            icon: 'none',
            duration: 2000
          })
          list[index].pgoods_choosenum--
          that.setData({
            goods_list: list
          })
        }else{
          this.total_money();
        }
      }
    })

  
 
    
      
 
   

  },

  // 减
  down: function (e) {
  
    var index = e.target.dataset.index;
    var list = this.data.goods_list;
    var that=this;
    if (list[index].pgoods_choosenum <= 1) {
      wx.showToast({
        title: '不能再低啦',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    list[index].pgoods_choosenum--
    this.setData({
      goods_list: list
    })
   
    wx.request({
      url: http + '/index.php?model=pointcart&fun=update', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        pc_id: e.target.dataset.cart_id,
        quantity: list[index].pgoods_choosenum,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    this.total_money();
  },
  // 删除
  del: function (e) {
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: http +'/index.php?model=pointcart&fun=drop', //仅为示例，并非真实的接口地址
            data: {
              key: that.data.key,
              pc_id: e.target.dataset.cart_id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)

              
              wx.request({
                url: http + '/index.php?model=pointcart&fun=index', //仅为示例，并非真实的接口地址
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
                    goods_list: res.data.datas.data.cartgoods_list,
                    total_: res.data.datas.data.cartgoods_pointall

                  })
                  if (that.data.goods_list.length <= 0) {
                    that.setData({
                      is_kong: true

                    })
                  }
                }
              })














            }
          })





        } 
      }
    })
            

  },







  // 支付
  pay: function () {
    wx.navigateTo({
      url: '../../poin_order/order_table/order_table'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      key: wx.getStorageSync('key')
    })
    wx.request({
      url: http + '/index.php?model=pointcart&fun=index', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        key:that.data.key
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
         



        that.setData({
          goods_list: res.data.datas.data.cartgoods_list,
          total_:res.data.datas.data.cartgoods_pointall
        })
        if (that.data.goods_list.length<=0){
          that.setData({
            is_kong: true
            
          })
        }


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
      url: http + '/index.php?model=pointcart&fun=index', //仅为示例，并非真实的接口地址
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
          goods_list: res.data.datas.data.cartgoods_list,
          total_: res.data.datas.data.cartgoods_pointall
        })
        if (that.data.goods_list.length <= 0) {
          that.setData({
            is_kong: true
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