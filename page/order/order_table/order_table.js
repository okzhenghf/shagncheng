var app = getApp()
var http = app.globalData.https
var appid = app.globalData.appid
var secret = app.globalData.secret
var loginObj = {}
var curpage = 1
var page_total = 0
var p_txt = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['箱包', '办公用品', '装修材料', '电脑配件'],
    index: "",
    // 是否需要发票
    need_invi: false,
    // 发票类型
    invoice_Type: false,
    goods_list: [],
    total_money: "",
    send_arr: [],
    address_info: {},
    has_address: true,
    yunf: 0.00,
    has_juan: true,
    chk: false,
    juan_data: [],
    zhang: 0,
    youhui: 0.00,
    table_hid: false,
    jian_hid: true,
    piao_hid: true,
    juan_txt: "选择优惠卷",
    juan_code: "",
    dong_show: false,
    dong_txt: "",
    in_chk: 1000,
    in_his_data: [],
    add_piao: false,
    in_id: "",
    piao_txt: "不需要发票",
    piao_content: "",
    input_txt: "",
    ly_txt: "",
    is_car: true,
    cart_id: "",
    vat_hash: "",
    offpay_hash: "",
    offpay_hash_batch: "",
    dan_goods: "",
    goods_id: "",
    buynum: "",
    jq: false,
    sl: false,
    desc: "",
    sl_img: "",
    key:""
  },
  all_get: function () {
    var that = this    
    if (that.data.address_info.address_id==""){
      wx.showToast({
        title: '请检查是否添加收货地址',
        icon: 'none',
        duration: 2000
      })
      return false
    }


    var data_obj = {}
    if (that.data.is_car) {
      data_obj = {
        key: that.data.key,
        cart_id: that.data.cart_id,
        ifcart: 1,
        address_id: that.data.address_info.address_id,
        vat_hash: that.data.vat_hash,
        offpay_hash: that.data.offpay_hash,
        offpay_hash_batch: that.data.offpay_hash_batch,
        pay_name: "online",
        invoice_id: that.data.in_id,
        voucher: that.data.juan_code,
        pd_pay: 0,
        password: "",
        fcode: "",
        rcb_pay: 0,
        rpt: "",
        pay_message: that.data.ly_txt
      }
      console.log(data_obj)
    } else {
      data_obj = {
        key: that.data.key,
        cart_id: that.data.dan_goods,
        ifcart: "",
        address_id: that.data.address_info.address_id,
        vat_hash: that.data.vat_hash,
        offpay_hash: that.data.offpay_hash,
        offpay_hash_batch: that.data.offpay_hash_batch,
        pay_name: "online",
        invoice_id: that.data.in_id,
        voucher: that.data.juan_code,
        pd_pay: 0,
        password: "",
        fcode: "",
        rcb_pay: 0,
        rpt: "",
        pay_message: that.data.ly_txt
      }
    }


    wx.request({
      url: http + '/index.php?model=member_buy&fun=buy_step2', //仅为示例，并非真实的接口地址
      method: "POST",
      data: data_obj,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==400){
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          })
          return false
        }



        if (res.data.datas.payment_code == "offline") {
          wx.navigateTo({
            url: '../../order_list/order_list'
          })
        } else {
          wx.request({
            url: http + '/index.php?model=member_buy&fun=pay', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
              key: that.data.key,
              pay_sn: res.data.datas.pay_sn
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

              if (res.data.datas.error) {
                // 报错
                wx.showToast({
                  title: res.data.datas.error,
                  icon: 'none',
                  duration: 2000
                })
                return false
              }

              console.log(res.data)
            
            

           
              wx.request({
                url: http + '/index.php?model=member_payment&fun=pay_miniapp', //仅为示例，并非真实的接口地址
                data: {
                  key:that.data.key,
                  pay_sn: res.data.datas.pay_info.pay_sn,
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
                      setTimeout(function () {

                        wx.navigateTo({
                          url: '../../order_list/order_list'
                        })
                      }, 2000)
                      console.log(res)
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
            }
          })
        }
      }
    })








  },
  get_ly: function (e) {
    this.setData({
      ly_txt: e.detail.value
    })
  },
  toggle_chk: function (e) {
    var that = this
    this.setData({
      in_chk: e.target.dataset.index,

    })
    if (e.target.dataset.index == "新增") {
      that.setData({
        add_piao: true
      })

    } else {
      that.setData({
        add_piao: false,
        in_id: e.target.dataset.inv_id
      })
      console.log(that.data.in_his_data[e.target.dataset.index])
      p_txt = that.data.in_his_data[e.target.dataset.index].inv_title + " " + that.data.in_his_data[e.target.dataset.index].inv_content

    }



  },
  get_p_val: function (e) {
    this.setData({
      input_txt: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var step_obj = {}
    var that = this
    that.setData({
      key: wx.getStorageSync('key')
    })
    // 判断是从购物车跳转过来
    if (options.ifcart == "1") {
      console.log(options)
      that.setData({
        is_car: true,
        cart_id: options.cart_id,
        ifcart: options.ifcart
      })
      step_obj = {
        key: that.data.key,
        cart_id: options.cart_id,
        ifcart: 1
      }
    } else {
      that.setData({
        is_car: false,
        dan_goods: options.goods_id + "|" + options.buynum,
        goods_id: options.goods_id,
        buynum: options.buynum
      })
      console.log(options)
      step_obj = {
        key:that.data.key,
        cart_id: options.goods_id + "|" + options.buynum,
      }
    }



    wx.request({
      url: http + '/index.php?model=member_buy&fun=buy_step1', //仅为示例，并非真实的接口地址
      data: step_obj,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)

        that.setData({
          vat_hash: res.data.datas.vat_hash,
          offpay_hash: res.data.datas.address_api.offpay_hash,
          offpay_hash_batch: res.data.datas.address_api.offpay_hash_batch,
        })
        // 判断有没有优惠卷
        console.log(res.data.datas.store_cart_list["1"].store_voucher_list.length)
        if (res.data.datas.store_cart_list["1"].store_voucher_list.length <= 0) {
          that.setData({
            has_juan: false
          })
        } else {
          // 有的话返回优惠卷列表
          for (var k in res.data.datas.store_cart_list) {
            for (var b in res.data.datas.store_cart_list[k].store_voucher_list) {
              var it = res.data.datas.store_cart_list[k].store_voucher_list[b]
              it.code = it.voucher_t_id + "|" + k + "|" + it.voucher_price
            }
          }
          that.setData({
            has_juan: true,
            juan_data: res.data.datas.store_cart_list["1"].store_voucher_list
          })
          console.log(that.data.juan_data)

        }

        // 判断有没有地址
        if (res.data.datas.address_info.length <= 0) {
          that.setData({
            has_address: false
          })
        } else {
          that.setData({
            address_info: res.data.datas.address_info,
            send_arr: res.data.datas.address_api.no_send_tpl_ids,
            yunf: res.data.datas.address_api.content["1"],
            has_address: true
          })
          // 判断商品是否支持配送
          for (var i = 0; i < res.data.datas.store_cart_list["1"].goods_list.length; i++) {

            for (var k = 0; k < that.data.send_arr.length; k++) {

              if (res.data.datas.store_cart_list["1"].goods_list[i].transport_id == that.data.send_arr[k]) {
                res.data.datas.store_cart_list["1"].goods_list[i].send_o = true
              } else {
                res.data.datas.store_cart_list["1"].goods_list[i].send_o = false
              }
            }
          }
        }
        // 获取商品列表与设置合计金额
        that.setData({
          goods_list: res.data.datas.store_cart_list["1"].goods_list,
          total_money: res.data.datas.store_final_total_list["1"]

        })

        // 判断有没有优惠活动
        if (res.data.datas.store_cart_list["1"].store_mansong_rule_list == null) {

          that.setData({
            dong_show: false,
            dong_txt: ""
          })



        } else {
          if (res.data.datas.store_cart_list["1"].store_mansong_rule_list.goods_id == "0") {
            that.setData({
              dong_show: true,
              dong_txt: res.data.datas.store_cart_list["1"].store_mansong_rule_list.desc.desc,
              jq: true,
              sl: false
            })

          } else {
            that.setData({
              dong_show: true,
              desc: res.data.datas.store_cart_list["1"].store_mansong_rule_list.desc.desc,
              sl_img: res.data.datas.store_cart_list["1"].store_mansong_rule_list.desc.url,
              jq: false,
              sl: true
            })

          }


        }

      }
    })

    // 获取发票内容
    wx.request({
      url: http + '/index.php?model=member_invoice&fun=invoice_content_list', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        key: that.data.key,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            array: res.data.datas.invoice_content_list
          })
        }
      }
    })
    // 获取发票历史
    wx.request({
      url: http + '/index.php?model=member_invoice&fun=invoice_list', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        key: that.data.key,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            in_his_data: res.data.datas.invoice_list
          })
        }
      }
    })







  },
  // 删除历史发票中的其中一个
  del_in: function (e) {
    var that = this
    wx.request({
      url: http + '/index.php?model=member_invoice&fun=invoice_del', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        key:that.data.key,
        inv_id: e.target.dataset.inv_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)

        wx.request({
          url: http + '/index.php?model=member_invoice&fun=invoice_list', //仅为示例，并非真实的接口地址
          method: "POST",
          data: {
            key: that.data.key,

          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 200) {
              that.setData({
                in_his_data: res.data.datas.invoice_list
              })
            }
          }
        })





      }
    })
  },
  ge: function () {
    this.setData({
      invoice_Type: false
    })
  },
  dw: function () {
    this.setData({
      invoice_Type: true
    })
  },
  bindPickerChange: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      piao_content: that.data.array[e.detail.value]
    })
  },
  // 不需要发票切换
  no_need_invi: function () {
    var that = this;
    this.setData({
      piao_txt: "不需要发票",
      in_id: "",
      need_invi: false,
      add_piao: false,
      in_chk: 1000
    })

  },
  //  发票确认
  paio_enter: function () {
    var that = this
    // 判断是不需要发票直接返回
    if (that.data.need_invi == false) {
      that.setData({
        table_hid: false,
        jian_hid: true,
        piao_hid: true,
      })
      return false
    }

    // 判断没有选择
    if (that.data.in_chk == 1000) {
      wx.showToast({
        title: '请选择发票',
        icon: 'none',
        duration: 2000
      })
    }
    // 判断选择了历史发票
    if (that.data.in_chk != 1000 && that.data.in_chk != "新增") {
      console.log(that.data.in_id)
      that.setData({
        piao_txt: p_txt,
        table_hid: false,
        jian_hid: true,
        piao_hid: true,
      })
    } else {
      // 新增发票
      var obj = {}
      if (that.data.invoice_Type == false) {
        if (that.data.piao_content == "") {
          wx.showToast({
            title: '请选择发票内容',
            icon: 'none',
            duration: 2000
          })
          return false
        }


        obj = {
          key: that.data.key,
          inv_title_select: "person ",
          inv_content: that.data.piao_content,
          inv_title: "个人"
        }


      } else if (that.data.invoice_Type == true) {

        if (that.data.piao_content == "") {
          wx.showToast({
            title: '请选择发票内容',
            icon: 'none',
            duration: 2000
          })
          return false
        }

        if (that.data.input_txt == "") {
          wx.showToast({
            title: '请填写发票抬头',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        obj = {
          key:that.data.key,
          inv_title_select: "company ",
          inv_content: that.data.piao_content,
          inv_title: that.data.input_txt
        }
      }
      console.log(obj)
      wx.request({
        url: http + '/index.php?model=member_invoice&fun=invoice_add', //仅为示例，并非真实的接口地址
        method: "POST",
        data: obj,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 200) {
            wx.request({
              url: http + '/index.php?model=member_invoice&fun=invoice_list', //仅为示例，并非真实的接口地址
              method: "POST",
              data: {
                key: that.data.key,

              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data)
                if (res.data.code == 200) {
                  that.setData({
                    in_his_data: res.data.datas.invoice_list
                  })
                }
              }
            })
            that.setData({
              table_hid: false,
              jian_hid: true,
              piao_hid: true,
              in_id: res.data.datas.inv_id,
              piao_txt: obj.inv_title + obj.inv_content,

            })


          }



























        }
      })

    }





  },
  // 需要发票切换
  _need_invi: function () {
    var that = this;
    this.setData({
      need_invi: true,
    })

  },
  // 优惠卷确认按钮
  jian_enter: function () {
    var that = this
    if (that.data.chk == false) {
      wx.showToast({
        title: '请选择你要使用的优惠卷',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    console.log(that.data.juan_data[(that.data.chk)])

    this.setData({
      juan_txt: that.data.juan_data[(that.data.chk)].voucher_desc,
      juan_code: that.data.juan_data[(that.data.chk)].code,
      table_hid: false,
      jian_hid: true,
      total_money: that.data.total_money - that.data.juan_data[(that.data.chk)].voucher_price
    })







  },
  // 显示优惠卷
  show_jian: function () {
    console.log(111)
    this.setData({
      table_hid: true,
      jian_hid: false,
      piao_hid: true,
    })

  },
  //发票返回
  piao_fang: function () {
    this.setData({
      table_hid: false,
      jian_hid: true,
      piao_hid: true,
    })

  },
  // 显示发票信息
  show_piao: function () {
    this.setData({
      table_hid: true,
      jian_hid: true,
      piao_hid: false
    })
  },
  // 优惠卷返回按钮
  jian_hui: function () {
    this.setData({
      table_hid: false,
      jian_hid: false,
    })
  },
  // 优惠卷选择
  ck_juan: function (e) {

    var that = this
    this.setData({
      chk: e.target.dataset.index,
      zhang: 1,
      youhui: that.data.juan_data[e.target.dataset.index].voucher_price
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
  onShow: function (e) {
    // console.log("show="+e)
    var that = this
    var step_obj = {}
    if (that.data.ifcart == "1") {
      that.setData({
        is_car: true,
      })
      step_obj = {
        key: that.data.key,
        cart_id: that.data.cart_id,
        ifcart: 1
      }
    } else {
      that.setData({
        is_car: false,
        dan_goods: that.data.goods_id + "|" + that.data.buynum
      })

      step_obj = {
        key: that.data.key,
        cart_id: that.data.goods_id + "|" + that.data.buynum,
      }
    }







    wx.request({
      url: http + '/index.php?model=member_buy&fun=buy_step1', //仅为示例，并非真实的接口地址
      data: step_obj,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        // 判断有没有地址
        if (res.data.datas.address_info.length <= 0) {
          that.setData({
            has_address: false
          })
        } else {
          that.setData({
            address_info: res.data.datas.address_info,
            send_arr: res.data.datas.address_api.no_send_tpl_ids,
            yunf: res.data.datas.address_api.content["1"],
            has_address: true
          })
        }
      }
    })
    setTimeout(function () {
      console.log(that.data.address_info.address_id)

    }, 500)
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
