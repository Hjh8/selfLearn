/**
 * 服务端渲染：
 * 需先安装art-template：npm i art-template
 * 导入包后使用render进行数据渲染
 * template.render(模板内容,进行渲染的值)
 */

const template = require('art-template')
template.render('我是{{name}}',{name:'codekiang'})
/**
 * 通常把模板内容写到另外一个文件,然后要渲染时进行文件读取，
 * 把读取到的文件内容放到render中
 * eg：
 *  const fs = require('fs')
 *  const template = require('art-template')
 * 
 *  fs.readFile('./template.html',(err,data)=>{
 *    template.render(data.toString(),{要进行渲染的值})
 *  })
 */