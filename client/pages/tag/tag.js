//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    tagList: [],
    currentArticle: '',
    inputTag: '',
    scrollH: 0,
    currentSwiper: 0
  },
  onLoadTag: function(){
    var that = this
    var link_id = that.data.currentArticle
    util.showBusy('正在加载标签...')
    qcloud.request({
      url: `${config.service.host}/weapp/tag`,
      method: 'get',
      data: {
        link_id: link_id,
      },
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          tagList: result.data.data
        })
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },
  onLoad: function(e){
    var that = this
    var link_id = e.id
    that.setData({
      currentArticle: link_id
    })
    that.onLoadTag()
  },
  onInputTag: function (e) {
  },
  onDeleteTag: function(e){
    var index = e.currentTarget.dataset.index
    var tagList = this.data.tagList
    tagList.splice(index,1)
    this.setData({
      tagList: tagList,
      currentSwiper: 0
    })
  },
  onConfirmTag: function(e){
    var that = this
    var tagList = that.data.tagList
    var name = e.detail.value
    for(var i = 0; i < tagList.length; i ++){
      if(tagList[i].name == name){
        that.setData({
          scrollH: Math.floor(i / 3) * 150,
          inputTag: "",
        })
        return
      }
    }
    var tag_id = Date.now() + that.data.currentArticle
    var newTag = {
      tag_id: tag_id,
      link_id: that.data.currentArticle,
      name: name
    }
    tagList.push(newTag)
    that.setData({
      tagList: tagList,
      scrollH: Math.floor((tagList.length - 1) / 3) * 150,
      inputTag: "",
    })
  },
  onConfirm: function(){
    var that = this
    util.showBusy('正在加载标签...')
    qcloud.request({
      url: `${config.service.host}/weapp/tag`,
      method: 'post',
      data: {
        link_id: that.data.currentArticle,
        tagList: that.data.tagList
      },
      success(result) {
        util.showSuccess('请求成功完成')
        that.onLoadTag()
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    wx.navigateBack()
  }
})