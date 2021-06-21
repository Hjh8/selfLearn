1.安装:`npm i -S art-template express-art-template`
2.配置：`app.engine('html',require('express-art-template'))`
  在配置中只需要加载express-art-template，但是为什么要把art-template也下载了呢？
  因为express-art-template依赖了art-template，所以需要把两者都下载下来。
  engine中的第一个参数表示当渲染以.html结尾的文件的时候，使用art-template

3.使用:
```javaScript
app.get('/',(req,res) => {
  // express默认去项目中的views目录找该文件
  res.render('index.html',{ })
})
```
如果希望修改默认的views存储目录：`app.set('views',目录路径)`
