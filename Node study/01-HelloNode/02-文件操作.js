// 浏览器中的js是没有文件操作能力的
//但是node的js提供了该功能的API-(fs)

// 1.使用require导入fs模块
const fs = require('fs')
/**
 * 读取文件：fs.readFile(path,callback)
 * path：文件路径
 * callback：回调函数
 *    该函数的参数
 *        error：如果读取失败，error就是错误对象，否则为null
 *        data：如果读取成功，data就是读取到的数据(16进制)，否则为undefined
 */
// fs.readFile('./02-test.txt',(error,data)=>{
//   // data默认是二进制数据
//   console.log(data.toString())
// })

/**
 * 写文件：fs.writeFile(path,data,callback)
 */
// fs.writeFile('./02-写入内容.txt','我是写入的内容',(err)=>{
//   if(err) throw err
//   console.log('----文件写入成功')
// })

// 判断path是目录还是文件夹
// fs.stat('./a.js',(err,data)=>{
//   if(err){
//     console.log(err)
//     return
//   }
//   console.log(`data.isFile()是文件`,data.isFile())
//   console.log(`data.isDirectory()判断目录`,data.isDirectory())
// })

// 创建文件夹
// fs.mkdir('./c.js',(err)=>{
//   if(err){
//     console.log(err)
//     return
//   }
//   console.log('创建成功')
// })

// 往文件中追加内容
fs.appendFile('02-test.txt','\nfs.appdentFile函数追加的文字',(err)=>{
  if(err) console.log(err)
  return
})

/**
 * fs.rmdir(path,callback) 删除文件夹
 * fs.unlink(path,callback) 删除文件
 */

