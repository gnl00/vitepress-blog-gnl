# Java 进阶



## SPI

**是什么**

SPI 全称 Service Provider Interface 服务提供接口。以数据库访问接口为例，Java 定义了访问接口 `java.sql.Driver` ，并规定了常用的方法。因为存在如 MySQL/PostGreSQL 等不同的数据库，其中数据库连接操作的实现不同的，Java 管不过来那么多实现。

所以 Java 说，我把 `java.sql.Driver` 接口暴露来，让你们外部各种各样的数据库们（也就是服务提供者）自己来实现，实现类必须带一个无参构造方法；之后在 `classpath:META-INF/services` 目录下，名字为 `java.sql.Driver` 的文件，将实现类的全限定类名保存在里面。

当服务调用者需要访问数据库的时候，不关心连接具体是如何实现的。只需要导入对应的 jar 包，Java 程序内部会利用 `java.util.ServiceLoader` 工具类从对应的位置加载到对应的数据库实现类。

如果想连接 MySQL 数据库，通过 `DriverManager` 加载 MySQL 的驱动，即可调用 `java.sql.Driver` 接口的对应方法。其中，`DriverManager` 内部使用的就是 `java.util.ServiceLoader` 来加载 MySQL 驱动实现类。之后如果想换成别的数据库，只需要将 jar 包替换即可，内部代码无需做大改动。

在上面的例子中存在着 3 个角色，服务接口定义（Java），服务提供者（各种数据库），服务调用者（客户端），SPI 的实现和使用就是围绕这三者展开的。



**SPI 和 API 的区别**

* 和 SPI 不同，SPI 是接口的定义和实现分开进行的，API 则是接口的定义和实现捆绑在一起的；

* 使用 SPI 的需要客户端加载对应的实现，而调用 API 服务则不需要。



**How to use**

```java
public interface CusDriver {
    void load();
}

public class CusDriverMySQL implements CusDriver {
    @Override
    public void load() {
        System.out.println("MySQL driver loaded");
    }
}

public class CusDriverPgSQL implements CusDriver{
    @Override
    public void load() {
        System.out.println("PgSQL driver loaded");
    }
}

// META-INF/spi.CusDriver
spi.CusDriverMySQL
spi.CusDriverPgSQL

public class SPITest {
    public static void main(String[] args) {
        ServiceLoader<CusDriver> serviceLoader = ServiceLoader.load(CusDriver.class);
        Iterator<CusDriver> iterator = serviceLoader.iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}
```





## 参考

[Java SPI思想梳理](https://zhuanlan.zhihu.com/p/28909673)

