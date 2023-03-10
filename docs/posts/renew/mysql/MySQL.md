# MySQL



## 关系/非关系型数据库

### 关系型数据库

>A relational database stores data in separate tables rather than putting all the data in one big storeroom. The database structures are organized into physical files optimized for speed. The logical model, with objects such as databases, tables, views, rows, and columns, offers a flexible programming environment.

关系型数据库将数据存储在不同的数据表中，而不是将所有的数据放在一个大的存储空间中。关系型数据库结构被组织成物理文件，以优化速度。逻辑上，关系型数据库包含数据库/表/试图/行/列，并提供灵活的编程环境。



> You set up rules governing the relationships between different data fields, such as one-to-one, one-to-many, unique, required or optional, and “pointers” between different tables. The database enforces these rules, so that with a well-designed database, your application never sees inconsistent, duplicate, orphan, out-of-date, or missing data.

可以定义规则用来管理数据库中不同数据字段之间的关系，比如说，一对一，一对多，唯一，必须或可选，在不同的数据表之间还有对应的指针。数据库会强制执行这些规则，因此在一个良好设计的数据库中，运行在其上的应用程序不会看到不一致的，重复的，孤立的，过时的或丢失的数据。



**特点**

1、存储媒介：

关系型数据库的数据存储在**磁盘**，相比于存储在内存更加稳定；但是高并发下 IO 压力大，面对大量存储数据无法快速响应；

2、存储结构：

关系型数据库按照**结构化存储**数据，数据表提前定义好字段，再根据表的结构存入数据。提前定义结构使得数据表乃至整个数据库的可靠性和稳定性都比较高，可后续修改表结构不方便；

3、存储规范：

关系型数据库按照**数据表**的形式进行存储，避免存储重复数据，及规范化数据以充分利用存储空间；但表之间存在复杂的关系，随着数据表数量的增加，数据管理会越来越复杂；

4、扩展方式：

水平扩展（增加数量）和垂直扩展（按业务拆分）；

5、查询：

采用结构化查询语言（即 SQL）进行查询，可以进行复杂的查询，也支持创建查询索引，但后续需要同时兼顾数据和索引的存储/维护，海量数据的索引存储和维护开销也是巨大的；模糊查询/全文搜索能力较弱，可以考虑使用如 ElasticSearch 等非关系型数据库来实现；

6、事务：

关系型数据库强调 ACID 原则，十分强调数据的强一致性，对于事务的操作有很好的支持。关系型数据库可以控制事务原子性细粒度，方便回滚操作；

但要保证事务操作的特性就需要在数据库中加各种锁，而且数据量增长之后还要面对数据库的拆分，就需要解决分布式事务。



### 非关系型数据库

**特点**

0、存储媒介：非关系型数据库大多数（不是所有都是存储在内存）都是和内存打交道的，比如 Redis，数据存储在内存中，以实现数据高性能/高并发访问。因为内存的特殊性，无法保存强一致性的数据，使用情景更多是作为缓存使用；

1、高性能：NoSQL 数据库都具有非常高的读写性能，就算在大数据量下，同样表现优秀。这得益于它的无关系性，数据库的结构简单。一般 MySQ L使用 Query Cache。NoSQL 的 Cache 是记录级的，是一种细粒度的 Cache，所以 NoSQL 在这个层面上来说性能就要高很多；

2、高可用：NoSQL 在不太影响性能的情况，就可以方便地实现高可用的架构。通过复制模型也能实现高可用；

3、存储结构：NoSQL 无须为存储的数据提前建立字段，可以存储自定义的数据格式。常见的有键值/列簇/文档/图形等存储格式；

4、事务：非关系数据库不支持事务，无法保证数据的一致性和安全性。只适合处理海量数据，但是不一定安全；

5、查询：复杂的查询不容易实现。





<br>

## 数据类型

### char/varchar

> The `CHAR` and `VARCHAR` types are similar, but differ in the way they are stored and retrieved. They also differ in maximum length and in whether trailing spaces are retained.

`CHAR` 和 `VARCHAR` 类似，但是在存储和读取上有所不同。除此之外，在支持的最大长度和字符串末尾空格是否保留上也有差异。




> The `CHAR` and `VARCHAR` types are declared with a length that indicates the maximum number of characters you want to store.

`CHAR` 和 `VARCHAR` 在定义的时候都需要指定所存储的字符串的最大长度。




> The length of a `CHAR` column can be any value from 0 to 255. 
>
> Values in `VARCHAR` columns are variable-length strings. The length can be specified as a value from 0 to 65,535. The effective maximum length of a `VARCHAR` is subject to the maximum row size (65,535 bytes, which is shared among all columns) and the character set used.

`CHAR` 的长度是固定的，支持的范围为 0 到 255。

`VARCHAR` 是可变长度的字符串类型，它的长度范围为 0 到 65535。`VARCHAR` 的有效最大长度取决于行的最大值（65535 bytes， 由所有的数据列共享）和使用的字符集类型。




> When `CHAR` values are stored, they are right-padded with spaces to the specified length.
>
> When `CHAR` values are retrieved, trailing spaces are removed unless the [`PAD_CHAR_TO_FULL_LENGTH`](https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html#sqlmode_pad_char_to_full_length) SQL mode is enabled.

当存储 `CHAR` 类型的数据时，如果长度未达到创建表时的指定长度，会在末尾添加上一定长度的空格补全长度；当读取  `CHAR` 类型的数据时，除非开启 [`PAD_CHAR_TO_FULL_LENGTH`](https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html#sqlmode_pad_char_to_full_length) SQL 模式，否则末尾的空格会被移除。



> `VARCHAR` values are not padded when they are stored. Trailing spaces are retained when values are stored and retrieved, in conformance with standard SQL.

VARCHAR 列数据在存储时，若是数据长度未达到指定的长度，不会对其内容进行填充。依照标准的 SQL 执行模式，尾随空格在存储和读取的时候都会被保留下来。




> In contrast to `CHAR`, `VARCHAR` values are stored as a 1-byte or 2-byte length prefix plus data. The length prefix indicates the number of bytes in the value. A column uses one length byte if values require no more than 255 bytes, two length bytes if values may require more than 255 bytes.

与 `CHAR` 不同，`VARCHAR` 值存储为 1 字节或 2 字节的**长度前缀**加上数据。长度前缀表示所存储值的字节数。如果数值不超过 255 字节，一列使用 1 长度字节，如果数值超过 255 字节，则使用 2 个长度字节。



> If strict SQL mode is not enabled and you assign a value to a `CHAR` or `VARCHAR` column that exceeds the column's maximum length, the value is truncated to fit and a warning is generated. For truncation of nonspace characters, you can cause an error to occur (rather than a warning) and suppress insertion of the value by using strict SQL mode. 

如果没有开启 SQL 严格模式，当 char/varchar 列存储的数据达到了最大长度，超出的字符会被截断，并且会抛出警告。

如果开启了 SQL 严格模式，当 char/varchar 列存储的数据达到了最大长度，对于非空格字符的截断，可能会抛出错误。



> For `VARCHAR` columns, trailing spaces in excess of the column length are truncated prior to insertion and a warning is generated, regardless of the SQL mode in use. For `CHAR` columns, truncation of excess trailing spaces from inserted values is performed silently regardless of the SQL mode.

对于 varchar 列数据，不管 SQL 模式是否严格，如果插入的数据超过指定长度，其尾随空格会在插入前被截断，然后生成警告。

对于 char 列数据，不管 SQL 模式是否严格，如果插入的数据超过指定长度，其尾随空格会以静默的方式截断。



下列表格展示了 CHAR 和 VARCHAR 列在存储指定长度为 4 的值时的不同表现（假设列数据使用的字符集是单字节字符集，比如说 `latin1`）

| Value      | CHAR(4)  | Storage Required | VARCHAR(4) | **Storage Required** |
| ---------- | -------- | ---------------- | ---------- | -------------------- |
| ''         | `'    '` | 4 bytes          | ''         | 1 byte               |
| 'ab'       | `'ab  '` | 4 bytes          | 'ab'       | 3 bytes              |
| 'abcd'     | 'abcd'   | 4 bytes          | 'abcd'     | 5 bytes              |
| 'abcdefgh' | 'abcd'   | 4 bytes          | 'abcd'     | 5 bytes              |

> The values shown as stored in the last row of the table apply *only when not using strict SQL mode*; if strict mode is enabled, values that exceed the column length are *not stored*, and an error results.

需要注意，需要开启非严格 SQL 模式，上表中的最后一行数据才能被保存，否则超过长度的数据将不会被保存，并且还会报错。



> If a given value is stored into the `CHAR(4)` and `VARCHAR(4)` columns, the values retrieved from the columns are not always the same because trailing spaces are removed from `CHAR` columns upon retrieval. The following example illustrates this difference:

如果一个给定的值被保存到 CHAR(4) 和 VARCHAR(4) 列中，读取到的数据不一定总是相同的，因为 CHAR 列在读取数据的时候会将尾随空格去除。

```bash
mysql> CREATE TABLE vc (v VARCHAR(4), c CHAR(4));
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO vc VALUES ('ab  ', 'ab  ');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT CONCAT('(', v, ')'), CONCAT('(', c, ')') FROM vc;
+---------------------+---------------------+
| CONCAT('(', v, ')') | CONCAT('(', c, ')') |
+---------------------+---------------------+
| (ab  )              | (ab)                |
+---------------------+---------------------+
1 row in set (0.06 sec)
```

可以看到，读取到的 varchar 数据并没有去掉尾随空格，而 char 类型的数据去掉了尾随空格。



> `InnoDB` encodes fixed-length fields greater than or equal to 768 bytes in length as variable-length fields, which can be stored off-page. For example, a `CHAR(255)` column can exceed 768 bytes if the maximum byte length of the character set is greater than 3, as it is with `utf8mb4`.

InnoDB 会将长度大于或等于 768 字节的固定长度字段编码为可变长度字段，让数据可以在页外存储。如果字符集的最大字节长度大于 3，一个 CHAR(255) 列可以超过 768 字节，比如 utf8mb4。



> Values in `CHAR`, `VARCHAR`, and `TEXT` columns are sorted and compared according to the character set collation assigned to the column.

`CHAR`, `VARCHAR`, 和 `TEXT` 数据会根据分配给该列的字符集规则进行排序和比较。



## 正排/倒排索引





<br>

## 参考

[Sql Or NoSql](https://www.cnblogs.com/xrq730/p/11039384.html)

[关系型数据库和非关系型区别](https://www.huaweicloud.com/zhishi/1592288147096.html)

[The CHAR and VARCHAR Types](https://dev.mysql.com/doc/refman/8.0/en/char.html)
