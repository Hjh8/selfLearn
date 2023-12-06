# 什么是 Kafka



kafka是一个分布式的基于发布/订阅模式的消息队列，主要用于大数据的实时收集。目前kafka也用于分布式事件流的处理和分析。主要特点是高吞吐量，低延迟。

- 发布订阅指的是只有订阅了topic的消费者才能收到此topic的消息。

缺点:

- 运维难度大
- 偶尔有数据混乱的情况 ​
- 2.8之前对zookeeper强依赖



# 基本概念

![](/Users/jianhang/Library/Application%20Support/marktext/images/2023-12-02-12-27-46-image.png)

- Broker : 和AMQP里协议的概念一样， 就是消息中间件所在的服务器
- Producer(生产者): 负责发布消息到Kafka broker
- Consumer: 消息消费者，向Kafka broker读取消息的客户端。
- Consumer Group（消费者群组） : 每个Consumer属于一个特定的Consumer Group（可为每个Consumer指定group name，若不指定group name则属于默认的group）
- Topic(主题) : 每条发布到Kafka集群的消息都有一个类别，这个类别被称为Topic。
- Partition(分区) : Partition是物理上的概念，体现在磁盘上面，每个Topic包含一个或多个Partition。
- replica(副本)：分区的备份数据，每个分区可以有多个副本，其中必然有一个副本做为leader跟生产者/消费者通信，其他副本作为follower。当leader挂掉之后follower可以成为leader。每个副本存在于不同的Broker中。
- offset 偏移量： kafka用来确定消息是否被消费过的标识，在kafka内部体现就是一个递增的数字

一个topic的消息会发在多个part上吗？不会。

一个broker可以存放相同topic不同part的leader吗。可以，但不建议


