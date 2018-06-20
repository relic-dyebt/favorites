module.exports = ctx => {
  ctx.response.body = 'Hello Pascal';
  ctx.state.data = {
    msg: 'Hello World'
  }
}