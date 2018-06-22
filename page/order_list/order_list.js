var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage=1
var total_page=0;
var hasmore

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_cur:1,
    all_data:[],
    state:"",
    is_kong:false,
    qx_yy:"",
    key:"",
    ht: new_http,
    status:'',

  },
  formatDateTime:function (timeStamp) {   
    var date = new Date();  
    date.setTime(timeStamp * 1000);  
    var y = date.getFullYear();      
    var m = date.getMonth() + 1;      
    m = m < 10 ? ('0' + m) : m;      
    var d = date.getDate();      
    d = d < 10 ? ('0' + d) : d;      
    var h = date.getHours();    
    h = h < 10 ? ('0' + h) : h;    
    var minute = date.getMinutes();    
    var second = date.getSeconds();    
    minute = minute < 10 ? ('0' + minute) : minute;      
    second = second < 10 ? ('0' + second) : second;     
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;      
  },
  pay_order:function(e){
    var that = this
    wx.request({
      url: http + '/index.php?model=member_payment&fun=pay_miniapp', //仅为示例，并非真实的接口地址
      data: {
        key: that.data.key,
        pay_sn: e.target.dataset.pay_sn,
        rcb_pay: 0,
        password: "",
        pd_pay: 0,
        payment_code: "wxpay_mini",
        inajax: 1
      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {

            wx.showToast({
              title: '支付操作完成！如果您的订单状态没有改变，请耐心等待支付网关的返回结果。',
              icon: 'none',
              duration: 2000
            })
           
            wx.request({
              url: http + '/index.php?model=member_order&fun=order_list', //仅为示例，并非真实的接口地址
              data: {
                key: that.data.key,
                page: 5,
                curpage: 1,
                state_type: ""
              },
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {


                hasmore = res.data.hasmore
                total_page = res.data.page_total



                console.log(res.data)
                for (var i = 0; i < res.data.datas.order_group_list.length; i++) {
                  res.data.datas.order_group_list[i].order_list[0].gong = 0
                  for (var k = 0; k < res.data.datas.order_group_list[i].order_list[0].extend_order_goods.length; k++) {
                    res.data.datas.order_group_list[i].order_list[0].gong += parseFloat(res.data.datas.order_group_list[i].order_list[0].extend_order_goods[k].goods_num)
                  }
                  res.data.datas.order_group_list[i].time = that.formatDateTime(res.data.datas.order_group_list[i].add_time)
                }

                that.setData({
                  all_data: res.data.datas.order_group_list

                })
                console.log(that.data.all_data)
                if (res.data.datas.order_group_list.length <= 0) {
                  that.setData({
                    is_kong: true
                  })

                } else {
                  that.setData({
                    is_kong: false
                  })
                }
                console.log(that.data.is_kong)
              }
            })


























          },
          'fail': function (res) {


            console.log(res)
            wx.showToast({
              title: '对不起，支付未完成或失败！',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {

              wx.navigateTo({
                url: '../../order_list/order_list'
              })
            }, 2000)

          }
        })
      }
    })


  },
  get_order:function(url,curpage,count){
    wx.showLoading({
      title: '加载中',
      mask:true,
    })

    var that=this;
    wx.request({
      url: new_http + url + '?common_param={"page_index":' + curpage + ',"page_size":' + count+'}&token=' + that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.errcode == '0') {
          for (var i = 0; i < res.data.data.data.length; i++) {
            res.data.data.data[i].create_time = that.formatDateTime(res.data.data.data[i].create_time)
          }
          
          if(res.data.data.data.length==0){
            that.setData({
              all_data: [],
              is_kong: true
            })
          }else{
            that.setData({
              all_data: res.data.data.data,
              is_kong: false
            })
          }
          if (url =='/hyapi/order/getalllist'){
              that.setData({
                show_cur: 1
              })
            }
        } 
        wx.hideLoading()
      }
    })
  },
  onLoad: function (options) {




    var that = this;
     this.setData({
      key: wx.getStorageSync('dl_key'),
      status: options.status||''

    })
    curpage = 1




    // this.get_order('/hyapi/order/getalllist',1,0);



    // 全部数据
    // wx.request({
    //   url: http + '/index.php?model=member_order&fun=order_list', //仅为示例，并非真实的接口地址
    //   data: {
    //     key: that.data.key,
    //     page: 5,
    //     curpage: 1,
    //     state_type: options.state
    //   },
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
      

    //     hasmore = res.data.hasmore
    //     total_page = res.data.page_total



    //       console.log(res.data)
    //     for (var i = 0; i < res.data.datas.order_group_list.length; i++) {
    //       res.data.datas.order_group_list[i].order_list[0].gong = 0
    //       for (var k = 0; k < res.data.datas.order_group_list[i].order_list[0].extend_order_goods.length; k++) {
    //         res.data.datas.order_group_list[i].order_list[0].gong += parseFloat(res.data.datas.order_group_list[i].order_list[0].extend_order_goods[k].goods_num)
    //       }
    //       res.data.datas.order_group_list[i].time = that.formatDateTime(res.data.datas.order_group_list[i].add_time)
    //     }

    //     that.setData({
    //       all_data: res.data.datas.order_group_list

    //     })
    //     console.log(that.data.all_data)
    //     if (res.data.datas.order_group_list.length<=0){
    //       that.setData({
    //         is_kong:true
    //       })

    //     }else{
    //       that.setData({
    //         is_kong: false
    //       })
    //     }
    //     console.log(that.data.is_kong)
    //   }
    // })



    if (options.status == "s1") {
      that.setData({
        show_cur: 2
      })
      this.get_order('/hyapi/order/getunpaidlist', 1, 0);
    } else if (options.status == "s2") {
      that.setData({
        show_cur: 3
      })
      this.get_order('/hyapi/order/getpaidlist', 1, 0);

    } else if (options.status == "s3") {
      that.setData({
        show_cur: 4
      })
      this.get_order('/hyapi/order/getdeliveredlist', 1, 0);   

    } else if (options.status == "s4") {
      that.setData({
        show_cur: 5
      })
      this.get_order('/hyapi/order/getuncommentlist', 1, 0);  
    }else{
      this.get_order('/hyapi/order/getalllist', 1, 0);
    }
  },
      // 切换订单
  toggle_cur:function(e){
    curpage = 1
  var that=this;
     this.setData({
       show_cur: e.target.dataset.index,
       state: e.target.dataset.state
     })
     console.log(e.target.dataset.state)
     if (e.target.dataset.state =='state_new'){
     
       this.get_order('/hyapi/order/getunpaidlist', 1, 0);
     }else if (e.target.dataset.state=='state_pay'){
       
       this.get_order('/hyapi/order/getpaidlist', 1, 0);
     }else if (e.target.dataset.state=='state_send'){
       this.get_order('/hyapi/order/getdeliveredlist', 1, 0);    
     
     }else if (e.target.dataset.state=='state_noeval'){
       this.get_order('/hyapi/order/getuncommentlist', 1, 0);    
      
     }else if (e.target.dataset.state=='state_cancel'){
       this.get_order('/hyapi/order/getuncommentlist', 1, 0);
    }else{
       this.get_order('/hyapi/order/getalllist', 1, 0);
    }
     
    //  wx.request({
    //    url: http + '/index.php?model=member_order&fun=order_list', //仅为示例，并非真实的接口地址
    //    data: {
    //      key: that.data.key,
    //      page: 5,
    //      curpage: 1,
    //      state_type: e.target.dataset.state
    //    },
    //    method: "POST",
    //    header: {
    //      'content-type': 'application/json' // 默认值
    //    },
    //    success: function (res) {
         
    //      hasmore=res.data.hasmore
    //      total_page = res.data.page_total
    //      for (var i = 0; i < res.data.datas.order_group_list.length;i++){
    //        res.data.datas.order_group_list[i].order_list[0].gong=0
    //        for (var k = 0; k < res.data.datas.order_group_list[i].order_list[0].extend_order_goods.length;k++){
    //          res.data.datas.order_group_list[i].order_list[0].gong += parseFloat(res.data.datas.order_group_list[i].order_list[0].extend_order_goods[k].goods_num)
    //         }
    //        res.data.datas.order_group_list[i].time = that.formatDateTime(res.data.datas.order_group_list[i].add_time)
    //     }
        
    //      that.setData({
    //        all_data: res.data.datas.order_group_list

    //      })
    //      if (res.data.datas.order_group_list.length <= 0) {
    //        that.setData({
    //          is_kong: true
    //        })

    //      } else {
    //        that.setData({
    //          is_kong: false
    //        })
    //      }
    //      console.log(that.data.is_kong)
    //    }
    //  })
  },   

  /**
   * 生命周期函数--监听页面加载
   */
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  sureorder:function(e){
      var that=this
    wx.showModal({
      title: '提示',
      content: '确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: http +'/index.php?model=member_order&fun=order_receive', //仅为示例，并非真实的接口地址
            data: {
              key: that.data.key,
              order_id:e.target.dataset.order_id
            },
            method:"POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)

              wx.request({
                url: http + '/index.php?model=member_order&fun=order_list', //仅为示例，并非真实的接口地址
                data: {
                  key: that.data.key,
                  page: 5,
                  curpage: curpage,
                  state_type: that.data.state
                },
                method: "POST",
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  // console.log(res.data)

                  hasmore = res.data.hasmore

                  for (var i = 0; i < res.data.datas.order_group_list.length; i++) {
                    res.data.datas.order_group_list[i].order_list[0].gong = 0
                    for (var k = 0; k < res.data.datas.order_group_list[i].order_list[0].extend_order_goods.length; k++) {
                      res.data.datas.order_group_list[i].order_list[0].gong += parseFloat(res.data.datas.order_group_list[i].order_list[0].extend_order_goods[k].goods_num)
                    }
                    res.data.datas.order_group_list[i].time = that.formatDateTime(res.data.datas.order_group_list[i].add_time)
                  }
                  that.setData({
                    all_data: res.data.datas.order_group_list

                  })
                  console.log(that.data.all_data)
                }
              })



            }
          })
        } 
      }
    })


  },
  cancel_order:function(e){
    var that=this
    wx.showModal({
      title: '提示',
      content: '是否确认取消该订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: new_http+'test.php', //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
            }
          })




        } else if (res.cancel) {
       
        }
      }
    })
    // wx.showActionSheet({
    //   itemList: ['改买其他商品', '改用其他配送方式', '其他原因'],
    //   success: function (res) {
    //     console.log(res.tapIndex)
    //     if (res.tapIndex==0){
    //       that.setData({
    //         qx_yy:"改买其他商品"
    //       })
    //     } else if (res.tapIndex == 1){
    //       that.setData({
    //         qx_yy: "改用其他配送方式"
    //       })
    //     }else{
    //       that.setData({
    //         qx_yy: "其他原因"
    //       })
    //     }
    //     wx.request({
    //       url: http + '/index.php?model=member_order&fun=order_cancel', //仅为示例，并非真实的接口地址
    //       method: "POST",

    //       data: {
    //         order_id: e.target.dataset.order_id,
    //         key:that.data.key,
    //         state_info: that.data.qx_yy
    //       },
    //       header: {
    //         'content-type': 'application/json' // 默认值
    //       },
    //       success: function (res) {
    //         console.log(res.data)
    //         if (res.data.code == 400) {
    //           wx.showToast({
    //             title: res.data.datas.error,
    //             icon: 'none',
    //             duration: 3000
    //           })
    //           return false
    //         }

    //         wx.request({
    //           url: http + '/index.php?model=member_order&fun=order_list', //仅为示例，并非真实的接口地址
    //           data: {
    //             key: that.data.key,
    //             page: 5,
    //             curpage: curpage,
    //             state_type: that.data.state
    //           },
    //           method: "POST",
    //           header: {
    //             'content-type': 'application/json' // 默认值
    //           },
    //           success: function (res) {
    //             // console.log(res.data)

    //             hasmore = res.data.hasmore

    //             for (var i = 0; i < res.data.datas.order_group_list.length; i++) {
    //               res.data.datas.order_group_list[i].order_list[0].gong = 0
    //               for (var k = 0; k < res.data.datas.order_group_list[i].order_list[0].extend_order_goods.length; k++) {
    //                 res.data.datas.order_group_list[i].order_list[0].gong += parseFloat(res.data.datas.order_group_list[i].order_list[0].extend_order_goods[k].goods_num)
    //               }
    //               res.data.datas.order_group_list[i].time = that.formatDateTime(res.data.datas.order_group_list[i].add_time)
    //             }
    //             that.setData({
    //               all_data: res.data.datas.order_group_list

    //             })
    //             console.log(that.data.all_data)
    //           }
    //         })


    //       }
    //     })


    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //   }
    // })

  



  },
  again_buy: function (e) {
    var that=this
    wx.showModal({
      title: '提示',
      content: '是否确认再次购买该商品',
      success: function (res) {
        if (res.confirm) {
          var flag = true;
          var arrAjax = e.target.dataset.cid.split(",")
          console.log(arrAjax)
          for (var i = 0; i < arrAjax.length; i++) {

            wx.request({
              url: http + '/index.php?model=member_cart&fun=cart_add', //仅为示例，并非真实的接口地址
              method: "POST",
              data: {
                quantity: 1,
                key: that.data.key,
                goods_id: arrAjax[i]
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data)
                if (res.data.code != 200) {
                  flag = false
                }


              },
              fail: function () {
                flag = false
              }
            })

          }
          if (flag) {
            wx.showToast({
              title: '以加入购物车',
              icon: 'success',
              duration: 2000
            })
          }



        } else if (res.cancel) {

        }
      }
    })


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.get_order('/hyapi/order/getalllist', 1, 0);
  var that=this;
    if (that.data.status == "s1") {
      this.get_order('/hyapi/order/getunpaidlist', 1, 0);
    } else if (that.data.status == "s2") {
      this.get_order('/hyapi/order/getpaidlist', 1, 0);

    } else if (that.data.status == "s3") {
   
      this.get_order('/hyapi/order/getdeliveredlist', 1, 0);

    } else if (that.data.status == "s4") {
      this.get_order('/hyapi/order/getuncommentlist', 1, 0);
    } else {
      this.get_order('/hyapi/order/getalllist', 1, 0);
      
    }
  },
  del_order:function(e){
    var that=this
      console.log(e.target.dataset.order_id)
    wx.showModal({
      title: '提示',
      content: '是否确认删除该订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: http + '/index.php?model=member_order&fun=order_delete', //仅为示例，并非真实的接口地址
            data: {
              order_id: e.target.dataset.order_id,
              key: that.data.key
            },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              console.log(curpage)
              wx.request({
                url: http + '/index.php?model=member_order&fun=order_list', //仅为示例，并非真实的接口地址
                data: {
                  key: that.data.key,
                  page: 5,
                  curpage: curpage,
                  state_type: that.data.state
                },
                method: "POST",
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  // console.log(res.data)

                  hasmore = res.data.hasmore

                  for (var i = 0; i < res.data.datas.order_group_list.length; i++) {
                    res.data.datas.order_group_list[i].order_list[0].gong = 0
                    for (var k = 0; k < res.data.datas.order_group_list[i].order_list[0].extend_order_goods.length; k++) {
                      res.data.datas.order_group_list[i].order_list[0].gong += parseFloat(res.data.datas.order_group_list[i].order_list[0].extend_order_goods[k].goods_num)
                    }
                    res.data.datas.order_group_list[i].time = that.formatDateTime(res.data.datas.order_group_list[i].add_time)
                  }
                  that.setData({
                    all_data: res.data.datas.order_group_list

                  })
                  console.log(that.data.all_data)
                }
              })










            }
          })
        } else if (res.cancel) {
          
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
    // var that=this
    // console.log("curpage=" + curpage)
    // console.log("total_page=" + total_page)
    // curpage++
    // if (curpage>total_page){
    //   return false
    // }



    // wx.request({
    //   url: http + '/index.php?model=member_order&fun=order_list', //仅为示例，并非真实的接口地址
    //   data: {
    //     key: that.data.key,
    //     page: 5,
    //     curpage: curpage,
    //     state_type: that.data.state
    //   },
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     // console.log(res.data)
        
    //     hasmore = res.data.hasmore

    //     for (var i = 0; i < res.data.datas.order_group_list.length; i++) {
    //       res.data.datas.order_group_list[i].order_list[0].gong = 0
    //       for (var k = 0; k < res.data.datas.order_group_list[i].order_list[0].extend_order_goods.length; k++) {
    //         res.data.datas.order_group_list[i].order_list[0].gong += parseFloat(res.data.datas.order_group_list[i].order_list[0].extend_order_goods[k].goods_num)
    //       }
    //       res.data.datas.order_group_list[i].time = that.formatDateTime(res.data.datas.order_group_list[i].add_time)
    //     }
    //     that.setData({
    //       all_data: that.data.all_data.concat(res.data.datas.order_group_list) 

    //     })
    //     console.log(that.data.all_data)
    //   }
    // })









  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})