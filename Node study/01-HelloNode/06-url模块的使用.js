const url = require('url')

const obj = url.parse('https://www.baidu.com/s?wd=node&name=codekiang')
console.log(obj)
/**
 * Url {
    protocol: 'https:',       
    slashes: true,
    auth: null,
    host: 'www.baidu.com',    
    port: null,
    hostname: 'www.baidu.com',
    hash: null,
    search: '?wd=node&name=codekiang',
    query: 'wd=node&name=codekiang',
    pathname: '/s',
    path: '/s?wd=node&name=codekiang',
    href: 'https://www.baidu.com/s?wd=node&name=codekiang'
  }
 */
const obj2 = url.parse('https://www.baidu.com/s?wd=node&name=codekiang',true)
console.log(obj2)
/**
 * 加了true的区别：把query变成一个对象query:{ wd: 'node', name: 'codekiang' }
 */