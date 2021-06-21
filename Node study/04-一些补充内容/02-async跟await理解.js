/**
 * async 让方法变成异步，且返回promise对象
 * await 等待异步方法执行完成，可直接获取异步方法里面的数据
 * tips:
 *    await必须使用在async修饰的函数中
 *    async跟await简化了promise的异步操作
 */


function a(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve('ddd')
    },1000)
  })
}
// 不使用async跟await
// function b(){
//   var b = a()
//   console.log(b.then((data)=>{console.log(data)}))
// }

// 使用async跟await
async function b(){
  var b = await a()
  console.log(b)
}

b();