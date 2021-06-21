// 与express不同的是，koa需要npm i koa-router

const koa = require('koa')
// 导入路由模块并实例化
const router = require('koa-router')()
const app = new koa()

//配置路由
router
.get('/',async (ctx)=>{
  ctx.body='根目录'
})
.get('/news/:p',async (ctx)=>{
  // 获取动态路由传值 { p: '111' }
  console.log(ctx.params)
   ctx.body = `新闻`
})

//启动路由
app.use(router.routes())
.use(router.allowedMethods()) // 处理错误

app.listen(3000,()=>{
  console.log('koa正在启动')
})
