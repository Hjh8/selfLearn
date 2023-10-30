# Maven基础

## 简介

maven不仅是一个服务于java平台的自动化构建工具，还可以作为依赖管理工具。

maven的好处在于可以将项目过程规范化、自动化、高效化以及强大的可扩展性，利用maven自身及其插件还可以获得代码检查报告、单元测试覆盖率、实现持续集成等等。

### 构建工具

构建一个项目通常包含了**清理、编译、测试、打包、发布**等流程，构建工具可以自动化进行这些操作，从而为我们减少这些繁琐的工作。

构建过程包含的主要的环节：

- 清理：删除上一次构建的结果，为下一次构建做好准备

- 编译：Java 源程序编译成 .class 字节码文件

- 测试：运行提前准备好的测试程序

- 打包：
  
  - Java工程：jar包
  - Web工程：war包

- 发布：将打包后的文件上传到服务器

### 依赖管理工具

依赖管理中要解决的具体问题：

- jar 包的下载：使用 Maven 之后，jar 包会从指定的远程仓库下载到本地

- jar 包之间的依赖：通过依赖的传递性自动完成

- jar 包之间的冲突：通过对依赖的配置进行调整，让某些jar包不会被导入

## 基本原理

Maven 的基本原理很简单，采用远程仓库和本地仓库以及一个pom.xml ，将 pom.xml 中定义的 jar 包从远程仓库下载到本地仓库，各个应用使用同一个本地仓库的 jar ，同一个版本的 jar 只需下载一次，而且避免每个应用都去拷贝 jar 。

同时它采用了现在流行的插件体系架构，只保留最小的核心，其余功能都通过插件的形式提供，所以 maven 下载很小，在执行 maven 任务时，才会自动下载需要的插件。

## 坐标

向量说明

Maven的仓库 使用三个 向量 唯一定位到一个jar包。

- groupId：公司或组织的 id。公司或组织域名的倒序，通常也会加上项目名称，例如：com.baidu.maven。

- artifactId：一个项目或者是项目中的一个模块的 id，将来作为 Maven 工程的工程名。

- version：版本号

举例：

```xml
<groupId>javax.servlet</groupId>
    <artifactId>servlet-api</artifactId>
<version>2.5</version>
```

上面坐标对应的 jar 包在 Maven 本地仓库中的位置：

```cmd
Maven本地仓库根目录\javax\servlet\servlet-api\2.5\servlet-api-2.5.jar 1
```

## pom.xml解析

POM：Project Object Model，项目对象模型。POM 表示将工程抽象为一个模型，再用程序中的对象来描述这个模型。这样我们就可以用程序来管理项目了。POM 理念集中体现在 Maven 工程根目录下 **`pom.xml`** 这个配置文件中。所以这个 pom.xml 配置文件就是 Maven 工程的核心配置文件。

pom.xml文件大致如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 当前项目的POM模型版本 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- 继承父项目的各类依赖及其他配置信息，如版本，构建信息，配置描述等 -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.9</version>
        <relativePath/> <!-- 父项目的pom.xml文件的相对路径，默认值是../pom.xml。Maven首先在构建当前项目寻找父项目的pom，其次在文件系统的 relativePath位置，而后在本地仓库，最后在远程仓库寻找父项目的pom。 -->
    </parent>

    <!-- 组织，应用 -->
    <groupId>com.xxx.boot</groupId>
    <!-- 项目ID，一般都喜欢是名称 -->
    <artifactId>framework</artifactId>
    <!-- 版本 -->
    <version>0.0.1-SNAPSHOT</version>

    <!-- 项目名称和描述 -->
    <name>newFramework</name>
    <description>Demo project for Spring Boot</description>

      <!-- 打包的机制，如jar、war。默认为jar -->
        <packaging>jar</packaging>

    <!-- 配置全局变量，可使用${标签名}的方式统一管理版本 -->
    <properties>
        <spring-boot.version>5.3.18</spring-boot.version>
        <maven.complier.source>17</maven.complier.source>
        <maven.complier.target>17</maven.complier.target>
    </properties>

    <!-- 依赖 -->
    <dependencies>
        <!-- 具体依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
              <version>5.3.18</version>
            <!-- 作用域 -->
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!-- 构建信息 -->
    <build>
        <!-- 插件 -->
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## 约定的目录结构

在一个项目中，maven如何知道哪个包下面是源码，哪个包下面是资源文件呢？其实，maven约定了特定的目录结构，每个目录都有其不同的含义，maven会分别对不同的包进行不同的处理：

hello-project

- src：源码目录
  - main：主程序目录
    - java：java源代码
      - com：package目录
    - resources：配置文件目录
  - test：测试程序目录
- pom.xml：maven的核心文件
- target：专门存放构建操作输出结果的文件。**classpath的路径就是以该目录为根路径**。

> 这些目录的作用其实是在superpom中定义了，不过一般情况下都不会去修改，默认按照此约定来存放文件。

## 作用域scope

在`<dependency>` 标签下的`<scope>` 标签中可以指定此jar包的作用范围。

scope标签的可选值：**compile**/**test**/**provided**/system/runtime/**import** 

|          | main目录 | test目录 | 开发环境 | 线上环境 |
| --------:|:------:|:------:|:----:|:----:|
| compile  | √      | √      | √    | √    |
| test     | ×      | √      | √    | ×    |
| provided | √      | √      | √    | ×    |

import 比较特殊，不会参与以上阶段运行。其只能在 dependencyManagement 标签下使用，且 type 需要为 pom，典型的例子为 Spring-boot 、SpringCloud依赖。

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-dependencies</artifactId>
  <version>${spring-boot.version}</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-dependencies</artifactId>
  <version>${spring-cloud.version}</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>
```

# Maven进阶

## 依赖的传递性

A 依赖 B，B 依赖 C，此时A就相当于依赖了C，但需要满足以下原则。

传递的原则：

- 在 A 依赖 B，B 依赖 C 的前提下，C 是否能够传递到 A，取决于 B 依赖 C 时使用的依赖范围。
  - B 依赖 C 时使用 compile 范围：可以传递
  - B 依赖 C 时使用 test 或 provided 范围：不能传递。

所以需要这样的 jar 包时，就必须在需要的地方明确配置依赖才可以。

## 依赖的排除

当 A 依赖 B，B 依赖 C 而且 C 可以传递到 A 的时候，A 不想要 C，需要在 A 里面把 C 排除掉。而往往这

种情况都是为了避免 jar 包之间的冲突。

排除方式如下：

```xml
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpcore</artifactId>
      <!-- 使用excludes标签配置依赖的排除 -->
    <excludes>
          <!-- 指定要排除的依赖的坐标（不需要写version） -->
          <exclude>
                  <groupId>commons-logging</groupId>
                <artifactId>commons-logging</artifactId>
          </exclude>
    </excludes>
</dependency>
```

## 如何写好pom

父子工程的pom

- 父pom只管理版本，不引入具体依赖 （dependencyManagement）
- 子pom只引入依赖，不管理版本（dependency）
- 父pom内统一指定版本，子模块不单独定义版本
- 子模块之间相互依赖时，版本号使用${project.version}
- 子模块内parent的坐标，必须与父pom一致

### 解决版本冲突

- 避免使用exclude解决版本冲突问题，使用dependencyManagement指定版本
- 冲突时通常指定高版本，但也需要确认向前兼容
- 尽量使用公共pom预定义的组件版本，保持最大程度兼容

## 继承

在maven的pom文件中也存在继承关系，以此来达到复用的效果。

可以理解为每个模块就是一个每部类，每个工程就是一个类。而在maven中有个superpom是所有pom文件的顶级父类，类似于java中Object。
