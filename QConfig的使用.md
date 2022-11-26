> QConfig的官方wiki链接：https://wiki.corp.qunar.com/confluence/pages/viewpage.action?pageId=63243290
>
> 管理后台地址：[http://qconfig.corp.qunar.com](http://qconfig.corp.qunar.com/)



# 1.QConfig介绍

QConfig作为配置中心可以解决什么问题？

1. 将配置和代码相分离。将配置和代码相分离，集中管理所有的配置。配置中心会根据不同的环境下发不同的配置，配合最新的发布系统(QDR)，我们可以实现打包一次部署到任意环境，不仅可以节约发布时间，更可以让流程更顺畅(经过测试的war包部署到线上)。
2. 监控配置文件的发布流程。将配置文件的修改和发布透明化；吸取我们之前在使用配置文件时的教训，将使用配置文件的最佳实践融合到发布流程中。比如，杜绝开发误修改beta环境配置，导致QA测试中断(beta的配置发布由QA控制)。
3. 热发布配置文件。在配置中心后台修改配置文件发布后应用会拿到最新的变更。
4. 生产环境灰度测试。修改配置后可以手动将改动推送到生产环境某台机器进行线上测试. 待完全通过后再批量生效。
5. 失败回滚机制。当配置文件解析失败后会自动回滚到上个版本. 保证生产环境稳定运行。

需要注意的是：**每个配置文件的大小最大只能为512k**。



# 2.本地测试须知

本地应用默认会调用qconfig_admin上dev文件夹下的文件（注意，是纯dev文件夹，不包含任何build_group!）， **开发人员在本地开发测试的时候可以不依赖配置中心，只需要在源程序的`resources`资源文件夹下创建一个`qconfig_test`目录，将需要在本地覆盖的配置文件放置在`应用名目录`(应用名即在应用中心中申请的名称)里面即可**。比如应用名称叫qtest，那么在qconfig_test目录下再建立一个qtest目录。

qconfig_test会被bds过滤，不会发布到线上。举例：假设你的应用名为qtask，有一个配置文件mysql.properties，你在本地测试的时候想使用这个文件，而不使用配置中心中的配置，则将mysql.properties这个文件放在/resources/qconfig_test/qtask/mysql.properties即可。



# 3.简单使用

## @QConfig

```java
//这个类需要配置成Spring的bean
public class YourClass{
 
  @QConfig("config2.properties")
  private Properties config;
 
  //以下config都是动态变化的，config.properties发生变更后，每次都去config获取值都是最新值
 
  //支持Map<String,String>
  @QConfig("config1.properties")
  private Map<String, String> config;
 
  //跨应用获取公开文件，这里指定应用名为otherapp
  @QConfig("otherapp#config1.properties")
  private Map<String, String> publicConfig;
 
  //还支持String，config里的内容是config.properties里完整内容，业务可以自行解析
  @QConfig("config3.properties")
  private String config;
}
```

@QConfig除了对Properties对象不能动态感知之外，对于其他类型都可以通过**轮询**的方式感知到文件变更，然后**自动**获取最新的值。

那如果文件变更的时候我们需要自己来处理呢？

这时候可以**注册监听器**，当文件变更时对应的监听器就会执行。

```java
//这个类需要配置成Spring的bean
public class YourClass{
  @QConfig("config1.properties")
  public void onChanged1(Map<String,String> conf){
      //支持参数为Map<String,String>
      //每次配置变更，onChaged1就会被调用
  }
 
  @QConfig("config2.properties")
  public void onChanged2(String conf){
     //支持参数为String
  }
}
```





## 使用原生API

如果你不想使用注解的方式来获取配置内容，也可以使用原生API的方式。

```java
MapConfig config = MapConfig.get("config.properties");
//这个map是动态变化的
Map<String, String> map = config.asMap();
```

这种方式也是采用**轮询**的方式来动态更新内容。

以下是**监听器**的方式：

```java
MapConfig config = MapConfig.get("config.properties");
config.asMap();
// QConfig会将配置文件内容自动转为Map<String, String>
config.addListener(new Configuration.ConfigListener<Map<String, String>>() {
  @Override //文件加载成功或者有新版本触发
  public void onLoad(Map<String, String> conf) {
     for (Map.Entry<String, String> entry : conf.entrySet()) {
         logger.info(entry.getKey() + "=>" + entry.getValue());
     }
  }
});
```

**ConfigListener**只能监听除了properties文件之外的文件变更，如果需要监听properties文件，则需要使用**PropertiesChangeListener**。如果文件里面的property为空，那么添加listener的操作并不会触发调用。

```java
MapConfig config = MapConfig.get("config.properties");
config.asMap();
config.addPropertiesListener(new MapConfig.PropertiesChangeListener() {
  @Override //配置发生变更的时候会触发，没有变更不触发
  public void onChange(PropertiesChange change) {
     // ...
  }
});
```



# 4.解析json文件

> qconfig client大于等于1.3.6的版本原生支持json文件。

## 注解方式

```json
//这个类需要配置成Spring的bean
public class YourClass{
 
  // 每次配置变更，person也会重新加载
  @QConfig("person.json")
  private volatile Person person;
 
  @QConfig("person.json")
  public void onChanged(Person p){
      //每次配置变更，onChanged就会被调用
  }
}
```



## api方式

直接指定自定义类类型。

```java
JsonConfig<Person> config = JsonConfig.get("person.json", Person.class);
 
Person person = config.current();
 
config.addListener(new Configuration.ConfigListener<Person>() {
  @Override
  public void onLoad(Person newPerson) {
    logger.info("new person: {}", newPerson);
  }
});
```

指定List类型，如`List<Integer>` 

```java
JsonConfig.ParameterizedClass parameter = JsonConfig.ParameterizedClass.of(List.class, Integer.class);

JsonConfig<List<Integer>> config = JsonConfig.get("list.json", parameter);

或者

JsonConfig.ParameterizedClass parameter = JsonConfig.ParameterizedClass.of(List.class).addParameter(Integer.class);
 
JsonConfig<List<Integer>> config = JsonConfig.get("list.json", parameter);
```

指定Map类型，例如`Map<String, Person>` 

```java
JsonConfig.ParameterizedClass parameter = JsonConfig.ParameterizedClass.of(Map.class, String.class, Person.class);
 
JsonConfig<Map<String, Person>> config = JsonConfig.get("map.json", parameter);
```

更复杂一些的描述，比如我们想生成`Map<String, Foo<Integer>>` 

```java
JsonConfig.ParameterizedClass stringDesc = JsonConfig.ParameterizedClass.of(String.class);
JsonConfig.ParameterizedClass fooDesc = JsonConfig.ParameterizedClass.of(Foo.class, Integer.class);
JsonConfig.ParameterizedClass parameter = JsonConfig.ParameterizedClass.of(Map.class, stringDesc, fooDesc);
 
JsonConfig<Map<String, Foo<Integer>>> config = JsonConfig.get("complex.json", parameter);
```



## 常见疑问

json中的key值如何将下划线转为驼峰？

使用`@JsonProperty`注解，例如：

```java
@Data
public class DiffConfig {

    @JsonProperty("able_process_diff")
    Boolean ableProcessDiff;
}
```

**注意：@JsonProperty需要跟@Data结合使用，否则无法正常获取。** 因为@Data比较智能，会自动在set方法上加上@JsonProperty。如果不想使用@Data则需要手动在set方法上加上@JsonProperty。



# 5.@QMapConfig

@QMapConfig在@QConfig的基础上进行了升级，除了具有之前QConfig注解获取Map和Properties的功能，还增加了获取自定义对象的功能。

```java
@Service
public class Test {
    @QMapConfig("test.properties")
    private Map<String, String> map;
     
    @QMapConfig("test.properties")
    private Properties p;
 
    // 直接转换为对象
    @QMapConfig("test.properties")
    private Person person;
     
    // 通过translator转化为对象
    @QMapConfig(value = "test.properties", translator = PersonTranslator.class)
    private Person person;
 
    @QMapConfig("test.properties")
    public void onChange(Map<String, String> map) { ... }
 
 
    @QMapConfig("test.properties")
    public void onChange(Properties p) { ... }
 
 
    @QMapConfig("test.properties")
    public void onChange(Person person) { ... }
    
    @QMapConfig(value = "test.properties", translator = PersonTranslator.class)
    public void onTranslatorChange(Person person) { ... }
}
 
public class Person {
    // 使用map中key为"person.name"的value
    @QConfigField(key = "person.name")
    private String name;
 
    // 使用map中key为age的value
    private int age;
 
    // 使用AddressTranslator对map中key为"address"的value进行转换
    @QConfigField(AddressTranslator.class)
    private Address address;
}

public class AddressTranslator extends QConfigTranslator<Address> {
    @Override
    public Address translate(String value) {
        int i = value.indexOf(":");
        return new Address(value.substring(0, i), value.substring(i + 1));
    }
}
 
public class PersonTranslator extends QConfigMapTranslator<Person> {
    @Override
    public Person translate(Map<String, String> map) {
        return new Person(String.valueOf(map.get("name")), Integer.parseInt(map.get("age")));
    }
}
```





