log4track使用文献参考：https://wiki.corp.qunar.com/confluence/pages/viewpage.action?pageId=531398290，本文在此基础上加入自己的理解以及原理的解析。



# log4track的使用

## 背景

项目中，通常为了方便查看，都会将日志打印为JSON格式，以方便阅读 or 解析。

通常写法：

```java
log.info("toInfo:[{}]", JsonUtil.toJson(info));
```

这种写法有个关键的问题：**性能**！

这种写法会将序列化前置，也就是说即使日志打印级别不满足，当执行到当前行时就会执行`JsonUtil.toJson(info)` 进行序列化。

因此，本来不对性能有损耗的日志数据，因为序列化前置的问题，会极大的影响性能。

对于slf4j来讲，解决此问题的方式就是 **延迟序列化**，即在真正打印日志时，才调用入参的序列化操作。具体方案：**JDK动态代理**，为Logger包装一层proxy，执行打印操作时才对参数对象进行序列化。而java对象在输出时是调用toString方法的，也是说我们需要重写toString方法，然后在toString方法里进行序列化。



## 解决方案

1、log4track提供了`LoggerFactoryProxy`，用来提供动态代理模式：

```java
private static final Logger LOGGER = LoggerFactoryProxy.getLogger(XXX.class);
```

2、针对lombok，其提供了 `@CustomLog` 模式，方便大家自定义Factory 



## 使用方式

### 原生Logger方式

修改Logger的声明

**原生** 

```java
private static final Logger logger = LoggerFactory.getLogger(XXX.class);
```

**动态代理** 

```java
private static final Logger logger = LoggerFactoryProxy.getLogger(XXX.class);
```

其他正常使用即可，无需再在入参中进行toString序列化。LoggerFactoryProxy生成的Logger会在调用时自动生成代理对象。



### lombok方式

通常，大家使用 @SLF4J 即可完成log的注册。

**SLF4J**

```java
@Slf4j
public class MyTest {
    private String txt = "我是测试";
    public void test() {
        log.info("test:{}", JsonUtil.toJson(new MyTest()));
    }
}
```



**动态代理方式** 

使用动态代理，我们要自定义生成的代码使用LoggerFactoryProxy类，利用lombok的 CustomLog来实现

首先，使用`@CustomLog`需要在项目的root目录下设置 lombok.config文件.这里注意，基于maven的开发，lombok.config文件不能放置到 `src/main/resources`下，而是需要放置到 `src/main/java/ `下，或者 `src/main/java/xxxx`下（如果放到这个位置，生效作用域是 package xxxx）

如图：

![image-20221109151715008](/Users/jianhang/Documents/learing/Untitled.assets/image-20221109151715008.png)

lombok.config文件的内容如下：

```properties
# value=日志实例接口 实例获取方法(TYPE)(TOPIC)
lombok.log.custom.declaration=org.slf4j.Logger com.qunar.flight.userproduct.gaea.log4track.LoggerFactoryProxy.getLogger(TYPE)(TOPIC)
```

使用：

```java
import lombok.CustomLog;

@CustomLog
public class MyTest {
    private String txt = "我是测试";
 
    public void test() {
        log.info("test:{}", new MyTest());
    }
}
```

至此，就可以完美的使用lombok的方式愉快的打日志了，也可以愉快的面对日志输出的性能问题了。

当然，如果不需要输出转为JSON，那么还使用原生的 `@SLF4J `即可。

注意：使用动态代理模式必须引入log4track组件

```xml
<dependency>
    <groupId>com.qunar.flight.userproduct</groupId>
    <artifactId>gaea-log4track</artifactId>
    <version>${log4track.version}</version>
    <scope>compile</scope>
</dependency>
```





# LoggerFactoryProxy源码解析

## 重要成员属性

```java
/** 
 * json 转换器，用于重写toString方法时进行序列化
 */
private static final JsonMapper jsonMapper = MapperBuilder.create()
    .configure(JsonFeature.INCLUSION_NOT_NULL, true)
    .build();
```



## 构造方法

在LoggerFactoryProxy中，将构造函数私有了，只能通过静态方法getLogger获取实例

```java
private LoggerFactoryProxy() {
}
```



## getLogger

```java
private static final Logger LOGGER = LoggerFactoryProxy.getLogger(CaseQueryService.class);
```

从上面这代码可以看出，getLogger获取的是Logger的代理对象，那么是如何实现代理的呢？

```java
public static Logger getLogger(Class<?> clazz) {
    // 获取slf4j的Logger
    Logger logger = LoggerFactory.getLogger(clazz);
    // 为slf4j的Logger包装一层proxy
    return proxyLogger(logger);
}
```



## proxyLogger

proxyLogger会为 logger 添加一层代理

```java
private static Logger proxyLogger(Logger logger) {
    // 创建动态代理器，ProxyHandler是一个内部类
    ProxyHandler handler = new LoggerFactoryProxy.ProxyHandler();
    // 创建logger的动态代理，并返回
    return handler.bind(logger);
}
```



## ProxyHandler内部类

ProxyHandler的作用是创建Logger动态代理以及代理的逻辑。

```java
private static final class ProxyHandler implements InvocationHandler {
    // 定义所代理的方法名
    private static final List<String> PROXY_METHOD = Arrays.asList("trace", "debug", "info", "warn", "error");

    // 原Logger
    private Logger target;

    private ProxyHandler() {
    }

    /**
     * 绑定target
     */
    public Logger bind(Logger target) {
        this.target = target;
        // 使用jdk的方式创建动态代理
        return (Logger) Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    /**
     * 动态代理实现
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 针对指定方法调用代理
        if (args.length > 1 && PROXY_METHOD.contains(method.getName())) {
            return invokeLoggerByArgs(this, method, args);
        } else {
            return method.invoke(target, args);
        }

    }

    /**
     * 对参数进行包装
     */
    private static Object invokeLoggerByArgs(ProxyHandler proxyHandler, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        Object[] argsProxy = new Object[args.length];
        // 设置第一个参数
        argsProxy[0] = args[0];
        // 从第一个参数判断第二个参数，第一个参数一定是Marker或者String，第一个参数为String的，就是format+参数模型，第一个参数是Marker的就是 marker+format+参数的模型
        int paramIndexOffset = 1;
        if (args[0] instanceof Marker) {
            argsProxy[1] = args[1];
            paramIndexOffset++;
        }
        // 处理String后面的参数，如果是Object[]，单独处理，否则直接包装处理
        if (args[paramIndexOffset] instanceof Object[]) {
            Object[] inArgs = (Object[]) args[paramIndexOffset];
            Object[] inArgsProxy = new Object[inArgs.length];
            for (int i = 0; i < inArgs.length; i++) {
                inArgsProxy[i] = proxyHandler.wrapperArg(inArgs[i]);
            }
            argsProxy[paramIndexOffset] = inArgsProxy;
        } else {
            for (int i = paramIndexOffset; i < args.length; i++) {
                argsProxy[i] = proxyHandler.wrapperArg(args[i]);
            }
        }
		// 将包装后的参数放入方法中执行
        return method.invoke(proxyHandler.target, argsProxy);
    }

    /**
     * 构建包装，即重写toString
     */
    private Object wrapperArg(Object arg) {
        if (arg instanceof Throwable || arg instanceof String) {
            return arg;
        } else {
            // ToStringWrapper为内部类，重写了toString
            return new ToStringWrapper(arg);
        }
    }
}
```

小结：

-   参数对象的类型有三种：Marker，Object[]，Object（包含了String和Throwable）
-   第一个参数的类型一定是 Marker 或 String
-   Object[]需要作为一个整体传给方法，而不是将数组里的每个元素作为单独的整体



## ToStringWrapper内部类

ToStringWrapper主要对参数进行了包装，重写toString方法，在toString中进行序列化

```java
public static class ToStringWrapper {
    private Object target;

    public ToStringWrapper(Object target) {
        this.target = target;
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();
        // json序列化
        str.append(jsonMapper.writeValueAsString(target));
        if (target instanceof AccessSerializable) {
            // 如果实现了序列化接口，则挂一个java序列化结果（有时候json序列化并不能完整的表示结果）
            String ser = serialize(target);
            str.append("::ser::<<")
                    .append(ser)
                    .append(">>");
        }
        return str.toString();
    }
}
```

serialize方法进行java 序列化：

```java
private static String serialize(Object obj) {
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    ObjectOutputStream objectOutputStream = null;
    try {
        objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
        objectOutputStream.writeObject(obj);
        return Base64.encodeBase64String(byteArrayOutputStream.toByteArray());
    } catch (IOException ex) {
        return "SerError";
    } finally {
        try {
            if (objectOutputStream != null) {
                objectOutputStream.close();
            }
            byteArrayOutputStream.close();
        } catch (Exception ex) {
            // 只是为了解sonar
            ex.getMessage();
        }
    }
}
```



# 第一个参数为什么一定是Marker或者String？

在对参数进行包装时，为什么说第一个参数的类型为什么一定是Marker或者String。这里需要查看Logger类（因为我们是给Logger添加的动态代理）

![image-20221109161920794](/Users/jianhang/Documents/learing/Untitled.assets/image-20221109161920794.png)



# Marker是什么？

此部分参考于：https://www.slf4j.org/faq.html#3

SLF4J提供了两项增强功能，这两项功能往往被低估。参数化日志消息以实用的方式解决了与日志性能相关的一个重要问题。slf4j支持的Marker对象为采用高级日志记录系统铺平了道路，如果需要，还可以切换回传统的日志记录系统。

虽然Marker是SLF4J API的一部分，但只有logback支持现成的Marker。例如，如果将`%marker`转换字添加到其模式中，logback的PatternLayout将向其输出中添加Marker数据。

log4j和java.util等日志框架，都不支持Marker的日志记录，此时Marker数据将被默默忽略。（不输出也不报错）

Marker为处理日志语句添加了一个具有无限可能值的新维度，与级别允许的五个值（即ERROR、WARN、INFO、DEBUG和TRACE）相比较。目前，只有logback支持标记数据。然而，没有什么可以阻止其他日志框架使用标记数据。



**为什么slf4j没有fatal级别的方法**？

Marker接口是org.slf4j包的一部分，它使得fatal级别在很大程度上是冗余的。如果一个给定的错误需要特别注意，只需用一个特别指定的Marker来标记日志语句，该标记可以被命名为“fatal”或您喜欢的任何其他名称。

这有个例子：

```java
class Bar {
    Logger logger = LoggerFactory.getLogger("aLogger");
    void foo() {
        // 创建一个Marker
        Marker fatal = MarkerFactory.getMarker("FATAL");

        try {
            ... obtain a JDBC connection
        } catch (JDBException e) {
            logger.error(fatal, "Failed to obtain JDBC connection", e);
        }
    }
}
```

