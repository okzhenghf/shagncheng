  var app = getApp()
var http = app.globalData.https
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:"",
    p_id:0,
    num:1,
    poin_info:{},
    // 库存数量
    ku:0,
    // 限制兑行数量
    limitnum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that=this;
    that.setData({
      key: wx.getStorageSync('key')
    })
    that.setData({
      p_id: options.id
    })
    wx.request({
      url: http +'/index.php?model=pointprod&fun=pinfo', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key, 
        id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          poin_info: res.data.datas,
          ku: res.data.datas.prodinfo.pgoods_storage,
          limitnum: res.data.datas.prodinfo.pgoods_limitnum
        })
      }
    })
  },
  buy:function(){
    var that=this;
    var flag=true;
    if (that.data.limitnum > 0 && that.data.num > that.data.limitnum){
      wx.showToast({
        title: '兑换数量不能大于限兑数量',
        icon: 'none',
        duration: 2000
      })
          flag=false;
          return false;
       }

    if (that.data.ku > 0 && that.data.num > that.data.ku) {
      wx.showToast({
        title: '兑换数量不能大于库存数量',
        icon: 'none',
        duration: 2000
      })
      flag=false;
      return false;
    }


    if (flag){

      wx.request({
        url: http +"/index.php?model=pointcart&fun=add", //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        data:{
          key:that.data.key,
          pgid: that.data.p_id,
          quantity: that.data.num

        },
        success: function (res) {
          // console.log(res.data)
          if(res.data.code==200){
            wx.navigateTo({
              url: '../../poin/Poin_car/Poin_car'
            })
          }

          if (res.data.code==400){
            wx.showToast({
              title: res.data.datas.error,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }



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
    
  },

    // 数量减少
  down:function(){
     var that=this;
    var my_num=this.data.num;
    if (my_num==1){
      wx.showToast({
        title: '不能低于最低限制',
        icon: 'none',
        duration: 2000
      })
        }else{
            my_num--
            that.setData({
              num: my_num

            })
        }
  },
      // 增加
  add:function(){
    var that = this;
    var my_num = this.data.num;
    my_num++;
    that.setData({
      num: my_num

    })


  }    







})