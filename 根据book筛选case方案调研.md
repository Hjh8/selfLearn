## 重推报价逻辑

重推流程是异步的，后续勾选乘机人是从缓存里拿数据计算。大致步骤如下：

- 选择乘机人->网关passenger_change接口->返回->返回给前端
- 依赖redis缓存，redis缓存是booking阶段存进去的。然后submit时候会带上可以表示重推报价的字段。

重推报价的识别：

- 通过submit的入参bookingThroughParam下的multiTagReSearch，该值为2表示重推报价
- 重推报价只能在submit的kfk消息判断

## 如何存储特殊场景及支持可扩展

规定一个特殊流程，里面专门存储特殊场景的配置，如配置重推报价：

![image-20221212101719117](/Users/jianhang/Documents/learing/selfLearn/根据book筛选case方案调研.assets/image-20221212101719117.png)

需要注意的是，此时配置的规则仍然是针对于订单详情数据的。(后期可改成针对指定T值的返回结果进行规则匹配)

## 如何捞case-监听custom_f_flight_server_log的kfk消息

新建一个类实现AsyncServerLogParser，重写parser方法。

在parser方法里对submit的入参进行重推报价过滤：

- 通过submit的入参bookingThroughParam下的multiTagReSearch，该值为2表示重推报价

满足重推报价条件之后进行场景处理，规则匹配。

## 如何存入es？

根据订单号往前捞serverLog。可以直接复用现有处理qmq消息的功能。

在存入的时候加一个字段标识该case属于普通场景还是特殊场景，如果是特殊场景是哪个特殊场景。

首先定义一个枚举类：（此枚举类可以做成配置类）

| sceneType  | sceneName |
| ---------- | --------- |
| NOMAL      | 普通场景      |
| RE_BOOKING | 重推报价      |

存入es的时候带上枚举类的sceneType

```json
{
    "scene_type": "NOMAL"
}
```

## 怎么跑重推报价的case？

取case：需要选择特殊流程中重推报价场景，此时会根据枚举类找到scene_type等于RE_BOOKING，然后带着scene_type去es查询case。

重推报价串流程步骤：进入booking页的时候需要调用乘机人变更接口（t值：f_flight_passenger_changes）如果结果符合重推报价，则从结果中拿到bookingParamKey等相关信息重新请求booking。如果不符合则正常进入submit。

在执行case的时候会遍历枚举类看此次执行的场景是否属于特殊场景，如果是的话就执行特殊操作。
