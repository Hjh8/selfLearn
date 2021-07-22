一、简介
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



二、 Spring Cloud快速入门
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

2. 添加eureka-server依赖：（**注意，springboot的版本要跟eureka一直**）

   ```xml
   <dependency>   		
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
       <version>2.2.7.RELEASE</version>
   </dependency>
   
   
   <dependencyManagement>
           <dependencies>
               <dependency>
                   <groupId>org.springframework.cloud</groupId>
                   <artifactId>spring-cloud-dependencies</artifactId>
                   <version>Hoxton.RELEASE</version>
                   <type>pom</type>
                   <scope>import</scope>
               </dependency>
           </dependencies>
       </dependencyManagement>
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

5. 访问页面

   ![image-20210721231109426](SpringCloud学习.assets/image-20210721231109426.png)





2.4 向Eureka注册中心注册服务
---

1. 在之前两个客户端系统中添加eureka-client依赖

```xml
<dependency>   		
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    <version>2.2.7.RELEASE</version>
</dependency>

<dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

2. 在 Spring Boot 的入口类上添加一个 **@EnableEurekaClient** 注解来表明自己是一个 eureka 客户端

3. 配置服务名称和注册中心地址

   ```properties
   # 注册的客户端名字，一般与项目名一致
   spring.application.name=XXX
   # 服务端所在路径
   eureka.client.service-url.defaultZone=http://localhost:8093/eureka
   ```

4. 自定义配置类，将RestTemplate放入容器中

   ```java
   package com.study.config;
   
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.web.client.RestTemplate;
   
   @Configuration
   public class MyConfig {
   
       @LoadBalanced // 使用负载均衡
       @Bean
       public RestTemplate restTemplate(){
           return new RestTemplate();
       }
   }
```
   

> @LoadBalanced实现负载均衡，合理的把请求分配给不同的服务器，而不是单单让某个服务器处理，从而让每个服务器可以发挥最大程度的作用。
>
> 服务的真正调用由 ribbon实现，所以我们需要在调用服务提供者时使用 ribbon 来调用，而@LoadBalanced实际就是调用ribbon。

5. 使用restTemplate进行系统通信

   ```java
   @RestController
   public class ConsumerController {
   
       @Autowired
       RestTemplate restTemplate;
   
       @RequestMapping("/consumer/hello")
       public String hello(){
           // 注册中心的服务名，而不是项目名
           String baseURL = "http://01-SPRINGCLOUD-PROVIDER";
           ResponseEntity<String> entity = restTemplate.getForEntity(baseURL+"/provider/hello", String.class);
           System.out.println(entity); // <200,provider.hello,[Content-Type:"text/plain;charset=UTF-8", Content-Length:"14", Date:"Thu, 22 Jul 2021 01:28:26 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]>
           System.out.println(entity.getBody()); // provider.hello
           return "consumer.hello";
       }
   }
   ```

Ribbon 是什么？

Ribbon 是一个基于 HTTP 和 TCP 的客户端**负载均衡器**，当使用 Ribbon 对服务进行访问的时候，它会扩展 Eureka 客户端的服务发现功能，实现从 Eureka注册中心中获取服务端列表，并通过 Eureka 客户端来确定服务端是否己经启动。Ribbon 在 Eureka 客户端服务发现的基础上，实现了对服务实例的选择策略，从而实现对服务的负载均衡消费。



三、服务注册中心Eureka
===

Eureka与Zookeeper的比较











