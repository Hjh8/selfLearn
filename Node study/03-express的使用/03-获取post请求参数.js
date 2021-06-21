/**
 * express中的post请求的参数默认是取不到的，必须通过第三方模块body-parser来获取
 * 首先，安装body-parser：npm i -S body-parser
 * 然后进行配置：
 *   // parse application/x-www-form-urlencoded
 *   app.use(bodyParser.urlencoded({ extended: false }))
 *   // parse application/json
 *   app.use(bodyParser.json())
 * 最后通过，res.body来获取参数
 */


const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// 所有的中间件都要使用use来注册
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/profile',(req,res)=>{
  console.log(res.body)
})

app.listen(3000,()=>{
  console.log('服务器正在开启')
})
