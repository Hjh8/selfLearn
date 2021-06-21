
const koa = require('koa')
const router = require('koa-router')()

// 导入路由模块
const user = require('./08-user')

const app = new koa()

router.get('/',(ctx)=>{
  ctx.body = 'koa页面'
})
// 此时用的是 use
router.use('/user',user.routes())

//也可以这么写 这样就可以省去导入router了
//app.use(user.routes(), user.allowedMethods())

app.use(router.routes())
.use(router.allowedMethods())


app.listen(3000)

