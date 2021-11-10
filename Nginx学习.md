Nginx学习
=========

Nginx简介
---------

Nginx 是高性能的 HTTP 和反向代理的服务器，处理高并发能力是十分强大的，能经受高负载的考验，有报告表明能支持高达 50,000 个并发连接数。它的主要功能的反向代理、负载均衡、动静分离。

- **正向代理**：客户端利用代理服务器进行指定网站的访问。
- **反向代理**：服务器利用代理服务器来作为中间的代理，即外部访问时不知道代理服务器的存在。暴露的是代理服务器的地址。
- **负载均衡**：增加服务器的数量，然后按某种策略将请求分发到各个服务器上。
- **动静分离**：将静态资源（html、css、js）跟动态资源分隔开。用户在请求的时候，如果只是简单的访问图片，html等静态的请求时，nginx直接返回,如果是发送动态请求时候，就由nginx把请求发送给服务器进行动态处理



Nginx的配置文件
---------------

> 查看配置文件的默认路径：`/usr/sbin/nginx -t ` 
>
> 配置文件的每个指令必须有分号结束。

配置文件内容如下：

```conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2 default_server;
#        listen       [::]:443 ssl http2 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        location / {
#        }
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }
}
```

- 全局块：配置服务器整体运行的配置指令，比如` worker_processes 1;` 处理并发的数量
- events块：影响Nginx服务器与用户的网络连接,`worker_connections 1024;` 支持的最大连接数为1024
- http块：配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
  - server块：配置虚拟主机的相关参数，一个http中可以有多个server
  - location块：配置请求的路由，以及各种页面的处理情况。



### server块

```java
server {
        listen       80 default_server;  # 监听端口
        server_name  119.91.150.120;  # 指定服务器名称
        root         /usr/share/nginx/html;  # 指定根目录
        
        # 指定url匹配规则
        location / {
            
        }
}
```





### location 块

Nginx配置文件中的location部分主要用来对于传入的URL进行匹配，然后根据特定的location中定义的目录下查找请求的文件，支持正则表达式。

语法如下：（`[]`表示可选）

```java
location [ = | ~ | ~* | ^~] uri {
    
}
```

- `=` ：用于不含正则表达式的 uri 前，要求请求字符串与 uri 严格匹配，如果匹配成功，就停止继续向下搜索并立即处理该请求。
- `~`：用于表示 uri 包含正则表达式，并且区分大小写。
- `~*`：用于表示 uri 包含正则表达式，并且不区分大小写。
- `^~`：用于不含正则表达式的 uri 前，要求 Nginx 服务器找到标识 uri 和请求字符串匹配度最高的 location 后，立即使用此 location 处理请求，而不再使用 location 块中的正则 uri 和请求字符串做匹配。

例如：

```java
location / {
    root   html;
    index  index.html index.htm;
}
```

匹配的URL规则为/，定义的根目录为html。也就是说，任何对于http://192.168.0.110的访问都将会在html目录下进行资源查找。

这里的**root指定的是一个相对目录**，以nginx的server块root中指定的路径为根目录。

例如：

- 访问http://192.168.0.110/1.jpg，此时在主机上对应的目录文件为`html/1.jpg`
- 访问http://192.168.0.110/test/1.html，此时在主机上对应的目录文件为`html/test/1.html` 



反向代理配置1
-------------

效果：浏览器输入nginx的访问地址，nginx将请求转发给tomcat服务器

步骤：在nginx进行请求转发的配置

```conf
server {
        listen       80;
        server_name  nginx的IP地址或域名;
        location / {
            proxy_pass 要转发的IP地址或域名;
        }
}
```



反向代理配置2
-------------

效果：根据不同的路径名访问不同的端口或地址，如访问`http://192.168.17.129:9001/edu`直接跳转到127.0.0.1:**8080**、访问`http:// 192.168.17.129:9001/vod` 直接跳转到127.0.0.1:**8081** 

步骤：在nginx进行请求转发的配置

```conf
server {
        listen       80;
        server_name  nginx的IP地址;
        location ~ /edu/ {
            proxy_pass http://192.168.17.129:9001/edu
        }
       location ~ /vod/ {
            proxy_pass http://192.168.17.129:9001/edu
        }
}
```



负载均衡配置
------------





