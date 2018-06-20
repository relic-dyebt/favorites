const { mysql } = require('../qcloud')

async function get(ctx, next) {
  var user_id = ctx.query.user_id
  await mysql('categories').select('*').where({user_id: user_id}).then(res => {
    ctx.state.data = res;
  })
}
async function post(ctx, next) {
  var user_id = ctx.request.body.user_id
  var name = ctx.request.body.name
  var category_id = Date.now() + user_id
  await mysql('categories').insert({ category_id: category_id, user_id: user_id, name: name})
}
async function remove(ctx, next) {
  var category_id = ctx.request.body.category_id
  await mysql('categories').where({category_id: category_id}).del()
}
module.exports = {
  post,
  get,
  remove
}
