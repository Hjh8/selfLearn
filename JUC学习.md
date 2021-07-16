JUC 学习
===

JUC就是 java.util.concurrent 工具包的简称。这是从JDK 1.5 开始出现的一个处理线程的工具包。



多线程
---

### 串行、并行、并发

串行：多个任务按顺序执行。比如打开电视后才可以切换频道。

并行：多个任务同个时刻执行。比如边看电视边喝奶茶

并发：多个任务同个时间段执行。比如左手按下电视遥控器的时候，右手按下空调遥控器。哪个手先看下无所谓，这两个动作完成的时间很短。



### 创建多线程的方式

![image-20210716092548980](JUC学习.assets/image-20210716092548980.png)



### 线程的状态

#### 操作系统层面

计算机底层线程是有5种状态的：初始态、就绪态、运行态、阻塞态、结束态。

![image-20210716112602457](JUC学习.assets/image-20210716112602457.png)



#### java层面

在Java层面，线程是有六种状态的，分别是：新建态、可运行态、阻塞态、等待态、计时等待态、终止态。

需要注意的是，**可运行态中包含了 就绪、运行阻塞和运行态**。





Synchronized
---

synchronized 是 Java 中的关键字，是一种同步锁。当一个线程获取了锁对象，其他线程就要等待该对象的释放（执行完代码块或出现异常）。由于要频繁的获取锁、释放锁、判断锁，所以性能会降低。

Synchronized还可以通过 `wait()` 跟 `notify()/notifyAll()` 进行线程间通信。

>  原理看JVM。

它可以修饰代码块，普通方法和静态方法。

当**修饰代码块**时，锁对象可以是**任意对象**，但多线程用的锁对象必须是同一个。

```java
synchronized(锁对象){
    可能出现安全问题的代码
}
```

当**修饰普通方法**时，锁对象是**this**，即本类对象。

```java
synchronized(this){
    可能出现安全问题的代码
}
```

当**修饰静态方法**时，锁对象是**类的class对象**。因为this是对象创建之后产生的，而静态方法比对象先进入内存。

```java
synchronized(xxx.class){
    可能出现安全问题的代码
}
```





Lock 接口
---

lock是一个接口，需要手动的加锁和释放锁，并且在发生异常时不会自动释放锁，因此通常把释放锁的操作放在finally中。



### ReentrantLock

ReentrantLock是lock实现类，它是可重入锁，其可以通过 `lock()` 加锁，`unlock()` 解锁。

```java
public void insert(Thread thread) {
    Lock lock = new ReentrantLock();
    // 加锁
    lock.lock();
    System.out.println(thread.getName()+"得到了锁");
    // 释放锁
    lock.unlock();
}
```



### Condition

Condition 类也是lock接口的实现类，其实现线程间的通信。

`lock.newCondition()`：获取Condition对象。

`await()`：会使当前线程等待，同时会释放锁，当其他线程调用signal()时,线程会重新获得锁并继续执行。

`signal()`：用于唤醒一个指定的正在等待的线程。区别于notify()，notify是随机唤醒一个。

- 比如`a.signal()` 就只会唤醒Condition a对象。

`signalAll()`：唤醒所有等待的线程。



### 线程间通信

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class DemoClass{
    //加减对象
    private int number = 0;
    //声明锁
    private Lock lock = new ReentrantLock();
    //声明钥匙
    private Condition condition = lock.newCondition();
    
    /**
    * 加 1
    */
    public void increment() {
        try {
            lock.lock();
            // 注意这里是while
            while (number != 0){
                condition.await();
            }
            number++;
            condition.signalAll();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
    /**
     * 减一
     */
    public void decrement(){
        try {
            lock.lock();
            while (number == 0){
                condition.await();
            }
            number--;
            condition.signalAll();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    } 
}
```

注意代码中判断条件是while，而不是if，需要在唤醒之后再次判断条件成不成立，不然signalAll的时候全都被唤醒，即使条件不成立也会往下执行，这也叫做**虚假唤醒**。



CopyOnWriteArrayList
---

在很多应用场景中，读操作可能会远远大于写操作。由于读操作根本不会修改原有的数据，因此如果每次读取都进行加锁操作，其实是一种资源浪费。

ArrayList是非线程安全的，CopyOnWriteArrayList是线程安全的。

CopyOnWriteArrayList类底层是通过 **写时复制技术** 实现线程安全的。

写时复制技术 就是对list进行修改时，不直接在原有list中进行写操作，而是将list拷贝一份，在新的list中进行写操作（此过程会加锁），写完之后，再将原来指向的list指针指到新的list。

```java
List<Integer> list = new CopyOnWriteArrayList<>();
list.add(1);
System.out.println(list);
```



CopyOnWriteArraySet
---

set集合是非线程安全的，而CopyOnWriteArraySet是线程安全的。

CopyOnWriteArraySet是通过CopyOnWriteArrayList实现的，即去重的时候是遍历list看有无该元素，没有该元素才放入。



公平锁和非公平锁
---

**公平锁**：多个线程按照申请锁的顺序去获得锁，线程会直接进入队列去排队，只有队列的第一个线程才能得到锁。

- 优点：所有的线程都能得到资源，不会饿死在队列中。
- 缺点：吞吐量会下降很多

**非公平锁**：多个线程同时获取锁，不讲究顺序。

- 优点：整体的吞吐效率会高点
- 缺点：可能导致队列中间的某些线程一直获取不到锁或者长时间获取不到锁，导致饿死。

> 通俗来讲就是公平锁要排队，非公平锁是抢。



死锁
---

死锁：两个或两个以上的进程（线程）在执行过程中，因为争夺资源而造成相互等待状态，若无外力作用，它们都将永远无法执行下去。

形成死锁的四个**必要条件**：

- 互斥：一个资源只能被一个线程(进程)占用
- 请求与保持：一个线程(进程)因请求被占用资源而发生阻塞时，对已获得的资源保持不放。
- 不可剥夺：线程(进程)已获得的资源在末使用完之前不能被其他线程强行剥夺
- 环路等待：所等待的线程(进程)必定会形成一个环路（类似于死循环），造成永久阻塞。

**解决**死锁的办法：

| 死锁条件   | 解决方案                           |
| ---------- | ---------------------------------- |
| 互斥       | 无法解决                           |
| 请求与保持 | 一次性申请所有的资源               |
| 不可剥夺   | 申请不到资源时，主动释放占有的资源 |
| 环路等待   | 顺序执行                           |



多线程锁

Callable 接口
---





JUC 三大辅助类: CountDownLatch CyclicBarrier Semaphore

读写锁: ReentrantReadWriteLock

阻塞队列

ThreadPool 线程池



多线程面试
===

什么是线程上下文切换
---

cpu通过时间片分配算法来循环执行任务，当前线程执行一个时间片后切换到下一个线程。但是，在切换前会保存上一个线程的状态，下次切换回此线程时可以重新回到保存的状态。这一过程就是上下文切换。



Synchronized和Lock区别
---

1. Synchronized是关键字，lock是接口
2. Synchronized会自动上锁和释放锁，lock要手动。且发生异常时lock不会自动释放锁。
3. Synchronized可以锁代码块和方法，lock只能锁代码块
4. Synchronized获取到锁之后其他线程会一直等待下去。而lock锁不一定会等待下去。
5. Synchronized是可重入锁、非公平。lock也是重入锁，但是可以设置使用公平锁或者非公平锁。



aqs

公平和非公平



Lock的底层实现
---