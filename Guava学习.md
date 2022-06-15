Guava学习
=========

**Guava**是由Google开发的基于Java的开源库，包含许多Google核心库，它有助于最佳编码实践，并有助于减少编码错误。它为[集合](https://so.csdn.net/so/search?q=集合&spm=1001.2101.3001.7020)[collections]、缓存[caching]、原生类型支持[primitives support]、并发库[concurrency libraries]、通用注解[common annotations]、字符串处理[string processing]、I/O等等提供实用程序方法。

引入Guava
---------

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>25.1-jre</version>
</dependency>
```



Utilites
--------

### Joiner连接器

joiner可以将一个数组中的元素按照某个指定的符号拼接在一起形成字符串。

```java
private final List<String> list1 = Arrays.asList("Google", "java", "guava");
private final List<String> list2 = Arrays.asList("python", "c", null);


@Test
public void testJoin(){
    String join = Joiner.on("#").join(list1);
    System.out.println(join);
}
```

如果数组中有null，则可以选择忽略或者采用默认值进行拼接。

```java
@Test
public void testJoinWithNull(){
    String join = Joiner.on("#").skipNulls().join(list2);
    System.out.println(join);
    String aaa = Joiner.on("#").useForNull("aaa").join(list2);
    System.out.println(aaa);
}
```

常用方法如下：

- on(String)：静态工厂方法，生成一个新的 Joiner 对象，参数为连接符
- skipNulls()：如果元素为空，则跳过
- useForNull(String)：如果元素为空，则用这个字符串代替
- join(T)：要连接的数组/链表
- withKeyValueSeparator(String)：得到MapJoiner，先根据指定符号连接Map的键、值，然后在根据on中的指定符号拼接。
- appendTo(T, Colletion)：在第一个参数后面新加上由Colletion拼接后的字符串。
  - 此方法可以将拼接后的字符写入文件：`Joiner.on("#").appendTo(writer, list1)` 



### Splitter拆分器

|      |      |      |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |
|      |      |      |





Optional类
----------

Optional用于包含**非空对象**的**不可变**对象。 Optional对象，用于不存在值表示null。这个类有各种实用的方法，以方便代码来处理为可用或不可用，而不是检查null值