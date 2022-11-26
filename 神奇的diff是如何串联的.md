# 流程是如何串联的？

## 模块区分

-   第一模块caserobot：负责流程规则的配置，根据规则匹配case，并将case存入es
-   第二模块casemotor：从es中获取对应流程和场景的case，然后根据case信息取出每个流程（list-ota-book-submit）的请求参数并发起基准与软路由的请求
-   第三模块casediff：负责将上一个模块中每个流程的基准与软路由的请求结果进行diff（调用jsondiff接口），然后将diff结果入库
-   第四模块casereport：负责获取diff结果以及一些case信息进行计算以及展示





## 第一模块caserobot

### 规则配置

在前端页面可以创建流程，一个流程下可以有多个场景，每个场景下都可以配置多个规则，以此来匹配每个场景的case。

![image-20221107193948454](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221107193948454.png)



普通配置：

-   维度名：一般是订单详情结果中的某个属性名 或者是 使用jsonpath语法来指定属性名，例如` $.priceDetail.priceDetails[0].ageType` 
-   维度标题：对维度名的解释
-   取值类型：与维度名搭配使用，是指维度名该如何取值。
    -   CONTANT：包含，目前是指整个订单详情结果的数据包含某个值
    -   MAP：键值对匹配，维度名为key，取值范围为value进行匹配
    -   JSONPATH：使用jsonpath语法去进行匹配
-   取值范围：根据取值
    -   取值范围格式：
        -   CONTANT类型支持：以","分割的字符串形式；
        -   JSONPATH和MAP类型支持：
            (1)字符串形式：a,b,c；
            (2)正则表达形式：REG#正则表达式；
            (3)匹配任意内容(字段名必须存在)：[ANY_MATCH]；
            (4)检查点的KEY在日志中不存在时：[NONE_KEY_MATCH]；
            (5)匹配任意不为空的内容：[NON_NULL_ANY_MATCH]；
            (6)可选值为null的内容：就写null(日志中必须打印出来"a":null)；
            (7)任意内容：*；
            (8)表达式录入方式：EXP#{}>5&&{}<10 EXP#{}==0 EXP#{}!=0；
            EXP#代表要使用表达式，不录入这个特殊标识，当正常值match；
            {}代表维度值是一个泛化的格式；
            {}>5&&{}<10 含义：维度值大于5和小于10可以match；



高级配置：

-   单条最大case数：相同条件的case最多录制几条
-   单次测试最大case数：单次测试任务，也就是对于所有的checklist，用于测试的总的case数量
-   接口通过率：diff成功的case数量与总case数量的比值。只有超过了配置的接口通过率才认为本次测试通过。
-   QPS：并发执行case的qps
-   日志查询范围：case捞取的时间范围，单位是**分钟**。例如：60，则以当前时间往前推60分钟以为的case才会捞取。
-   失败重试：调用jsondiff接口失败时进行重试，默认重试3次。



流程接口配置：

-   T值：指定哪个步骤
-   忽略节点：不diff此节点下的数据，格式为`root$@$data$@$profitPrices`
-   关心节点：只diff此节点下的数据，格式同上



### 维度支持叉乘成checklist

1.  维度配置：

    ![image-20221107195736181](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221107195736181.png)

2.  生成的checklist：

    ![image-20221107195804110](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221107195804110.png)



对应的表结构ER图：

![image-20221107200117705](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221107200117705.png)



### case匹配

监听qmq的payok消息，然后使用线程池异步的去处理这条消息。

-   根据订单号去订单快照中获取前置请求的日志记录列表，并封装成一个流程链。
-   去redis中获取所有的规则，遍历这些规则去匹配case。匹配的过程需要考虑 **流程的完整性 和 case的新鲜度**。
    -   Key是"流程名$$场景名"，Value是该场景下的CheckList的列表
-   如果case符合某个规则，会构建一个es日志对象并打印，供**LogStash**去进行收集，转换，然后存到ES当中。

```cmd
filter {
    if ("caserobot.log" in [source_path]){
        dissect{
            mapping => {
                "content" => "%{start}####%{orderNo}####%{processId}####%{sceneName}####%{currentTime}####%{caseData}####%{checkpoint}####%{checkpointId}####%{end}"
            }
        }
    
        mutate{
            remove_field => [
                "content",
                "start",
                "end"
            ]
        }
    }
}
```



![image-20221108174839247](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221108174839247.png)





## 第二模块casemotor

### 流程支持可配置

每个流程都需要可配置化，便于日后支持不同的业务（目前只支持机票主系统流程）

1.  每一个流程的**请求接口**&&**请求方式**

2.  每一个流程的请求参数（B参和C参）
    1.  可直接用case里的参数
    2.  case里的参数+前流程的返回结果中参数的替换
    3.  可添加**参数默认值**+前流程的返回结果中参数的替换
    4.  **前流程的返回结果中参数的替换**
    
    

![image-20221108175810939](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221108175810939.png)



### 触发检查

>   边流程串联边触发检查

1.  需要同时触发两个环境检查
    1.  软路由环境：支持前端传入软路由key请求软路由环境；
    2.  基准环境请求：根据模板配置的链路请求
2.  需要控制并发请求量：
    1.  执行case支持并发操作，并受配置的最大QPS数限制



### 流程串联具体实现

![image-20221107163057377](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221107163057377.png)

1.   获取case和流程串联配置：
     1.   根据用户填写的流程、场景去es获取case
     2.   获取**流程串联**配置：每一步的请求接口、请求方式以及默认请求参数
     3.   获取diff开关：流程diff以及前后diff
2.   流程串联
     1.   遍历流程串联配置，对每个流程的进行参数转换：
          1.   解析case中对应流程的请求参数（目前针对整个B参），如果B参为空，则使用qconfig中对应流程的 **对应的默认B参** 进行替换。
          2.   根据**上一个流程的配置和结果** 进行参数的转换。如果配置了指定流程的某些参数需要依赖上一个流程的结果的话，则会使用JsonPath获取配置中指定的参数值，然后赋值给请求参数对象
     2.   基准与软路由请求：拿着转换后参数发起基准和软路由请求
3.   异步调用diff：将请求的结果交给第三模块进行diff。如果某个阶段diff抛出异常了，则会调用diff的补偿接口，对数据进行补全，便于第四模块的展示。



## 第三模块casediff

### 流程diff

串联过程中，每一个流程请求完基准与软路由之后，都会调用流程diff接口：

`com.qunar.flight.userproduct.haders.linker.casediff.rpc.ProcessDiffService#saveProcessDiffRecord(ProcessDiffRecordDTO processDiffRecordDTO)` 

在此接口中会构建jsondiff接口请求参数，然后使用HttpClient请求得到diff结果，并将结果入库。（流程diff记录表）



### 前后diff

在一个case串联完整个流程之后，会将每个流程的请求参数，结果都传给前后diff接口：

`com.qunar.flight.userproduct.haders.linker.casediff.rpc.AroundDiffService#doAroundDiff(AroundDiffInfo aroundDiffInfo)` 

此接口会进行以下操作：

-   解析QConfig中前后diff配置，然后根据解析出来的配置 以及 第二模块传递过来的数据 解析得到需要前后diff的内容
-   构建jsondiff接口请求参数，然后使用HttpClient请求得到diff结果，并将结果入库。（前后diff记录表）



![image-20221108192329779](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221108192329779.png)





### 前后diff的QConfig配置

![image-20221108193911828](/Users/jianhang/Documents/learing/神奇的diff是如何串联的.assets/image-20221108193911828.png)



