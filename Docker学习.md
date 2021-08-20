Docker学习
===

一、docker介绍
---

### docker简介

Docker是一个基于go语言的容器化的技术，让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

也就是说我们只需要考虑在docker上安装开发环境需要的各种软件跟容器，然后部署的时候只需要在服务器下载docker即可，**无需再手动在服务器配置运行环境**。此外docker非常适合 **持续集成CI** 和 **持续交付目CD**，即程序员只需要push一下，服务器就会自动更新。

***

容器化技术与虚拟机技术的**区别**：

- 不是一个完整的操作系统，而是直接运行在操作系统之上
- 每个容器之间是相互隔离的



### docker的核心概念

docker中有几个核心概念：

- 镜像：一个镜像代表一个软件
- 容器：运行着的镜像就叫做容器
- 仓库：存储docker所有镜像的具体位置。分为远程仓库跟本地仓库

当需要用到镜像时，使用`docker image pull 镜像名:版本` 命令从远程仓库拉取镜像到本地仓库，如果不指定版本则默认拉取最新的版本。

使用`docker run 镜像名` 运行镜像。



### 镜像配置

> docker有类似maven的[仓库网站](https://registry.hub.docker.com/)，可以查看对应镜像的版本号：
>
> ![image-20210811193033558](Docker学习.assets/image-20210811193033558.png)

由于远程仓库是在国外，每次拉取的速度比较慢，所以可以使用国内的镜像仓库地址：

```json
"registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://dockerhub.azk8s.cn",
    "https://reg-mirror.qiniu.com",
    "https://registry.docker-cn.com",
    "https://nrbewqda.mirror.aliyuncs.com"
  ]
```

![image-20210811175557414](Docker学习.assets/image-20210811175557414.png)



二、docker入门
---

### helloworld案例

docker为我们提供了一个hello-world案例，我们只需要通过`docker run hello-world ` 即可运行，如下图：

![image-20210811180642937](Docker学习.assets/image-20210811180642937.png)

根据前面我们知道，**run的是一个镜像**，所以可以知道hello-world是一个镜像，所以我们第一次run的时候docker会**先从本地中找该镜像，找不到该镜像就会去远程仓库拉取**，远程仓库没有则报错。



### 常见镜像命令

- `docker images [image]`：查看本地的镜像，可以指定镜像名称
- `docker pull image:version`：拉取远程仓库的image
- `docker rmi [-f] image:version`：删除本地仓库的image，-f参数表示强制删除



### 容器相关操作

#### 查看容器信息

- `docker load -i xx.tar`：将被打包成jar包的镜像文件导入本地仓库

- `docker ps [-a] [-q]`：查看当前正在运行的容器。
  - **-a**：表示显示全部，包括结束和正在运行的容易。
  - **-q**：查询正在运行的**容器id**。
- `docker inspect 容器名称/id`：查看容器的详细信息，如容器状态、端口映射、IP地址等。



#### 运行容器

- `docker run [-p hostPort:imagePort ] [-d] [--name name] image:tag`：运行容器。如果不加-p参数，主机访问不到该容器。**容器可以多次执行，相互没有影响，即使容器端口一样，但是主机端口不能一样**。
  - **-p hostPort:hostPort**：将主机端口跟容器端口进行映射。例如 `docker run -p 8080:8080 tomcat`：启动tomcat容器，且映射到主机端口。
  - **-d**：表示后台运行。
  - **--name name**：指定容器启动的名字（唯一）
- `docker start 容器名称/id`：启动容器
- `docker restart 容器名称/id`：重启容器
- `docker stop 容器名称/id`：停止容器
- `docker rm [-f] 容器名称/id `：删除容器
  - `docker rm -f $(docker ps -aq)`：删除所有的容器



#### 查看容器日志

- `docker logs [-f] [-t] 容器名称/id`：查看容器运行日志。
  - -f：实时查看日志
  - -t：显示时间



#### 容器内操作

- 查看容器内进程：`docker top 容器名称/id` 
- 进入容器终端：`docker exec -it 容器名称 bash`
  - **exit命令**，退出容器终端



#### 容器与宿主机的文件拷贝

宿主机到容器的文件拷贝：`docker cp 主机文件 容器名称:文件路径` 

容器到宿主机的文件拷贝：`docker cp容器名称:文件 主机文件路径 ` 



#### 数据卷

数据卷(volume)是一个可供一个或多个容器使用的特殊的**宿主机目录**。数据卷是被设计用来**持久化数据**的。

- 宿主机和容器之间，多个容器之间可通过数据卷进行数据共享
- 对数据卷的修改会立马生效。

创建数据卷的方式很简单，就在容器启动的时候指定目录就可以了，即加上`-v 数据卷路径:容器文件路径`。数据卷路径等同于数据卷名称

完整启动路径：

```bash
docker run -d -p 8080:8080 --name tomcat -v /myDemo:/usr/local/tomcat/webapps tomcat:latest
```

- 宿主机目录不存在时，会自动创建
- 如果挂载一个**空的数据卷**到**容器的非空目录**中，那么这个目录下的文件会被复制到数据卷中。
- 如果挂载一个**非空的数据卷**到**容器中的目录**中，那么容器中的目录中原有的内容会被隐藏掉，只显示数据卷中的数据。

***

查看所有数据卷：`docker volume ls` 

查看容器的数据卷：`docker volume inspect volume名` 

删除数据卷：`docker volume rm volume名`



三、镜像分层原理
---

一个镜像为什么这么大？因为一个镜像不仅包括某个软件要运行的代码，还包括其运行环境以及其他软件包依赖。

正是因为镜像大，所以把镜像分成一层层的，一个镜像由若干个镜像组成，而这些小的镜像还可以去组合其他的镜像，依次达到复用的效果。



四、启动mysql
---

`docker run -d -p 3308:3306 -e MYSQL_PASSWORD=密码 --name mysql mysql:8.0.17` 



五、Dockerfile
---

### Dockerfile 简介

Dockerfile 是一个用来构建镜像的**文本文件**，文本内容包含了一条条构建镜像所需的**指令**。Docker通过读取`Dockerfile`中的指令自动生成映像。

> Dockerfile 所在的目录称为上下文目录

使用 `docker build -t image:tag 路径` 命令构建镜像，例如：

```bash
docker build -t nginx:v3 . # 点表示当前目录
```

**构建过程**：

1. 对上下文目录中所有的内容进行打包然后发送给docker的server
2. server对dockerfile中的指令一行行的解析，每一行指令都会在缓存中生成一个image层
3. 每行的指令都在之前的image层上构建image层，直到最后一行指令执行完才是完整的image



### 基础结构

Dockerfile 一般分为四部分：<u>基础镜像信息</u>、<u>维护者信息</u>、<u>镜像操作指令</u> 和 <u>容器启动时执行指令</u>。



















