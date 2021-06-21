//第一步需要先npm i koa

const koa = require('koa')

// 实例化 需要new
const app = new koa()

// 每个函数前都要加async
app.use(async (ctx)=>{
  /**
   * ctx包括了request跟response
   */
  ctx.body='你好koa' // 相当于res.end()

})

//监听端口
app.listen(3000,()=>{
  console.log('koa启动成功')
})


