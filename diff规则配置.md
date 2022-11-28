t值：标识页面，唯一url

c参：通用参数

b参：业务参数



# diff规则

- 是否开启流程diff：`able-flow-diff=true` 
- 是否开启前后diff：`able-around-diff=true` 

- diff参数和结果
  - `diff-params-result=方法1.参数1.属性=方法2.属性名,方法1@参数1.属性名$方法2.属性名` 
    - 不写属性名则表示整个参数或结果都参与diff


> diff应该支持 一方包含着另一方的情况，例如{a: {b: 1}} 跟 b:1做diff



```json
{
  "应用名1": {
    "able_process_diff": true,
    "able_around_diff": true,
    "procedures": [
      {
        "before_procedure": {
          "name": "流程名1",
          "result": "参数1"
        },
        "after_procedure": {
          "name": "流程名2",
          "param": "参数2.属性2"
        }
      },
      {
        "before_procedure": {
          "name": "流程名3",
          "param": "参数3"
        },
        "after_procedure": {
          "name": "流程名4",
          "param": "参数4"
        }
      }
    ]
  },
  "应用名2": {
    
  }
}
```







# 根据不同维度入库

- diff表：PMO、应用、触发时间、场景id，caseid，执行状态，diff方式
- diff-detail表：case_code，流程，diff结果，详情url
- 常规字段：create_time，update_time，is_del

```
应用-场景 1-多
场景-case 多-多
```

> 比较的参数名，参数值，结果





# 流程配置模型

```java
List<proceduce> beforeProduce;
List<proceduce> afterProduce;

public class proceduce{
  String name; // 流程名
  String type; // 要diff的类型，params或者result
  String comparison; // 要diff的参数名或结果
}

if(type == "params"){
  1. 根据name去串联传递过来的数据中获取对应的流程的所有参数；
  2. 解析comparison，得到具体参数的值
}
else if(type == "result"){
	1. 根据name去串联传递过来的数据中获取对应的结果
  2. 解析comparison，得到具体结果的值
}
```







# 思考

什么时候会出现解析错误？

1. diff参数的数量不配对。
2. 配置文件中指定的diff参数不存在





# 忽略节点

```java
root$@$data$@$allFilters$@$detail$@$selapsedMillis,root$@$data$@$allFilters$@$detail$@$endTime
```





# 监听AppCode有提测等动作时进行diff

1.   参考wiki：https://wiki.corp.qunar.com/confluence/pages/viewpage.action?pageId=214817656

     

     灭霸代码逻辑：

     1、在pmo状态改变时，会发生qmq消息：`@QmqConsumer(prefix = "qunar.cm.ic.issue-update", consumerGroup = "f_inter_autotest_dispatch")`

     **【注意】wiki中的prefix是[qunar.cm](http://qunar.cm/).ic.issue-updated，\**updated\**有d，而灭霸是\**update，\**没有d。并且灭霸在代码中排除了带d的情况。这是为什么？**

     2、监听到消息之后获取消息体里面的url获取对应的pmo信息，然后开始进行处理。

     -   url返回结果参考：http://ic.corp.qunar.com/api/v2/event/80081917

     

     在灭霸基础上我们可以进行：

     1.  根据上述url获取到pmo，我们参考 [diff项目实现自动部署方案](https://wiki.corp.qunar.com/confluence/pages/viewpage.action?pageId=636826383)，根据pmo拿到需要的信息，如appcode以及对应的环境。
     2.  使用qconfig配置需要监听的appcode
     3.  根据qconfig和第一步获取的appcode进行判断，如果需要监听则发起diff。

     ## 问题

     1.  pmo状态为什么时才进行diff？pmo各状态参考：http://pmo.corp.qunar.com/rest/api/2/status/



 





