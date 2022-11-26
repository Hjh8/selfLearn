# qsso接入

官方qsso接入文档：https://wiki.corp.qunar.com/confluence/pages/viewpage.action?pageId=31265466

qsso大致的工作流程如下：

1.  将qsso提供的js库文件引入到您的登录页面里
2.  在登录页面上放个按钮，使用QSSO.attach这个函数，将按钮和登录接口绑定，当用户点击按钮时，就会自动跳转到qsso登录页面，当用户登录完成，会自动再post跳回你的登录接口，同时会将一个随机的token字符串以post的形式给你
3.  在您的登录接口取到这个token参数的值，然后用这个token值调用http://qsso.corp.qunar.com/api/verifytoken.php这个接口，接口会返回的json数据中包含对应登录用户的用户名
4.  用返回的用户名来完成您的应用的登录，例如设置cookie或者session



## 接入步骤

前端代码：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>qsso登录</title>
</head>
<body>
<button id="qsso-login">My-qsso登录</button>
<script src="https://qsso.corp.qunar.com/lib/qsso-auth.js"></script><!--将qsso提供的js库文件引入到您的登录页面里-->
<script>
    // 调用QSSO.attach进行登录参数的设置，如：设置绑定登录事件的HTML元素，接收token的登录接口URI。
    QSSO.attach('qsso-login','/login');//第一个参数就是button的id  ;第二个参数是跳转到的一个地址，用来接收qsso传递过来的token值的，（若是java，可以在controller层控制，也可以是同一个页面）
   // attach函数会将HTMLid为qsso-login的元素onclick时自动去qsso登录，当用户用户点击上面的button，会跳到qsso登录页面,用户在qsso登录后将会把token值post到http://xxx.qunar.com/login.php上。
</script>
</body>
</html>
```

java后端：

1、引入jar包

```xml
<dependency>
  <groupId>com.qunar.security</groupId>
  <artifactId>qsso-client</artifactId>
  <version>0.0.3</version>
</dependency>
```

2、编写登录接口，使用qsso-client

```java
@PostMapping(value = "/login")
public void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    // 获取token
    String token = req.getParameter("token");
    QUser user = QSSO.getQUser(token);
    if (null != user) {
        // 登录成功, 从user中获取用户名， 可以使用userId来标识一个qunar员工，完成后面的登录逻辑（如：setSession或者setCookie）
        String userId = user.getUserId();
        // do something...
        log.info("[{}]登录成功，qsso token : {}", userId, token);
    } else {
        // 登录失败，token值非法或者过期了，（token只能verify一次，验证后就失效了）
        String remoteUser = req.getRemoteUser();
        log.error("remoteUser:{} 登录失败，qsso token：{}", remoteUser, token);
    }
    // 最后不要忘记重定向回前端页面
    resp.sendRedirect("http://XXX.corp.qunar.com");
}
```



# qsso本地调试

>   此文是针对前后端分离的项目进行调试的，如果是前后端不分离的项目根据接入文档走就行了。

1.   开启前后端项目

2.   目前qsso只允许 *.[qunar.com](http://qunar.com/) **或者** *.[qunarman.com](http://qunarman.com/) 的域名来使用qsso认证，所以我们需要修改本地的host文件，使前端可以使用域名访问：

     ```bash
     前端项目的IP     mytest.qunar.com
     ```

3.   然后点击登录按钮会调到如下界面：

     ![image-20221122192835557](/Users/jianhang/Documents/learing/qsso接入和调试.assets/image-20221122192835557.png)

4.   因为qsso默认以当前的域名为请求的域名，所以针对前后端项目来说，需要使用代理工具进行代理转发，使其可以打到不同域名的后端。可以使用ng或者使用代理工具来实现。（这里以Charles工具为例）：

     1.   设置后端代理映射：

          ![image-20221122193657427](/Users/jianhang/Documents/learing/qsso接入和调试.assets/image-20221122193657427.png)

          ![image-20221122193823370](/Users/jianhang/Documents/learing/qsso接入和调试.assets/image-20221122193823370.png)

          ![image-20221122194117567](/Users/jianhang/Documents/learing/qsso接入和调试.assets/image-20221122194117567.png)

5.   可以正常的进行测试了