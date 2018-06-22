var app = getApp()
var http = app.globalData.https
var new_http = app.globalData.new_http
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ku_list:[],
    pl_img_list:[],
    car_count:false,
    m_tp: new_http,
    nub:1,
    pj:true,
    lun_image:[],
    goods_info:[],
    image_info:{},
    goods_data:"",
    goods_id:0,
    key:"",
    goods_eval_list:"",
    is_kong:false,
    is_favorate:false,
    song_arr:[],
    song_show:false,
    my_Array: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: red;'
      }
    }]
  },
  show_ld:function(){
    wx.showToast({
      title: '请前往个人中心登陆',
      icon: 'none',
      duration: 2000
    })
  },
  lool_img:function(e){
    // console.log(e.target.dataset.img, e.target.dataset.arr)
    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: e.target.dataset.arr// 需要预览的图片http链接列表
    })

  },
  xq:function(){
        this.setData({
            pj:true
        })
  },
  pj: function () {
    this.setData({
      pj: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  
    console.log(wx.getStorageSync('dl_key'))
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      key: wx.getStorageSync('dl_key')
    })

      // 获取商品收藏列表并判断该商品是否收藏
    wx.request({
      url: new_http + "/hyapi/user/getcollectgoodslist?common_param={}&token=" +that.data.key, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.errcode=="0"){
          var fav_flag = false;
          
              for(var i=0;i<res.data.data.data.length;i++){
                if (res.data.data.data[i].goods_id == options.goods_id){
                      fav_flag=true
                  }
              }
              if (fav_flag){
                  that.setData({
                    is_favorate:true
                  })
            }else{
                that.setData({
                  is_favorate: false
                })
            }
        }
      }
    })



























    var cacont = wx.getStorageSync('car_count')||false
    this.setData({
      car_count: cacont
    })

    console.log(options.goods_id)
    this.setData({
      goods_id: options.goods_id,
      key: wx.getStorageSync('dl_key')

    })
    wx.request({
      url: new_http + '/hyapi/goods/getgoodsdetail?common_param={"goods_id":"' + options.goods_id+'"}', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var sku_arr = res.data.data.sku_list;
        for (var i = 0; i < sku_arr.length;i++){
          if(i==0){
            sku_arr[i].chk=true
          }else{
            sku_arr[i].chk = false
          }

         }




      sku_arr = res.data.data.sku_list

        that.setData({
          goods_info:res.data.data,
          image_info: { content: res.data.data.description },
          lun_image: res.data.data.img_list,
          ku_list: sku_arr
        })
       

          wx.hideLoading()
      }
    })

      // 商品评论
    wx.request({

    
      url: new_http + '/hyapi/goods/getcommentlist?common_param={"goods_id":"' + options.goods_id+'"}', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
        console.log(res.data)
        if(res.data.errcode!='-1'){
          var arr_list = res.data.data.data
          for (var i = 0; i < arr_list.length; i++) {
            console.log(arr_list[i].image)
            arr_list[i].addtime = that.formatDate(arr_list[i].addtime)
            if (arr_list[i].image != '') {
              arr_list[i].img_arr = arr_list[i].image.split(',')
              for (var z = 0; z < arr_list[i].img_arr.length; z++) {
                arr_list[i].img_arr[z] = new_http + "/" + arr_list[i].img_arr[z]
              }
            }
          }
          that.setData({

            goods_eval_list: arr_list,
            is_kong: false
          })
        }else{
          that.setData({
            is_kong:true
          })
        }
      
      }
    })
        
 
  },
  toggel_coll:function(){
    var that=this;
    console.log(that.data.goods_id)
  
    if (!wx.getStorageSync('dl_key')){
      wx.showToast({
        title: '请前往个人中心登陆',
        icon: 'none',
        duration: 2000
      })
        return false
  }
   


    if (that.data.is_favorate==true){
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: new_http + '/hyapi/user/removecollectgoods?common_param={"goods_id":' + that.data.goods_id + '}&token=' + that.data.key, //仅为示例，并非真实的接口地址
        method:"POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.errcode == "0") {
            that.setData({
              is_favorate: !that.data.is_favorate
            })
            wx.showToast({
              title: '已取消',
              icon: 'none',
              duration: 2000
            })

          }
          wx.hideLoading();
          
        }
      })
    }else{
      console.log(2)
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: new_http + '/hyapi/user/collectgoods?common_param={"goods_id":"' + that.data.goods_id + '","remark":""}&token='+that.data.key, //仅为示例，并非真实的接口地址
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if(res.data.errcode=="0"){
            that.setData({
              is_favorate: !that.data.is_favorate
            })
            wx.showToast({
              title: '已收藏',
              icon: 'none',
              duration: 2000
            })
            wx.hideLoading();

          }
          
        }
      })
     }




  },
  get_skuid:function(e){
    var that=this;
    var b_list = this.data.ku_list;

      
      for (var i = 0; i < b_list.length;i++){
        b_list[i].chk=false;
      };
    console.log(e.target.dataset.index)
    b_list[e.target.dataset.index].chk = true;
    this.setData({
      ku_list: b_list
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  to_car:function(){
    wx.redirectTo({
      url: '../shopcar/shopcar'
    })
  },
  add_car:function(){
    if (!wx.getStorageSync('dl_key')) {
      wx.showToast({
        title: '请前往个人中心登陆',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认加入购物车',
      success: function (res) {
        if (res.confirm) {
      var sku_id;
    
      for (var i = 0; i < that.data.ku_list.length;i++){
        if (that.data.ku_list[i].chk){
           sku_id = that.data.ku_list[i].sku_id  
          }


      }



          wx.request({
            url: new_http + '/hyapi/cart/add?common_param={"sku_id":' + sku_id + ',"num":' + that.data.nub + '}&token=' +that.data.key, //仅为示例，并非真实的接口地址
            method:"POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              
                if(res.data.errcode=='0'){
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: '加入失败',
                    icon: 'none',
                    duration: 2000
                  })
                }


              
            }
          })
         
        } 
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  formatDate: function (nS){
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' '); 
  },
  
  addNub:function(){
    // var that = this;
    
    console.log(this.data.nub++)
      
    var My_nub = this.data.nub++;
    this.setData({
      nub: My_nub

    })
  },
  downNub:function(){
    if (this.data.nub==1){
      wx.showToast({
        title: '不能低于最低限制',
        icon: 'none',
        duration: 2000
      })
     
        return false;

    }

    console.log(this.data.nub--)

    var My_nub = this.data.nub--;
    this.setData({
      nub: My_nub

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