const { mysql } = require('../qcloud')

async function post(ctx, next) {
  var link_id = ctx.request.body.link_id
  var abstract = ctx.request.body.abstract
  await mysql('links').where({ link_id: link_id }).update('abstract', abstract)
}
module.exports = {
  post
}