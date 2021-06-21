# Node基本认识

#### Node.js是什么

​	node.js不是一门语言，也不是库不是框架。

​	node.js是一个JS运行时环境(简单来说就是可以解析和执行JS代码，也就是说可以让JS完全摆脱浏览器运行)。他是构建于V8引擎之上的。

#### Node.js中的JS

​	没有BOM、DOM(浏览器的JS就有这些)

​	有ES(EcmaScript) ：一些基本语法

​	在JS执行环境中为JS提供一些服务器级别操作的API

​			·如读写文件的能力

​			·网络服务器的搭建

​			·网络通信

​			·http服务器

#### Node.js的特点

​	事件驱动

​	非阻塞IO模型(异步)

​	轻量和高效

#### Node.js的npm

​npm是世界上最大的开源库生态系统。(相当于maven)

npm简单命令的使用：

npm -v 查看 npm 的版本
npm install [选项] XXX(包名) 安装所需要的包
    选项可使用的值：
        --save 或 -S 表示在 package.json 文件中（dependencies）记录下载包的版本信息；即下载生产依赖包，打包的时候会把此包打包出去
        --save-dev或-D 下载开发依赖包,只会在程序员开发的时候此包才有用，打包的时候不会将此包打包出去
        -g全局安装模块
npm init 初始化

有时候国外的npm服务器可能下载比较慢，可以通过淘宝的服务器来下载。

每次都使用淘宝镜像来下载。
`npm config set registry https://registry.npm.taobao.org`

单单本次下载使用淘宝镜像。
`npm install xxx --registry=https://registry.npm.taobao.org`

#### Node.js能做什么

​	Web服务器后台

​	命令行工具
