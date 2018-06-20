const { mysql } = require('../qcloud')

async function get(ctx, next) {
  await mysql('links').select('*').then(res => {
    ctx.state.data = res;
  })
}
module.exports = {
  get
}