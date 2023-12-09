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
- offset 偏移量： kafka用来确定消息是否被消费过的标识，在kafka内部体现就是一个递增的数字。

一个topic的消息会发在多个part上吗？不会。只会发给一个topic下的某个part上。可以理解为topic-part才作为一个消息存放的区域。

一个broker可以存放相同topic不同part的leader吗。可以，但不建议

# 生产者



# 消费者

消费者在消费的时候，需要指定主题，还可以指定消费的起始偏移量的指定策略。消费者只会负责自己所负责的主题下的partition，例如topicA-0，topicB-1等。

起始偏移量的指定策略有以下 3 种：

1. earliest：让偏移量等于最小

2. latest：让偏移量等于最大

3. 自定义offset：自定义分区号和偏移量

4. 从上一次所记录的偏移量开始消费

kafka 的 topic 中的消息，是有序号的（消息偏移量），而且消息的偏移量是在各个 partition 中独立维护的，在各个分区内，都是从 0 开始递增编号。

kafka 的消费者，可以记录自己所消费到的消息偏移量，记录的这个偏移量就叫（消费位移）；

记录这个消费到的位置，作用就在于消费者重启后可以接续上一次消费到位置来继续往后面消费；

消费位移，是组内共享的！！！

## 消费组

**消费组是 kafka 为了提高消费并行度的一种机制**！在 kafka 的底层逻辑中，任何一个消费者都有自己所属的组（如果没有指定则有一个自己默认的组），每条消息只会被组内的某个消费者，组跟组之间没有关系，即A组的某个消费者消费了C消息，B组也会收到这个C消息然后交由B组内的某个消费者消费。因为消费者只会负责自己所负责的主题下的partition。

KAFKA 中的消费组，可以**动态增减消费者**，当消费组中的消费者数量发生任意变动时会根据**再均衡策略**重新分配每个消费者的消费分区。



消费者组再均衡流程
