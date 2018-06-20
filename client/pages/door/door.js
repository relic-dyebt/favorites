//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({
  data:{
    navbar:["分类","文章"],
    articleList:[],
    categoryList:[],
    currentCategory: null,
    currentCategoryTitle: '未选择分类',
    currentCategoryColor: 'white',
    currentTab: 0,
    showFloatingButtons: true,
    userInfo:{},
    currentSwiper: 0,
    currentSwiperCategory: 0,
    preSwiper: 0

  },
  onLoadUser: function(){
    util.showBusy('正在获取用户信息...')
    var that = this
    var session = qcloud.Session.get()
    that.setData({
      userInfo: session.userinfo
    })
    // qcloud.request({
    //   url: `${config.service.host}/weapp/user`,
    //   success(result) {
    //     util.showSuccess('请求成功完成')
    //     that.setData({
    //       userInfo: result.data.data
    //     })
    //   },
    //   fail(error) {
    //     util.showModel('请求失败', error);
    //     console.log('request fail', error);
    //   }
    // })
  },
  onLoadCategory: function(){
    var that = this
    
    util.showBusy('正在加载分类...')
    qcloud.request({
      url: `${config.service.host}/weapp/category`,
      method: 'get',
      data: {
        user_id: that.data.userInfo.openId
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
  onLoadTag: function(){
    util.showBusy('正在获取标签...')
    var that = this
    var articleList = this.data.articleList
    articleList.forEach(function(item, index, callback){
      qcloud.request({
        url: `${config.service.host}/weapp/tag`,
        data: {
          link_id: item.link_id
        },
        success(result) {
          util.showSuccess('请求成功完成')
          if (result.data.data.length > 0) {
            articleList[index].tagList = result.data.data
            that.setData({
              articleList: articleList
            })
          }
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      })
    })
  },
  onLoadArticle: function () {
    var that = this
    util.showBusy('正在获取文章...')
    var index = that.data.currentCategory
    var category_id = ''
    if (index == null) {
      that.setData({
        //currentCategoryTitle: '所有文章'
      })
    }
    else{
      category_id = that.data.categoryList[index].category_id
      qcloud.request({
        url: `${config.service.host}/weapp/link`,
        data: {
          category_id: category_id
        },
        success(result) {
          util.showSuccess('请求成功完成')
          that.setData({
            articleList: result.data.data
          })
          if (that.data.articleList.length > 0) {
            that.onLoadTag()
          }
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      })
    }
    
  },
  onShow: function(){
    util.showBusy('正在加载页面...')
    this.onLoadUser()
    this.onLoadCategory()
    this.onLoadArticle()
    util.showSuccess('页面加载完成')
  },
  onCategoryTap: function(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      currentCategory: index,
      currentCategoryTitle: this.data.categoryList[index].name,
      currentTab: 1
    })
    this.onLoadArticle()
  },
  onAddTap:function(e){
    util.showBusy('正在加载页面...')
    var that = this
    var user_id = e.currentTarget.dataset.user_id
    wx.navigateTo({
      url: '../add/add?user_id=' + user_id,
    })
  },
  onSearchTap: function(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onNavbarTap:function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.index,
    })
  },
  onCreateCategory:function(e){
    util.showBusy('正在加载页面...')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/category`,
      method: 'post',
      data: {
        user_id: that.data.userInfo.openId,
        name: e.detail.value,
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
    wx.redirectTo({
      url: '../door/door'
    })
  },
  onCategoryDeleteTap: function(e){
    util.showBusy('正在加载页面...')
    var that = this
    var category_id = e.currentTarget.dataset.category_id
    that.data.articleList.forEach(function (item, index, callback) {
      if(item.category_id == category_id){
        qcloud.request({
          url: `${config.service.host}/weapp/link/delete`,
          method: 'post',
          data: {
            link_id: item.link_id,
            category_id: category_id,
            count: 0
          },
          success(result) {
            util.showSuccess('请求成功完成')
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        })
        wx.redirectTo({
          url: '../door/door'
        })
      }
      
    })
    qcloud.request({
      url: `${config.service.host}/weapp/category/delete`,
      method: 'post',
      data: {
        category_id: category_id
      },
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          currentSwiperCategory: 0
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
    this.onLoadCategory()
  },
  onArticleTap: function(e){
    var link_id = e.currentTarget.dataset.link_id
    wx.navigateTo({
      url: '../article/article?id=' + link_id
    })
  },
  onArticleAbstract: function (e) {
    var link_id = e.currentTarget.dataset.link_id
    var abstract = e.currentTarget.dataset.abstract
    wx.navigateTo({
      url: '../abstract/abstract?link_id=' + link_id + '&abstract=' + abstract
    })
  },
  onArticleShare: function(e){
    var link_id = e.currentTarget.dataset.link_id
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '../share/share?link_id=' + link_id + '&url=' + url
    })
  },
  onArticleDelete:function(e){
    util.showBusy('正在删除文章...')
    var that = this
    var count = 0
    var category_id = e.currentTarget.dataset.category_id
    that.data.categoryList.forEach(function (item, index, callback) {
      if (item.category_id == category_id) {
        count = item.count
      }
    })
    qcloud.request({
      url: `${config.service.host}/weapp/link/delete`,
      method: 'post',
      data: {
        link_id: e.currentTarget.dataset.link_id,
        category_id: e.currentTarget.dataset.category_id,
        count: count
      },
      success(result){
        util.showSuccess('请求成功完成')
        that.setData({
          currentSwiper: 0
        })
        wx.redirectTo({
          url: '../door/door'
        })
      },
      fail(error){
        util.showModel('请求失败',error)
        console.log('request fail',error)
      }
    })
    that.onLoadUser()
    that.onLoadCategory()
    that.onLoadArticle()
    that.onLoadTag()
  },
  onArticleEditTag: function(e){
    var link_id = e.currentTarget.dataset.link_id
    wx.navigateTo({
      url: '../tag/tag?id=' + link_id,
    })
  },
  onArticlesScroll: function (ev) {
    var deltaY = ev.detail.deltaY;
    if (deltaY > 0) {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.bottom(40).step()
      this.setData({
        floatingButtonsAnimation: animation.export()
      })
    } else {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.bottom(-80).step()
      this.setData({
        floatingButtonsAnimation: animation.export()
      })
    }
  },

  onArticlesScrollToUpper: function (ev) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom(40).step()
    this.setData({
      floatingButtonsAnimation: animation.export()
    })
  },

  onArticlesScrollToLower: function (ev) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom(-80).step()
    this.setData({
      floatingButtonsAnimation: animation.export()
    })
  },
  onBindChange: function(e){
  }
})