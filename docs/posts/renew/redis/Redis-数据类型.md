# Redis 数据类型



## Key

>Redis keys are binary safe, this means that you can use any binary sequence as a key, from a string like "foo" to the content of a JPEG file. The empty string is also a valid key.
>
>Redis 支持二进制的 Key 值，使用空字符串来作 Key 也同样支持



> A few other rules about keys:
>
> * 太长的 key 不推荐，不仅消耗更多的内存空间，而且进行键值比较的消费也更大。
>
>   For instance a key of 1024 bytes is a bad idea not only memory-wise, but also because the lookup of the key in the dataset may require several costly key-comparisons. Even when the task at hand is to match the existence of a large value, hashing it (for example with SHA1) is a better idea, especially from the perspective of memory and bandwidth.
>
> * Very short keys are often not a good idea. 太短的 Key 不推荐
>
>   There is little point in writing "u1000flw" as a key if you can instead write "user:1000:followers". The latter is more readable and the added space is minor compared to the space used by the key object itself and the value object. While short keys will obviously consume a bit less memory, your job is to find the right balance.
>
> * Try to stick with a schema. 推荐给 Key 定制约束
>
>   For instance "object-type:id" is a good idea, as in "user:1000". Dots or dashes are often used for multi-word fields, as in "comment:4321:reply.to" or "comment:4321:reply-to".
>
> * The maximum allowed key size is 512 MB. 键值允许的最大 size 为 512MB



## String

