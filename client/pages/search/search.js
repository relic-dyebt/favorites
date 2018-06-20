var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    inputFocus: false,
    setSearchKeyword: "",
    searchKeyword: "",
    searchResultShow: false,
    searchCancelShow: false,

    searchResultList: [],

    tags: [],
  },

  onSearchCancel: function () {
    this.setData({
      searchResultShow: false,
      searchCancelShow: false,
      setSearchKeyword: '',
      searchKeyword: '',
      inputFocus: false
    });
  },

  onSearchInput: function (ev) {
    this.setData({ searchKeyword: ev.detail.value });
  },

  onClearInput: function () {
    this.setData({
      searchResultShow: false,
      searchCancelShow: true,
      setSearchKeyword: '',
      searchKeyword: '',
      inputFocus: true
    });
  },
  onLoadTag: function () {
    util.showBusy('正在获取标签...')
    var that = this
    var searchResultList = this.data.searchResultList
    searchResultList.forEach(function (item, index, callback) {
      qcloud.request({
        url: `${config.service.host}/weapp/tag`,
        data: {
          link_id: item.link_id
        },
        success(result) {
          util.showSuccess('请求成功完成')
          if (result.data.data.length > 0) {
            searchResultList[index].tagList = result.data.data
            that.setData({
              searchResultList: searchResultList
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
  onSearchConfirm: function () {
    var that = this
    util.showBusy('正在获取文章...')
    qcloud.request({
      url: `${config.service.host}/weapp/search`,
      data: {
        title: that.data.searchKeyword
      },
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          searchResultList: result.data.data,
          searchResultShow: true,
          searchCancelShow: true
        })
        if (that.data.searchResultList.length > 0) {
          that.onLoadTag()
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },

  onArticleTap: function (e) {
    var link_id = e.currentTarget.dataset.link_id
    wx.navigateTo({
      url: '../article/article?id=' + link_id
    })
  },
})