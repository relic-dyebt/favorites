var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    link_id: '',
    abstract: '',
  },
  onLoad(opt) {
    var link_id = opt.link_id
    var abstract = opt.abstract
    this.setData({
      link_id: link_id,
      abstract: abstract
    })
  },
  onInput: function(e){
    this.setData({
      abstract: e.detail.value
    })
  },
  onConfirm: function(){
    var link_id = this.data.link_id
    var abstract = this.data.abstract
    qcloud.request({
      url: `${config.service.host}/weapp/abstract`,
      method: 'post',
      data: {
        link_id: link_id,
        abstract: abstract
      },
      success(result) {
        util.showSuccess('请求成功完成')
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  }
})