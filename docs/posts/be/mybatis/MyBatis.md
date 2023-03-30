# MyBatis

## 前言

> 在使用 MySQL 的时候，需要先启动 MySQL 服务，再使用客户端连接 MySQL 服务，开启一个 session，才能在 session 中进行增删改查操作。
>
> 因为每一次连接都需要创建与之对应的 session，断开连接就会关闭 session。因此需要一个可以管理 session 的工具，MyBatis 就可以认为是这样子的一个工具。除了管理 session 之外，它还能提供了 XML 与接口方法的映射等功能，方便进行数据库操作。
>
> MyBatis 的这些操作都是在 session 中进行的，所以 session 在 MyBatis 中占据了一个很重要的位置。因此就可以围绕 MyBatis 从何处创建 session，使用什么工具 创建 session，如何管理 session 这几个方面出发来了解 MyBatis。

> [官方文档](https://mybatis.org/mybatis-3/)

<br>

## 配置

> 配置文件内的标签需要保持一定的顺序
>
> * properties 属性
>
> * settings 设置
>
> * typeAliases 类型别名
>
> * typeHandlers 类型处理器
>
> * objectFactory 对象工厂
>
>   每次 MyBatis 创建 result 对象的新实例时，它都会使用一个对象工厂实例来完成实例化工作
>
> * plugins 插件
>
>   MyBatis 允许在映射语句执行过程中的某一时刻进行拦截调用
>
> * environments 环境配置
>
> * databaseIdProvider 数据库厂商标识
>
> * mappers 映射器
>
> 顺序不能颠倒，比如 settings 不能放在 environments 后面

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties>
        <property name="username" value="root"/>
        <property name="password" value=""/>
        <property name="url" value="jdbc:mysql://localhost:3306/db_test?useSSL=false"/>
        <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
    </properties>
    <typeAliases>
        <package name="com.demo.mapper"/>
    </typeAliases>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper resource="mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

<br>

### 插件

> MyBatis 允许在映射语句执行过程中的某一时刻进行拦截调用，默认情况下，MyBatis 允许使用插件来拦截的方法调用包括
>
> - Executor 接口中的方法，如 update/query/flushStatements/commit/rollback/getTransaction/close/isClosed
> - ParameterHandler 接口中的方法，如 getParameterObject/setParameters
> - ResultSetHandler 接口中的方法，如 handleResultSets/handleOutputParameters
> - StatementHandler 接口中的方法，如 prepare/parameterize/batch/update/query

**自定义插件**

```java
// 拦截 Executor 的 update(MappedStatement, Object) 方法
@Intercepts({@Signature(
  type= Executor.class,
  method = "update",
  args = {MappedStatement.class,Object.class})})
public class ExamplePlugin implements Interceptor {
  private Properties properties = new Properties();

  @Override
  public Object intercept(Invocation invocation) throws Throwable {
    // pre processing
    Object returnObject = invocation.proceed();
    // post processing
    return returnObject;
  }

  @Override
  public void setProperties(Properties properties) {
    this.properties = properties;
  }
}
```

**注册插件**

```xml
<!-- 将插件注册到 MyBatis -->>
<plugins>
  <plugin interceptor="org.mybatis.example.ExamplePlugin">
    <property name="someProperty" value="100"/>
  </plugin>
</plugins>
```

<br>

## XML 映射文件

> [XML 映射文件](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html)]

<br>

## 核心接口/类

> 所有核心接口/类的创建都是从 MybatisAutoConfiguration 的初始化及其内部对应方法调用开始的。Mabais 的核心配置类为 MybatisProperties，配置文件的位置和 mapper 映射文件的位置等都是在这个类内部配置的。

<br>

### SqlSessionFactory

> 从连接或数据源创建 SqlSession

> * 每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的
> * SqlSessionFactory 的实例可以通过 SqlSessionFactoryBuilder 获得
> * SqlSessionFactoryBuilder 可以从 XML 配置文件或一个预先配置的 Configuration 实例来构建 SqlSessionFactory 实例

> 从 XML 文件中构建 SqlSessionFactory 的实例非常简单，建议使用类路径下的资源文件进行配置，也可以使用任意的输入流（InputStream）实例，比如用文件路径字符串或 file:// URL 构造的输入流。
>
> MyBatis 包含一个名叫 Resources 的工具类，它包含一些实用方法，使得从类路径或其它位置加载资源文件更加容易。
>
> ```java
> String resource = "org/mybatis/example/mybatis-config.xml";
> InputStream inputStream = Resources.getResourceAsStream(resource);
> SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
> ```

```java
public interface SqlSessionFactory {
  SqlSession openSession();
  Configuration getConfiguration();
}
```

<br>

### SqlSessionFactoryBuilder

> 负责创建 SqlSessionFactory，内部定义了多种方法，用于从不同途径创建 SqlSessionFactory，比如 XML 文件/输入流/Configuration 配置类等

```java
public class SqlSessionFactoryBuilder {
  // 从输入流创建 SqlSessionFactory
  public SqlSessionFactory build(InputStream inputStream) {
    return build(inputStream, null, null);
  }
  
  public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
    try {
      // 解析 XML 输入流
      // 这一步会创建 Configuration
      // 创建 Configuration 的时候会跟着 MapperRegistry 用于注册 mapper 文件
      XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);
      // parser.parse() 方法会先检查是否已经解析过，如果已经解析过就会抛出异常
      // 然后开始解析 Configuration
      // 会扫描可用的 mapper 然后注册到 MapperRegistry
      // MapperRegistry 实际上是使用 HashMap 来保存 mapper 映射关系
      // 最后返回 Configuration
      // 实际上此类中的所有方法最后调用的都是 build(Configuration config)
      return build(parser.parse());
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error building SqlSession.", e);
    } finally {
      ErrorContext.instance().reset();
      try {
      	if (inputStream != null) {
      	  inputStream.close();
      	}
      } catch (IOException e) {
        // Intentionally ignore. Prefer previous error.
      }
    }
  }
  
  // 配置文件创建 SqlSessionFactory
  // 如果不是使用 mybatis.xml 配置文件来创建 SqlSessionFactory
  // 而是通过配置类来创建，一般都是使用此方法
  // Configuration 类定义了 MyBatis 的各种属性
  // 如 MyBatis 的环境信息，是否开启缓存，是否开启懒加载等
  // 配置 Mapper 的注册器 MapperRegistry
  public SqlSessionFactory build(Configuration config) {
    return new DefaultSqlSessionFactory(config);
  }
  // ...
}
```

```java
// Configuration.java 初始化时创建 MapperRegistry
protected final MapperRegistry mapperRegistry = new MapperRegistry(this);
```



> MyBatis 启动时
>
> * 解析 xml 配置
> * 创建 Configuration 类
> * 设置 MyBatis 环境信息
> * 解析 xml 标签，比如解析 mapper 标签
> * 将 Java 接口和对应的 XML Mapper 绑定
> * 创建 Java 接口代理，将映射信息保存到 MapperRegistry
>
> 
>
> getMapper 方法执行时
>
> * 从 MapperRegistry 中获取到对应的代理 Mapper
> * 调用代理 Mapper 的对应方法

<br>

### DefaultSqlSessionFactory

> SqlSessionFactory 子类，用于开启 session

```java
public class DefaultSqlSessionFactory implements SqlSessionFactory {
  
  // 从 DataSource 开启 session
  // 一般来说，如果配置了 DataSource 就会使用此方法打开 session
  private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {
    // 用来包装数据库连接，管理连接的生命周期
    // 包括：连接的创建、准备、commit/rollback 和连接的关闭
    Transaction tx = null;
    try {
      // 获取环境信息
      final Environment environment = configuration.getEnvironment();
      // 创建事务工厂
      final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
      tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);
      // 创建 SQL 执行器
      final Executor executor = configuration.newExecutor(tx, execType);
      // 创建 session
      return new DefaultSqlSession(configuration, executor, autoCommit);
    } catch (Exception e) {
      closeTransaction(tx); // may have fetched a connection so lets call close()
      throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }

  // 从 Connection 开启 session
  private SqlSession openSessionFromConnection(ExecutorType execType, Connection connection) {
    try {
      boolean autoCommit; // default false
      try {
        autoCommit = connection.getAutoCommit(); // 是否自动提交
      } catch (SQLException e) {
        // Failover to true, as most poor drivers
        // or databases won't support transactions
        autoCommit = true;
      }
      final Environment environment = configuration.getEnvironment();
      final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
      final Transaction tx = transactionFactory.newTransaction(connection);
      final Executor executor = configuration.newExecutor(tx, execType);
      return new DefaultSqlSession(configuration, executor, autoCommit); // 创建 sesion
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }
}
```



<br>

### SqlSession

> 使用 MyBatis 的主要接口，定义了 SQL 执行/Mapper 映射获取/事务管理等方法

```java
public interface SqlSession extends Closeable
```

**内部方法**

```java
<T> T selectOne(String statement);
<E> List<E> selectList(String statement);
<K, V> Map<K, V> selectMap(String statement, String mapKey);
int insert(String statement);
int update(String statement);
int delete(String statement);
void commit();
void rollback();
<T> T getMapper(Class<T> type);
Connection getConnection();
```



<br>

### DefaultSqlSession

> SqlSession 的默认实现类，实现 SQL 执行/Mapper 映射获取/事务管理等方法

```java
public class DefaultSqlSession implements SqlSession
```

<br>

## Mapper 接口与 XML 绑定

### XMLConfigBuilder

> 解析 mybatis-config.xml 配置，并创建 Configuration 实例

**mapperElement**

> 处理 Mapper 映射元素

```xml
<!-- 实际上就是解析 <mapper> 标签 -->
<mappers>
    <mapper resource="mapper/UserMapper.xml"/><!-- 样例 -->
</mappers>
```

```java
private void mapperElement(XNode parent) throws Exception {
  if (parent != null) {
    for (XNode child : parent.getChildren()) {
      // 检查 mapper 标签中是否包含 package 属性
      if ("package".equals(child.getName())) {
        String mapperPackage = child.getStringAttribute("name");
        configuration.addMappers(mapperPackage);
      } else {
        // 检查 mapper 标签中是否包含 resource 属性
        // 从上面的样例只能解析到 resource 属性
        String resource = child.getStringAttribute("resource");
        // 检查 mapper 标签中是否包含 url 属性
        String url = child.getStringAttribute("url");
        // 检查 mapper 标签中是否包含 class 属性
        String mapperClass = child.getStringAttribute("class");
        if (resource != null && url == null && mapperClass == null) {
          ErrorContext.instance().resource(resource);
          try(InputStream inputStream = Resources.getResourceAsStream(resource)) {
            XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, configuration, resource, configuration.getSqlFragments());
            // 解析 xml 配置并将 mapper 接口和 mapper xml 绑定
            mapperParser.parse();
          }
        } else if (resource == null && url != null && mapperClass == null) {
          ErrorContext.instance().resource(url);
          try(InputStream inputStream = Resources.getUrlAsStream(url)){
            XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, configuration, url, configuration.getSqlFragments());
            // 解析 xml 配置并将 mapper 接口和 mapper xml 绑定
            mapperParser.parse();
          }
        } else if (resource == null && url == null && mapperClass != null) {
          Class<?> mapperInterface = Resources.classForName(mapperClass);
          // 属性为 class 直接添加 mapper 映射，不需要解析 xml
          configuration.addMapper(mapperInterface);
        } else {
          throw new BuilderException("A mapper element may only specify a url, resource or class, but not more than one.");
        }
      }
    }
  }
}
```

<br>

### XMLMapperBuilder

**parse**

```java
public void parse() {
  if (!configuration.isResourceLoaded(resource)) {
    configurationElement(parser.evalNode("/mapper"));
    configuration.addLoadedResource(resource);
    bindMapperForNamespace(); // Mapper 接口和 xml 文件绑定
  }

  parsePendingResultMaps();
  parsePendingCacheRefs();
  parsePendingStatements();
}
```

<br>

### MapperRegistry

```java
public <T> void addMapper(Class<T> type) {
  if (type.isInterface()) {
    if (hasMapper(type)) {
      throw new BindingException("Type " + type + " is already known to the MapperRegistry.");
    }
    boolean loadCompleted = false;
    try {
      knownMappers.put(type, new MapperProxyFactory<>(type));
      // It's important that the type is added before the parser is run
      // otherwise the binding may automatically be attempted by the
      // mapper parser. If the type is already known, it won't try.
      MapperAnnotationBuilder parser = new MapperAnnotationBuilder(config, type);
      parser.parse();
      loadCompleted = true;
    } finally {
      if (!loadCompleted) {
        knownMappers.remove(type);
      }
    }
  }
}
```



## 原理扩展



> **目标方法调用流程**
>
> MapperInterface#targetMethod
>
> -> MybatisAutoConfiguration#sqlSessionFactory 如果使用 SpringBoot 自动配置
>
> -> MapperProxy#invoke
>
> -> MapperMethod#execute
>
> -> DefaultSqlSessionFactory#openSession -> openSessionFromDataSource
>
> -> DefaultSqlSession 构造方法



### SqlSessionFactoryBean

> 用于创建 SqlSessionFactory 的 FactoryBean

```java
public class SqlSessionFactoryBean
    implements FactoryBean<SqlSessionFactory>, InitializingBean, ApplicationListener<ApplicationEvent>
```

**创建 SqlSessionFactoryBean** 

> MybatisAutoConfiguration#sqlSessionFactory 会创建一个全局共享的 SqlSessionFactoryBean 交由 Spring 管理

```java
@Bean
@ConditionalOnMissingBean
public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
  SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
}
```

**创建 SqlSessionFactoryBuilder**

```java
// 实例化 SqlSessionFactoryBean 的时候就会跟着创建 SqlSessionFactoryBuilder
private SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
```



### SqlSessionInterceptor

> 真正执行 SQL 的类

```java
private class SqlSessionInterceptor implements InvocationHandler {
  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    SqlSession sqlSession = getSqlSession(SqlSessionTemplate.this.sqlSessionFactory,
        SqlSessionTemplate.this.executorType, SqlSessionTemplate.this.exceptionTranslator);
    try {
      // 将 SQL 发送到数据库服务器，执行 SQL，并获取结果
      Object result = method.invoke(sqlSession, args);
      if (!isSqlSessionTransactional(sqlSession, SqlSessionTemplate.this.sqlSessionFactory)) {
        // force commit even on non-dirty sessions because some databases require
        // a commit/rollback before calling close()
        sqlSession.commit(true);
      }
      return result;
    } catch (Throwable t) {
      Throwable unwrapped = unwrapThrowable(t);
      if (SqlSessionTemplate.this.exceptionTranslator != null && unwrapped instanceof PersistenceException) {
        // release the connection to avoid a deadlock if the translator is no loaded. See issue #22
        closeSqlSession(sqlSession, SqlSessionTemplate.this.sqlSessionFactory);
        sqlSession = null;
        Throwable translated = SqlSessionTemplate.this.exceptionTranslator
            .translateExceptionIfPossible((PersistenceException) unwrapped);
        if (translated != null) {
          unwrapped = translated;
        }
      }
      throw unwrapped;
    } finally {
      if (sqlSession != null) {
        closeSqlSession(sqlSession, SqlSessionTemplate.this.sqlSessionFactory);
      }
    }
  }
}
```



<br>

### MapperProxy

```java
public class MapperProxy<T> implements InvocationHandler, Serializable
```



<br>

### MapperMethod

```java
public class MapperMethod
```



```java
public Object execute(SqlSession sqlSession, Object[] args) {
  Object result;
  switch (command.getType()) {
    case INSERT: {
      Object param = method.convertArgsToSqlCommandParam(args);
      result = rowCountResult(sqlSession.insert(command.getName(), param));
      break;
    }
    case UPDATE: {
      Object param = method.convertArgsToSqlCommandParam(args);
      result = rowCountResult(sqlSession.update(command.getName(), param));
      break;
    }
    case DELETE: {
      Object param = method.convertArgsToSqlCommandParam(args);
      result = rowCountResult(sqlSession.delete(command.getName(), param));
      break;
    }
    case SELECT:
      if (method.returnsVoid() && method.hasResultHandler()) {
        executeWithResultHandler(sqlSession, args);
        result = null;
      } else if (method.returnsMany()) {
        result = executeForMany(sqlSession, args);
      } else if (method.returnsMap()) {
        result = executeForMap(sqlSession, args);
      } else if (method.returnsCursor()) {
        result = executeForCursor(sqlSession, args);
      } else {
        Object param = method.convertArgsToSqlCommandParam(args);
        result = sqlSession.selectOne(command.getName(), param);
        if (method.returnsOptional()
            && (result == null || !method.getReturnType().equals(result.getClass()))) {
          result = Optional.ofNullable(result);
        }
      }
      break;
    case FLUSH:
      result = sqlSession.flushStatements();
      break;
    default:
      throw new BindingException("Unknown execution method for: " + command.getName());
  }
  if (result == null && method.getReturnType().isPrimitive() && !method.returnsVoid()) {
    throw new BindingException("Mapper method '" + command.getName()
        + "' attempted to return null from a method with a primitive return type (" + method.getReturnType() + ").");
  }
  return result;
}
```



## Spring 集成

<br>

### SqlSessionTemplate

> SqlSession 的实现类，由 Spring 管理，效果类似 DefaultSqlSession

```java
public class SqlSessionTemplate implements SqlSession, DisposableBean
```

<br>

### SqlSessionUtils