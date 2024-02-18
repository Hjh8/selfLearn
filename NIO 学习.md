NIO 学习
===

I/O 模型分类
---

IO分为文件IO和网络IO，在网络编程中，如Socket通信就是典型的网络IO。

I/O 模型：就是用什么样的通道或者通信模式进行网络数据的传输和接收，很大程度上决定了程序通信的性能。

Java 共支持 3 种网络编程的/IO 模型：**BIO、NIO、AIO**。

BIO（Blocking I/O）：同步阻塞模型。在进行I/O操作时，必须等待数据读取或写入完成后才能进行下一步操作。这种模式一般一个线程处理一个IO请求，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果一个连接不做任何事情则对应的线程会一直等待。

NIO（Non-blocking I/O）： 同步非阻塞模型，是一种事件驱动的I/O模型。在进行I/O操作时，不需要等待操作完成，可以进行其他操作。

AIO（Asynchronous I/O）：异步非阻塞模型，是一种更高级别的I/O模型。在进行I/O操作时，不需要等待操作完成，就可继续进行其他操作，当操作完成后会自动回调通知。

由上可见，IO模型涉及四个非常重要的概念，只有弄懂了这些概念才能深入了解IO。那什么叫阻塞，非阻塞，什么叫同步异步呢？

举个例子，中午吃饭有几个选择：

- 自选餐线：我们点餐的时候都得在队伍里排队等待，必须等待前面的同学打好菜才到我们，这就是**同步阻塞模型**BIO。

- 麻辣烫餐线：点完餐会给我们发个叫号器，我们拿到叫号器后不需排队原地等待，我们可以找个地方去做其他事情，等麻辣烫准备好收到呼叫之后，自行取餐，这就是**同步非阻塞模型**NIO。

- 包厢模式：我们只要点好菜，坐在包厢干自己的事情，等到饭菜做好，服务员亲自送，无需自己取，这就是**异步非阻塞模型**AIO。

根据上个例子分析：

**阻塞和非阻塞**：等待期间能不能做其他事

- **阻塞**：读数据时，数据未就绪，读阻塞直到有数据；写数据时，缓冲区满时，写操作也会阻塞等待。**本质上是线程挂起**，不能做其他事；

- **非阻塞**：不管数据有没有就绪/缓冲区够不够空间，请求直接返回。**本质上线程活跃**，可以处理其他事情；

**同步与异步**：是不是自己做

- 同步：数据就绪后**应用程序**自己读取；

- 异步：数据就绪后**操作系统**直接回调应用程序；

NIO介绍
---

Java NIO（New IO）也有人称之为non-blocking IO，从Java 1.4版本开始引入的一个新的IO API。NIO面向**缓冲区**的、基于**通道**的IO操作。NIO将以更加高效的方式进行文件/网络的读写操作。

NIO 三大核心
---

NIO 有三大核心部分：**Channel(通道) ，Buffer(缓冲区)，Selector(选择器)**

### Buffer 缓冲区

缓冲区本质上是一块可以写入/读取数据的内存。这块内存被包装成NIO Buffer对象，并提供了一组方法给应用程序访问这块内存。需要注意的是缓冲区是非线程安全的。

Buffer 中的重要概念： 

* **容量 (capacity)** ：作为一个内存块，Buffer具有一定的固定大小，也称为"容量"，缓冲区容量不能为负，并且创建后不能更改。 
* **限制 (limit)**：表示缓冲区中可以操作数据的大小（limit 后数据不能进行读写）。缓冲区的限制不能为负，并且不能大于其容量。 **写入模式下，limit等于buffer的容量。读取模式下，limit等于写入的数据量**。
* **位置 (position)**：下一个要读取或写入的数据的索引。缓冲区的位置不能为负，并且不能大于其限制 
* **标记 (mark)与重置 (reset)**：标记是一个索引，通过 Buffer 中的 mark() 方法 指定 Buffer 中一个特定的 position，之后可以通过调用 reset() 方法恢复到这 个position.

> 标记、位置、限制、容量遵守以下不变式：
> 
>  0 ≤ mark ≤ position ≤ limit ≤ capacity

![image-20200619171301760](NIO 学习.assets/image-20200619171301760.png)

常见的 buffer 有

- ByteBuffer
  - MappedByteBuffer
  - DirectByteBuffer
  - HeapByteBuffer
- ShortBuffer
- IntBuffer
- LongBuffer
- FloatBuffer
- DoubleBuffer
- CharBuffer

常用方法：

- 分配缓冲区：ByteBuffer.allocate(1024);
- 存入数据到缓冲区：put(byte[] b)
- 获取缓冲区的数据：get(byte[] b)
- 切换到读取模式（默认是写入模式）：flip()
- 转成字符数组：array()
- 设置标记：mark()
- 恢复到标记位置：reset()
- 取消mark，位置设为0：rewind()
- 清空缓冲区：clear()
- 压缩数据：compat()，把未读完的部分往前压缩，然后切换至写模式

![](NIO%20学习.assets/2023-12-21-20-02-50-image.png)

#### 直接缓冲区和非直接缓冲区

**非直接缓冲区HeapByteBuffer**：通过allocate()方法分配的缓冲区，建立在JVM内存中，收到垃圾回收影响。

**直接缓冲区DirectByteBuffer**：也叫直接内存，通过allocateDirect()方法分配的缓冲区，建立在系统内存中，不会受到垃圾回收的影响。

![微信图片_20210531212738](NIO 学习.assets/微信图片_20210531212738.jpg)

### Channel 通道

**通道**表示打开到 IO 设备(例如：文件、套接字)的连接，数据从通道读入到缓冲区buffer，再从缓冲区buffer写回通道，是双向的。

常用的Channel实现类：

* FileChannel：与文件读写的通道。
* DatagramChannel：UDP 读写网络中的数据通道。
* SocketChannel：TCP 读写网络中的数据通道。
* ServerSocketChannel：针对服务端，可以监听新进来的 TCP 连接，对每一个新进来的连接都会创建一个 SocketChannel。

**获取通道的方法**，支持通道的类调用getChannel() ：

- DatagramSocket
- Socket
- ServerSocket

> 在JDK 1.7 中的NIO.2 针对各个通道类提供了静态方法 open()

常用方法：

- read(ByteBuffer[] dsts)：将通道中的数据存入缓冲区中
- write(ByteBuffer[] srcs)：将缓冲区中的数据写回通道中
- position()：通道内数据的当前位置
- size()：通道内数据的大小
- close()：关闭管道
- transferFrom(原通道, 原通道的位置, 原通道的大小)：从目标通道中去复制原通道数据
- transferTo(原通道的位置, 原通道的大小, 目标通道)：把原通道数据复制到目标通道

```java
@Test
public void test() throws Exception {
    /*
        把data01的内容复制到data03中
    */
    FileInputStream is = new FileInputStream("data01.txt");
    // 获取输入管道
    FileChannel isChannel = is.getChannel();
    FileOutputStream fos = new FileOutputStream("data03.txt");
    // 获取输出管道
    FileChannel osChannel = fos.getChannel();
    // 复制
    osChannel.transferFrom(isChannel, isChannel.position(), isChannel.size());
    // 等价于
    // isChannel.transferTo(isChannel.position() , isChannel.size() , osChannel);

    isChannel.close();
    osChannel.close();
}
```

### Selector 选择器

Selector可以能够检查一个或多个 NIO 通道（管理多个网络连接），并确定哪些通道已经准备好进行读取或写入，并对准备就绪的通道进行处理。Selector 是非阻塞 IO 的核心。可以理解为Selector就是取号器，当数据就绪的时候会告知用户。

在NIO模型中，多个channel会被注册到同一个Selector中，Selector会检测这些通道是否请求，如果有请求就针对此channel进行处理。

将通道注册到Selector时，需要 **指定监听的事件** 类型：

* 读 : SelectionKey.OP_READ
* 写 : SelectionKey.OP_WRITE
* 连接 : SelectionKey.OP_CONNECT
* 接收 : SelectionKey.OP_ACCEPT

> 若注册时不止监听一个事件，则可以使用加号“+”连接。
> 
> int interestSet = SelectionKey.OP_READ + SelectionKey.OP_WRITE 

### 处理read和accept事件

服务端流程：

1. 获取服务端通道

```java
ServerSocketChannel ssChannel = ServerSocketChannel.open();
```

2. 切换非阻塞模式

```java
ssChannel.configureBlocking(false);
```

3. 绑定连接

```java
ssChannel.bind(new InetSocketAddress(9999));
```

4. 获取选择器

```java
Selector selector = Selector.open();
```

5. 将服务器通道注册到选择器上, 并且告诉**选择器监听服务器通道的“接收accept事件”**

```java
ssChannel.register(selector, SelectionKey.OP_ACCEPT);
```

6. 轮询式的获取选择器上已经“准备就绪”的事件

```java
// 轮询式的获取选择器上已经“准备就绪”的事件
while (true) {
    // 阻塞 直到有绑定事件就绪
    selector.select();
    // 获取当前选择器中所有注册的 “选择键(已就绪的监听事件)”
    Iterator<SelectionKey> it = selector.selectedKeys().iterator();
    // 有请求事件
    while (it.hasNext()) {
        // 获取准备“就绪”的 事件
        SelectionKey sk = it.next();
        // 判断具体是什么事件
        if (sk.isAcceptable()) {
            // 若“接收就绪”，获取客户端连接
            SocketChannel sChannel = ssChannel.accept();
            // 切换非阻塞模式
            sChannel.configureBlocking(false);
            // 将该通道注册到选择器上
            sChannel.register(selector, SelectionKey.OP_READ);
        } else if (sk.isReadable()) {
            // 获取当前选择器上“读就绪”状态的通道
            SocketChannel sChannel = (SocketChannel) sk.channel();
            // 读取数据
            ByteBuffer buf = ByteBuffer.allocate(1024);
            int len = 0;
            while ((len = sChannel.read(buf)) > 0) {
                buf.flip();
                System.out.println(new String(buf.array(), 0, len));
                buf.clear();
            }
        }
        // 使用完需要删除key，否则会一直存在selectedKeys中
        it.remove();
    }
}
```

客户端流程：

1. 获取通道

```java
SocketChannel sChannel = SocketChannel.open(new InetSocketAddress("127.0.0.1", 9999));
```

2. 切换非阻塞模式

```java
sChannel.configureBlocking(false);
```

3. 分配指定大小的缓冲区

```java
ByteBuffer buf = ByteBuffer.allocate(1024);
```

4. 发送数据给服务端

```java
Scanner scan = new Scanner(System.in);
while(scan.hasNext()){
    String str = scan.nextLine();
    buf.put(str.getBytes());
    buf.flip();
    sChannel.write(buf);
    buf.clear();
}
//关闭通道
sChannel.close();
```

为什么处理完就绪事件需要remove对应SelectionKey？

因为 select 在事件发生后，就会将相关的 key 放入 selectedKeys 集合，但不会在处理完后从 selectedKeys 集合中移除，需要我们自己编码删除。例如

- 第一次触发了 ssckey 上的 accept 事件，没有移除 ssckey
- 第二次触发了 sckey 上的 read 事件，但这时 selectedKeys 中还有上次的 ssckey ，在处理时因为没有真正的 serverSocket 连上了，就会导致ssckey空指针异常

### 处理 write 事件

非阻塞模式下，无法保证把 buffer 中所有数据可以一次性都写入 channel，因此需要追踪 write 方法的返回值（代表实际写入字节数）。

- 当消息处理器第一次写入消息时，才将 channel 注册到 selector 上
- selector 检查 channel 上的可写事件，如果服务端的所有的数据写完了，就取消 channel 的注册，避免占用不必要的内存。

服务端代码：

```java
public class WriteServer {

    public static void main(String[] args) throws IOException {
        ServerSocketChannel ssc = ServerSocketChannel.open();
        ssc.configureBlocking(false);
        ssc.bind(new InetSocketAddress(8080));

        Selector selector = Selector.open();
        ssc.register(selector, SelectionKey.OP_ACCEPT);

        while(true) {
            selector.select();

            Iterator<SelectionKey> iter = selector.selectedKeys().iterator();
            while (iter.hasNext()) {
                SelectionKey key = iter.next();
                iter.remove();
                if (key.isAcceptable()) {
                    SocketChannel sc = ssc.accept();
                    sc.configureBlocking(false);
                    SelectionKey sckey = sc.register(selector, SelectionKey.OP_READ);
                    // 1. 模拟向客户端发送内容
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < 3000000; i++) {
                        sb.append("a");
                    }
                    ByteBuffer buffer = Charset.defaultCharset().encode(sb.toString());
                    int write = sc.write(buffer);
                    // 3. write 表示实际写了多少字节
                    System.out.println("实际写入字节:" + write);
                    // 4. 如果有剩余未读字节，才需要关注写事件
                    if (buffer.hasRemaining()) {
                        // 在原有关注事件的基础上，再关注 写事件
                        sckey.interestOps(sckey.interestOps() + SelectionKey.OP_WRITE);
                        // 把 buffer 作为附件加入 sckey
                        sckey.attach(buffer);
                    }
                } else if (key.isWritable()) {
                    // 如果缓冲区有空间可进行写操作
                    ByteBuffer buffer = (ByteBuffer) key.attachment();
                    SocketChannel sc = (SocketChannel) key.channel();
                    int write = sc.write(buffer);
                    System.out.println("实际写入字节:" + write);
                    if (!buffer.hasRemaining()) {
                        // 如果写完了则不关注写事件了，并且把附件删除
                        key.interestOps(key.interestOps() - SelectionKey.OP_WRITE);
                        key.attach(null);
                    }
                }
            }
        }
    }
}
```

客户端代码：

```java
public class WriteClient {
    public static void main(String[] args) throws IOException {
        Selector selector = Selector.open();
        SocketChannel sc = SocketChannel.open();
        sc.configureBlocking(false);
        sc.register(selector, SelectionKey.OP_CONNECT + SelectionKey.OP_READ);
        sc.connect(new InetSocketAddress("localhost", 8080));
        int count = 0;
        while (true) {
            selector.select();
            Iterator<SelectionKey> iter = selector.selectedKeys().iterator();
            while (iter.hasNext()) {
                SelectionKey key = iter.next();
                iter.remove();
                if (key.isConnectable()) {
                    System.out.println(sc.finishConnect());
                } else if (key.isReadable()) {
                    // 如果可
                    ByteBuffer buffer = ByteBuffer.allocate(1024 * 1024);
                    count += sc.read(buffer);
                    buffer.clear();
                    System.out.println(count);
                }
            }
        }
    }
}
```





# Reactor

reactor跟nio的关系，reactor是基于nio的一个设计模式，让nio的各个事件（connect建立连接、read数据读取、write数据写回，业务处理）的处理更加明确，能有效利用系统多核资源；同时为提高事件处理的效率。而reactor是通过**事件驱动**来进行事件的分离处理。

**事件驱动**的核心是：当有事件准备就绪时，通知与此时间相关的线程进行处理；可以理解为发布订阅模式。

Reactor 模式由三大角色组成：

- **Reactor** 将I/O事件分派给Acceptor或者对应的Handler
- **Acceptor** 处理客户端新连接connect，并创建Handler并绑定对应请求
- **Handler** 执行非阻塞 读/写 任务

网络模型演化过程中，将建立连接、IO读写以及事件转发等操作分阶段处理，然后可以对不同阶段采用相应的优化策略来提高性能；也正是如此，Reactor 模型在不同阶段都有相关的优化策略，常见的有以下三种方式呈现：

- 单线程模型
- 多线程模型
- 主从多线程模型



## 单线程模型

![](NIO%20学习.assets/2024-01-25-15-25-22-image.png)

Reactor 的单线程模型结构，在 Reactor 单线程模型中，所有 I/O 操作（包括连接建立、数据读写、事件分发等）、业务处理，都是由一个线程完成的。

- 一个线程支持处理的连接数非常有限，CPU 很容易打满，性能方面有明显瓶颈；  

- 当多个事件被同时触发时，只要有一个事件没有处理完，其他后面的事件就无法执行，这就会造成消息积压及请求超时；  

- 线程在处理 I/O 事件时，Select 无法同时处理连接建立、事件分发等操作 

在单线程 Reactor 模式中，Reactor 和 Handler 都在同一条线程中执行。这样，带来了一个问题：当其中某个 Handler 阻塞时，会导致其他所有的 Handler 都得不到执行。

在这种场景下，被阻塞的 Handler 不仅仅负责输入和输出处理的传输处理器，还包括负责新连接监听的 Acceptor 处理器，可能导致服务器无响应。





## 多线程模型

![](NIO%20学习.assets/2024-01-25-15-38-46-image.png)

Reactor 多线程模型将 **业务逻辑** 交给多个线程进行处理。**当客户端有数据发送至服务端时，Select 会监听到可读事件，数据读取完毕后提交到业务线程池中并发处理**。

除此之外，多线程模型其他的操作与单线程模型是类似的，比如连接建立、IO事件读写以及事件分发等都是由一个线程来完成。

一般的请求中，耗时最长的一般是业务处理，所以用一个线程池（worker 线程池）来处理业务操作，在性能上的提升也是非常可观的。

当然，这种模型也有明显缺点，连接建立、IO事件读取以及事件分发完全有单线程处理；比如**当某个连接通过系统调用正在读取数据，其他事件是阻塞状态**，新连接无法处理、其他连接的IO查询/IO读写以及事件分发都无法完成。



## 主从Reactor模型

在多线程模型中，我们提到，其主要缺陷在于同一时间无法处理**大量新连接**、**IO就绪事件**；并且**通常客户端连接的建立是不频繁的，但是连接建立后数据的收发是频繁的**，所以如果能够将监听**READ**事件这个动作拆分出来，让多个子**Reactor**来监听**READ**事件，而原来的主**Reactor**只监听**ACCEPT**事件，那么整体的效率，会进一步提升

因此，将主从模式应用到这一块，就可以解决这个问题。

主从 Reactor 模式中，分为了主 Reactor 和 从 Reactor，分别处理 `新建立的连接`、`IO读写事件/事件分发`。

- 一来，主 Reactor 可以解决同一时间大量新连接，将其注册到从 Reactor 上进行IO事件监听处理
- 二来，使用线程池来监听IO事件并派发，充分利用多核 CPU 的特性，能使更多就绪的IO事件及时处理。

简言之，**主从多线程模型由多个 Reactor 线程组成，每个 Reactor 线程都有独立的 Selector 对象**。MainReactor 仅负责处理客户端连接的 Accept 事件，连接建立成功后将新创建的连接对象注册至 SubReactor。再由 SubReactor 分配线程池中的 I/O 线程与其连接绑定，它将负责连接生命周期内所有的 I/O 事件。

在海量客户端并发请求的场景下，主从多线程模式甚至可以适当增加 SubReactor 线程的数量，从而利用多核能力提升系统的吞吐量。
