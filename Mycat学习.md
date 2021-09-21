Mycat学习
===

认识Mycat
---

Mycat支持Mysql集群，可以作为**Proxy**操作数据库。支持mysql集群，Mysql主从架构的模式，自动故障切换；支持读写分离，自动根据sql选择主从机；支持全局表，数据自动分片到多个节点，用于高效表关联查询；支持独有的基于E-R 关系的分片策略，实现了高效的表关联查询多平台支持；



分库分表
---

当前的应用都离不开数据库，随着数据库中的数据越来越多，单表记录数量突破性能上限时，如MySQL单表上限估计在近千万条内，当记录数继续增长时，从性能考虑，则需要进行**水平拆分**。

水平拆分：根据某个列的数据指定拆分规则，然后依据规则将记录分散在不同的数据库的相同结构的表中，从而减少了搜索数据的时间。比如说根据id%n来决定连接哪个数据库。

***

如果数据库的QPS每秒查询率(Query Per Second) 过高，就需要考虑**垂直拆分**，通过分库来分担单个数据库的连接压力。比如，如果查询QPS为3500，假设单库可以支撑1000个连接数的话，那么就可以考虑拆分成4个库，来分散查询连接压力。比如说指定哪些表去连接哪个数据库。

> 单表的数据太多考虑水平拆分；单库的表太多考虑垂直拆分。



schema.xml
---

### schema标签

schema标签用来定义mycat实例中的逻辑库，mycat可以有多个逻辑库，每个逻辑库都有自己的相关配置。

可以使用schema标签来划分这些不同的逻辑库：

`<schema name="TESTDB" checkSQLschema="false" sqlMaxLimit="100" dataNode="dn1,dn2,dn3" >` 

- dataNode：该标签用于绑定逻辑库到某个具体的database上。如果定义了这个属性，则这个schema就可以用作读写分离和主从切换；但不能工作在分库分表模式下。
- checkSQLschema：当该值为true时，例如我们执行语句 select * from TESTDB.company 。mycat会把语句修改为 select * from company 去掉TESTDB。
- sqlMaxLimit：指定每次返回的记录数。当该值设置为某个数值时，每条执行的sql语句，如果没有加上limit语句，Mycat会自动加上对应的值。不写的话，默认返回所有的值。



#### table标签

Table 标签定义了MyCat中的逻辑表，所有需要拆分的表都需要在这个标签中定义。

`<table name="travelrecord,address" dataNode="dn1,dn2,dn3" primaryKey="ID" rule="auto-sharding-long" splitTableNames ="true"/>` 

- name：定义mycat逻辑表的表名（唯一）。

- dataNode：定义这个逻辑表所属的dataNode, 该属性的值需要和dataNode标签中name属性的值相互对应。

  - 如果需要定义的dataNode过多可以使用`表名$n-m`减少配置：

    ```xml
    <table name="travelrecord" dataNode="multipleDn$0-99,multipleDn2$100-199" rule="auto-sharding-long" />
    
    <dataNode name="multipleDn" dataHost="localhost1" database="db$0-99" ></dataNode>
    <dataNode name="multipleDn2" dataHost="localhost1" database=" db$100-199" ></dataNode>
    ```

- rule：指定逻辑表要使用的规则，即数据库分库分表时的规则，规则名字在`rule.xml`中定义，里面有许多规则算法。

- primaryKey：该逻辑表对应真实表的主键。如果不指定主键，且分片的规则是使用非主键进行分片的，那么在使用主键查询的时候，就会发送查询语句到所有配置的dataNode上。如果指定主键，那么MyCat会缓存主键与具体dataNode的信息，那么再次使用该非主键进行查询的时候就不会进行广播式的查询，就会直接发送语句给具体的dataNode。

- autoIncrement：指定这个表有无使用自增长主键。因为是通过mycat的逻辑表来操作数据库的表，所以需要在mycat中指定。如果数据插入时主键有值，则不会进行自增；没有值时才进行自增。

- splitTableNames：启用table的name属性使用逗号分割配置多个表，即多个表使用这个配置



### dataNode标签

dataNode 标签定义了MyCat中的数据节点，也就是我们通常所说的**数据分片**。一个**dataNode** 标签就是一个独立的数据分片。

例如：`<dataNode name="dn1" dataHost="localhost1" database="db1" />` 所表述的意思为：使用名字为localhost1数据库实例上的db1物理数据库，组成一个数据分片，并使用名字dn1标识这个分片。

- name：定义数据节点的名字（唯一），在schema会使用到。

- dataHost：定义该分片属于哪个数据库实例的，属性值是引用dataHost标签上定义的name属性。
- database：定义该分片属于哪个数据库实例上的具体库，因为这里使用两个纬度来定义分片，就是：实例+具体的库。因为每个库上建立的表和表结构是一样的。所以这样做就可以轻松的对表进行水平拆分。



### dataHost标签

dataHost定义了具体的数据库实例、读写分离配置和心跳语句。

```xml
<dataHost name="localhost1" maxCon="1000" minCon="10" balance="0"
		writeType="0" dbType="mysql" dbDriver="native" 
              switchType="1"  slaveThreshold="100">
    <heartbeat>select user()</heartbeat>
    <!-- can have multi write hosts，主机（可多个） -->
    <writeHost host="hostM1" url="localhost:3306" user="root"
    password="123456">
        <!-- can have multi read hosts ，从机（可多个）-->
        <readHost host="hostS1" url="localhost:3306" 
                  user="root" password="123456"/>
    </writeHost>
    <!-- <writeHost host="hostM2" url="localhost:3316" user="root" password="123456"/> -->
</dataHost>
```

- name：唯一标识dataHost标签，供上层的标签使用。
- maxCon：指定每个读写实例连接池的最大连接。即标签内嵌套的writeHost、readHost标签都会使用这个属性值来实例化出连接池的最大连接数。
- minCon：指定每个读写实例连接池的最小连接，即初始化连接池的大小。
- balance：负载均衡类型，目前的取值有4种：
  - balance=“0”, 不开启读写分离机制，所有读操作都发送到当前可用的writeHost上。
  - balance=“1”，所有读操作都随机的发送到readHost跟备用的writeHost上。
  - balance=“2”，所有读操作都随机的在writeHost、readhost上分发。
  - balance=“3”，所有的读操作随机的发送到readHost，writeHost完全不分担读操作。
- writeType：负载均衡类型，1.6以后被淘汰。

- dbType：指定后端连接的数据库类型，目前支持二进制的mysql协议，还有其他使用JDBC连接的数据库，例如：mongodb、oracle、spark等。
- dbDriver：指定连接后端数据库使用的Driver，目前可选的值有**native**和**JDBC**。数据库类型为mysql的话使用native。其他类型的数据库则需要使用JDBC驱动来支持。
- switchType：指定主服务器发生故障时的行为。
  - -1，表示不自动切换
  - 1，自动切换（默认值）
  - 2，基于mysql主从同步的状态决定是否切换
  - 3，基于mysql集体的切换机制



#### heartbeat标签

指定和后端数据库进行心跳检查的语句，检测mysql数据库是否正常进行。

- 当switchType为1时，mysql的心跳检查语句为：`select user()` 
- 当switchType为2时，mysql的心跳检查语句为：`select slave status` 
- 当switchType为3时，mysql的心跳检查语句为：`select status like“wsrep%”`  



#### writeHost跟readHost标签

这两个标签都指定后端数据库的相关配置给mycat，用于实例化后端连接池。唯一不同的是，writeHost指定写实例、readHost指定读实例，组着这些读写实例来满足系统的要求。

在一个dataHost内可以定义多个writeHost和readHost。但是，**如果writeHost指定的后端数据库宕机，那么这个writeHost绑定的所有readHost都将不可用**。



读写分离配置
---

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">
     <!-- 数据库配置，与server.xml中的数据库对应 -->
     <schema name="db_test" checkSQLschema="false" sqlMaxLimit="100" dataNode="db_node"></schema>
     <!-- 分片配置 -->
     <dataNode name="db_node" dataHost="db_host" database="db_test" />
     <!-- 物理数据库配置 -->
     <dataHost name="db_host" maxCon="1000" minCon="10" balance="1"
     		writeType="0" dbType="mysql" dbDriver="native" 
                 switchType="1" slaveThreshold="100">
         <heartbeat>select user()</heartbeat>
         <writeHost host="hostM1" url="mysql_master:3306" 
                    user="root" password="apple">
             <readHost host="hostS2" url="mysql_slaver:3306" 
                       user="root" password="apple" />
         </writeHost>
     </dataHost>
</mycat:schema>
```



水平拆分配置
---

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

	<schema name="TESTDB" checkSQLschema="false" sqlMaxLimit="100" >
		<table name="users" dataNode="dn1,dn2,dn3" primaryKey="id" 
               		  rule="mod-long"autoIncrement="true" />
	</schema>
    
	<dataNode name="dn1" dataHost="localhost1" database="demo" />
	<dataNode name="dn2" dataHost="localhost2" database="demo" />
	<dataNode name="dn3" dataHost="localhost3" database="demo" />
    
	<dataHost name="localhost1" maxCon="1000" minCon="10" balance="1"
			  writeType="0" dbType="mysql" dbDriver="native" 
              	     switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="hostM1" url="localhost:3306" user="root"
				   password="123456">
			<readHost host="hostS1" url="localhost:3307" user="root"
				   password="123456" />
		</writeHost>
	</dataHost>
    
</mycat:schema>
```



垂直拆分配置
---

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

	<schema name="TESTDB" checkSQLschema="false" sqlMaxLimit="100" >
		<table name="users" dataNode="dn1" primaryKey="id" autoIncrement="true" />
        <table name="orders" dataNode="dn2" primaryKey="id" autoIncrement="true" />
        <table name="goods" dataNode="dn3" primaryKey="id" autoIncrement="true" />
	</schema>
    
	<dataNode name="dn1" dataHost="localhost1" database="demo" />
	<dataNode name="dn2" dataHost="localhost2" database="demo" />
	<dataNode name="dn3" dataHost="localhost3" database="demo" />
    
	<dataHost name="localhost1" maxCon="1000" minCon="10" balance="1"
			  writeType="0" dbType="mysql" dbDriver="native" 
              	     switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="hostM1" url="localhost:3306" user="root"
				   password="123456">
			<readHost host="hostS1" url="localhost:3307" user="root"
				   password="123456" />
		</writeHost>
	</dataHost>
    
</mycat:schema>
```



