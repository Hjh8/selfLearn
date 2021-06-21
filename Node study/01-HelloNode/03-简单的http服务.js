/**
 * Node给我们提供了一个搭建Web服务器的一个模块：http
 * 我们可以用他来创建编写服务器
 */

//加载核心模块
const http = require('http')
//创建一个Web服务器，返回一个server实例
const server = http.createServer()
/**
 * 注册request请求事件,回调函数需要接受两个函数
 * Request：请求对象，可以获取客户端发送的一些请求消息
 * Response：响应对象，可以用来给客户端发送响应信息
 */
server.on('request',(req,res) => {
  console.log('收到请求,请求路径是：'+req.url)
  console.log('本地服务器端口号是：',req.socket.localPort)
  console.log('请求的客户端端口号是:',req.socket.remotePort)

  // res.write('收到') //可以write多次但要用end结束
  // res.end()
  // res.end('收到') //等价于上面两行
  /**
   * 此时你在浏览器看到的是一个乱码，原因是
   * 服务端默认发送的数据的编码是utf8，但浏览器不知道，于是就默认按照当前操作系统的默认编码解析
   * window操作系统的默认编码是gbk，linux操作系统的默认编码是utf8
   * 解决乱码问题：res.setHeader('Content-Type','text/plain;charset=utf-8')
   */
  res.setHeader('Content-Type','text/plain;charset=utf-8')
  res.statusCode = 302 //设置状态码
  res.setHeader('Location','/')//重定向
  res.end('收到')
})

//绑定端口号，启动服务器
server.listen(3000,()=>{
  console.log('服务器正在启动')
})

/**
 * 然后打开浏览器，输入http://localhost:3000/
 * 即可成功请求。
 * 现在的情况就是，无论请求路径是什么，收到的响应都是同一个内容
 * 如果想要根据不同的请求路径发送不同的响应
 *  1.获取请求路径
 *  2.判断路径(if/switch)，处理响应
 */