const router = require('koa-router')()

router.get('/',(ctx)=>{
 ctx.body = 'user路由主页面'
})

router.get('/profile',(ctx)=>{
  ctx.body = 'profile页面'
 })

//导出暴露的路由
module.exports = router