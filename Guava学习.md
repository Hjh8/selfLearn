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

| 方法                              | 描述                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| **Splitter.on(char)**             | 按单个字符拆分                                               |
| **Splitter.on(CharMatcher)**      | 按字符匹配器拆分                                             |
| **Splitter.on(String)**           | 按字符串拆分                                                 |
| **Splitter.on(Pattern)**          | 按正则表达式拆分                                             |
| **Splitter.onPattern(String)**    | 按正则表达式拆分                                             |
| **Splitter.fixedLength(int)**     | 按固定长度拆分；最后一段可能比给定长度短，但不会为空。       |
| **omitEmptyStrings()**            | 从结果中自动忽略空字符串                                     |
| **trimResults()**                 | 移除结果字符串的前导空白和尾部空白                           |
| **trimResults(CharMatcher)**      | 给定匹配器，移除结果字符串的前导匹配字符和尾部匹配字符       |
| **limit(int)**                    | 限制拆分出的字符串的数量，即只会拆分成int个字符串            |
| **withKeyValueSeparator(String)** | 得到 **MapSplitter**，拆分成Map的键、值。 注意，这个对被拆分字符串格式有严格要求，否则会抛出异常 |
| **splitToList(String)**           | 对字符串拆分后形成List                                       |



### Strings字符串处理

| 方法                                                     | 描述                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| **nullToEmpty(String s)**                                | 如果s为null则转为空字符串                                    |
| **emptyToNull(String s)**                                | 如果s为空字符串则转为null                                    |
| **isNullOrEmpty(String string)**                         | 判断字符串为null或空字符串                                   |
| **padStart(String string, int minLength, char padChar)** | 如果string的长度小于minLength，在string前添加padChar，直到字符串长度为minLeng |
| **padEnd(String string, int minLength, char padChar)**   | 和padStart类似，不过是在尾部添加新字符串                     |
| **repeat(String s, int count)**                          | 将s重复拼接count次                                           |
| **commonPrefix(CharSequence a, CharSequence b)**         | 返回共同的前缀                                               |
| **commonSuffix(CharSequence a, CharSequence b)**         | 返回共同的后缀                                               |
| **lenientFormat(String template,Object… args)**          |                                                              |

```java
@Test
public void StringsTest(){
    System.out.println(Strings.emptyToNull("pp"));
}
```



Optional
----------

Optional用于包含**非空对象**的**不可变**对象。 Optional对象，用不存在值表示null。这个类有各种实用的方法，以方便代码来处理为可用或不可用，而不是检查null值。

创建Optional实例：

| 方法                         | 描述                                               |
| ---------------------------- | -------------------------------------------------- |
| **Optional.of(T)**           | 创建指定引用的Optional实例，若引用为null则快速失败 |
| **Optional.fromNullable(T)** | 创建指定引用的Optional实例，若引用为null则表示缺失 |
| **Optional.absent()**        | 创建引用缺失的Optional实例                         |

Optional实例查询引用：

| 方法                    | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| **boolean isPresent()** | 如果Optional包含非null的引用（引用存在），返回true           |
| **T get()**             | 返回Optional所包含的引用，若引用缺失，则抛出异常             |
| **T or(T)**             | 返回Optional所包含的引用，若引用缺失，返回指定的值           |
| **T orNull()**          | 返回Optional所包含的引用，若引用缺失，返回null               |
| **Set asSet()**         | 返回Optional所包含引用的单例不可变集。 如果引用存在，返回一个只有单一元素的集合，如果引用缺失，返回一个空集合。 |

```java
@Test
public void OptionalTest(){
    Integer a = null;
    Optional<Integer> of = Optional.fromNullable(a);
    System.out.println(of.or(0));
}
```



Objects
-------

`Objects.equal(a, b)`：当一个对象中的字段可以为null时，实现 **Object.equals** 会很痛苦，因为不得不分别对它们进行null检查。使用 **Objects.equal** 帮助你执行null敏感的equals判断，从而避免抛出NullPointerException。



Collections
-----------

### Lists

Lists是Guava Collections中提供的用于处理List实例的实用类，翻开源代码，我们看到，其内部使用了静态工厂方法代替构造器，提供了许多用于List子类构造和操作的静态方法：

| 方法                                               | 描述                                              |
| -------------------------------------------------- | ------------------------------------------------- |
| **newArrayList()**                                 | 构造一个可变的、空的ArrayList实例                 |
| **newArrayList(E… elements)**                      | 构造一个可变的包含传入元素elements的ArrayList实例 |
| **newLinkedList()**                                | 构造一个空的LinkedList实例                        |
| **newCopyOnWriteArrayList()**                      | 构造一个空的CopyOnWriteArrayList实例              |
| **newArrayListWithCapacity(int initialArraySize)** | 构造一个分配 指定空间大小的ArrayList实例          |

**Lists** 为List类型的对象提供了若干工具方法：

| 方法                               | 描述                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| **reverse(List list)**             | 返回一个传入List内元素倒序后的List                           |
| **asList(E first, E[] rest)**      | 返回一个不可变的List                                         |
| **partition(List list, int size)** | 形成二维List，每个维度的List长度为size                       |
| **charactersOf(String string)**    | 将传进来的String分割为单个的字符，并存入到一个新的List对象中返回 |
| **transform(list, function)**      | 返回一个经过function处理后的List                             |

