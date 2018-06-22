var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage=1
var total_page=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_list: [
      // {
      //   image: "../../images/tj1.jpg",
      //   name: "领券199减100【周黑鸭_锁鲜】卤鸭脖320g鸭锁骨240g鸭掌245g气调盒装零食套餐",
      //   price: "118.90",
      //   chk:false
      // },
      // {
      //   image: "../../images/tj2.jpg",
      //   name: "包邮【周黑鸭_锁鲜】卤鸭脖200g鸭锁骨240g鸭翅250g气调盒装麻辣肉类零食大礼包",
      //   price: "73.80",
      //   chk: false
      // },
     
    ],
    key: "",
    is_kong:false,
    tp:''
    
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
         key: wx.getStorageSync('dl_key'),
         tp: new_http
       })
       wx.request({
         url: new_http +'/hyapi/user/getcollectgoodslist?common_param={"page_index":1,"page_size":""}&token='+that.data.key, //仅为示例，并非真实的接口地址
         header: {
           'content-type': 'application/json' // 默认值
         },
         success: function (res) {
           console.log(res.data)
            if(res.data.errcode!='0'){
                that.setData({
                  is_kong: true,
                  select_list: []
                })
            }else{
                that.setData({
                  select_list:res.data.data.data,
                  is_kong: false
                })
            }
         }
       })


    // wx.request({
    //   url: http + '/index.php?model=member_favorites&fun=favorites_list', //仅为示例，并非真实的接口地址
    //   data: {
    //     key:that.data.key,
    //     curpage: 1,
    //     page: 10
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     wx.hideLoading()
    //   console.log(res.data)
    //     total_page = res.data.page_total
        
    //     if (res.data.datas.favorites_list.length<=0){
    //       that.setData({
    //         is_kong: true
    //       })
    //     }else{
    //       that.setData({
    //         select_list: res.data.datas.favorites_list,
    //         is_kong: false
    //       })
    //     }
        


    //   }
    // })
  },
  cancel_collect:function(e){
      var that=this
    wx.showModal({
      title: '提示',
      content: '确认取消该商品的收藏',
      success: function (res) {
        if (res.confirm) {
     
            wx.request({
              url: new_http + '/hyapi/user/removecollectgoods?common_param={"goods_id":' + e.target.dataset.id + '}&token=' + that.data.key, //仅为示例，并非真实的接口地址
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

                  wx.request({
                    url: new_http + '/hyapi/user/getcollectgoodslist?common_param={"page_index":1,"page_size":""}&token=' + that.data.key, //仅为示例，并非真实的接口地址
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      console.log(res.data)
                      if (res.data.errcode != '0') {
                        that.setData({
                          is_kong: true,
                          select_list: []
                        })
                      } else {
                        that.setData({
                          select_list: res.data.data.data,
                          is_kong: false
                        })
                      }
                    }
                  })
                }
              }
            })

       
        }
      }
    })


  },
  add_car:function(e){
    var that=this
      console.log(e.target.dataset.id)
      wx.showModal({
        title: '提示',
        content: '是否确认加入购物车',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: http +'/index.php?model=member_cart&fun=cart_add', //仅为示例，并非真实的接口地址
              method:"POST",
              data: {
                goods_id: e.target.dataset.id,
                key: that.data.key,
                quantity: 1
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data)
                if(res.data.code==200){
                  wx.showModal({
                    title: '提示',
                    content:"添加成功" ,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })

                } else if (res.data.code == 400){
                  wx.showModal({
                    title: '提示',
                    content: res.data.datas.error,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }



              }
             
            })



          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })





  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  del_cur:function(){
    var that=this
    console.log(that.data.select_list)
    var selarr=[]

    for (var i = 0; i < that.data.select_list.length;i++ ){
      if (that.data.select_list[i].chk){
        selarr.push(that.data.select_list[i].goods_id)
        }
    }
    if (selarr.length<=0){
      wx.showToast({
        title: '请选择需要移除的商品',
        icon: 'none',
        duration: 2000
      })
        return false;
    }
    wx.showModal({
      title: '提示',
      content: '确认删除选择的商品吗',
      success: function (res) {
        if (res.confirm) {

          console.log(selarr)
            var all_flag=false
          for (var i = 0; i < selarr.length;i++){
            wx.request({
              url: new_http + '/hyapi/user/removecollectgoods?common_param={"goods_id":' + selarr[i] + '}&token=' + that.data.key, //仅为示例，并非真实的接口地址
              header: {
                'content-type': 'application/json' // 默认值
              },
              success:function(res){


                console.log(res.data)
                if (res.data.errcode == '0') {
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                  wx.request({
                    url: new_http + '/hyapi/user/getcollectgoodslist?common_param={"page_index":1,"page_size":""}&token=' + that.data.key, //仅为示例，并非真实的接口地址
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      console.log(res.data)
                      if (res.data.errcode != '0') {
                        that.setData({
                          is_kong: true,
                          select_list: []
                        })
                      } else {
                        that.setData({
                          select_list: res.data.data.data,
                          is_kong: false
                        })
                      }
                    }
                  })

                  
             
          
                }else{

                
                }
              }
            })
        } 
          
     
      
       

      
           


        } else if (res.cancel) {
         return false
        }
      }
    })


   





  },
  onReady: function () {
    
  },

    // 添加选择状态
  sel_del:function(e){
     var index= e.target.dataset.index;
     var list = this.data.select_list;
     list[index].chk =!list[index].chk
    this.setData({
      select_list: list
    })
  },

  all_:function(){
    
    var list = this.data.select_list;

    var flag = true;
    for (var i = 0; i < list.length;i++){
      if (list[i].chk==false){
        flag = false
      }
    }
   
    if (flag==false){

      for (var i = 0; i < list.length; i++) {
        list[i].chk =true;
         
      }
      this.setData({
        select_list: list
      })

    }else{
      for (var i = 0; i < list.length; i++) {
        list[i].chk = false;

      }

      this.setData({
        select_list: list
      })
    }

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
    var that=this
    curpage++
    if (curpage > total_page){

        return false
      }

    wx.request({
      url: http + '/index.php?model=member_favorites&fun=favorites_list', //仅为示例，并非真实的接口地址
      data: {
        key:that.data.key,
        curpage: curpage,
        page: 10
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.datas.favorites_list)


        // for (var i = 0; i < res.data.datas.favorites_list.length; i++) {
        //   res.data.datas.favorites_list[i].chk = false;
        // }

        console.log(res.data.datas.favorites_list)

        that.setData({
          select_list: that.data.select_list.concat(res.data.datas.favorites_list) 
        })


      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})