# ElasticSearch



## 概念



### 全文搜索引擎



一般传统数据库，全文检索都实现的很鸡肋，因为一般也没人用数据库存文本字段。进行全文检索需要扫描整个表，如果数据量大的话即使对 SQL 的语法优化，也收效甚微。建立索引，维护起来也很麻烦，对于 insert 和 update 操作都会重新构建索引。

基于以上原因可以分析得出，在一些生产环境中，使用常规的搜索方式，性能是非常差的

- 搜索的数据对象是大量的非结构化的文本数据
- 文件记录量达到数十万或数百万个甚至更多
- 支持大量基于交互式文本的查询
- 需求非常灵活的全文搜索查询
- 对高度相关的搜索结果的有特殊需求，但是没有可用的关系数据库可以满足
- 对不同记录类型、非文本数据操作或安全事务处理的需求相对较少的情况。为了解决结构化数据搜索和非结构化数据搜索性能问题，我们就需要专业，健壮，强大的全文搜索引擎



> 全文搜索引擎工作原理是计算机索引程序通过扫描文章中的每一个词，对每一个词建立一个索引，指明该词在文章中出现的次数和位置，当用户查询时，检索程序就根据事先建立的索引进行查找，并将查找的结果反馈给用户的检索方式。这个过程类似于通过字典中的检索字表查字的过程。



### 相关术语

**与关系型数据库对比**

| DB      | ES            |
| ------- | ------------- |
| Table   | Index（Type） |
| Row     | Document      |
| Columns | Field         |
| Schema  | Mapping       |
| SQL     | DSL           |



#### 文档

> ES是面向文档的，**文档是所有可搜索数据的最小单位**

- **在 ES 中文档会被序列化成 JSON 格式**，保存在 ES 中，JSON 对象由字段组成，其中每个字段都有对应的字段类型（字符串/数组/布尔/日期/二进制/范围类型）
- 在 ES 中，每个文档都有一个 Unique ID，可以**自己指定 ID** 或者通过 **ES 自动生成**
- JSON 每个字段都有自己的数据类型，ES 可以帮助你自动做做一个数据类型的推算，并且在 ES 中数据还支持**数组和嵌套**。

ES数据内容

```json
{
    "_index" : "movies", # _index 代表文档所属的索引名
    "_type" : "_doc", # _type 表示文档所属的类型名
    "_id" : "2035", # _id 为文档唯一 id
    "_score" : 1.0, # _score 为相关性打分，是这个文档在这次查询中的算分
    "_source" : { # _source 为文档的原始 JSON 数据，当搜索文档的时候默认返回的就是 _source 字段
        "title" : "Blackbeard's Ghost",
        "genre" : [
        "Children",
        "Comedy"
        ],
        "@version" : "1", # @version 为文档的版本信息，可以很好地来解决版本冲突的问题
    }
}
```



#### 类型

> 在 7.0 之前，每一个索引是可以设置多个 Types 的，每个 Type 会拥有相同结构的文档，但是在 6.0 开始，Type 已经被废除，在 7.0 开始，一个索引只能创建一个 Type，也就是 `_doc`

每个索引里都可以有一个或多个 Type，Type 是索引中的一个逻辑数据分类，一个 Type 下的文档，都有相同的字段（Field），比如博客系统，有一个索引，可以定义用户数据 Type，博客数据 Type，评论数据 Type 等。



#### 索引

> **索引简单来说就是相似结构文档的集合**，对比关系型数据库，创建索引就等同于创建数据库

- **一个索引可以包含很多文档**，一个索引就代表了一类类似的或者相同的文档，比如说建立一个商品索引，里面可能就存放了所有的商品数据，也就是所有的商品文档。每一个索引都是自己的 Mapping 定义文件，用来去描述去包含文档字段的类型
- 在一个的索引当中，可以去为它设置 Mapping 和 Setting，Mapping 定义的是索引当中所有**文档字段的类型结构**，Setting 主要是指定要用多少的分片以及**数据是怎么样进行分布**的
- 索引在不同的上下文会有不同的含义，比如，在 ES 当中，**索引是一类文档的集合**，这里就是名词；同时**保存一个文档到 ES 的过程也叫索引（indexing）**，抛开 ES，提到索引，还有可能是 **B 树索引或者是倒排索引**，倒排索引是 ES 中一个重要的数据结构



#### 集群

> ES 集群其实是一个分布式系统，要满足高可用性，高可用就是当集群中有节点服务停止响应的时候，整个服务还能正常工作，也就是**服务可用性**；或者说整个集群中有部分节点丢失的情况下，不会有数据丢失，即**数据可用性**。

- 当用户的请求量越来越高，数据的增长越来越多的时候，系统需要把数据分散到其他节点上，最后来实现水平扩展。当集群中有节点出现问题的时候，整个集群的服务也不会受到影响
- ES 的分布架构当中，**不同的集群是通过不同的名字来区分的**，默认的名字为 `elasticsearch`，可以在配置文件中进行修改，或者在命令行中使用 `-E cluster.name=wupx` 进行设定，一个集群中可以有一个或者多个节点



一个 ES 集群有三种颜色来表示健康程度

1. Green：主分片与副本都正常分配
2. Yellow：主分片全部正常分配，有副本分片未能正常分配
3. Red：有主分片未能分配（例如，当服务器的磁盘容量超过 85% 时，去创建了一个新的索引）



#### 节点

> 节点其实就是一个 ES 实例，**本质上是一个 Java 进程**，一台机器上可以运行多个 ES 进程，但是生产环境一般**建议一台机器上只运行一个 ES 实例**

![image-20210714143132828](assets/image-20210714143132828.png)

- 每一个节点都有自己的名字，节点名称很重要（在执行运维管理操作的时候），可以通过配置文件进行配置，或者启动的时候 `-E node.name=node1` 指定。每一个节点在启动之后，会分配一个 UID，保存在 data 目录下
- 默认节点会去加入一个名称为 `elasticsearch` 的集群，如果直接启动很多节点，那么它们会自动组成一个 `elasticsearch` 集群，当然一个节点也可以组成一个 `elasticsearch` 集群



##### 候选主节点（Master-eligible Node） & 主节点（Master Node）

- 每一个节点启动后，默认就是一个 Master-eligible 节点，可以通过在配置文件中设置 `node.master: false` 禁止，Master-eligible 节点可以参加选主流程，成为 Master 节点。当第一个节点启动时候，它会将自己选举成 Master 节点
- **每个节点上都保存了集群的状态，只有 Master 节点才能修改集群的状态信息**，如果是任意节点都能修改信息就会导致数据的不一致性



> 集群状态（Cluster State），维护一个集群中必要的信息，主要包括如下信息

1. 所有的节点信息
2. 所有的索引和其相关的 Mapping 与 Setting 信息
3. 分片的路由信息



##### 数据节点（Data Node） & 协调节点（Coordinating Node）

- ==可以保存数据的节点叫作 Data Node==，负责保存分片上存储的所有数据，当集群无法保存现有数据的时候，可以通过增加数据节点来解决存储上的问题，在数据扩展上有至关重要的作用
- Coordinating Node 负责接收 Client 的请求，将请求分发到合适的节点，最终把结果汇集到一起返回给客户端，每个节点默认都起到了 Coordinating Node 的职责



##### 其他节点类型

- 冷热节点（Hot & Warm Node） ：热节点（Hot Node）就是配置高的节点，可以有更好的磁盘吞吐量和更好的 CPU，冷节点（Warm Node）存储一些比较旧的数据，这些节点的机器配置会比较低。不同硬件配置的 Data Node，用来实现 Hot & Warm 架构，降低集群部署的成本
- 机器学习节点（Machine Learning Node）：负责跑机器学习的工作，用来做异常检测
- 部落节点（Tribe Node）：连接到不同的 ES 集群，并且支持将这些集群当成一个单独的集群处理
- 预处理节点（Ingest Node）：预处理操作允许在索引文档之前，即写入数据之前，通过事先定义好的一系列的 processors（处理器）和 pipeline（管道），对数据进行某种转换、富化



##### 配置节点类型

> 开发环境中一个节点可以承担多种角色，生产环境中，应该设置单一的角色的节点（dedicated node）

| 节点类型          | 配置参数    | 默认值                                                    |
| ----------------- | ----------- | --------------------------------------------------------- |
| master-eligible   | node.master | true                                                      |
| data              | node.data   | true                                                      |
| ingest            | node.ingest | true                                                      |
| coordinating only | 无          | 每个节点默认都是coordinating节点，设置其他类型全部为false |
| machine learning  | node.ml     | true（需enable x-pack）                                   |



#### 分片

> 分片（Shard）体现的是物理空间的概念，**索引中的数据分散在分片上**

由于单台机器无法存储大量数据，ES 可以将一个索引中的数据切分为多个分片（Shard），分布在多台服务器上存储。有了分片就可以横向扩展，存储更多数据，让搜索和分析等操作分布到多台服务器上去执行，提升吞吐量和性能。

![image-20210714143505500](assets/image-20210714143505500.png)

**一个 ES 索引包含很多分片，一个分片是一个 Lucene 的索引**，它本身就是一个完整的搜索引擎，可以独立执行建立索引和搜索任务。**Lucene 索引又由很多分段组成，每个分段都是一个倒排索引。**ES 每次 refresh 都会生成一个新的分段，其中包含若干文档的数据。在每个分段内部，文档的不同字段被单独建立索引。**每个字段的值由若干词（Term）组成，Term 是原文本内容经过分词器处理和语言处理后的最终结果**（例如，去除标点符号和转换为词根）



> 分片分为两类，一类为**主分片（Primary Shard）**，另一类为**副本分片（Replica Shard）**

- 主分片主要用以**解决水平扩展**的问题，通过主分片，就可以将数据分布到集群上的所有节点上，一个主分片就是一个运行的 Lucene 实例，当我们在创建 ES 索引的时候，可以指定分片数，但是**主分片数在索引创建时指定，后续不允许修改，除非使用 Reindex 进行修改**
- 副本分片用以**解决数据高可用**的问题，也就是说集群中有节点出现硬件故障的时候，通过副本的方式，也可以保证数据不会产生真正的丢失，因为副本分片是主分片的拷贝，在索引中副本分片数可以动态调整，通过增加副本数，可以在一定程度上提高服务查询的性能（读取的吞吐）



**为索引设置主分片和副本分片：**

```json
PUT /blogs
{
    "settings" :{
        "number_of_shards" : 3, # 表示主分片数为 3
        "number_of_repicas" : 1 # 表示副本只有 1 份
    }
}
```



##### 分片的设定

> 分片的设定在生产环境中是十分重要的，很多时候需要提前做好容量规划，因为主分片在索引创建的时候需要预先设定的，并且在事后无法修改

在前面的例子中，一个索引被分成了 3 个主分片，这个集群即便增加再多节点，索引也只能分散在 3 个节点上



分片设置过大的时候，也会带来副作用，一方面来说会**影响搜索结果的打分**，影响统计结果的准确性，另外，单个节点上过多的分片，也会**导致资源浪费，同时也会影响性能**。从 7.0 版本开始，ES 的默认主分片数设置从 5 改为了 1，从这个方面也可以解决 over-sharding 的问题



##### REST API

- GET
- PUT
- POST
- DELETE
- HEAD





## 上手操作

### 启动

**Docker**

```shell
# es

# 1、拉取镜像
docker pull elasticsearch:7.6.2
# 2、创建挂载的目录
mkdir -p /mydata/elasticsearch/config
mkdir -p /mydata/elasticsearch/data
# 3、创建配置文件
echo "http.host: 0.0.0.0" >> /mydata/elasticsearch/config/elasticsearch.yml
# 4、创建容器并启动，单节点启动
# 9300 端口为 Elasticsearch 集群间组件的通信端口， 9200 端口为浏览器访问的 http协议 RESTful 端口
docker run --name es -p 9200:9200 -p 9300:9300  -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -v /mydata/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v /mydata/elasticsearch/data:/usr/share/elasticsearch/data -v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins -d elasticsearch:7.6.2

# 其中elasticsearch.yml是挂载的配置文件，data是挂载的数据，plugins是es的插件，如ik，而数据挂载需要权限，需要设置data文件的权限为可读可写,需要下边的指令。
# -e "discovery.type=single-node" 设置为单节点
# -e ES_JAVA_OPTS="-Xms256m -Xmx256m" \ 测试环境下，设置ES的初始内存和最大内存，否则导致过大启动不了ES

# 访问 http://localhost:9200 查看es启动情况
```

```shell
# kibana

# 1、拉取镜像
docker pull kibana:7.6.2

# 2、创建容器并启动
docker run --name kibana -e ELASTICSEARCH_HOSTS=http://IP地址:9200 -p 5601:5601 -d kibana:7.6.2

# 查看kibana启动日志
docker logs kibana

# 3、进入kibana容器修改相应内容
# 修改docker内kibana的配置文件 kibana/config/kibana.yml
docker exec -it kibana bash
cd config
cp kibana.yml kibana.yml.bak

vi kibana.yml
server.port: 5601
server.host: 0.0.0.0
elasticsearch.hosts: [ "http://公网IP地址:9200" ]
i18n.locale: "Zh-CN"

# 4、重启kibana

# 5、访问页面
# http://IP地址:5601/app/kibana
```



### 基本操作

#### 节点操作

```json
# 查看cat能进行的操作
GET _cat

# 查看所有节点
GET _cat/nodes

# 查看健康状态
GET _cat/health
```

#### 索引操作

```json
# 查看所有索引
GET _cat/indices

# 查看所有索引信息
GET /_all

# add
# 创建一个名为customer的索引
# pretty要求返回一个漂亮的json结果
PUT /customer?pretty

# update
POST

# delete
DELETE

# 判断索引是否存在
HEAD /indexName
```

#### 文档操作

 ```json
 # 创建文档
 POST /phone/_doc
 {
   "brand": "xiaomi",
   "title": "xiaomi Mi6",
   "price": 1999.00
 }
 
 # 创建指定Id文档
 POST /phone/_doc/1
 {
   "brand": "xiaomi",
   "title": "xiaomi Mi6",
   "price": 1999.00
 }
 
 # 查找指定id文档
 GET phone/_doc/1
 
 # 查找指定index下的所有数据
 GET phone/_search
 
 # 局部更新
 POST /phone/_update/1
 {
   "doc": {
     "brand": "XiaoMi",
     "title": "XiaoMi Mi6"
   }
 }
 
 # 删除
 DELETE phone/_doc/1
 ```



### 查询操作

#### 1、条件查询

```json
# URL带参查询
GET phone/_search?q=brand:小米

# 请求体带参查询
GET phone/_search
{
  "query": {
    "match": {
      "category": "小米"
    }
  }
}

# 请求体带参查询所有
GET phone/_search
{
  "query": {
    "match_all": {}
  }
}

# 查询指定字段
GET phone/_search
{
	"query":{
		"match_all":{}
	},
	"_source":["title"]
}
```

#### 2、分页查询

```json
GET phone/_search
{
	"query":{
		"match_all":{}
	},
	"from":0,
	"size":2
}
```

#### 3、排序查询

```json
GET phone/_search
{
	"query":{
		"match_all":{}
	},
	"sort":{
		"price":{ # 根据price字段排序
			"order":"desc"
		}
	}
}
```

#### 4、多条件查询&范围查询

```json
GET phone/_search
{
	"query":{
		"bool":{
			"must":[{ # must 相当于 &&
				"match":{
					"category":"小米"
				}
			},
			{
				"match":{
					"price":3999.00
				}
			}]
		}
	}
}

GET phone/_search
{
	"query":{
		"bool":{
			"should":[{ # should 相当于 ||
				"match":{
					"category":"小米"
				}
			},{
				"match":{
					"category":"华为"
				}
			}]
		},
        "filter":{
            "range":{ # range 范围查询
                "price":{
                    "gt":2000 # greater than
                }
            }
        }
	}
}
```

#### 5、完全匹配

```json
GET phone/_search
{
	"query":{
		"match_phrase":{
			"category" : "小"
		}
	}
}
```

#### 6、高亮查询

```json
GET phone/_search
{
	"query":{
		"match_phrase":{
			"category" : "小"
		}
	},
    "highlight":{
        "fields":{
            "category":{}
    }
  }
}
```

#### 7、聚合查询

> 聚合允许使用者对ES文档进行统计分析，类似与关系型数据库中的 group by，还有很多其他的聚合，例如取最大值max、平均值avg等

```json
# 以price聚合查询，查询结果附带原始数据
GET phone/_search
{
	"aggs":{
		"price_group":{
			"terms":{
				"field":"price"
			}
		}
	}
}

# 不附带原始数据
GET phone/_search
{
	"aggs":{
		"price_group":{
			"terms":{
				"field":"price"
			}
		}
	},
    "size":0
}
```



### 映射关系

```json
# 创建索引
PUT /user

# 创建映射
PUT /user/_mapping
{
    "properties": {
        "name":{
        	"type": "text", # 可进行模糊查询
        	"index": true
        },
        "sex":{
        	"type": "keyword", # 必须全文匹配才有结果
        	"index": true
        },
        "tel":{
        	"type": "keyword",
        	"index": false # 
        }
    }
}

# 查询映射
GET user/_mapping
```



## ElasticSearch Java API基础操作

**依赖**

```xml
<dependencies>
    <dependency>
        <groupId>org.elasticsearch</groupId>
        <artifactId>elasticsearch</artifactId>
        <version>7.6.2</version>
    </dependency>

    <!-- elasticsearch 的客户端 -->
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.6.2</version>
    </dependency>

    <!-- elasticsearch 依赖 2.x 的 log4j -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-api</artifactId>
        <version>2.8.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.8.2</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.9</version>
    </dependency>

    <!-- junit 单元测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
    </dependency>
</dependencies>
```

**代码**

```java
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

public class ESIndexTest {

    private RestHighLevelClient restHighLevelClient = null;

    /**
     * 建立连接
     */
    @Before
    public void init() {
        // 创建客户端对象
        restHighLevelClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );
    }

    /**
     * 创建索引
     */
    @Test
    public void addIndexTest() throws IOException {

          // 创建索引
          // CreateIndexRequest createIndexRequest = new CreateIndexRequest("user");
          // 发送请求，获取响应
          // CreateIndexResponse response = restHighLevelClient.indices().create(createIndexRequest, RequestOptions.DEFAULT);
          // boolean acknowledged = response.isAcknowledged();
          // Assert.assertTrue(acknowledged);

        // 查询索引
        // GetIndexRequest getIndexRequest = new GetIndexRequest("user", "phone");
        // GetIndexResponse response = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);

        // 删除索引
        // DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("user");
        // restHighLevelClient.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);

        restHighLevelClient.close();
    }
}
```

```java
package com.demo;

import com.demo.entity.User;
import com.demo.util.ElasticSearchConnector;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.index.query.TermsQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.search.sort.SortOrder;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;

/**
 * DocTest
 *
 * @author lgn
 */

public class DocTest {

    /**
     * 文档crud操作
     */
    @Test
    public void documentTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            IndexRequest indexRequest = new IndexRequest();

            // 设置索引及唯一性标识
            indexRequest.index("user").id("1001");

            User user = User.builder().name("zhangsan").gender("male").age(20).build();

            ObjectMapper objectMapper = new ObjectMapper();
            String userStr = objectMapper.writeValueAsString(user);

            // 添加文档数据，数据格式为 JSON 格式
            indexRequest.source(userStr, XContentType.JSON);

            // 新增
            IndexResponse response = client.index(indexRequest, RequestOptions.DEFAULT);
            // 修改
            // client.update(indexRequest, RequestOptions.DEFAULT);
            // 查询
            // client.get(indexRequest, RequestOptions.DEFAULT);
            // 删除
            // client.delete(indexRequest, RequestOptions.DEFAULT);

            System.out.println(response.getIndex());
            System.out.println(response.getId());
            System.out.println(response.getResult());

        });

    }

    /**
     * 批量操作
     */
    @Test
    public void bulkTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            BulkRequest bulkRequest = new BulkRequest();

            // 批量新增
            bulkRequest
                    .add(new IndexRequest().index("user").id("1002").source(XContentType.JSON, "name","lisi"))
                    .add(new IndexRequest().index("user").id("1003").source(XContentType.JSON, "name","wangwu"))
                    .add(new IndexRequest().index("user").id("1003").source(XContentType.JSON, "name","zhaoliu"));

            BulkResponse response = client.bulk(bulkRequest, RequestOptions.DEFAULT);

            // 批量删除
//            bulkRequest
//                    .add(new DeleteRequest().index("user").id("1001"))
//                    .add(new DeleteRequest().index("user").id("1002"));

            System.out.println(response.getTook());
            System.out.println(response.getItems());

        });

    }

    /**
     * 查询索引下的所有数据
     */
    @Test
    public void queryIndexAllTest() throws IOException {
        ElasticSearchConnector.connect(client -> {

            SearchRequest request = new SearchRequest();
            request.indices("user");
            // 构建查询的请求体
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            // 查询所有数据
            sourceBuilder.query(QueryBuilders.matchAllQuery());
            request.source(sourceBuilder);
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            // 查询匹配
            SearchHits hits = response.getHits();
            System.out.println("took:" + response.getTook());
            System.out.println("timeout:" + response.isTimedOut());
            System.out.println("total:" + hits.getTotalHits());
            System.out.println("MaxScore:" + hits.getMaxScore());
            System.out.println("hits========>>");
            for (SearchHit hit : hits) {
                //输出每条查询的结果信息
                System.out.println(hit.getSourceAsString());
            }
            System.out.println("<<========");

        });
    }

    /**
     * 条件查询
     */
    @Test
    public void conditionQueryTest() throws IOException {

        ElasticSearchConnector.connect(client -> {
            // 创建搜索请求对象
            SearchRequest request = new SearchRequest();
            request.indices("user");
            // 构建查询的请求体
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            sourceBuilder.query(QueryBuilders.termQuery("name", "lisi"));
            request.source(sourceBuilder);
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            // 查询匹配
            SearchHits hits = response.getHits();
            System.out.println("took:" + response.getTook());
            System.out.println("timeout:" + response.isTimedOut());
            System.out.println("total:" + hits.getTotalHits());
            System.out.println("MaxScore:" + hits.getMaxScore());
            System.out.println("hits========>>");
            for (SearchHit hit : hits) {
                //输出每条查询的结果信息
                System.out.println(hit.getSourceAsString());
            }
            System.out.println("<<========");
        });

    }

    /**
     * 分页查询
     */
    @Test
    public void queryByPageTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            // 创建搜索请求对象
            SearchRequest request = new SearchRequest();
            request.indices("user");
            // 构建查询的请求体
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            sourceBuilder.query(QueryBuilders.matchAllQuery());
            // 分页查询
            // 当前页其实索引(第一条数据的顺序号)， from
            sourceBuilder.from(0);

            // 每页显示多少条 size
            sourceBuilder.size(2);
            request.source(sourceBuilder);
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            // 查询匹配
            SearchHits hits = response.getHits();
            System.out.println("took:" + response.getTook());
            System.out.println("timeout:" + response.isTimedOut());
            System.out.println("total:" + hits.getTotalHits());
            System.out.println("MaxScore:" + hits.getMaxScore());
            System.out.println("hits========>>");
            for (SearchHit hit : hits) {
                //输出每条查询的结果信息
                System.out.println(hit.getSourceAsString());
            }
            System.out.println("<<========");
        });
    }

    /**
     * 查询排序
     */
    @Test
    public void queryByOrderTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            // 创建搜索请求对象
            SearchRequest request = new SearchRequest();
            request.indices("user");

            // 构建查询的请求体
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            sourceBuilder.query(QueryBuilders.matchAllQuery());
            // 排序
            sourceBuilder.sort("age", SortOrder.ASC);
            request.source(sourceBuilder);
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            // 查询匹配
            SearchHits hits = response.getHits();
            System.out.println("took:" + response.getTook());
            System.out.println("timeout:" + response.isTimedOut());
            System.out.println("total:" + hits.getTotalHits());
            System.out.println("MaxScore:" + hits.getMaxScore());
            System.out.println("hits========>>");
            for (SearchHit hit : hits) {
                //输出每条查询的结果信息
                System.out.println(hit.getSourceAsString());
            }
            System.out.println("<<========");
        });
    }

    @Test
    public void combineQueryTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            // 创建搜索请求对象
            SearchRequest request = new SearchRequest();
            request.indices("user");
            // 构建查询的请求体
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
            // 必须包含
            boolQueryBuilder.must(QueryBuilders.matchQuery("age", "20"));
            // 一定不含
            boolQueryBuilder.mustNot(QueryBuilders.matchQuery("name", "lisi"));
            // 可能包含
            boolQueryBuilder.should(QueryBuilders.matchQuery("sex", "male"));
            sourceBuilder.query(boolQueryBuilder);
            request.source(sourceBuilder);
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            // 查询匹配
            SearchHits hits = response.getHits();
            System.out.println("took:" + response.getTook());
            System.out.println("timeout:" + response.isTimedOut());
            System.out.println("total:" + hits.getTotalHits());
            System.out.println("MaxScore:" + hits.getMaxScore());
            System.out.println("hits========>>");
            for (SearchHit hit : hits) {
                //输出每条查询的结果信息
                System.out.println(hit.getSourceAsString());
            }
            System.out.println("<<========");
        });
    }

    /**
     * 范围查询
     */
    @Test
    public void rangeQueryTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            // 创建搜索请求对象
            SearchRequest request = new SearchRequest();
            request.indices("user");
            // 构建查询的请求体
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            RangeQueryBuilder rangeQuery = QueryBuilders.rangeQuery("age");
            // 大于等于
            //rangeQuery.gte("30");
            // 小于等于
            rangeQuery.lte("40");
            sourceBuilder.query(rangeQuery);
            request.source(sourceBuilder);
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            // 查询匹配
            SearchHits hits = response.getHits();
            System.out.println("took:" + response.getTook());
            System.out.println("timeout:" + response.isTimedOut());
            System.out.println("total:" + hits.getTotalHits());
            System.out.println("MaxScore:" + hits.getMaxScore());
            System.out.println("hits========>>");
            for (SearchHit hit : hits) {
                //输出每条查询的结果信息
                System.out.println(hit.getSourceAsString());
            }
            System.out.println("<<========");
        });
    }

    /**
     * 模糊查询 fuzzyQuery
     */
    @Test
    public void fuzzyQueryTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
// 创建搜索请求对象
            SearchRequest request = new SearchRequest();
            request.indices("user");
            // 构建查询的请求体
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            sourceBuilder.query(QueryBuilders.fuzzyQuery("name","lisi").fuzziness(Fuzziness.ONE));
            request.source(sourceBuilder);
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            // 查询匹配
            SearchHits hits = response.getHits();
            System.out.println("took:" + response.getTook());
            System.out.println("timeout:" + response.isTimedOut());
            System.out.println("total:" + hits.getTotalHits());
            System.out.println("MaxScore:" + hits.getMaxScore());
            System.out.println("hits========>>");
            for (SearchHit hit : hits) {
                //输出每条查询的结果信息
                System.out.println(hit.getSourceAsString());
            }
            System.out.println("<<========");
        });
    }

    /**
     * 高亮查询
     */
    @Test
    public void highlightQueryTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            // 高亮查询
            SearchRequest request = new SearchRequest().indices("user");
            //2.创建查询请求体构建器
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            //构建查询方式：高亮查询
            TermsQueryBuilder termsQueryBuilder =
                    QueryBuilders.termsQuery("name","zhangsan");
            //设置查询方式
            sourceBuilder.query(termsQueryBuilder);
            //构建高亮字段
            HighlightBuilder highlightBuilder = new HighlightBuilder();
            highlightBuilder.preTags("<font color='red'>");//设置标签前缀
            highlightBuilder.postTags("</font>");//设置标签后缀
            highlightBuilder.field("name");//设置高亮字段
            //设置高亮构建对象
            sourceBuilder.highlighter(highlightBuilder);
            //设置请求体
            request.source(sourceBuilder);
            //3.客户端发送请求，获取响应对象
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            //4.打印响应结果
            SearchHits hits = response.getHits();
            System.out.println("took::"+response.getTook());
            System.out.println("time_out::"+response.isTimedOut());
            System.out.println("total::"+hits.getTotalHits());
            System.out.println("max_score::"+hits.getMaxScore());
            System.out.println("hits::::>>");
            for (SearchHit hit : hits) {
                String sourceAsString = hit.getSourceAsString();
                System.out.println(sourceAsString);
                //打印高亮结果
                Map<String, HighlightField> highlightFields = hit.getHighlightFields();
                System.out.println(highlightFields);
            }
            System.out.println("<<::::");
        });
    }

    /**
     * 最大值查询
     */
    @Test
    public void maxValueQueryTest() throws IOException {
        ElasticSearchConnector.connect(client -> {
            // 高亮查询
            SearchRequest request = new SearchRequest().indices("user");
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            sourceBuilder.aggregation(AggregationBuilders.max("maxAge").field("age"));
            //设置请求体
            request.source(sourceBuilder);
            //3.客户端发送请求，获取响应对象
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            //4.打印响应结果
            SearchHits hits = response.getHits();
            System.out.println(response);
        });
    }

    /**
     * 分组查询
     */
    @Test
    public void queryByGroup() throws IOException {
        ElasticSearchConnector.connect(client -> {
            SearchRequest request = new SearchRequest().indices("user");
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            sourceBuilder.aggregation(AggregationBuilders.terms("age_groupby").field("age"));
            //设置请求体
            request.source(sourceBuilder);
            //3.客户端发送请求，获取响应对象
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            //4.打印响应结果
            SearchHits hits = response.getHits();
            System.out.println(response);
        });
    }

}
```





## SpringBoot集成ElasticSearch



**依赖**

```java
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.12.RELEASE</version>
    </parent>

    <groupId>com.demo</groupId>
    <artifactId>demo-es-boot</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- es -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
           
    </dependencies>

</project>
```

**配置**

```yaml
server:
  port: 8888

spring:
  application:
    name: demo-es-boot
  data:
    elasticsearch:
      repositories:
        enabled: true
  elasticsearch:
    rest:
      uris: http://localhost:9200
```

**代码**

```java
// 实体类
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Field(type = FieldType.Text)
    private String name;
    private Integer age;
    private String gender;

}

// elasticsearch repository类
public interface UserRepository extends ElasticsearchRepository<User, Long> {

    /**
     * findUserByName
     * @param name
     * @return com.demo.entity.User
     * @author lgn
     * @date 2021/7/15
     */
    User findUserByName(String name);

}

// 单元测试类
@RunWith(SpringRunner.class)
@SpringBootTest
public class ServiceTest {

    @Resource
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    public void test02() {

        Iterable<User> users = userRepository.findAll();
        for (User user : users) {
            System.out.println(user.toString());
        }
    }

    @Autowired
    ElasticsearchRestTemplate esTemplate;

    @Test
    public void test03() {
        User user = User.builder().name("wangwu").id(12L).age(21).gender("male").build();
        esTemplate.save(user);
    }

    @Test
    public void test04() {
        MatchQueryBuilder matchQuery = QueryBuilders.matchQuery("gender", "male");
        NativeSearchQuery query = new NativeSearchQueryBuilder().withQuery(matchQuery).build();
        long count = esTemplate.count(query, User.class);
        System.out.println(count);
    }

}
```



## 集群

> 单台 Elasticsearch 服务器提供服务，往往都有最大的负载能力，超过这个阈值，服务器性能就会大大降低甚至不可用，所以生产环境中，一般都是运行在指定服务器集群中

单点服务器存在的问题：

- 单台机器存储容量有限
- 单服务器容易出现单点故障，无法实现高可用
- 单服务的并发处理能力有限



> 一个 Elasticsearch 集群有一个唯一的名字标识，这个名字默认就是`elasticsearch`。这个名字是很重要的，因为一个节点只能通过指定某个集群的名字，来加入这个集群





## 参考

[ 一篇文章带你搞定 ElasticSearch 术语 ](https://mp.weixin.qq.com/s/tsoBovXDcB02KxvWu2_SpQ)

[Elasticsearch学习笔记_KISS-CSDN博客](https://blog.csdn.net/u011863024/article/details/115721328)

