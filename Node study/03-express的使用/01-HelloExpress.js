// 1.下载并加载express
const express = require('express')

// 2.创建服务器
const app = express()

// 3.进行配置操作
// 3.1 配置路径请求信息
// 当用户向/about路径发送get请求时执行
app.get('/about',(req,res)=>{
  //可直接拿到get请求携带的参数
  console.log(req.query)

  //返回信息
  res.send('我是about')
  //重定向
  //res.redirect('/')
})

// 当用户向/profile路径发送post请求时执行
app.post('/profile',(req,res)=>{
  //返回信息
  res.send('我是profile')
})

// 4.开启服务器
app.listen(3000,()=>{
  console.log('服务器正在开启')
})
