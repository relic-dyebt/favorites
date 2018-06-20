const { mysql } = require('../qcloud')
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var async = require('async')




async function get(ctx, next) {
  var link_id = ctx.query.link_id
  await mysql('contents').select('*').where({ link_id: link_id }).then(res => {
    ctx.state.data = res;
  })
}


async function post(ctx, next){
  var that = this
  var url = ctx.request.body.url
  var category_id = ctx.request.body.category_id
  var count = ctx.request.body.count
  var abstract = ctx.request.body.abstract
  var link_id = Date.now() + category_id
  let items = []
  let title = ''
  let image = ''

  var sres = await superagent.get(url)
  var $ = cheerio.load(sres.text);
  title = $('title').text()
  $('p').each(function (index, element) {
    var $element = $(element)
    items.push({
      link_id: link_id,
      type: 'text',
      value: $element.text()
    });
  })
  image = $('img').attr('src')
  await mysql('categories').where({ category_id: category_id }).update('count', count + 1)
  await mysql('links').insert({ link_id: link_id, category_id: category_id, url: url, image: image, title: title, abstract: abstract })
  await mysql('contents').insert(items)
}
  
module.exports = {
  get,
  post
}
