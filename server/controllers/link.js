const { mysql } = require('../qcloud')

async function load(ctx, next) {
  var link_id = ctx.query.link_id
    await mysql('links').select('*').where({ link_id: link_id }).then(res => {
      ctx.state.data = res;
    })
}
async function get(ctx, next) {
  var category_id = ctx.query.category_id
  if(category_id == ''){
    await mysql('links').select('*').then(res => {
      ctx.state.data = res;
    })
  }
  else{
    await mysql('links').select('*').where({ category_id: category_id }).then(res => {
      ctx.state.data = res;
    })
  }
}
async function post(ctx, next) {
  var user_id = ctx.request.body.user_id
  var category_id = ctx.request.body.category_id
  if(category_id == ''){
    category_id = Date.now() + user_id
    var name = '未分类...'
    await mysql('categories').insert({ category_id: category_id, user_id: user_id, name: name })
  }
  var count = ctx.request.body.count
  var url = ctx.request.body.url
  var image = ctx.request.body.image
  var title = ctx.request.body.title
  var abstract = ctx.request.body.abstract
  var link_id = Date.now() + category_id
  await mysql('links').insert({ link_id: link_id, category_id: category_id, url: url, image: image, title: title, abstract: abstract})
  await mysql('categories').where({ category_id: category_id }).update('count',count + 1)
}
async function remove(ctx, next) {
  var link_id = ctx.request.body.link_id
  var category_id = ctx.request.body.category_id
  var count = ctx.request.body.count
  await mysql('tags').where({link_id: link_id}).del()
  await mysql('contents').where({ link_id: link_id }).del()
  await mysql('links').where({link_id: link_id}).del()
  await mysql('categories').where({category_id: category_id}).update({
    count: count - 1
  })
}
module.exports = {
  post,
  get,
  remove,
  load
}
