1. 简介
===

1.1 微服务概述
---

> 微服务一词源于 Martin Fowler（马丁.福勒）的名为 Microservices 的博文，可以在他的官方博客上找到这篇文章：http://martinfowler.com/articles/microservices.html
>
> 中文翻译版本：https://www.martinfowler.cn/articles/microservices.html

微服务是系统架构上的一种设计风格， 它的主旨是将一个原本独立的系统拆分成多个小型服务，这些小型服务都各自运行，服务之间通过基于 HTTP 的 RESTful API 进行通信协作；

分布式强调系统的拆分，微服务也是强调系统的拆分，微服务架构属于分布式架构的范畴；

优点：

- 每个服务的更新不会影响其他服务的运行
- 每个服务都是独立开发，便于后期维护
- 每个服务可以使用不同的编程语言进行开发

缺点：

- 增加了整体的系统维护以及部署的难度，导致一些功能模块或代码无法复用；
- 数据的一致性问题需要解决
- 增加了集成测试的复杂度；



1.2 认识Spring Cloud
---

Spring Cloud 为开发人员提供了快速构建分布式系统中一些常见模式的工具。比如：配置管理，服务发现，断路器，智能路由、微代理、控制总线、全局锁、决策竞选、分布式会话和集群状态管理等 。

Spring Cloud 基于 Spring Boot 框架构建微服务架构



2. Spring Cloud快速入门
===

一个服务就是一个系统，服务之间进行通信就等于系统之间通信，那系统之间要如何通信呢？需要把他们都注册到一个中心，我们称为“**服务注册中心**”。通过中心，系统之间就可以相互通信，获取到需要的结果。

Spring Cloud 提供了多种服务注册与发现的实现方式，例如：Eureka、

Consul、Zookeeper。在这里我们介绍Eureka。



2.1 Eureka介绍
---

Eureka 采用了 **C-S（客户端/服务端）**的设计架构，也就是 Eureka 由两个组件组成：Eureka服务端和 Eureka客户端。Eureka服务端 是服务注册中心，而系统中的其他微服务，使用 Eureka客户端 连接到 Eureka服务端，并维持心跳连接。

有了 Eureka 注册中心，系统的维护人员就可以通过 Eureka服务端 来监控系统中各个微服务是否正常运行。



2.2 搭建两个微服务
---

创建两个springboot项目（作为注册中心的客户端）

![image-20210721210116272](SpringCloud学习.assets/image-20210721210116272.png)





2.3 搭建与配置Eureka 服务注册中心
---

1. 创建另一个系统用于服务注册中心

2. 添加eureka-server依赖：

   ```xml
   <dependency>   		
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
       <version>2.2.7.RELEASE</version>
   </dependency>
   ```

3. 在 Spring Boot 的入口类上添加一个@EnableEurekaServer 注解，用于开启 Eureka 注册中心服务端

4. 在配置文件中配置 Eureka 服务注册中心信息

   ```properties
   # 内嵌定时 tomcat 的端口
   server.port=8093
   # 设置该服务注册中心的 hostname
   eureka.instance.hostname=localhost
   # 由于我们目前创建的应用是一个服务注册中心，而不是普通的应用，默认情况下，这个应用会向注册中心（也是它自己）注册它自己，
   # 设置为 false 表示禁止这种自己向自己注册的默认行为
   eureka.client.register-with-eureka=false
   # 表示不去检索其他的服务
   eureka.client.fetch-registry=false
   # 指定服务注册中心的位置
   eureka.client.service-url.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka
   ```





2.4 向Eureka注册中心注册服务
---

在之前两个客户端系统中添加eureka-client依赖

```xml
<dependency>   		
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    <version>2.2.7.RELEASE</version>
</dependency>
```





Eureka与Zookeeper的比较











