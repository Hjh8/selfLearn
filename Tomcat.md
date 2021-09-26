Tomcat
===

tomcat采用war包部署，是因为jar包的话比较难区别此jar包是应用还是应用依赖的jar包。

Tomcat 的核心功能有两个，分别是负责接收/反馈请求的连接器Connector、负责处理请求的容器 Container。

> TCP协议的实现是操作系统，操作系统提供了方法进行tcp连接，而socket就是该方法暴露在外的一个api。

tomcat采用线程池部署项目。

部署项目的三种方式：

1. webapps文件夹下部署：tomcat默认会扫描该文件夹下的项目

2. server.xml项目映射的部署：在Context标签中指定

   ```xml
   <Context path="/WebProject" docBase="D:/WebProject" reloadable="true" />
   ```

3. 进入tomcat根项目下的`conf\Catalina\localhost`目录下新建一个xml文件，文件名为项目名，在项目名中指定Context标签。

   - 新建`WebProject.xml`，在里面指定`<Context docBase="D:/WebProject" reloadable="true" />` 