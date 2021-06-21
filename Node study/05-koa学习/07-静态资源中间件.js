// 需要先npm i koa-static

const koa = require('koa')
const static = require('koa-static')

const app = new koa()

//开放静态资源static文件夹，访问的时候不需要加上此文件夹
app.use(static(__dirname+'static'))

app.listen(3000)
