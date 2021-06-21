//需要先安装koa-views 和 ejs
/**
 * ejs 类似于jsp，可以在html中嵌套js代码
 */
const koa = require('koa')
const router = require('koa-router')()
const views = require('koa-views')

const app = new koa()

// 配置模板引擎 app.use(views(模板位置,{extension:'模板引擎'}))
// 也可以 app.use(views(模板位置,{html:'ejs'})) 此时必须是html文件
app.use(views('views',{
  // 后缀名是ejs
  extension:'ejs'
}))

app.use(async (ctx,next)=>{
  ctx.state.name='全局变量'
  await next()
})

router.get('/',async (ctx)=>{
  let title='你好，ejs'
  let arr = ['js','java','c','python']
  await ctx.render('index',{
    title,
    arr
  })
})

app.use(router.routes())
.use(router.allowedMethods())

app.listen(3000,()=>{
  console.log('koa启动')
})