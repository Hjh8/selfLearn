const koa = require('koa')

// 导入路由模块并实例化
const router = require('koa-router')()
const app = new koa()

/**
 * 中间件就是多了个next
 */

// 应用级中间件 use 不加路径 匹配所有路由 相当于路由拦截器
app.use(async (ctx,next)=>{
  // ctx.body='我是中间件'
  console.log(new Date())
  // 放行，当路由全部匹配完之后还会回到next的下一步，相当于压栈
  await next()
  console.log(`use的status--${ctx.status}`)

  //错误处理
  if(ctx.status==404) ctx.body = '404页面'
  else console.log(ctx.url)
})

//路由级中间件 get/post 匹配多个指定路由
router
.get('/',async (ctx,next)=>{
  console.log('匹配了根目录1')
  // 匹配了此路由后继续往后匹配，匹配完后继续回到next的下一步
  await next()
  console.log(`根路径的status--${ctx.status}`)
})
.get('/',async (ctx)=>{
  ctx.body='我是根目录1过来的--根目录2'
})



//启动路由
app.use(router.routes())
.use(router.allowedMethods()) // 处理错误

app.listen(3000,()=>{
  console.log('koa正在启动')
})
