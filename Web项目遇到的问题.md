# 问题

@CrossOrigin(origins = "*")解决跨域问题



获取axios的post请求携带的参数：@RequestBody。



问题：No serializer found for class com.xxxx and no properties discovered to create

解决：检查返回到对象中是否实现了getter/setter方法/构造方法；（本人漏了getter）



jwt解决token问题。



token失效问题没有解决，仅仅抛出异常。

```java
<router-link tag="p" to="/about">
 	<a target="_blank">About< /a>
</router-link>
//a标签将会成为真正的链接,并获取到正确的跳转,但激活的类会应用在外部的p上面
//如果你想打开一个新标签页，你必须用 a标签。
```



```java
Vue跳转到新的页面
const { href } = this.$router.resolve({
    name: "LookLive",
    params: { webinarId: this.$route.params.item.webinarId }
})
window.open(href, '_blank')
    
无论是跳转到新页面还是老页面都是一样的路由配置
{ path: '/LookLive/:webinarId', name: 'LookLive', component: LookLive }
```













