  var app= getApp()
  var http = app.globalData.https
  var new_http = app.globalData.new_http
  var history = [];
  var curpage=1;
  var total_page=0;
  var pageindex = 1;
  
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    data_new_http: new_http,
    select_list:[
    {
      image: "../../images/tj1.jpg",
      name: "领券199减100【周黑鸭_锁鲜】卤鸭脖320g鸭锁骨240g鸭掌245g气调盒装零食套餐",
      price: "118.90"
    },
    {
      image: "../../images/tj2.jpg",
      name: "包邮【周黑鸭_锁鲜】卤鸭脖200g鸭锁骨240g鸭翅250g气调盒装麻辣肉类零食大礼包",
      price: "73.80"
    },
    {
      image: "../../images/tj3.jpg",
      name: "领券199减100【周黑鸭_锁鲜】卤鸭脖320g+200g各一盒 零食套餐D",
      price: "80.90"
    },
    {
      image: "../../images/tj4.jpg",
      name: "领券199减100【周黑鸭_锁鲜】卤鸭舌80gX2盒 气调盒装食品麻辣休闲零食熟食小吃D",
      price: "80.90"
    },
    {
      image: "../../images/tj5.jpg",
      name: "领券199减100【周黑鸭_锁鲜】卤鸭锁骨240gX2盒 气调盒装食品 武汉特产麻辣零食D",
      price: "80.90"
    },
    {
      image: "../../images/tj6.jpg",
      name: "领券199减100【周黑鸭_锁鲜】卤鸭舌80gX2盒 气调盒装食品麻辣休闲零食熟食小吃D",
      price: "80.90"
    }
    ],
    goods_list:[],
    is_kong:false,
    my_option:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curpage=1
      var that=this;
    console.log(options)
    that.setData({
      my_option: options

    })
    console.log("my_option")
    console.log(that.data.my_option)
    if (options.brand_id){
      wx.request({
        url: http + '/index.php?model=goods&fun=goods_list',
        data: {
          b_id: options.brand_id,
          curpage: 1,
          page: 6
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // console.log(res.data.datas.goods_list)
          total_page = res.data.page_total
          that.setData({
            goods_list: res.data.datas.goods_list
          })
          // console.log("长度为" + that.data.goods_list.length)
          if (that.data.goods_list.length <= 0) {
            that.setData({
              is_kong: true
            })
          }
        }
      })
    } else if (options.keyword){



      var that = this

    


      history = wx.getStorageSync("key_ser") || []

      if (history.length >= 3) {
        history.unshift(options.keyword)
        history.pop()

      } else {
        history.unshift(options.keyword)

      }


      wx.setStorageSync(
        "key_ser",
        history
      )
      wx.request({
        url: http + '/index.php?model=goods&fun=goods_list',
        data: {
          keyword: options.keyword,
          curpage: 1,
          page: 6
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          total_page = res.data.page_total
          that.setData({
            goods_list: res.data.datas.goods_list
          })
          // console.log("长度为" + that.data.goods_list.length)
          if (that.data.goods_list.length <= 0) {
            that.setData({
              is_kong: true
            })

          }
        }
      })
    }else{
      wx.request({
        url: new_http + '/hyapi/goods/getgoodslist?common_param={"shop_id":0,"page_index":1,"page_size":6,"category_id":' + that.data.my_option.gc_id+'}',
        
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          // total_page=res.data.page_total
          that.setData({
            goods_list: res.data.data.data
          })
          // // console.log("长度为" + that.data.goods_list.length)
          if (that.data.goods_list.length <= 0) {
            that.setData({
              is_kong: true
            })

          }


        }
      })
    }






   
  },
  back: function () {
    wx.navigateBack({ changed: true });  
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
    var that = this;
    
    // console.log("触底")
    // console.log("curpage=" + curpage)
    // console.log("total_page=" + total_page)
    // console.log(that.data.my_option)
    // curpage++

  //   if (curpage>total_page){
  //     return false;
  // }   
  
    if (that.data.my_option.brand_id) {
      console.log("brand")
      console.log("curpage=" + curpage)
      console.log("total_page=" + total_page)
      wx.request({
        url: http + '/index.php?model=goods&fun=goods_list',
        data: {
          b_id: that.data.my_option.brand_id,
          curpage: curpage,
          page: 6
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
       
          that.setData({
            goods_list: that.data.goods_list.concat(res.data.datas.goods_list) 
          })
          // console.log("长度为" + that.data.goods_list.length)
         
        }
      })
    } else if (that.data.my_option.keyword) {
      console.log("keyword")
      console.log("curpage=" + curpage)
      console.log("total_page=" + total_page)

      wx.request({
        url: http + '/index.php?model=goods&fun=goods_list',
        data: {
          keyword: that.data.my_option.keyword,
          curpage: curpage,
          page: 6
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
         
          that.setData({
            goods_list: that.data.goods_list.concat(res.data.datas.goods_list) 
          })
          // console.log("长度为" + that.data.goods_list.length)
       
        }
      })
    } else {
      var that=this
      wx.showLoading({
        title: '加载中',
      })
      pageindex++
       console.log(pageindex)
       var get_url = new_http + '/hyapi/goods/getgoodslist?common_param={"shop_id":0,"page_index":' + pageindex + ',"page_size":6,"category_id":' + that.data.my_option.gc_id+'}'     
      wx.request({
        url: get_url,
        // data: {
        //   gc_id: that.data.my_option.gc_id,
        //   curpage: curpage,
        //   page: 6
        // },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading()
          
          console.log(res.data)
          if(res.data.data.data.length>0){
            that.setData({
              goods_list: that.data.goods_list.concat(res.data.data.data)
            })

          }else{
            wx.showToast({
              title: '以无更多商品！',
              icon: 'none',
              duration: 2000
            })
          }
       


        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})