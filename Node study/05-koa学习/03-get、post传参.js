// 与express不同的是，koa需要npm i koa-router

const koa = require('koa')
// 导入路由模块并实例化
const router = require('koa-router')()
const app = new koa()
const bodyParser = require('koa-bodyparser')

// 注册body-parser
app.use(bodyParser())

//配置路由
router
.get('/',async (ctx)=>{
  ctx.body='根目录'

})
.get('/news',async (ctx)=>{
   //获取get传值，得到的是一个对象 如{ id: '111' }
  console.log(ctx.query)
  ctx.body='新闻页面'
})
.post('/login',async (ctx)=>{
  // 获取post请求参数需要使用koa-bodyparser中间件
  console.log(ctx.request.body)
  ctx.body = ctx.request.body
})


//启动路由
app.use(router.routes())
.use(router.allowedMethods()) // 处理错误

app.listen(3000,()=>{
  console.log('koa正在启动')
})
