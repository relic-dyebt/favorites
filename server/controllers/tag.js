const { mysql } = require('../qcloud')

async function get(ctx, next) {
  var link_id = ctx.query.link_id
  await mysql('tags').select('*').where({link_id: link_id}).then(res => {
    ctx.state.data = res;
  })
}

async function post(ctx, next) {
  
  var link_id = ctx.request.body.link_id
  var tagList = ctx.request.body.tagList
  await mysql('tags').where({link_id: link_id}).del()
  await mysql('tags').insert(tagList)
}
module.exports = {
  get,
  post
}
