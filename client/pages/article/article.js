var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    link_id: '',
    content: [],
    tagList: [],
    fontSize: 36,
    lineHeight: 60,
    textIndent: 72,
    canIUseClipboard: wx.canIUse('setClipboardData')
  },
  onLoad: function (e) {
    var that = this
    var link_id = e.id
    that.setData({
      link_id: link_id,
    })
  },
  onShow: function(){
    this.onLoadArticle()
    this.onLoadTag()
  },
  onLoadTag: function () {
    util.showBusy('正在获取标签...')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/tag`,
      data: {
        link_id: that.data.link_id
      },
      success(result) {
        util.showSuccess('请求成功完成')
          that.setData({
            tagList: result.data.data
          })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  onDeleteTap: function(){

  },
  onLoadArticle: function(){
    util.showBusy('加载中...')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/link/load`,
      data: {
        link_id: that.data.link_id
      },
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          article: result.data.data[0]
        })
      },
      fail(error) {
        util.showModel('请求失败',error)
        console.log('request fail',error)
      }
    })
    qcloud.request({
      url: `${config.service.host}/weapp/article`,
      method: 'get',
      data: {
        link_id: that.data.link_id
      },
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          content: result.data.data
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  copyCode: function () {
    wx.setClipboardData({
      data: this.data.article.url,
      success: function () {
        util.showSuccess('复制成功')
      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '',
      path: 'pages/article/article?id=' + that.data.link_id,
      success: function (res) {

        // 转发成功  

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败  
      }
    }
  },


})
