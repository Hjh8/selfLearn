# Logback简介

目前比较常用的java日志框架：Logback、log4j、log4j2、JUL等。

Logback是在log4j的基础上重新开发的一套日志框架，是完全实现SLF4J接口API（也叫日志门面）。而在SpringBoot中默认使用的日志框架就是Logback。

目前Logback主要分为三个模块：

- logback-access：logback-access模块与Servlet容器（如Tomcat和Jetty）集成，以提供HTTP访问日志功能。我们可以使用logback-access模块来替换tomcat的访问日志。
- logback-classic：log4j的一个改良版本，同时它完整提供了slf4j API，让我们可以很方便地更换成其他日志系统，如log4j。
- logback-core：其他两个模块的基础模块。我们可以在logback-core构建自己的模块。

> slf4j称之为门面日志接口，它提供了一套标准的日志功能的接口，定义了日志记录的规范。而我们的log4j和logback都是属于slf4j的具体实现。



logback依赖：（引入classic模块的时候，其他两个模块也会自动被引入。）

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.36</version>
    <scope>compile</scope>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.10</version>
    <scope>runtime</scope>
</dependency>
```



Logback 主要包含三个类：Logger，Appender 和 Layout。这三个不同类型的组件一起作用能够让开发者根据消息的类型以及日志的级别来打印日志。

**Logger**作为日志的记录器，控制要输出哪些日志记录语句，对日志信息进行级别限制。此外记录器会以树的结构排列各个 logger。

**Appender**主要用于指定日志输出的目的地，目的地可以是控制台、文件、 数据库等。

**Layout** 负责把事件转换成字符串，输出格式化的日志信息。



# Logger记录器

创建logger：`LoggerFactory.getLogger(String Name)` 

在logback中，所有logger是单例的，都会被放到缓存中。Name一般为**类的全限定名**；也可以是**类的Class对象，即`类.class`**，此时会自动的调用getName()方法。

Logback中，日志打印级别分为5个级别：`TRACE < DEBUG < INFO < WARN < ERROR` ，我们默认只能生成debug及以上的日志，trace默认是生成不了的。

```java
private static final Logger logger = LoggerFactory.getLogger("org.example.app");
logger.debug("debug");
logger.info("info");
logger.warn("warn");
logger.error("error");
```



## logger的层级

logger是具有继承关系的，所有的logger都继承了一个**顶级记录器root**。 例如 org记录器 是 org.example记录器的父记录器，org.example记录器 是 org.example.app记录器的父记录器。而**root是org的父记录器**。

- 记录器具有继承性：每个记录器都有自己的属性，当本身记录器没有设置一些属性时，会自动到父级记录器中层次寻找，最后会到root。
- 记录器具有叠加性：当子记录器输出一条日志时，父记录器以及祖先记录器都会输出该日志。

当你运行` LoggerFactory.getLogger("org.example.app")` 创建记录器的时候，会**同时把 org记录器、org.example记录器都创建出来**。此时如果你再使用 `LoggerFactory.getLogger("org.example.app2")` 创建记录器时，则只会生成org.example.app2记录器，因为org记录器、org.example记录器已经存在了。

![image-20221030213247076](/Users/jianhang/Documents/learing/logback学习.assets/image-20221030213247076.png)



## logger的属性

- name：指定某个包下或者具体类的**日志级别**。比如：org、org.example
- level：用来设置**打印级别**，大小写无关：ALL、TRACE、DEBUG、INFO、WARN、ERROR、OFF。**记录器默认情况下只会收集大于等于指定级别的日志**。
    - 如果未设置此属性，那么当前 logger 将会继承上级的级别。**root的打印级别为debug**。
- addtivity：是否接受叠加上级配置的打印信息。**默认：true**，即具有叠加性。



# Logback.xml 配置文件

一般使用配置文件来统一配置logback的各个组件的属性，便于管理。配置文件内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="false" scanPeriod="60 seconds" debug="false">
    <!--  指定根记录器的日志打印级别   -->
	<root level="info">
  	</root>
    
    <!--  指定根记录器的日志打印级别   -->
    <logger name="org.example.app" level="info">
    </logger>
</configuration>
```

但此时的配置文件还不能使用，因为还需要结合Appender。



# Appender附加器

**Appender**主要用于指定日志输出的目的地，目的地可以是控制台、文件、 数据库等。

常见的附加器有如下三个类：

-   控制台附加器：ch.qos.logback.core.ConsoleAppender
-   文件附加器：ch.qos.logback.core.FileAppender
-   滚动文件附加器：ch.qos.logback.core.rolling.RollingFileAppender

配置如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="false" scanPeriod="60 seconds" debug="false">
    
	<root level="info">
  	</root>
  
  	<!-- 1. 配置好appender
			name：附加器的名字，唯一
  			class：使用的附加器的类，这里为 ConsoleAppender，即输出到控制台
	-->
  	<appender name="MyAppender" class="ch.qos.logback.core.ConsoleAppender">
    	<encoder>
            <!--  2.设置日志内容输出的模版   -->
    		<pattern>%date %msg</pattern>
    	</encoder>
  	</appender>
  
  	<logger name="org.example.app" level="info">
        <!--  3.在logger中引用附加器   -->
        <appender-ref ref="MyAppender"></appender-ref>
  	</logger>
</configuration>
```



##FileAppender

```xml
<appender name="MyAppender" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%date %msg</pattern>
    </encoder>
    <!--  日志输出的文件名，如果不存在则创建   -->
    <file>文件名.log</file>
    <append>true</append>  <!--  是否已追加的方式写入文件   -->
</appender>
```



## RollingFileAppender

logback的滚动策略有两种

1.   基于时间的滚动策略：`ch.qos.logback.core.rolling.TimeBasedRollingPolicy`

2. 基于大小和时间的滚动策略：`ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy`

```xml
<appender name="MyAppender" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%date %msg</pattern>
    </encoder>
    <file>MyLog.log</file>
    <append>true</append>
    <!--  滚动策略   -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <!--  滚动的文件名
   				如果是yyyy/MM-dd，则年份作为文件夹，MM-dd作为文件名
		-->
        <fileNamePattern>MyLog-%d{yyyy-MM-dd}.log</fileNamePattern>
        <!--  文件最多为多少个，超过了则会删除最早的文件   -->
        <maxHistory>3</maxHistory>
        <!--  所有文件总的大小，超过了会删除最早的文件内容   -->
        <totalSizeCap>5GB</totalSizeCap>
    </rollingPolicy>
</appender>
```



## pattern标签

pattern标签是用来控制日志内容的输出格式，具体规则如下：

![image-20221030214229112](/Users/jianhang/Documents/learing/logback学习.assets/image-20221030214229112.png)

![image-20221030214258456](/Users/jianhang/Documents/learing/logback学习.assets/image-20221030214258456.png)





## 自定义Appender

1、创建自定义Appender类，继承 `UnsynchronizedAppenderBase` （同步附加器），并定义一个编码器属性，以及此编码器的setter

```java
import ch.qos.logback.core.UnsynchronizedAppenderBase;

/**
 * @author jianhang
 * @date 2022/10/30 22:31
 */
public class MyAppender<E> extends UnsynchronizedAppenderBase<E> {
	// encoder要与xml文件的<encoder>标签一致
    private Encoder encoder;

    @Override
    protected void append(E e) {
        
    }

    public void setEncoder(Encoder encoder) {
        this.encoder = encoder;
    }
}
```

2、编写输出日志内容具体逻辑（模拟 ConsoleAppender 将日志输出到控制台）

```java
@Override
protected void append(E e) {
    try{
        ILoggingEvent event = (ILoggingEvent) e;
        byte[] encode = encoder.encode(event);
        String msg = new String(encode, StandardCharsets.UTF_8);
        System.out.println(msg);
    }
    catch (Exception exception){
        exception.printStackTrace();
    }
}
```

如果是想实现FileAppender，还需要添加一个`String file;` 属性接收文件名，并添加对应的setter方法。如：

```java
public class MyAppender<E> extends UnsynchronizedAppenderBase<E> {
    // encoder要与xml文件的<encoder>标签一致
    private Encoder encoder;

    private String file;

    @Override
    protected void append(E e) {
        FileOutputStream fileOutputStream = null;
        try{
            ILoggingEvent event = (ILoggingEvent) e;
            byte[] encode = encoder.encode(event);
            fileOutputStream= new FileOutputStream(file, true);
            fileOutputStream.write(encode);
        }
        catch (Exception exception){
            exception.printStackTrace();
        }
        finally {
            if (fileOutputStream != null){
                try {
                    fileOutputStream.close();
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            }
        }
    }

    public void setEncoder(Encoder encoder) {
        this.encoder = encoder;
    }

    public void setFile(String file) {
        this.file = file;
    }
}
```



## 过滤器Filter

过滤器是附加器的一个组件，它用于决定附加器是否输出日志。一个附加器可以包含一个或多个过滤器。每个过滤器都会返回一个枚举值，**可选的值：DENY、 NEUTRAL、ACCEPT**.

附加器根据过滤器返回值判断是否输出日志：

-   DENY  ： 不输出日志。
-   ACCEPT ： 输出日志。
-   NEUTRAL ： 中立，即交由父记录器觉得是否输出日志，如果父记录器也是NEUTRAL，则会一直往上找，直到root，如果root是NEUTRAL或ACCEPT，那么该日志将可以输出。

常用过滤器有：

-   LevelFilter(级别过滤器) ： 实现类 ch.qos.logback.classic.filter.LevelFilter。
-   ThresholdFilter(阈值过滤器)：实现类 ch.qos.logback.classic.filter.ThresholdFilter

### 级别过滤器

LevelFilter： 级别过滤器，对特定某个级别的日志进行过滤。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%date %msg %n</pattern>
            <charset>utf-8</charset>
        </encoder>
        <!-- 过滤掉非info的日志 -->
         <filter class="ch.qos.logback.classic.filter.LevelFilter">   
              <level>INFO</level>   
              <onMatch>ACCEPT</onMatch>   
              <onMismatch>DENY</onMismatch>   
          </filter>   
    </appender>
    
    <root>
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

-   level：日志级别。
-   onMatch：对符合过滤级别的日志的操作，这里仅仅包括指定级别。（DENY，NEUTRAL，ACCEPT）
-   onMismatch：对不符合过滤级别的日志的操作，这里仅仅包括指定级别。（DENY，NEUTRAL，ACCEPT）

###临界值过滤器

ThresholdFilter： 临界值过滤器，过滤掉低于指定临界值的日志。

它没有过多的参数，只有默认配置。当日志级别等于或高于临界值时，过滤器返回NEUTRAL；当日志级别低于临界值时，日志返回DENY。

```xml
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
        <pattern>%date %msg %n</pattern>
        <charset>utf-8</charset>
    </encoder>
    <!-- 打印info及以上的日志 -->
    <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
        <level>INFO</level> 
    </filter> 
</appender> 
```



## 自定义过滤器

创建自定义过滤器类，继承Filter，给定Level属性和它的setter方法。在decide方法中编写你的过滤逻辑。

```java
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;

/**
 * @author jianhang
 * @date 2022/10/31 20:34
 */
public class MyFilter extends Filter<ILoggingEvent> {

    private Level level;

    /**
     * 模拟 ThresholdFilter
     */
    @Override
    public FilterReply decide(ILoggingEvent iLoggingEvent) {
        if(iLoggingEvent.getLevel().isGreaterOrEqual(level)){
            return FilterReply.ACCEPT;
        }
        return FilterReply.DENY;
    }

    public void setLevel(Level level) {
        this.level = level;
    }
}
```



## 异步日志配置

日志记录会消耗性能，但当出现问题的时候，日志又能够帮助我们快速解决问题。那么如何提高打日志的性能呢？在使用logback的时候，推荐使用AsyncAppender异步记录日志。

**要注意AsyncAppender异步记录ILoggingEvents，它仅充当事件分派器，因此必须引用另一个appender才能执行任何有用的操作**。

```xml
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>myapp.log</file>
    <encoder>
      <pattern>[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%level] [%thread] [%logger{50}] >>> %msg%n</pattern>
    </encoder>
  </appender>
 
  <appender name="ASYNC" class="ch.qos.logback.classic.AsyncAppender">
      <neverBlock>true</neverBlock>
      <queueSize>512</queueSize>
      <appender-ref ref="FILE" />
  </appender>
 
  <root level="DEBUG">
    <appender-ref ref="ASYNC" />
  </root>
</configuration>
```

AsyncAppender标签参数配置：

| 参数名称            | 参数类型 | 说明                                                         |
| ------------------- | -------- | ------------------------------------------------------------ |
| queueSize           | int      | 阻塞队列的最大容量。默认情况下，queueSize为256               |
| neverBlock          | boolean  | 默认值为false，表示程序将阻止追加到完整队列，而不是丢失消息。设置为true时，附加程序只会丢弃消息，不会阻止您的应用程序 |
| discardingThreshold | int      | 默认值20，表示当阻塞队列剩余20%的容量时，它将丢弃级别跟踪、调试和信息事件，只保留级别警告和错误事件。要保留所有事件，请将discardingThreshold设置为0 |

