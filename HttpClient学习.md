# HttpClient学习

## 简介

HttpClient是用来编程实现HTTP调用的一款框架，它是Apache Jakarta Common下的子项目，相比传统JDK自带的URLConnection，增加了易用性和灵活性。

HttpClient不仅使客户端发送Http请求变得更加容易，而且也方便了开发人员测试接口（基于Http协议的），即提高了开发的效率，也方便提高代码的健壮性。

目前主流的SpringCloud框架，服务与服务之间的调用也全部是基于HttpClient来实现的。因此，系统的学习一下HttpClient，还是非常有必要的。

### HttpClient使用步骤

使用HttpClient来发送请求、接收响应通常有以下步骤：

- 引入依赖：项目中通过Maven等形式引入`HttpClient`依赖类库。
  
  ```xml
  <dependency>
      <groupId>org.apache.httpcomponents</groupId>
      <artifactId>httpclient</artifactId>
      <version>4.5.13</version>
  </dependency>
  ```

- 创建`HttpClient`对象。
  
  ```jav
  HttpClient client = HttpClients.createDefault();
  ```

- 创建请求方法实例：GET请求创建`HttpGet`对象，POST请求创建`HttpPost`对象，并在对象构建时指定请求URL。
  
  ```java
  HttpPost httpPost = new HttpPost(url);
  ```

- 设置请求参数：调用`HttpGet`、`HttpPost`共同的`setParams(HetpParams params)`方法来添加请求参数；`HttpPost`也可调用`setEntity(HttpEntity entity)`方法来设置请求参数。
  
  ```java
  // 转换成json形式
  StringEntity entity = new StringEntity(jsonParam, ContentType.APPLICATION_JSON);
  httpPost.setEntity(entity);
  ```

- 发送请求：调用`HttpClient`对象的`execute(HttpUriRequest request)`发送请求，该方法返回一个`HttpResponse`。
  
  ```java
  HttpResponse response = client.execute(httpPost);
  ```

- 获取响应结果：调用`HttpResponse`的`getEntity()`方法可获取`HttpEntity`对象，该对象包装了服务器的响应内容。
  
  ```java
  if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
      res = EntityUtils.toString(response.getEntity(), "UTF-8");
  }
  ```

- 释放连接：无论执行方法是否成功，都必须释放连接。
  
  ```java
  if (response != null) {
    try {
      response.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  if (httpClient != null) {
    try {
      httpClient.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  ```

**如果response没有被close，则连接不会被关闭，此时导致线程一直在等待**。

Tips: 如果不想手动的关闭资源，可以使用`CloseableHttpClient`跟`CloseableHttpResponse` ，会自动的进行关闭资源。

## HttpClient超时配置

如果还需要对HTTP请求设置一些配置，尤其是针对HTTP请求超时情况的处理，HttpClient对此提供了`setConfig(RequestConfig config)`方法来为请求配置超时时间等，部分核心代码如下：

```java
RequestConfig requestConfig = RequestConfig.custom()
                // 连接上服务器(握手成功)的时间
                .setConnectTimeout(2000)
                // 从连接池中获取连接的超时时间
                .setConnectionRequestTimeout(500)
                // 服务器返回数据(response)的时间
                .setSocketTimeout(3000)
                .build();
```

http三个超时时间相关参数：

**connectionRequestTimeout**

 从连接池中获取连接的超时时间（单位毫秒），超过该时间未拿到可用连接， 会抛出org.apache.http.conn.ConnectionPoolTimeoutException:Timeout waiting for connection from pool。

默认值是-1，无限长等待。建议设置500ms即可，不要设置太大，这样可以使连接池连接不够时不用等待太久去获取连接，不要让大量请求堆积在获取连接处，尽快抛出异常，发现问题。

**connectTimeout**

连接上服务器(握手成功)的时间，超出该时间抛出connecttimeout

设置建议：根据网络情况，内网、外网等，可设置连接超时时间为2秒，具体根据业务调整。

**socketTimeout**

服务器返回数据(response)的时间，超过该时间抛出read timeout。

设置建议：需要根据具体请求的业务而定，如请求的API接口从接到请求到返回数据的平均处理时间为1秒，那么读超时时间可以设置为2秒，考虑并发量较大的情况，也可以通过性能测试得到一个相对靠谱的值。socketTimeout有默认值，也可以针对每个请求单独设置。

## HttpClient工具类封装

```java
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import java.io.IOException;
import java.util.Map;

/**
 * @author jianhang 2022/9/7
 */
@Slf4j
public class HttpClientUtils {

    private static RequestConfig requestConfig;

    private HttpClientUtils() {}

    static {
        // 设置http的超时参数
        requestConfig = RequestConfig.custom()
                // 连接上服务器(握手成功)的时间
                .setConnectTimeout(2000)
                // 从连接池中获取连接的超时时间
                .setConnectionRequestTimeout(500)
                // 服务器返回数据(response)的时间
                .setSocketTimeout(3000)
                .build();
    }

  public static String doGet(String url, Map<String, String> param) {
    // 创建Httpclient对象
    CloseableHttpClient httpClient = HttpClients.createDefault();

    String resultString = "";
    CloseableHttpResponse response = null;
    try {
      // 创建uri
      URIBuilder builder = new URIBuilder(url);
      if (param != null) {
        for (String key : param.keySet()) {
          builder.addParameter(key, param.get(key));
        }
      }
      URI uri = builder.build();
      // 创建http GET请求
      HttpGet httpGet = new HttpGet(uri);
      httpGet.setConfig(requestConfig);
      // 执行请求
      response = httpClient.execute(httpGet);
      // 判断返回状态是否为200
      if (response.getStatusLine().getStatusCode() == 200) {
        resultString = EntityUtils.toString(response.getEntity(), "UTF-8");
      }
    } catch (Exception e) {
      // TODO 完善异常处理
      e.printStackTrace();
    } finally {
      try {
        if (response != null) {
          response.close();
        }
        if (httpClient != null) {
          httpClient.close();
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return resultString;
  }

  public static String doGet(String url) {
    return doGet(url, null);
  }

     public static String doPostJson(String url, String jsonParam, Map<String, String> headers){
        String res = "";
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);
        httpPost.setConfig(requestConfig);

        if (headers != null && !headers.isEmpty()) {
            for (String key : headers.keySet()) {
                httpPost.addHeader(key, headers.get(key));
            }
        }

        StringEntity entity = new StringEntity(jsonParam, ContentType.APPLICATION_JSON);
        httpPost.setEntity(entity);
        // 执行请求
        CloseableHttpResponse response;
        try {
            response = client.execute(httpPost);
            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
                res = EntityUtils.toString(response.getEntity(), "UTF-8");
            }
        } catch (IOException e) {
            log.error("请求出错:", e);
        }
        return res;
    }
}
```

## httpclient连接池的使用

采用连接池可以减少 每次连接发起Http请求的时候建立TCP连接(经历3次握手)，关闭连接(4次挥手)的时间损耗。

使用连接池可以支持更大的并发，如果不采用连接池，每次连接都会打开一个端口，在大并发的情况下系统的端口资源很快就会被用完，导致无法建立新的连接。

```java
PoolingHttpClientConnectionManager cm = null;
LayeredConnectionSocketFactory sslsf = null;
try {
    sslsf = new SSLConnectionSocketFactory(SSLContext.getDefault());
} catch (NoSuchAlgorithmException e) {
    e.printStackTrace();
}

Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create()
        .register("https", sslsf)
        .register("http", new PlainConnectionSocketFactory())
        .build();

cm = new PoolingHttpClientConnectionManager(socketFactoryRegistry);
cm.setMaxTotal(200); // 设置最大连接数
cm.setDefaultMaxPerRoute(20); // 设置每个路由的默认最大连接数

// 创建客户端的时候指定连接池
CloseableHttpClient httpClient = HttpClients.custom()
        .setConnectionManager(cm)
        .build();
```

连接池释放连接的时候，并不会直接对TCP连接的状态有任何改变，只是维护了两个Set集合（leased和avaliabled），leased代表被占用的连接集合，avaliabled代表可用的连接的集合，释放连接的时候仅仅是将连接从leased中remove掉了，并把连接放到avaliabled集合中。
