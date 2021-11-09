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

> 配置文件的默认路径：`/usr/local/nginx/conf/nginx.conf` 
>
> 配置文件的每个指令必须有分号结束。

配置文件内容如下：

```conf
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

- 全局块：配置服务器整体运行的配置指令，比如` worker_processes 1;` 处理并发的数量
- events块：影响Nginx服务器与用户的网络连接,`worker_connections 1024;` 支持的最大连接数为1024
- http块：配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
  - server块：配置虚拟主机的相关参数，一个http中可以有多个server
  - location块：配置请求的路由，以及各种页面的处理情况。



location 指令：该指令用于匹配 URL。

语法如下：

```java
location [ = | ~ | ~* | ^~] uri {
    
}
```





### 反向代理配置1

效果：浏览器输入nginx的访问地址，nginx将请求转发给tomcat服务器

步骤：在nginx进行请求转发的配置

```conf
server {
        listen       80;
        server_name  nginx的IP地址;
        location / {
            proxy_pass 要转发的IP地址
        }
}
```



### 反向代理配置2

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







