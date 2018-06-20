var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    url: '',
    canIUseClipboard: wx.canIUse('setClipboardData')
  },
  onLoad(opt){
    var link_id = opt.link_id
    var url = opt.url
    this.setData({
      url: url
    })
  },
  copyCode: function () {
    wx.setClipboardData({
      data: this.data.url,
      success: function () {
        util.showSuccess('复制成功')
      }
    })
  }
})