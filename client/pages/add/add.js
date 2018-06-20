var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data:{
    categoryList: '',
    articleUrl: '',
    selectedCategory: '',
    article: '',
    userInfo:{},
    user_id: '',
    count: 0
  },
  onLoadCategory: function () {
    var that = this
    util.showBusy('正在加载分类...')
    qcloud.request({
      url: `${config.service.host}/weapp/category`,
      method: 'get',
      data: {
        user_id: that.data.user_id
      },
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          categoryList: result.data.data
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  onLoad: function(e){
    var that = this
    var session = qcloud.Session.get()
    that.setData({
      userInfo: session.userinfo
    })
    this.setData({
      user_id: e.user_id
    })
    this.onLoadCategory()
  },
  onUrlInput: function (ev) {
    var articleUrl = ev.detail.value
    this.setData({
      articleUrl: articleUrl
    })
  },

  onCategoryTap: function (ev) {
    var category_id = ev.currentTarget.dataset.category_id
    var count = ev.currentTarget.dataset.count
    console.log(category_id)
    console.log(count)
    this.setData({
      selectedCategory: category_id,
      count: count
    })
  },
  onParseUrl: function(){
    util.showBusy('正在获取页面...')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/article`,
      method: 'post',
      data: {
        category_id: that.data.selectedCategory,
        count: that.data.count,
        url: that.data.articleUrl,
        image: '',
        abstract: ''
      },
      success(result) {
        util.showSuccess('请求成功完成')
        console.log(result)
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  onConfirm: function (ev) {
    var articleUrl = this.data.articleUrl
    var selectedCategory = this.data.selectedCategory

    if (selectedCategory == '') {
      wx.showModal({
        title: "信息不完整",
        content: "请选择一个要加入的分类",
        showCancel: false
      })
      return
    }
    
    this.onParseUrl()
    //this.onParseUrl()
    //console.log(this.data.article)

    this.setData({ selectedCategory: '' })
    wx.redirectTo({
      url: '../door/door'
    })
  }
})