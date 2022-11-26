# 一、编程规约

## (一) 命名风格

POJO 类中的任何**布尔类型**的变量，都不要加 is 前缀，否则部分框架解析会引起序列化错误。

- 定义为布尔类型 Boolean isDeleted 的字段，它的 getter 方法也是 isDeleted()，部分框架在序列化与反序列化时，会“误以为”对应的字段名称是 deleted，导致字段获取不到，得到意料之外的结果或抛出异常。

所有的POJO类属性必须使用包装数据类型。所有RPC方法的返回值和参数必须使用包装数据类型。所有的局部变量使用基本数据类型。

- boolean类型的默认值为false；而Boolean类型的默认值是null

如果模块、接口、类、方法使用了设计模式，在命名时要体现出具体模式。

- 将设计模式体现在名字中，有利于阅读者快速理解架构设计思想。

各层命名规约： 

A）Service / DAO 层方法命名规约： 

1）获取单个对象的方法用 get 做前缀。

2）获取多个对象的方法用 list 做前缀，复数结尾，如：listObjects

3）获取统计值的方法用 count 做前缀。 

4）插入的方法用 save / insert 做前缀。

5）删除的方法用 remove / delete 做前缀。 

6）修改的方法用 update 做前缀。 

B）领域模型命名规约： 

1）数据对象：xxxDO，xxx 即为数据表名。例如DAO跟service交互时传输的对象

2）数据传输对象：xxxDTO，xxx 为业务领域相关的名称。例如service跟Controller交互时传输的对象。

3）展示对象：xxxVO，xxx 一般为网页名称。例如Controller跟前端交互的对象。

4）业务对象：xxxBO，封装业务逻辑的对象，一般由多个DTO组成然后与DAO交互。

5）POJO 是 DO / DTO / BO / VO 的统称，禁止命名成 xxxPOJO。 



## (二) 常量定义

long 或 Long 赋值时，数值后使用大写 L，不能是小写 l，小写容易跟数字混淆，造成误解。浮点数类型的数值后缀统一为大写的 D 或 F。

使用常量类维护常量，但不要使用一个常量类维护所有常量，要按常量功能进行归类，分开维护。例如缓存相关常量放在类 CacheConsts 下；系统配置相关常量放在类 SystemConfigConsts 下

常量的复用层次有五层：跨应用共享常量、应用内共享常量、子工程内共享常量、包内共享常量、类内共享常量。

1）跨应用共享常量：放置在二方库中，通常是 client.jar 中的 constant 目录下。

2）应用内共享常量：放置在一方库中，通常是子模块中的 constant 目录下。

3）子工程内部共享常量：即在当前子工程的 constant 目录下。

4）包内共享常量：即在当前包下单独的 constant 目录下。

5）类内共享常量：直接在类内部 private static final 定义



## (三) 代码格式

if后如果还有 else 等代码则 else 不换行；表示终止的右大括号后必须换行。

if / for / while / switch / do 等保留字与左右括号之间都必须加空格。

任何二目、三目运算符的左右两边都需要加一个空格。

注释的双斜线与注释内容之间有且仅有一个空格。

在进行类型强制转换时，右括号与强制转换值之间不需要任何空格隔开。

单行字符数限制不超过 120 个，超出需要换行，换行时遵循如下原则： 

1）第二行相对第一行缩进 4 个空格，从第三行开始，不再继续缩进，参考示例。 

2）运算符与下文一起换行。

3）方法调用的点符号与下文一起换行。 

4）方法调用中的多个参数需要换行时，在逗号后进行。

```java
StringBuilder builder = new StringBuilder();
// 超过 120 个字符的情况下，换行缩进 4 个空格，并且方法前的点号一起换行
builder.append("yang").append("hao")
	.append("chen")
	.append("chen")
	.append("chen");
```

不同逻辑、不同语义、不同业务的代码之间插入一个空行，分隔开来以提升可读性.



## (四) OOP 规约

> 方法签名=方法名+参数列表

避免通过一个类的对象引用访问此类的静态变量或静态方法，无谓增加编译器解析成本，直接用类名来访问即可。

Object 的 equals 方法容易抛空指针异常，推荐使用 JDK7 引入的工具类 java.util.Objects#equals(Object a, Object b)

所有**整型包装类**对象之间值的比较，全部使用 equals 方法比较。

- 对于 Integer 在 -128 至 127 之间的赋值，Integer 对象是在 IntegerCache.cache 产生，会复用已有对象，这个区间内的 Integer 值可以直接使用 == 进行判断，但是这个区间之外的所有数据，都会在堆上产生，并不会复用已有对象，这是一个大坑，推荐使用 equals 方法进行判断。

任何货币金额，均以最小货币单位且为整型类型进行存储。也就是说，金额乘以100后再存储，取出来之后再除以100得到结果。

浮点数之间的等值判断，基本数据类型不能使用 == 进行比较，而是通过相减之后与1e-6F比较是否小于；包装数据类型不能使用 equals进行判断。

禁止使用构造方法 BigDecimal(double) 的方式把 double 值转化为 BigDecimal 对象。而是使用BigDecimal(String) 的方式

关于基本数据类型与包装数据类型的使用标准如下： 

1）【强制】所有的 POJO 类属性必须使用包装数据类型。 

2）【强制】RPC 方法的返回值和参数必须使用包装数据类型。 

3）【推荐】所有的局部变量使用基本数据类型。

定义 DO / PO / DTO / VO 等 POJO 类时，不要设定任何属性默认值。

构造方法里面禁止加入任何业务逻辑，如果有初始化逻辑，请放在 init 方法中。

POJO 类必须写 toString 方法。使用 IDE 中的工具 source > generate toString 时，如果继承了另一个 POJO 类，注意在前面加一下 super.toString()。

- 在方法执行抛出异常时，可以直接调用 POJO 的 toString() 方法打印其属性值，便于排查问题。

禁止在 POJO 类中，同时存在对应属性 xxx 的 isXxx() 和 getXxx() 方法。

- 框架在调用属性 xxx 的提取方法时，并不能确定哪个方法一定是被优先调用到，神坑之一

避免上下文重复使用一个变量，使用 final 可以强制重新定义一个变量，方便更好地进行重构

-   大家在写代码的时候，为变量命名（尤其是临时变量）是一件很烧脑的事情，所以大家会偷懒重复使用变量名，但重复使用变量名在代码修改、代码重构时，因为修改的不彻底很容易出错，并且这类bug还很难测试出来，所以应该避免上下文重复使用一个变更，所以这种情况应该使用final关键字。

慎用 Object 的 clone 方法来拷贝对象，因为对象 clone 方法默认是浅拷贝。若想实现深拷贝需覆写 clone 方法实现域对象的深度遍历式拷贝



类成员与方法访问控制从严：

-   如果不允许外部直接通过 new 来创建对象，那么构造方法必须是 private。 
-   工具类不允许有 public 或 default 构造方法。
-   类非 static 成员变量并且与子类共享，必须是 protected。 
-   类非 static 成员变量并且仅在本类使用，必须是 private。 
-   类 static 成员变量如果仅在本类使用，必须是 private。 
-   若是 static 成员变量，考虑是否为 final。
-   类成员方法只供类内部调用，必须是 private。 
-   类成员方法只对继承类公开，那么限制为 protected。





## 日期时间

不允许在程序任何地方中使用：1）java.sql.Date 2）java.sql.Time 3）java.sql.Timestamp。

-   第 1 个不记录时间，getHours()抛出异常；第 2 个不记录日期，getYear()抛出异常；第 3 个在构造方法 super((time/1000)*1000)，fastTime 和 nanos 分开存储秒和纳秒信息。

不要在程序中写死一年为 365 天，避免在公历闰年时出现日期转换错误或程序逻辑错误。例：

```java
// 获取今年的天数
int daysOfThisYear = LocalDate.now().lengthOfYear();

// 获取指定某年的天数
int days = LocalDate.of(2011, 1, 1).lengthOfYear();
```



## 集合处理

关于 hashCode 和 equals 的处理，遵循如下规则：

1.   只要重写 equals，就必须重写 hashCode。 因为 Set 存储的是不重复的对象，依据 hashCode 和 equals 进行判断，所以 Set 存储的对象必须重写这两个方法。
2.   如果自定义对象作为 Map 的键，那么必须覆写 hashCode 和 equals。String 因为重写了 hashCode 和 equals 方法，所以我们可以愉快地使用 String 对象作为 key 来使用



在使用 java.util.stream.Collectors 类的 toMap()方法转为 Map 集合时，一定要使用含有参数类型为 BinaryOperator，参数名为 mergeFunction 的方法，否则当出现相同 key值时会抛出 IllegalStateException 异常。

-   参数 mergeFunction 的作用是当出现 key 重复时，自定义对 value 的处理策略。

正例：

```java
List<Pair<String, Double>> pairArrayList = new ArrayList<>(3);

pairArrayList.add(new Pair<>("version", 6.19));
pairArrayList.add(new Pair<>("version", 10.24));
pairArrayList.add(new Pair<>("version", 13.14));
Map<String, Double> map = pairArrayList.stream().collect(

// 生成的 map 集合中只有一个键值对：{version=13.14}
Collectors.toMap(Pair::getKey, Pair::getValue, (v1, v2) -> v2));
```

在使用 java.util.stream.Collectors 类的 toMap()方法转为 Map 集合时，一定要注意当 value 为 null 时会抛 NPE 异常。此时需要先对value进行过滤。



ArrayList 的 subList 结果不可强转成 ArrayList，否则会抛出 ClassCastException 异 常：java.util.RandomAccessSubList cannot be cast to java.util.ArrayList。

-   subList 返回的是 ArrayList 的内部类 SubList，并不是 ArrayList 而是 ArrayList 的一个视图，对于 SubList 子列表的所有操作最终会反映到原列表上。



使用 Map 的方法 keySet()/values()/entrySet()返回集合对象时，不可以对其进行添加元素操作，否则会抛出 UnsupportedOperationException 异常

Collections 类返回的对象，如：emptyList()/singletonList()等都是 immutable list，不可对其进行添加或者删除元素的操作。否则出现 UnsupportedOperationException 异常

使用集合转数组的方法，必须使用集合的 toArray(T[] array)，传入的是类型完全一致、长度为 0 的空数组。因为直接使用 toArray 无参方法存在问题，此方法返回值只能是 Object[]类，若强转其它类型数组将出现ClassCastException 错误

```java
List<String> list = new ArrayList<>(2);
list.add("guan");
list.add("bao");
String[] array = list.toArray(new String[0]);
```

说明：

-   使用 toArray 带参方法，数组空间大小的 length， 等于 0，动态创建与 size 相同的数组，性能最好。

-   大于 0 但小于 size，重新创建大小等于 size 的数组，增加 GC 负担。
-   等于 size，在高并发情况下，数组创建完成之后，size 正在变大的情况下，也会增加GC负担
-   大于 size，空间浪费，且在 size 处插入 null 值，存在 NPE 隐患

在使用 Collection 接口任何实现类的 addAll()方法时，都要对输入的集合参数进行NPE 判断

使用工具类 Arrays.asList()把数组转换成集合时，不能使用其修改集合相关的方法，它的 add/remove/clear 方法会抛出 UnsupportedOperationException 异常。因为得到的List也是视图。



泛型通配符<? extends T>来接收返回的数据，此写法的泛型集合不能使用 add 方法，。而<? super T>不能使用 get 方法，两者在接口调用赋值的场景中容易出错。

-   扩展说一下 PECS(Producer Extends Consumer Super)原则：第一、频繁往外读取内容的，适合用<? extends T>。第二、经常往里插入的，适合用<? super T>



不要在 foreach 循环里进行元素的 remove/add 操作。remove 元素请使用 Iterator方式，如果并发操作，需要对 Iterator 对象加锁。

![image-20221120121253856](/Users/jianhang/Documents/learing/阿里java开发手册-阅读心得.assets/image-20221120121253856.png)



## 并发处理

获取单例对象需要保证线程安全，其中的方法也要保证线程安全。

创建线程或线程池时请指定有意义的线程名称，方便出错时回溯。

线程资源必须通过线程池提供，不允许在应用中自行显式创建线程。

线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。

必须回收自定义的 ThreadLocal 变量，尤其在线程池场景下，线程经常会被复用，如果不清理自定义的 ThreadLocal 变量，可能会影响后续业务逻辑和造成内存泄露等问题。尽量在代理中使用 try-finally 块进行回收。

高并发时，同步调用应该去考量锁的性能损耗。能用无锁数据结构，就不要用锁；能锁区块，就不要锁整个方法体；能用对象锁，就不要用类锁。

-   尽可能使加锁的代码块工作量尽可能的小，避免在锁代码块中调用 RPC 方法。



对多个资源、数据库表、对象同时加锁时，需要保持一致的加锁顺序，否则可能会造成死锁。

在使用阻塞等待获取锁的方式中，必须在 try 代码块之外，并且在加锁方法与 try 代码块之间没有任何可能抛出异常的方法调用，避免加锁成功后，在 finally 中无法解锁。

说明一：如果在 lock 方法与 try 代码块之间的方法调用抛出异常，那么无法解锁，造成其它线程无法成功

获取锁。

说明二：如果 lock 方法在 try 代码块之内，可能由于其它方法抛出异常，导致在 finally 代码块中，unlock对未加锁的对象解锁，它会调用 AQS 的 tryRelease 方法（取决于具体实现类），抛出IllegalMonitorStateException 异常。

说明三：在 Lock 对象的 lock 方法实现中可能抛出 unchecked 异常，产生的后果与说明二相同。

```java
Lock lock = new XxxLock();
// ...
lock.lock();
try {
 doSomething();
 doOthers();
} finally {
 lock.unlock();
}
```



并发修改同一记录时，避免更新丢失，需要加锁。要么在应用层加锁，要么在缓存加锁，要么在数据库层使用乐观锁，使用 version 作为更新依据

-   如果每次访问冲突概率小于 20%，推荐使用乐观锁，否则使用悲观锁。乐观锁的重试次数不得小于3 次

资金相关的金融敏感信息，使用悲观锁策略。

-   乐观锁在获得锁的同时已经完成了更新操作，校验逻辑容易出现漏洞，另外，乐观锁对冲突的解决策略有较复杂的要求，处理不当容易造成系统压力或数据异常，所以资金相关的金融敏感信息不建议使用乐观锁更新。
-   悲观锁遵循一锁二判三更新四释放的原则



避免 Random 实例被多线程使用，虽然共享该实例是线程安全的，但会因竞争同一 seed导致的性能下降。

-   Random 实例包括 java.util.Random 的实例或者 Math.random()的方式。

-   在 JDK7 之后，可以直接使用 API ThreadLocalRandom，而在 JDK7 之前，需要编码保证每个线程持有一个单独的 Random 实例。



ThreadLocal 对象使用 static 修饰。因为这个变量是针对一个线程内所有操作共享的，所以设置为静态变量，避免重复的创建，造成内存的浪费。





## (八) 控制语句

当 switch 括号内的变量类型为 String 并且此变量为外部参数时，必须先进行 null判断.

```java
public class SwitchString {
    public static void main(String[] args) {
        method(null);
    }
    public static void method(String param) {
        switch (param) {
                // 肯定不是进入这里
            case "sth":
                System.out.println("it's sth");
                break;
                // 也不是进入这里
            case "null":
                System.out.println("it's null");
                break;
                // 也不是进入这里
            default:
                System.out.println("default");
        }
    } 
}
```

在高并发场景中，避免使用”等于”判断作为中断或退出的条件。

-   如果并发控制没有处理好，容易产生等值判断被“击穿”的情况，使用大于或小于的区间判断条件来代替。例如，当商品数量小于等于0时应该停止售卖。

循环体中的语句要考量性能，以下操作尽量移至循环体外处理，如定义对象、变量、获取数据库连接，进行不必要的 try-catch 操作（这个 try-catch 是否可以移至循环体外）。

下列情形，不需要进行参数校验： 

1.   极有可能被循环调用的方法。但在方法说明里必须注明外部参数检查。
2.   底层调用频度比较高的方法。毕竟是像纯净水过滤的最后一道，参数错误不太可能到底层才会暴露问题。一般 DAO 层与 Service 层都在同一个应用中，部署在同一台服务器中，所以 DAO 的参数校验，可以省略。
3.   被声明成 private 只会被自己代码所调用的方法，如果能够确定调用方法的代码传入参数已经做过检查或者肯定不会有问题，此时可以不校验参数。



## 其他

避免用 Apache Beanutils 进行属性的 copy。

-   Apache BeanUtils 性能较差，可以使用其他方案比如 Spring BeanUtils, Cglib BeanCopier，注意均是**浅拷贝**。

在调用 RPC、二方包、或动态生成类的相关方法时，捕捉异常必须使用 Throwable类来进行拦截。

防止 NPE，是程序员的基本修养，注意 NPE 产生的场景(可使用 JDK8 的 Optional 类来防止 NPE 问题)：

1.   返回类型为基本数据类型，return 包装数据类型的对象时，自动拆箱有可能产生 NPE。` public int f() { return Integer 对象}`
2.   数据库的查询结果可能为 null。 
3.   集合里的元素即使 isNotEmpty，取出的数据元素也可能为 null。 
4.   远程调用返回对象时，一律要求进行空指针判断，防止 NPE。 
5.   对于 Session 中获取的数据，建议进行 NPE 检查，避免空指针。
6.   级联调用 obj.getA().getB().getC()；一连串调用，易产生 NPE。

定义时区分 unchecked / checked 异常，避免直接抛出 new RuntimeException()，更不允许抛出 Exception 或者 Throwable，应使用有业务含义的自定义异常。推荐业界已定义过的自定义异常，如：DAOException / ServiceException 等
