import{_ as s,o as e,c as n,Q as a}from"./chunks/framework.834b76fb.js";const y=JSON.parse('{"title":"Redis 配置详解","description":"","frontmatter":{},"headers":[],"relativePath":"posts/renew/redis/Redis-配置详解.md","filePath":"posts/renew/redis/Redis-配置详解.md"}'),l={name:"posts/renew/redis/Redis-配置详解.md"},p=a(`<h1 id="redis-配置详解" tabindex="-1">Redis 配置详解 <a class="header-anchor" href="#redis-配置详解" aria-label="Permalink to &quot;Redis 配置详解&quot;">​</a></h1><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><blockquote><p>详读 Redis 配置文件会发现一个词 “ASAP” 经常出现在文件中，是 &quot;As Soon As Possible&quot; 的缩写</p></blockquote><h2 id="线程与-io" tabindex="-1">线程与 IO <a class="header-anchor" href="#线程与-io" aria-label="Permalink to &quot;线程与 IO&quot;">​</a></h2><blockquote><p>Redis is mostly single threaded, however there are certain threaded operations such as UNLINK, slow I/O accesses and other things that are performed on side threads.</p><p>Redis 基本上可以说是单线程运行的，除了某些如 <code>UNLINK</code> 以及慢 IO 访问等需要其他需要多线程访问的情况</p></blockquote><blockquote><p>Now it is also possible to handle Redis clients socket reads and writes in different I/O threads.</p><p>Redis 目前可以使用不同的读写线程来进行读写操作</p><p>Since especially writing is so slow, normally Redis users use pipelining in order to speed up the Redis performances per core, and spawn multiple instances in order to scale more.</p><p>由于写入操作比较慢，Redis 通常使用管道以加速每个核心的写入性能，并且面对大量的写入场景会启用多个线程实例</p><p>Using I/O threads it is possible to easily speedup two times Redis without resorting to pipelining nor sharding of the instance.</p><p>使用多个读写线程可以不借助管道或者实例分片，将 Redis 的读写速率提高 2 倍</p></blockquote><br><h2 id="数据持久化" tabindex="-1">数据持久化 <a class="header-anchor" href="#数据持久化" aria-label="Permalink to &quot;数据持久化&quot;">​</a></h2><h3 id="rdb" tabindex="-1">RDB <a class="header-anchor" href="#rdb" aria-label="Permalink to &quot;RDB&quot;">​</a></h3><h4 id="同步策略" tabindex="-1">同步策略 <a class="header-anchor" href="#同步策略" aria-label="Permalink to &quot;同步策略&quot;">​</a></h4><blockquote><p>Save the DB to disk.</p><p><code>save &lt;seconds&gt; &lt;changes&gt; [&lt;seconds&gt; &lt;changes&gt; ...]</code></p><p>Redis will save the DB if the given number of seconds elapsed and it surpassed the given number of write operations against the DB.</p><p>Snapshotting can be completely disabled with a single empty string argument</p><p>as in following example:</p><p><code>save &quot;&quot;</code></p><p>Unless specified otherwise, by default Redis will save the DB:</p><ul><li>After 3600 seconds (an hour) if at least 1 change was performed</li><li>After 300 seconds (5 minutes) if at least 100 changes were performed</li><li>After 60 seconds if at least 10000 changes were performed</li></ul><p>You can set these explicitly by uncommenting the following line.</p><p><code>save 3600 1 300 100 60 10000</code></p></blockquote><h4 id="名称与路径" tabindex="-1">名称与路径 <a class="header-anchor" href="#名称与路径" aria-label="Permalink to &quot;名称与路径&quot;">​</a></h4><blockquote><p>The filename where to dump the DB</p><p><code>dbfilename dump.rdb</code></p><p>The working directory.</p><p>The DB will be written inside this directory, with the filename specified above using the &#39;dbfilename&#39; configuration directive. The Append Only File will also be created inside this directory.</p><p>Note that you must specify a directory here, not a file name.</p><p><code>dir /usr/local/var/db/redis/</code></p></blockquote><h4 id="错误恢复" tabindex="-1">错误恢复 <a class="header-anchor" href="#错误恢复" aria-label="Permalink to &quot;错误恢复&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"># By default Redis will stop accepting writes if RDB snapshots are enabled</span></span>
<span class="line"><span style="color:#e1e4e8;"># (at least one save point) and the latest background save failed.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 默认情况下，如果开启了 RDB 快照，且最近一次 RDB 后台保存失败，就会停止写操作</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># This will make the user aware (in a hard way) that data is not persisting</span></span>
<span class="line"><span style="color:#e1e4e8;"># on disk properly, otherwise chances are that no one will notice and some</span></span>
<span class="line"><span style="color:#e1e4e8;"># disaster will happen.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 这会以一种强硬的方式让用户知道，数据没能正确的在磁盘上进行持久化</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># If the background saving process will start working again Redis will</span></span>
<span class="line"><span style="color:#e1e4e8;"># automatically allow writes again.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 如果后台执行保存工作的进程重新运行，Redis 会重新自动允许写操作发生</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># However if you have setup your proper monitoring of the Redis server</span></span>
<span class="line"><span style="color:#e1e4e8;"># and persistence, you may want to disable this feature so that Redis will</span></span>
<span class="line"><span style="color:#e1e4e8;"># continue to work as usual even if there are problems with disk,</span></span>
<span class="line"><span style="color:#e1e4e8;"># permissions, and so forth.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 如果设置了自定义的监视器来监视 Redis 服务器的持久化，将此功能关闭后，即使</span></span>
<span class="line"><span style="color:#e1e4e8;"># 磁盘写入出现问题 Redis 也会照常工作</span></span>
<span class="line"><span style="color:#e1e4e8;">stop-writes-on-bgsave-error yes</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"># By default Redis will stop accepting writes if RDB snapshots are enabled</span></span>
<span class="line"><span style="color:#24292e;"># (at least one save point) and the latest background save failed.</span></span>
<span class="line"><span style="color:#24292e;"># 默认情况下，如果开启了 RDB 快照，且最近一次 RDB 后台保存失败，就会停止写操作</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># This will make the user aware (in a hard way) that data is not persisting</span></span>
<span class="line"><span style="color:#24292e;"># on disk properly, otherwise chances are that no one will notice and some</span></span>
<span class="line"><span style="color:#24292e;"># disaster will happen.</span></span>
<span class="line"><span style="color:#24292e;"># 这会以一种强硬的方式让用户知道，数据没能正确的在磁盘上进行持久化</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># If the background saving process will start working again Redis will</span></span>
<span class="line"><span style="color:#24292e;"># automatically allow writes again.</span></span>
<span class="line"><span style="color:#24292e;"># 如果后台执行保存工作的进程重新运行，Redis 会重新自动允许写操作发生</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># However if you have setup your proper monitoring of the Redis server</span></span>
<span class="line"><span style="color:#24292e;"># and persistence, you may want to disable this feature so that Redis will</span></span>
<span class="line"><span style="color:#24292e;"># continue to work as usual even if there are problems with disk,</span></span>
<span class="line"><span style="color:#24292e;"># permissions, and so forth.</span></span>
<span class="line"><span style="color:#24292e;"># 如果设置了自定义的监视器来监视 Redis 服务器的持久化，将此功能关闭后，即使</span></span>
<span class="line"><span style="color:#24292e;"># 磁盘写入出现问题 Redis 也会照常工作</span></span>
<span class="line"><span style="color:#24292e;">stop-writes-on-bgsave-error yes</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h4 id="压缩与校验" tabindex="-1">压缩与校验 <a class="header-anchor" href="#压缩与校验" aria-label="Permalink to &quot;压缩与校验&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"># Compress string objects using LZF when dump .rdb databases?</span></span>
<span class="line"><span style="color:#e1e4e8;"># 启动 LZF 压缩算法</span></span>
<span class="line"><span style="color:#e1e4e8;"># By default compression is enabled as it&#39;s almost always a win.</span></span>
<span class="line"><span style="color:#e1e4e8;"># If you want to save some CPU in the saving child set it to &#39;no&#39; but</span></span>
<span class="line"><span style="color:#e1e4e8;"># the dataset will likely be bigger if you have compressible values or keys.</span></span>
<span class="line"><span style="color:#e1e4e8;">rdbcompression yes</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># RDB 文件校验码，一般出现在 RDB 文件的尾部</span></span>
<span class="line"><span style="color:#e1e4e8;"># Since version 5 of RDB a CRC64 checksum is placed at the end of the file.</span></span>
<span class="line"><span style="color:#e1e4e8;"># This makes the format more resistant to corruption but there is a performance</span></span>
<span class="line"><span style="color:#e1e4e8;"># hit to pay (around 10%) when saving and loading RDB files, so you can disable it</span></span>
<span class="line"><span style="color:#e1e4e8;"># for maximum performances.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 在保证文件完整性和准确性上有很大保证，但是在保存 RDB 文件的时候会多大约 10% 的性能损耗</span></span>
<span class="line"><span style="color:#e1e4e8;"># 可将其禁用以获得更的高性能</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># RDB files created with checksum disabled have a checksum of zero that will</span></span>
<span class="line"><span style="color:#e1e4e8;"># tell the loading code to skip the check.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 将校验关闭后，RDB 文件尾部会使用 0 来作为标识，加载到拥有 0 标识的文件时会跳过校验</span></span>
<span class="line"><span style="color:#e1e4e8;">rdbchecksum yes</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"># Compress string objects using LZF when dump .rdb databases?</span></span>
<span class="line"><span style="color:#24292e;"># 启动 LZF 压缩算法</span></span>
<span class="line"><span style="color:#24292e;"># By default compression is enabled as it&#39;s almost always a win.</span></span>
<span class="line"><span style="color:#24292e;"># If you want to save some CPU in the saving child set it to &#39;no&#39; but</span></span>
<span class="line"><span style="color:#24292e;"># the dataset will likely be bigger if you have compressible values or keys.</span></span>
<span class="line"><span style="color:#24292e;">rdbcompression yes</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># RDB 文件校验码，一般出现在 RDB 文件的尾部</span></span>
<span class="line"><span style="color:#24292e;"># Since version 5 of RDB a CRC64 checksum is placed at the end of the file.</span></span>
<span class="line"><span style="color:#24292e;"># This makes the format more resistant to corruption but there is a performance</span></span>
<span class="line"><span style="color:#24292e;"># hit to pay (around 10%) when saving and loading RDB files, so you can disable it</span></span>
<span class="line"><span style="color:#24292e;"># for maximum performances.</span></span>
<span class="line"><span style="color:#24292e;"># 在保证文件完整性和准确性上有很大保证，但是在保存 RDB 文件的时候会多大约 10% 的性能损耗</span></span>
<span class="line"><span style="color:#24292e;"># 可将其禁用以获得更的高性能</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># RDB files created with checksum disabled have a checksum of zero that will</span></span>
<span class="line"><span style="color:#24292e;"># tell the loading code to skip the check.</span></span>
<span class="line"><span style="color:#24292e;"># 将校验关闭后，RDB 文件尾部会使用 0 来作为标识，加载到拥有 0 标识的文件时会跳过校验</span></span>
<span class="line"><span style="color:#24292e;">rdbchecksum yes</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h3 id="aof" tabindex="-1">AOF <a class="header-anchor" href="#aof" aria-label="Permalink to &quot;AOF&quot;">​</a></h3><blockquote><p>By default Redis asynchronously dumps the dataset on disk. This mode is good enough in many applications, but an issue with the Redis process or a power outage may result into a few minutes of writes lost (depending on the configured save points).</p><p>Redis 进程或者服务器断电等问题会导致存在几分钟的数据丢失</p><p>The Append Only File is an alternative persistence mode that provides much better durability. For instance using the default data fsync policy Redis can lose just one second of writes in a dramatic event like a server power outage, or a single write if something wrong with the Redis process itself happens, but the operating system is still running correctly.</p><p>AOF 可以提供一个更加完善的持久化方式，对于默认使用 <code>fsync</code> 策略的 Redis 服务器，在遇到服务器断电或者单个写程序线程在遇到问题时，仅会丢失几秒钟的数据</p><p>AOF and RDB persistence can be enabled at the same time without problems. If the AOF is enabled on startup Redis will load the AOF, that is the file with the better durability guarantees.</p><p>AOF 和 RDB 持久化可同时开启，在 Redis 启动时，如果同时存在 AOF 和 RDB 数据，会优先选择使用 AOF 持久化的数据来恢复，因为 AOF 具有更好的数据持久化保证</p></blockquote><p>在 Redis 中配置 <code>appendonly &lt;yes|no&gt;</code> 来修改 AOF 状态。</p><h4 id="同步策略-1" tabindex="-1">同步策略 <a class="header-anchor" href="#同步策略-1" aria-label="Permalink to &quot;同步策略&quot;">​</a></h4><p>当 Redis 开启 AOF 持久化时，Redis 会将所有的写命令以日志的形式追加到 AOF 文件中。当 AOF 文件过大时，Redis 会启动 AOF 重写操作，以此来压缩 AOF 文件。AOF 重写的过程是将内存中的数据库状态写入到新的 AOF 文件中。在这个过程中，Redis 可以采用两种同步策略：</p><ul><li>每次写入 AOF 文件时，都进行一次 fsync 操作，将缓冲区的数据刷入磁盘。这种方式会保证 AOF 文件的持久化和安全性，但是会导致写入性能下降。</li><li>Redis 从上次 fsync 操作以来，累计写入一定数量的数据后，才进行一次 fsync 操作。这种方式会提高写入性能，但是会带来数据安全性的风险。因为在 fsync 之前，数据仅停留在缓冲区中，如果系统出现宕机等异常情况，那么这部分数据就会丢失。</li></ul><blockquote><p>The <code>fsync()</code> call tells the Operating System to actually write data on disk instead of waiting for more data in the output buffer. Some OS will really flush data on disk, some other OS will just try to do it ASAP.</p><p>Redis supports three different modes:</p><ul><li>no: don&#39;t fsync, just let the OS flush the data when it wants. Faster.</li><li>always: fsync after every write to the append only log. Slow, Safest.</li><li>everysec: fsync only one time every second. Compromise.</li></ul><p>The default is &quot;everysec&quot;, as that&#39;s usually the right compromise between speed and data safety. It&#39;s up to you to understand if you can relax this to &quot;no&quot; that will let the operating system flush the output buffer when it wants, for better performances (but if you can live with the idea of some data loss consider the default persistence mode that&#39;s snapshotting), or on the contrary, use &quot;always&quot; that&#39;s very slow but a bit safer than everysec.</p><p><code>#appendfsync always</code></p><p><code>appendfsync everysec</code></p><p><code>#appendfsync no</code></p><p>调用 <code>fsync()</code> （Append-only file sync）会让操作系统将 AOF 文件直接写到磁盘上，无需等缓存中有足够 AOF 文件数据再转存至磁盘（不同的操作系统会有不同的响应，有些操作系统直接写入磁盘，而有些操作系统只是尝试尽量这样做）</p><p><code>appendfsync</code> 选项决定了写命令被追加到 AOF 文件后是否需要立即同步到磁盘：</p><ul><li>no 不会执行同步操作，让系统决定何时将 AOF 文件同步到磁盘</li><li>always 每次写命令被追加到 AOF 文件后都会立即同步到磁盘</li><li>everysec 每秒钟会执行一次同步操作</li></ul></blockquote><blockquote><p>When the AOF fsync policy is set to always or everysec, and a background saving process (a background save or AOF log background rewriting) is performing a lot of I/O against the disk, in some Linux configurations Redis may block too long on the fsync() call. Note that there is no fix for this currently, as even performing fsync in a different thread will block our synchronous write(2) call.</p><p>当 AOF 文件同步策略设置为 <em>always</em> 或 <em>everysec</em>，且存在一个后台进程正在执行大量的磁盘 IO 操作，在某些 Linux 上 Redis 可能会在调用 <code>fsync</code> 时阻塞很长的时间。目前还没有办法修复。</p><p>In order to mitigate this problem it&#39;s possible to use the following option that will prevent fsync() from being called in the main process while a BGSAVE or BGREWRITEAOF is in progress.</p><p>为了缓解这个问题，可以启用 <code>no-appendfsync-on-rewrite</code> 阻止主线程在执行 <code>BGSAVE</code> 或 <code>BGREWRITEAOF</code> 的时候调用 <code>fsync</code></p><p>This means that while another child is saving, the durability of Redis is the same as &quot;appendfsync no&quot;. In practical terms, this means that it is possible to lose up to 30 seconds of log in the worst scenario (with the default Linux settings).</p><p>当存在子线程进行保存备份操作的时候 Redis 的 AOF 文件同步策略相当于 <code>appendfsync no</code>，也就是说此时可能会丢失大概 30s 左右时间的数据</p><p><code>no-appendfsync-on-rewrite no</code></p></blockquote><h4 id="创建策略" tabindex="-1">创建策略 <a class="header-anchor" href="#创建策略" aria-label="Permalink to &quot;创建策略&quot;">​</a></h4><blockquote><p>Redis can create append-only base files in either RDB or AOF formats. Using the RDB format is always faster and more efficient, and disabling it is only supported for backward compatibility purposes. 默认使用 RDB 文件作为基准创建 AOF 文件</p><p><code>aof-use-rdb-preamble yes</code></p><p>Redis supports recording timestamp annotations in the AOF to support restoring the data from a specific point-in-time. However, using this capability changes the AOF format in a way that may not be compatible with existing AOF parsers. 是否给 AOF 记录加时间戳，可能存在兼容性问题</p><p><code>aof-timestamp-enabled no</code></p></blockquote><h4 id="名称与路径-1" tabindex="-1">名称与路径 <a class="header-anchor" href="#名称与路径-1" aria-label="Permalink to &quot;名称与路径&quot;">​</a></h4><p><strong>文件类型</strong></p><blockquote><p>Redis 7 and newer use a set of append-only files to persist the dataset and changes applied to it. Redis 7 之后使用一系列文件来进行数据持久化以及应用数据更改。</p><ul><li><p>Base files, which are a snapshot representing the complete state of the dataset at the time the file was created. Base files can be either in the form of RDB (binary serialized) or AOF (textual commands).</p><p>基础文件，表示快照文件创建时整个数据库中数据的状态，基础文件可以是 RDB 形式的文件，也可以是 AOF 文件</p></li><li><p>Incremental files, which contain additional commands that were applied to the dataset following the previous file.</p><p>增量文件，包含对基础文件之后针对数据集操作的附加命令</p></li></ul></blockquote><p><strong>文件名称</strong></p><blockquote><p>Append-only file names are created by Redis following a specific pattern. The file name&#39;s prefix is based on the &#39;appendfilename&#39; configuration parameter, followed by additional information about the sequence and type.</p><p><code>appendfilename &quot;appendonly.aof&quot;</code></p><p>For example, if appendfilename is set to appendonly.aof, the following file names could be derived:</p><p>---- appendonly.aof.1.base.rdb as a base file.</p><p>----- appendonly.aof.1.incr.aof, appendonly.aof.2.incr.aof as incremental files.</p><p>---- appendonly.aof.manifest as a manifest file.</p></blockquote><p><strong>文件保存路径</strong></p><blockquote><p>For convenience, Redis stores all persistent append-only files in a dedicated directory. The name of the directory is determined by the appenddirname configuration parameter.</p><p><code>appenddirname &quot;appendonlydir&quot;</code></p></blockquote><h4 id="文件重写" tabindex="-1">文件重写 <a class="header-anchor" href="#文件重写" aria-label="Permalink to &quot;文件重写&quot;">​</a></h4><blockquote><p>Automatic rewrite of the append only file. Redis is able to automatically rewrite the log file implicitly calling BGREWRITEAOF when the AOF log size grows by the specified percentage.</p><p>在 AOF 文件大小增长到指定范围时，Redis 能够通过隐式调用 BGREWRITEAOF 来重写 AOF 文件。</p><p>Redis remembers the size of the AOF file after the latest rewrite (if no rewrite has happened since the restart, the size of the AOF at startup is used).</p><p>This base size is compared to the current size. If the current size is bigger than the specified percentage, the rewrite is triggered. Also you need to specify a minimal size for the AOF file to be rewritten, this is useful to avoid rewriting the AOF file even if the percentage increase is reached but it is still pretty small.</p><p>Redis 会使用最新一次重写时 AOF 文件的大小来作为基准，如果还没进行过重写操作，则使用 Redis 启动时 AOF 文件的大小来作为基准。</p><p>用当前文件大于来和基准大小做比较，当前文件大小超过指定阈值，且大于基准大小乘上对应百分比，就会触发重写操作。默认是当 AOF 文件大于 64m 且大于上一次重写文件的 2 倍触发重写</p><p>Specify a percentage of zero in order to disable the automatic AOF rewrite feature.</p><p><code>auto-aof-rewrite-percentage 100</code><code>auto-aof-rewrite-min-size 64mb</code></p></blockquote><blockquote><p>When a child rewrites the AOF file, if the following option is enabled the file will be fsync-ed every 4 MB of data generated. This is useful in order to commit the file to the disk more incrementally and avoid big latency spikes.</p><p><code>aof-rewrite-incremental-fsync yes</code></p></blockquote><h4 id="文件校验" tabindex="-1">文件校验 <a class="header-anchor" href="#文件校验" aria-label="Permalink to &quot;文件校验&quot;">​</a></h4><blockquote><p>An AOF file may be found to be truncated at the end during the Redis startup process, when the AOF data gets loaded back into memory. This may happen when the system where Redis is running crashes, especially when an ext4 filesystem is mounted without the data=ordered option (however this can&#39;t happen when Redis itself crashes or aborts but the operating system still works correctly).</p><p>Redis can either exit with an error when this happens, or load as much data as possible (the default now) and start if the AOF file is found to be truncated at the end. The following option controls this behavior.</p><p>If aof-load-truncated is set to yes, a truncated AOF file is loaded and the Redis server starts emitting a log to inform the user of the event. Otherwise if the option is set to no, the server aborts with an error and refuses to start. When the option is set to no, the user requires to fix the AOF file using the &quot;redis-check-aof&quot; utility before to restart the server.</p><p>Note that if the AOF file will be found to be corrupted in the middle, the server will still exit with an error. This option only applies when Redis will try to read more data from the AOF file but not enough bytes will be found.</p><p><code>aof-load-truncated yes</code></p><p>Redis 启动过程中，将 AOF 数据加载回内存时，可能会发现 AOF 文件在末尾被截断。Redis 可能会因此退出，也可能继续加载数据并启动。</p><p>如果 <code>aof-load-truncated</code> 设置为 <em>yes</em>，Redis 会发送相关日志通知用户此事件；否则 Redis 会出错并拒绝启动。当设置为 <em>no</em> 时，需要使用 <code>redis-check-aof</code> 命令修复 AOF 文件才能重新启动；如果在加载 AOF 文件时发现文件损坏，Redis 服务会报错并退出。</p></blockquote><br><h2 id="内存管理" tabindex="-1">内存管理 <a class="header-anchor" href="#内存管理" aria-label="Permalink to &quot;内存管理&quot;">​</a></h2><h3 id="内存回收策略" tabindex="-1">内存回收策略 <a class="header-anchor" href="#内存回收策略" aria-label="Permalink to &quot;内存回收策略&quot;">​</a></h3><p>Redis 设置最大内存容量 <code>maxmemory &lt;bytes&gt;</code></p><blockquote><p>When the memory limit is reached Redis will try to remove keys according to the eviction policy selected.</p><p>If Redis can&#39;t remove keys according to the policy, or if the policy is set to <code>noeviction</code>, Redis will start to reply with errors to commands that would use more memory, like SET, LPUSH, and so on, and will continue to reply to read-only commands like GET.</p></blockquote><p><strong>POLICY</strong>:</p><ul><li>volatile-lru（Least Recently Used） -&gt; 从<strong>已设置过期</strong>时间数据中淘汰<strong>最近最少使用</strong>数据</li><li>allkeys-lru -&gt; 从<strong>所有</strong>数据中淘汰<strong>最近最少使用</strong>数据</li><li>volatile-lfu（Least Frequently Used） -&gt; 从<strong>已设置过期</strong>时间数据中淘汰<strong>最不经常使用</strong>数据</li><li>allkeys-lfu -&gt; 从<strong>所有</strong>数据中淘汰<strong>最不经常使用</strong>数据</li><li>volatile-random -&gt; 从<strong>已设置过期</strong>时间数据中<strong>随机</strong>淘汰数据</li><li>allkeys-random -&gt; 从<strong>所有</strong>时间数据中<strong>随机</strong>淘汰数据</li><li>volatile-ttl -&gt; 从<strong>已设置过期</strong>时间数据中移除将要过期数据</li><li>noeviction -&gt; 不淘汰数据，写入操作报错</li></ul><blockquote><p>Both LRU, LFU and volatile-ttl are implemented using approximated randomized algorithms(in order to save memory).</p></blockquote><blockquote><p>By default Redis will check five keys and pick the one that was used least recently, you can change the sample size using the following configuration directive.</p><p>默认一次检查 5 个 key，从其中一个选出满足策略的 key 并将其淘汰</p><p>The default of 5 produces good enough results. 10 Approximates very closely true LRU but costs more CPU. 3 is faster but not very accurate.</p></blockquote><h3 id="过期数据回收策略" tabindex="-1">过期数据回收策略 <a class="header-anchor" href="#过期数据回收策略" aria-label="Permalink to &quot;过期数据回收策略&quot;">​</a></h3><ul><li>在访问到过期 key 时将其删除；</li><li><strong>主动回收</strong>，在后台缓慢扫描寻找过期的 key，就可以释放过期/不会再被访问到的 key 占用的空间。</li></ul><p>Redis 的默认策略会尽量避免内存中存在超过 10% 的过期 Key，并尽量避免过期的 Key 消耗超过总内存 25% 的空间。</p><h3 id="key-删除原语" tabindex="-1">Key 删除原语 <a class="header-anchor" href="#key-删除原语" aria-label="Permalink to &quot;Key 删除原语&quot;">​</a></h3><p>Redis 中有两个删除 key 的原语：</p><ul><li><p>DEL</p><blockquote><p>DEL is a blocking deletion of the object. It means that the server stops processing new commands in order to reclaim all the memory associated with an object in a synchronous way.</p></blockquote><blockquote><p>If the key deleted is associated with a small object, the time needed in order to execute the DEL command is very small and comparable to most other O(1) or O(log_N) commands in Redis. However if the key is associated with an aggregated value containing millions of elements, the server can block for a long time (even seconds) in order to complete the operation.</p></blockquote></li><li><p>UNLINK</p><blockquote><p>For the above reasons Redis also offers non blocking deletion primitives UNLINK (non blocking DEL) and the ASYNC option of FLUSHALL and FLUSHDB commands, in order to reclaim memory in background.</p><p>Those commands are executed in constant time. Another thread will incrementally free the object in the background as fast as possible.</p><p>这些命令由一个线程在一定的时间内执行，另一个线程在后台尽可能快的释放内存</p></blockquote></li></ul><blockquote><p>DEL, UNLINK and ASYNC option of FLUSHALL and FLUSHDB are user-controlled. It&#39;s up to the design of the application to understand when it is a good idea to use one or the other.</p><p>以上删除命令是供用户使用的，由应用开发者来决定使用何种方式。</p></blockquote><blockquote><p>However the Redis server sometimes has to delete keys or flush the whole database as a side effect of other operations.</p><p>Redis 服务器有些时候也会主动的删除或者清空整个数据库数据，特别是以下这些场景：</p><p>Specifically Redis deletes objects independently of a user call in the following scenarios:</p><ol><li><p>On eviction, because of the maxmemory and maxmemory policy configurations, in order to make room for new data, without going over the specified memory limit.</p><p>达到最大内存限制</p></li><li><p>Because of expire: when a key with an associated time to live must be deleted from memory.</p><p>当 key 过期</p></li><li><p>Because of a side effect of a command that stores data on a key that may already exist. For example the RENAME command may delete the old key content when it is replaced with another one. Similarly SUNIONSTORE or SORT with STORE option may delete existing keys. The SET command itself removes any old content of the specified key in order to replace it with the specified string.</p><p>执行相关的命令可能会将以存在的数据删除，如 RENAME 命令会将旧的键值删除；类似的还有 SUNIONSTORE 和 带有 STORE 参数的 SORT 命令也会删除已存在的 key；常用的 SET 命令本身也会将旧的内容（如果存在）删除，并替换成新的内容</p></li><li><p>During replication, when a replica performs a full resynchronization with its master, the content of the whole database is removed in order to load the RDB file just transferred.</p><p>从库从主库接收到一个完整的 resynchronization 请求时，整个从库的数据都会被移除，然后重新加载刚传输过来的 RDB 文件数据</p></li></ol><p>In all the above cases the default is to delete objects in a blocking way, like if DEL was called. However you can configure each case specifically in order to instead release memory in a non-blocking way like if UNLINK was called, using the following configuration directives. 以上删除 Key 的方式都是阻塞进行的</p></blockquote><br><h2 id="高级配置" tabindex="-1">高级配置 <a class="header-anchor" href="#高级配置" aria-label="Permalink to &quot;高级配置&quot;">​</a></h2><h3 id="rehash" tabindex="-1">Rehash <a class="header-anchor" href="#rehash" aria-label="Permalink to &quot;Rehash&quot;">​</a></h3><blockquote><p>Active rehashing uses 1 millisecond every 100 milliseconds of CPU time in order to help rehashing the main Redis hash table (the one mapping top-level keys to values). The hash table implementation Redis uses (see dict.c) performs a lazy rehashing: the more operation you run into a hash table that is rehashing, the more rehashing &quot;steps&quot; are performed, so if the server is idle the rehashing is never complete and some more memory is used by the hash table.</p><p><code>activerehashing yes</code></p></blockquote><br><h2 id="内存碎片整理" tabindex="-1">内存碎片整理 <a class="header-anchor" href="#内存碎片整理" aria-label="Permalink to &quot;内存碎片整理&quot;">​</a></h2><h2 id="主从配置" tabindex="-1">主从配置 <a class="header-anchor" href="#主从配置" aria-label="Permalink to &quot;主从配置&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark has-diff vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"># Master-Replica replication. Use replicaof to make a Redis instance a copy of</span></span>
<span class="line"><span style="color:#e1e4e8;"># another Redis server. A few things to understand ASAP about Redis replication.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;">#   +------------------+      +---------------+</span></span>
<span class="line"><span style="color:#e1e4e8;">#   |      Master      | ---&gt; |    Replica    |</span></span>
<span class="line"><span style="color:#e1e4e8;">#   | (receive writes) |      |  (exact copy) |</span></span>
<span class="line"><span style="color:#e1e4e8;">#   +------------------+      +---------------+</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># 1) Redis replication is asynchronous, but you can configure a master to</span></span>
<span class="line"><span style="color:#e1e4e8;">#    stop accepting writes if it appears to be not connected with at least</span></span>
<span class="line"><span style="color:#e1e4e8;">#    a given number of replicas.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 2) Redis replicas are able to perform a partial resynchronization with the</span></span>
<span class="line"><span style="color:#e1e4e8;">#    master if the replication link is lost for a relatively small amount of</span></span>
<span class="line"><span style="color:#e1e4e8;">#    time. You may want to configure the replication backlog size (see the next</span></span>
<span class="line"><span style="color:#e1e4e8;">#    sections of this file) with a sensible value depending on your needs.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 3) Replication is automatic and does not need user intervention. After a</span></span>
<span class="line"><span style="color:#e1e4e8;">#    network partition replicas automatically try to reconnect to masters</span></span>
<span class="line"><span style="color:#e1e4e8;">#    and resynchronize with them.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># replicaof &lt;masterip&gt; &lt;masterport&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># If the master is password protected (using the &quot;requirepass&quot; configuration</span></span>
<span class="line"><span style="color:#e1e4e8;"># directive below) it is possible to tell the replica to authenticate before</span></span>
<span class="line"><span style="color:#e1e4e8;"># starting the replication synchronization process, otherwise the master will</span></span>
<span class="line"><span style="color:#e1e4e8;"># refuse the replica request.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># masterauth &lt;master-password&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># However this is not enough if you are using Redis ACLs (for Redis version</span></span>
<span class="line"><span style="color:#e1e4e8;"># 6 or greater), and the default user is not capable of running the PSYNC</span></span>
<span class="line"><span style="color:#e1e4e8;"># command and/or other commands needed for replication. In this case it&#39;s</span></span>
<span class="line"><span style="color:#e1e4e8;"># better to configure a special user to use with replication, and specify the</span></span>
<span class="line"><span style="color:#e1e4e8;"># masteruser configuration as such:</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># masteruser &lt;username&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># When masteruser is specified, the replica will authenticate against its</span></span>
<span class="line"><span style="color:#e1e4e8;"># master using the new AUTH form: AUTH &lt;username&gt; &lt;password&gt;.</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># When a replica loses its connection with the master, or when the replication</span></span>
<span class="line"><span style="color:#e1e4e8;"># is still in progress, the replica can act in two different ways:</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># 1) if replica-serve-stale-data is set to &#39;yes&#39; (the default) the replica will</span></span>
<span class="line"><span style="color:#e1e4e8;">#    still reply to client requests, possibly with out of date data, or the</span></span>
<span class="line"><span style="color:#e1e4e8;">#    data set may just be empty if this is the first synchronization.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># 2) If replica-serve-stale-data is set to &#39;no&#39; the replica will reply with error</span></span>
<span class="line"><span style="color:#e1e4e8;">#    &quot;MASTERDOWN Link with MASTER is down and replica-serve-stale-data is set to &#39;no&#39;&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">#    to all data access commands, excluding commands such as:</span></span>
<span class="line"><span style="color:#e1e4e8;">#    INFO, REPLICAOF, AUTH, SHUTDOWN, REPLCONF, ROLE, CONFIG, SUBSCRIBE,</span></span>
<span class="line"><span style="color:#e1e4e8;">#    UNSUBSCRIBE, PSUBSCRIBE, PUNSUBSCRIBE, PUBLISH, PUBSUB, COMMAND, POST,</span></span>
<span class="line"><span style="color:#e1e4e8;">#    HOST and LATENCY.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;">replica-serve-stale-data yes</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># You can configure a replica instance to accept writes or not. Writing against</span></span>
<span class="line"><span style="color:#e1e4e8;"># a replica instance may be useful to store some ephemeral data (because data</span></span>
<span class="line"><span style="color:#e1e4e8;"># written on a replica will be easily deleted after resync with the master) but</span></span>
<span class="line"><span style="color:#e1e4e8;"># may also cause problems if clients are writing to it because of a</span></span>
<span class="line"><span style="color:#e1e4e8;"># misconfiguration.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Since Redis 2.6 by default replicas are read-only.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Note: read only replicas are not designed to be exposed to untrusted clients</span></span>
<span class="line"><span style="color:#e1e4e8;"># on the internet. It&#39;s just a protection layer against misuse of the instance.</span></span>
<span class="line"><span style="color:#e1e4e8;"># Still a read only replica exports by default all the administrative commands</span></span>
<span class="line"><span style="color:#e1e4e8;"># such as CONFIG, DEBUG, and so forth. To a limited extent you can improve</span></span>
<span class="line"><span style="color:#e1e4e8;"># security of read only replicas using &#39;rename-command&#39; to shadow all the</span></span>
<span class="line"><span style="color:#e1e4e8;"># administrative / dangerous commands.</span></span>
<span class="line"><span style="color:#e1e4e8;">replica-read-only yes</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># Replication SYNC strategy: disk or socket.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># New replicas and reconnecting replicas that are not able to continue the</span></span>
<span class="line"><span style="color:#e1e4e8;"># replication process just receiving differences, need to do what is called a</span></span>
<span class="line"><span style="color:#e1e4e8;"># &quot;full synchronization&quot;. An RDB file is transmitted from the master to the</span></span>
<span class="line"><span style="color:#e1e4e8;"># replicas.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># The transmission can happen in two different ways:</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># 1) Disk-backed: The Redis master creates a new process that writes the RDB</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 file on disk. Later the file is transferred by the parent</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 process to the replicas incrementally.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 2) Diskless: The Redis master creates a new process that directly writes the</span></span>
<span class="line"><span style="color:#e1e4e8;">#              RDB file to replica sockets, without touching the disk at all.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># With disk-backed replication, while the RDB file is generated, more replicas</span></span>
<span class="line"><span style="color:#e1e4e8;"># can be queued and served with the RDB file as soon as the current child</span></span>
<span class="line"><span style="color:#e1e4e8;"># producing the RDB file finishes its work. With diskless replication instead</span></span>
<span class="line"><span style="color:#e1e4e8;"># once the transfer starts, new replicas arriving will be queued and a new</span></span>
<span class="line"><span style="color:#e1e4e8;"># transfer will start when the current one terminates.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># When diskless replication is used, the master waits a configurable amount of</span></span>
<span class="line"><span style="color:#e1e4e8;"># time (in seconds) before starting the transfer in the hope that multiple</span></span>
<span class="line"><span style="color:#e1e4e8;"># replicas will arrive and the transfer can be parallelized.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># With slow disks and fast (large bandwidth) networks, diskless replication</span></span>
<span class="line"><span style="color:#e1e4e8;"># works better.</span></span>
<span class="line"><span style="color:#e1e4e8;">repl-diskless-sync yes</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># When diskless replication is enabled, it is possible to configure the delay</span></span>
<span class="line"><span style="color:#e1e4e8;"># the server waits in order to spawn the child that transfers the RDB via socket</span></span>
<span class="line"><span style="color:#e1e4e8;"># to the replicas.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># This is important since once the transfer starts, it is not possible to serve</span></span>
<span class="line"><span style="color:#e1e4e8;"># new replicas arriving, that will be queued for the next RDB transfer, so the</span></span>
<span class="line"><span style="color:#e1e4e8;"># server waits a delay in order to let more replicas arrive.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># The delay is specified in seconds, and by default is 5 seconds. To disable</span></span>
<span class="line"><span style="color:#e1e4e8;"># it entirely just set it to 0 seconds and the transfer will start ASAP.</span></span>
<span class="line"><span style="color:#e1e4e8;">repl-diskless-sync-delay 5</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># When diskless replication is enabled with a delay, it is possible to let</span></span>
<span class="line"><span style="color:#e1e4e8;"># the replication start before the maximum delay is reached if the maximum</span></span>
<span class="line"><span style="color:#e1e4e8;"># number of replicas expected have connected. Default of 0 means that the</span></span>
<span class="line"><span style="color:#e1e4e8;"># maximum is not defined and Redis will wait the full delay.</span></span>
<span class="line"><span style="color:#e1e4e8;">repl-diskless-sync-max-replicas 0</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># -----------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#e1e4e8;"># WARNING: RDB diskless load is experimental. Since in this setup the replica</span></span>
<span class="line"><span style="color:#e1e4e8;"># does not immediately store an RDB on disk, it may cause data loss during</span></span>
<span class="line"><span style="color:#e1e4e8;"># failovers. RDB diskless load + Redis modules not handling I/O reads may also</span></span>
<span class="line"><span style="color:#e1e4e8;"># cause Redis to abort in case of I/O errors during the initial synchronization</span></span>
<span class="line"><span style="color:#e1e4e8;"># stage with the master. Use only if you know what you are doing.</span></span>
<span class="line"><span style="color:#e1e4e8;"># -----------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Replica can load the RDB it reads from the replication link directly from the</span></span>
<span class="line"><span style="color:#e1e4e8;"># socket, or store the RDB to a file and read that file after it was completely</span></span>
<span class="line"><span style="color:#e1e4e8;"># received from the master.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># In many cases the disk is slower than the network, and storing and loading</span></span>
<span class="line"><span style="color:#e1e4e8;"># the RDB file may increase replication time (and even increase the master&#39;s</span></span>
<span class="line"><span style="color:#e1e4e8;"># Copy on Write memory and replica buffers).</span></span>
<span class="line"><span style="color:#e1e4e8;"># However, parsing the RDB file directly from the socket may mean that we have</span></span>
<span class="line"><span style="color:#e1e4e8;"># to flush the contents of the current database before the full rdb was</span></span>
<span class="line"><span style="color:#e1e4e8;"># received. For this reason we have the following options:</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># &quot;disabled&quot;    - Don&#39;t use diskless load (store the rdb file to the disk first)</span></span>
<span class="line"><span style="color:#e1e4e8;"># &quot;on-empty-db&quot; - Use diskless load only when it is completely safe.</span></span>
<span class="line"><span style="color:#e1e4e8;"># &quot;swapdb&quot;      - Keep current db contents in RAM while parsing the data directly</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 from the socket. Replicas in this mode can keep serving current</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 data set while replication is in progress, except for cases where</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 they can&#39;t recognize master as having a data set from same</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 replication history.</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 Note that this requires sufficient memory, if you don&#39;t have it,</span></span>
<span class="line"><span style="color:#e1e4e8;">#                 you risk an OOM kill.</span></span>
<span class="line"><span style="color:#e1e4e8;">repl-diskless-load disabled</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># Master send PINGs to its replicas in a predefined interval. It&#39;s possible to</span></span>
<span class="line"><span style="color:#e1e4e8;"># change this interval with the repl_ping_replica_period option. The default</span></span>
<span class="line"><span style="color:#e1e4e8;"># value is 10 seconds.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># repl-ping-replica-period 10</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># The following option sets the replication timeout for:</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># 1) Bulk transfer I/O during SYNC, from the point of view of replica.</span></span>
<span class="line"><span style="color:#e1e4e8;"># 2) Master timeout from the point of view of replicas (data, pings).</span></span>
<span class="line"><span style="color:#e1e4e8;"># 3) Replica timeout from the point of view of masters (REPLCONF ACK pings).</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># It is important to make sure that this value is greater than the value</span></span>
<span class="line"><span style="color:#e1e4e8;"># specified for repl-ping-replica-period otherwise a timeout will be detected</span></span>
<span class="line"><span style="color:#e1e4e8;"># every time there is low traffic between the master and the replica. The default</span></span>
<span class="line"><span style="color:#e1e4e8;"># value is 60 seconds.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># repl-timeout 60</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># Disable TCP_NODELAY on the replica socket after SYNC?</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># If you select &quot;yes&quot; Redis will use a smaller number of TCP packets and</span></span>
<span class="line"><span style="color:#e1e4e8;"># less bandwidth to send data to replicas. But this can add a delay for</span></span>
<span class="line"><span style="color:#e1e4e8;"># the data to appear on the replica side, up to 40 milliseconds with</span></span>
<span class="line"><span style="color:#e1e4e8;"># Linux kernels using a default configuration.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># If you select &quot;no&quot; the delay for data to appear on the replica side will</span></span>
<span class="line"><span style="color:#e1e4e8;"># be reduced but more bandwidth will be used for replication.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># By default we optimize for low latency, but in very high traffic conditions</span></span>
<span class="line"><span style="color:#e1e4e8;"># or when the master and replicas are many hops away, turning this to &quot;yes&quot; may</span></span>
<span class="line"><span style="color:#e1e4e8;"># be a good idea.</span></span>
<span class="line"><span style="color:#e1e4e8;">repl-disable-tcp-nodelay no</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># Set the replication backlog size. The backlog is a buffer that accumulates</span></span>
<span class="line"><span style="color:#e1e4e8;"># replica data when replicas are disconnected for some time, so that when a</span></span>
<span class="line"><span style="color:#e1e4e8;"># replica wants to reconnect again, often a full resync is not needed, but a</span></span>
<span class="line"><span style="color:#e1e4e8;"># partial resync is enough, just passing the portion of data the replica</span></span>
<span class="line"><span style="color:#e1e4e8;"># missed while disconnected.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># The bigger the replication backlog, the longer the replica can endure the</span></span>
<span class="line"><span style="color:#e1e4e8;"># disconnect and later be able to perform a partial resynchronization.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># The backlog is only allocated if there is at least one replica connected.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># repl-backlog-size 1mb</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># After a master has no connected replicas for some time, the backlog will be</span></span>
<span class="line"><span style="color:#e1e4e8;"># freed. The following option configures the amount of seconds that need to</span></span>
<span class="line"><span style="color:#e1e4e8;"># elapse, starting from the time the last replica disconnected, for the backlog</span></span>
<span class="line"><span style="color:#e1e4e8;"># buffer to be freed.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Note that replicas never free the backlog for timeout, since they may be</span></span>
<span class="line"><span style="color:#e1e4e8;"># promoted to masters later, and should be able to correctly &quot;partially</span></span>
<span class="line"><span style="color:#e1e4e8;"># resynchronize&quot; with other replicas: hence they should always accumulate backlog.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># A value of 0 means to never release the backlog.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># repl-backlog-ttl 3600</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># The replica priority is an integer number published by Redis in the INFO</span></span>
<span class="line"><span style="color:#e1e4e8;"># output. It is used by Redis Sentinel in order to select a replica to promote</span></span>
<span class="line"><span style="color:#e1e4e8;"># into a master if the master is no longer working correctly.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># A replica with a low priority number is considered better for promotion, so</span></span>
<span class="line"><span style="color:#e1e4e8;"># for instance if there are three replicas with priority 10, 100, 25 Sentinel</span></span>
<span class="line"><span style="color:#e1e4e8;"># will pick the one with priority 10, that is the lowest.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># However a special priority of 0 marks the replica as not able to perform the</span></span>
<span class="line"><span style="color:#e1e4e8;"># role of master, so a replica with priority of 0 will never be selected by</span></span>
<span class="line"><span style="color:#e1e4e8;"># Redis Sentinel for promotion.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># By default the priority is 100.</span></span>
<span class="line"><span style="color:#e1e4e8;">replica-priority 100</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># The propagation error behavior controls how Redis will behave when it is</span></span>
<span class="line"><span style="color:#e1e4e8;"># unable to handle a command being processed in the replication stream from a master</span></span>
<span class="line"><span style="color:#e1e4e8;"># or processed while reading from an AOF file. Errors that occur during propagation</span></span>
<span class="line"><span style="color:#e1e4e8;"># are unexpected, and can cause data inconsistency. However, there are edge cases</span></span>
<span class="line"><span style="color:#e1e4e8;"># in earlier versions of Redis where it was possible for the server to replicate or persist</span></span>
<span class="line"><span style="color:#e1e4e8;"># commands that would fail on future versions. For this reason the default behavior</span></span>
<span class="line"><span style="color:#e1e4e8;"># is to ignore such errors and continue processing commands.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># If an application wants to ensure there is no data divergence, this configuration</span></span>
<span class="line"><span style="color:#e1e4e8;"># should be set to &#39;panic&#39; instead. The value can also be set to &#39;panic-on-replicas&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;"># to only panic when a replica encounters an error on the replication stream. One of</span></span>
<span class="line"><span style="color:#e1e4e8;"># these two panic values will become the default value in the future once there are</span></span>
<span class="line"><span style="color:#e1e4e8;"># sufficient safety mechanisms in place to prevent false positive crashes.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># propagation-error-behavior ignore</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># Replica ignore disk write errors controls the behavior of a replica when it is</span></span>
<span class="line"><span style="color:#e1e4e8;"># unable to persist a write command received from its master to disk. By default,</span></span>
<span class="line"><span style="color:#e1e4e8;"># this configuration is set to &#39;no&#39; and will crash the replica in this condition.</span></span>
<span class="line"><span style="color:#e1e4e8;"># It is not recommended to change this default, however in order to be compatible</span></span>
<span class="line"><span style="color:#e1e4e8;"># with older versions of Redis this config can be toggled to &#39;yes&#39; which will just</span></span>
<span class="line"><span style="color:#e1e4e8;"># log a warning and execute the write command it got from the master.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># replica-ignore-disk-write-errors no</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># -----------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#e1e4e8;"># By default, Redis Sentinel includes all replicas in its reports. A replica</span></span>
<span class="line"><span style="color:#e1e4e8;"># can be excluded from Redis Sentinel&#39;s announcements. An unannounced replica</span></span>
<span class="line"><span style="color:#e1e4e8;"># will be ignored by the &#39;sentinel replicas &lt;master&gt;&#39; command and won&#39;t be</span></span>
<span class="line"><span style="color:#e1e4e8;"># exposed to Redis Sentinel&#39;s clients.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># This option does not change the behavior of replica-priority. Even with</span></span>
<span class="line"><span style="color:#e1e4e8;"># replica-announced set to &#39;no&#39;, the replica can be promoted to master. To</span></span>
<span class="line"><span style="color:#e1e4e8;"># prevent this behavior, set replica-priority to 0.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># replica-announced yes</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># It is possible for a master to stop accepting writes if there are less than</span></span>
<span class="line"><span style="color:#e1e4e8;"># N replicas connected, having a lag less or equal than M seconds.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># The N replicas need to be in &quot;online&quot; state.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># The lag in seconds, that must be &lt;= the specified value, is calculated from</span></span>
<span class="line"><span style="color:#e1e4e8;"># the last ping received from the replica, that is usually sent every second.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># This option does not GUARANTEE that N replicas will accept the write, but</span></span>
<span class="line"><span style="color:#e1e4e8;"># will limit the window of exposure for lost writes in case not enough replicas</span></span>
<span class="line"><span style="color:#e1e4e8;"># are available, to the specified number of seconds.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># For example to require at least 3 replicas with a lag &lt;= 10 seconds use:</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># min-replicas-to-write 3</span></span>
<span class="line"><span style="color:#e1e4e8;"># min-replicas-max-lag 10</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Setting one or the other to 0 disables the feature.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># By default min-replicas-to-write is set to 0 (feature disabled) and</span></span>
<span class="line"><span style="color:#e1e4e8;"># min-replicas-max-lag is set to 10.</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># A Redis master is able to list the address and port of the attached</span></span>
<span class="line"><span style="color:#e1e4e8;"># replicas in different ways. For example the &quot;INFO replication&quot; section</span></span>
<span class="line"><span style="color:#e1e4e8;"># offers this information, which is used, among other tools, by</span></span>
<span class="line"><span style="color:#e1e4e8;"># Redis Sentinel in order to discover replica instances.</span></span>
<span class="line"><span style="color:#e1e4e8;"># Another place where this info is available is in the output of the</span></span>
<span class="line"><span style="color:#e1e4e8;"># &quot;ROLE&quot; command of a master.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># The listed IP address and port normally reported by a replica is</span></span>
<span class="line"><span style="color:#e1e4e8;"># obtained in the following way:</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;">#   IP: The address is auto detected by checking the peer address</span></span>
<span class="line"><span style="color:#e1e4e8;">#   of the socket used by the replica to connect with the master.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;">#   Port: The port is communicated by the replica during the replication</span></span>
<span class="line"><span style="color:#e1e4e8;">#   handshake, and is normally the port that the replica is using to</span></span>
<span class="line"><span style="color:#e1e4e8;">#   listen for connections.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># However when port forwarding or Network Address Translation (NAT) is</span></span>
<span class="line"><span style="color:#e1e4e8;"># used, the replica may actually be reachable via different IP and port</span></span>
<span class="line"><span style="color:#e1e4e8;"># pairs. The following two options can be used by a replica in order to</span></span>
<span class="line"><span style="color:#e1e4e8;"># report to its master a specific set of IP and port, so that both INFO</span></span>
<span class="line"><span style="color:#e1e4e8;"># and ROLE will report those values.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># There is no need to use both the options if you need to override just</span></span>
<span class="line"><span style="color:#e1e4e8;"># the port or the IP address.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># replica-announce-ip 5.5.5.5</span></span>
<span class="line"><span style="color:#e1e4e8;"># replica-announce-port 1234</span></span></code></pre><pre class="shiki github-light has-diff vp-code-light"><code><span class="line"><span style="color:#24292e;"># Master-Replica replication. Use replicaof to make a Redis instance a copy of</span></span>
<span class="line"><span style="color:#24292e;"># another Redis server. A few things to understand ASAP about Redis replication.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;">#   +------------------+      +---------------+</span></span>
<span class="line"><span style="color:#24292e;">#   |      Master      | ---&gt; |    Replica    |</span></span>
<span class="line"><span style="color:#24292e;">#   | (receive writes) |      |  (exact copy) |</span></span>
<span class="line"><span style="color:#24292e;">#   +------------------+      +---------------+</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># 1) Redis replication is asynchronous, but you can configure a master to</span></span>
<span class="line"><span style="color:#24292e;">#    stop accepting writes if it appears to be not connected with at least</span></span>
<span class="line"><span style="color:#24292e;">#    a given number of replicas.</span></span>
<span class="line"><span style="color:#24292e;"># 2) Redis replicas are able to perform a partial resynchronization with the</span></span>
<span class="line"><span style="color:#24292e;">#    master if the replication link is lost for a relatively small amount of</span></span>
<span class="line"><span style="color:#24292e;">#    time. You may want to configure the replication backlog size (see the next</span></span>
<span class="line"><span style="color:#24292e;">#    sections of this file) with a sensible value depending on your needs.</span></span>
<span class="line"><span style="color:#24292e;"># 3) Replication is automatic and does not need user intervention. After a</span></span>
<span class="line"><span style="color:#24292e;">#    network partition replicas automatically try to reconnect to masters</span></span>
<span class="line"><span style="color:#24292e;">#    and resynchronize with them.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># replicaof &lt;masterip&gt; &lt;masterport&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># If the master is password protected (using the &quot;requirepass&quot; configuration</span></span>
<span class="line"><span style="color:#24292e;"># directive below) it is possible to tell the replica to authenticate before</span></span>
<span class="line"><span style="color:#24292e;"># starting the replication synchronization process, otherwise the master will</span></span>
<span class="line"><span style="color:#24292e;"># refuse the replica request.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># masterauth &lt;master-password&gt;</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># However this is not enough if you are using Redis ACLs (for Redis version</span></span>
<span class="line"><span style="color:#24292e;"># 6 or greater), and the default user is not capable of running the PSYNC</span></span>
<span class="line"><span style="color:#24292e;"># command and/or other commands needed for replication. In this case it&#39;s</span></span>
<span class="line"><span style="color:#24292e;"># better to configure a special user to use with replication, and specify the</span></span>
<span class="line"><span style="color:#24292e;"># masteruser configuration as such:</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># masteruser &lt;username&gt;</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># When masteruser is specified, the replica will authenticate against its</span></span>
<span class="line"><span style="color:#24292e;"># master using the new AUTH form: AUTH &lt;username&gt; &lt;password&gt;.</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># When a replica loses its connection with the master, or when the replication</span></span>
<span class="line"><span style="color:#24292e;"># is still in progress, the replica can act in two different ways:</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># 1) if replica-serve-stale-data is set to &#39;yes&#39; (the default) the replica will</span></span>
<span class="line"><span style="color:#24292e;">#    still reply to client requests, possibly with out of date data, or the</span></span>
<span class="line"><span style="color:#24292e;">#    data set may just be empty if this is the first synchronization.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># 2) If replica-serve-stale-data is set to &#39;no&#39; the replica will reply with error</span></span>
<span class="line"><span style="color:#24292e;">#    &quot;MASTERDOWN Link with MASTER is down and replica-serve-stale-data is set to &#39;no&#39;&quot;</span></span>
<span class="line"><span style="color:#24292e;">#    to all data access commands, excluding commands such as:</span></span>
<span class="line"><span style="color:#24292e;">#    INFO, REPLICAOF, AUTH, SHUTDOWN, REPLCONF, ROLE, CONFIG, SUBSCRIBE,</span></span>
<span class="line"><span style="color:#24292e;">#    UNSUBSCRIBE, PSUBSCRIBE, PUNSUBSCRIBE, PUBLISH, PUBSUB, COMMAND, POST,</span></span>
<span class="line"><span style="color:#24292e;">#    HOST and LATENCY.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;">replica-serve-stale-data yes</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># You can configure a replica instance to accept writes or not. Writing against</span></span>
<span class="line"><span style="color:#24292e;"># a replica instance may be useful to store some ephemeral data (because data</span></span>
<span class="line"><span style="color:#24292e;"># written on a replica will be easily deleted after resync with the master) but</span></span>
<span class="line"><span style="color:#24292e;"># may also cause problems if clients are writing to it because of a</span></span>
<span class="line"><span style="color:#24292e;"># misconfiguration.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Since Redis 2.6 by default replicas are read-only.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Note: read only replicas are not designed to be exposed to untrusted clients</span></span>
<span class="line"><span style="color:#24292e;"># on the internet. It&#39;s just a protection layer against misuse of the instance.</span></span>
<span class="line"><span style="color:#24292e;"># Still a read only replica exports by default all the administrative commands</span></span>
<span class="line"><span style="color:#24292e;"># such as CONFIG, DEBUG, and so forth. To a limited extent you can improve</span></span>
<span class="line"><span style="color:#24292e;"># security of read only replicas using &#39;rename-command&#39; to shadow all the</span></span>
<span class="line"><span style="color:#24292e;"># administrative / dangerous commands.</span></span>
<span class="line"><span style="color:#24292e;">replica-read-only yes</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># Replication SYNC strategy: disk or socket.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># New replicas and reconnecting replicas that are not able to continue the</span></span>
<span class="line"><span style="color:#24292e;"># replication process just receiving differences, need to do what is called a</span></span>
<span class="line"><span style="color:#24292e;"># &quot;full synchronization&quot;. An RDB file is transmitted from the master to the</span></span>
<span class="line"><span style="color:#24292e;"># replicas.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># The transmission can happen in two different ways:</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># 1) Disk-backed: The Redis master creates a new process that writes the RDB</span></span>
<span class="line"><span style="color:#24292e;">#                 file on disk. Later the file is transferred by the parent</span></span>
<span class="line"><span style="color:#24292e;">#                 process to the replicas incrementally.</span></span>
<span class="line"><span style="color:#24292e;"># 2) Diskless: The Redis master creates a new process that directly writes the</span></span>
<span class="line"><span style="color:#24292e;">#              RDB file to replica sockets, without touching the disk at all.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># With disk-backed replication, while the RDB file is generated, more replicas</span></span>
<span class="line"><span style="color:#24292e;"># can be queued and served with the RDB file as soon as the current child</span></span>
<span class="line"><span style="color:#24292e;"># producing the RDB file finishes its work. With diskless replication instead</span></span>
<span class="line"><span style="color:#24292e;"># once the transfer starts, new replicas arriving will be queued and a new</span></span>
<span class="line"><span style="color:#24292e;"># transfer will start when the current one terminates.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># When diskless replication is used, the master waits a configurable amount of</span></span>
<span class="line"><span style="color:#24292e;"># time (in seconds) before starting the transfer in the hope that multiple</span></span>
<span class="line"><span style="color:#24292e;"># replicas will arrive and the transfer can be parallelized.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># With slow disks and fast (large bandwidth) networks, diskless replication</span></span>
<span class="line"><span style="color:#24292e;"># works better.</span></span>
<span class="line"><span style="color:#24292e;">repl-diskless-sync yes</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># When diskless replication is enabled, it is possible to configure the delay</span></span>
<span class="line"><span style="color:#24292e;"># the server waits in order to spawn the child that transfers the RDB via socket</span></span>
<span class="line"><span style="color:#24292e;"># to the replicas.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># This is important since once the transfer starts, it is not possible to serve</span></span>
<span class="line"><span style="color:#24292e;"># new replicas arriving, that will be queued for the next RDB transfer, so the</span></span>
<span class="line"><span style="color:#24292e;"># server waits a delay in order to let more replicas arrive.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># The delay is specified in seconds, and by default is 5 seconds. To disable</span></span>
<span class="line"><span style="color:#24292e;"># it entirely just set it to 0 seconds and the transfer will start ASAP.</span></span>
<span class="line"><span style="color:#24292e;">repl-diskless-sync-delay 5</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># When diskless replication is enabled with a delay, it is possible to let</span></span>
<span class="line"><span style="color:#24292e;"># the replication start before the maximum delay is reached if the maximum</span></span>
<span class="line"><span style="color:#24292e;"># number of replicas expected have connected. Default of 0 means that the</span></span>
<span class="line"><span style="color:#24292e;"># maximum is not defined and Redis will wait the full delay.</span></span>
<span class="line"><span style="color:#24292e;">repl-diskless-sync-max-replicas 0</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># -----------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#24292e;"># WARNING: RDB diskless load is experimental. Since in this setup the replica</span></span>
<span class="line"><span style="color:#24292e;"># does not immediately store an RDB on disk, it may cause data loss during</span></span>
<span class="line"><span style="color:#24292e;"># failovers. RDB diskless load + Redis modules not handling I/O reads may also</span></span>
<span class="line"><span style="color:#24292e;"># cause Redis to abort in case of I/O errors during the initial synchronization</span></span>
<span class="line"><span style="color:#24292e;"># stage with the master. Use only if you know what you are doing.</span></span>
<span class="line"><span style="color:#24292e;"># -----------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Replica can load the RDB it reads from the replication link directly from the</span></span>
<span class="line"><span style="color:#24292e;"># socket, or store the RDB to a file and read that file after it was completely</span></span>
<span class="line"><span style="color:#24292e;"># received from the master.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># In many cases the disk is slower than the network, and storing and loading</span></span>
<span class="line"><span style="color:#24292e;"># the RDB file may increase replication time (and even increase the master&#39;s</span></span>
<span class="line"><span style="color:#24292e;"># Copy on Write memory and replica buffers).</span></span>
<span class="line"><span style="color:#24292e;"># However, parsing the RDB file directly from the socket may mean that we have</span></span>
<span class="line"><span style="color:#24292e;"># to flush the contents of the current database before the full rdb was</span></span>
<span class="line"><span style="color:#24292e;"># received. For this reason we have the following options:</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># &quot;disabled&quot;    - Don&#39;t use diskless load (store the rdb file to the disk first)</span></span>
<span class="line"><span style="color:#24292e;"># &quot;on-empty-db&quot; - Use diskless load only when it is completely safe.</span></span>
<span class="line"><span style="color:#24292e;"># &quot;swapdb&quot;      - Keep current db contents in RAM while parsing the data directly</span></span>
<span class="line"><span style="color:#24292e;">#                 from the socket. Replicas in this mode can keep serving current</span></span>
<span class="line"><span style="color:#24292e;">#                 data set while replication is in progress, except for cases where</span></span>
<span class="line"><span style="color:#24292e;">#                 they can&#39;t recognize master as having a data set from same</span></span>
<span class="line"><span style="color:#24292e;">#                 replication history.</span></span>
<span class="line"><span style="color:#24292e;">#                 Note that this requires sufficient memory, if you don&#39;t have it,</span></span>
<span class="line"><span style="color:#24292e;">#                 you risk an OOM kill.</span></span>
<span class="line"><span style="color:#24292e;">repl-diskless-load disabled</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># Master send PINGs to its replicas in a predefined interval. It&#39;s possible to</span></span>
<span class="line"><span style="color:#24292e;"># change this interval with the repl_ping_replica_period option. The default</span></span>
<span class="line"><span style="color:#24292e;"># value is 10 seconds.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># repl-ping-replica-period 10</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># The following option sets the replication timeout for:</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># 1) Bulk transfer I/O during SYNC, from the point of view of replica.</span></span>
<span class="line"><span style="color:#24292e;"># 2) Master timeout from the point of view of replicas (data, pings).</span></span>
<span class="line"><span style="color:#24292e;"># 3) Replica timeout from the point of view of masters (REPLCONF ACK pings).</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># It is important to make sure that this value is greater than the value</span></span>
<span class="line"><span style="color:#24292e;"># specified for repl-ping-replica-period otherwise a timeout will be detected</span></span>
<span class="line"><span style="color:#24292e;"># every time there is low traffic between the master and the replica. The default</span></span>
<span class="line"><span style="color:#24292e;"># value is 60 seconds.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># repl-timeout 60</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># Disable TCP_NODELAY on the replica socket after SYNC?</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># If you select &quot;yes&quot; Redis will use a smaller number of TCP packets and</span></span>
<span class="line"><span style="color:#24292e;"># less bandwidth to send data to replicas. But this can add a delay for</span></span>
<span class="line"><span style="color:#24292e;"># the data to appear on the replica side, up to 40 milliseconds with</span></span>
<span class="line"><span style="color:#24292e;"># Linux kernels using a default configuration.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># If you select &quot;no&quot; the delay for data to appear on the replica side will</span></span>
<span class="line"><span style="color:#24292e;"># be reduced but more bandwidth will be used for replication.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># By default we optimize for low latency, but in very high traffic conditions</span></span>
<span class="line"><span style="color:#24292e;"># or when the master and replicas are many hops away, turning this to &quot;yes&quot; may</span></span>
<span class="line"><span style="color:#24292e;"># be a good idea.</span></span>
<span class="line"><span style="color:#24292e;">repl-disable-tcp-nodelay no</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># Set the replication backlog size. The backlog is a buffer that accumulates</span></span>
<span class="line"><span style="color:#24292e;"># replica data when replicas are disconnected for some time, so that when a</span></span>
<span class="line"><span style="color:#24292e;"># replica wants to reconnect again, often a full resync is not needed, but a</span></span>
<span class="line"><span style="color:#24292e;"># partial resync is enough, just passing the portion of data the replica</span></span>
<span class="line"><span style="color:#24292e;"># missed while disconnected.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># The bigger the replication backlog, the longer the replica can endure the</span></span>
<span class="line"><span style="color:#24292e;"># disconnect and later be able to perform a partial resynchronization.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># The backlog is only allocated if there is at least one replica connected.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># repl-backlog-size 1mb</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># After a master has no connected replicas for some time, the backlog will be</span></span>
<span class="line"><span style="color:#24292e;"># freed. The following option configures the amount of seconds that need to</span></span>
<span class="line"><span style="color:#24292e;"># elapse, starting from the time the last replica disconnected, for the backlog</span></span>
<span class="line"><span style="color:#24292e;"># buffer to be freed.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Note that replicas never free the backlog for timeout, since they may be</span></span>
<span class="line"><span style="color:#24292e;"># promoted to masters later, and should be able to correctly &quot;partially</span></span>
<span class="line"><span style="color:#24292e;"># resynchronize&quot; with other replicas: hence they should always accumulate backlog.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># A value of 0 means to never release the backlog.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># repl-backlog-ttl 3600</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># The replica priority is an integer number published by Redis in the INFO</span></span>
<span class="line"><span style="color:#24292e;"># output. It is used by Redis Sentinel in order to select a replica to promote</span></span>
<span class="line"><span style="color:#24292e;"># into a master if the master is no longer working correctly.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># A replica with a low priority number is considered better for promotion, so</span></span>
<span class="line"><span style="color:#24292e;"># for instance if there are three replicas with priority 10, 100, 25 Sentinel</span></span>
<span class="line"><span style="color:#24292e;"># will pick the one with priority 10, that is the lowest.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># However a special priority of 0 marks the replica as not able to perform the</span></span>
<span class="line"><span style="color:#24292e;"># role of master, so a replica with priority of 0 will never be selected by</span></span>
<span class="line"><span style="color:#24292e;"># Redis Sentinel for promotion.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># By default the priority is 100.</span></span>
<span class="line"><span style="color:#24292e;">replica-priority 100</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># The propagation error behavior controls how Redis will behave when it is</span></span>
<span class="line"><span style="color:#24292e;"># unable to handle a command being processed in the replication stream from a master</span></span>
<span class="line"><span style="color:#24292e;"># or processed while reading from an AOF file. Errors that occur during propagation</span></span>
<span class="line"><span style="color:#24292e;"># are unexpected, and can cause data inconsistency. However, there are edge cases</span></span>
<span class="line"><span style="color:#24292e;"># in earlier versions of Redis where it was possible for the server to replicate or persist</span></span>
<span class="line"><span style="color:#24292e;"># commands that would fail on future versions. For this reason the default behavior</span></span>
<span class="line"><span style="color:#24292e;"># is to ignore such errors and continue processing commands.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># If an application wants to ensure there is no data divergence, this configuration</span></span>
<span class="line"><span style="color:#24292e;"># should be set to &#39;panic&#39; instead. The value can also be set to &#39;panic-on-replicas&#39;</span></span>
<span class="line"><span style="color:#24292e;"># to only panic when a replica encounters an error on the replication stream. One of</span></span>
<span class="line"><span style="color:#24292e;"># these two panic values will become the default value in the future once there are</span></span>
<span class="line"><span style="color:#24292e;"># sufficient safety mechanisms in place to prevent false positive crashes.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># propagation-error-behavior ignore</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># Replica ignore disk write errors controls the behavior of a replica when it is</span></span>
<span class="line"><span style="color:#24292e;"># unable to persist a write command received from its master to disk. By default,</span></span>
<span class="line"><span style="color:#24292e;"># this configuration is set to &#39;no&#39; and will crash the replica in this condition.</span></span>
<span class="line"><span style="color:#24292e;"># It is not recommended to change this default, however in order to be compatible</span></span>
<span class="line"><span style="color:#24292e;"># with older versions of Redis this config can be toggled to &#39;yes&#39; which will just</span></span>
<span class="line"><span style="color:#24292e;"># log a warning and execute the write command it got from the master.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># replica-ignore-disk-write-errors no</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># -----------------------------------------------------------------------------</span></span>
<span class="line"><span style="color:#24292e;"># By default, Redis Sentinel includes all replicas in its reports. A replica</span></span>
<span class="line"><span style="color:#24292e;"># can be excluded from Redis Sentinel&#39;s announcements. An unannounced replica</span></span>
<span class="line"><span style="color:#24292e;"># will be ignored by the &#39;sentinel replicas &lt;master&gt;&#39; command and won&#39;t be</span></span>
<span class="line"><span style="color:#24292e;"># exposed to Redis Sentinel&#39;s clients.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># This option does not change the behavior of replica-priority. Even with</span></span>
<span class="line"><span style="color:#24292e;"># replica-announced set to &#39;no&#39;, the replica can be promoted to master. To</span></span>
<span class="line"><span style="color:#24292e;"># prevent this behavior, set replica-priority to 0.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># replica-announced yes</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># It is possible for a master to stop accepting writes if there are less than</span></span>
<span class="line"><span style="color:#24292e;"># N replicas connected, having a lag less or equal than M seconds.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># The N replicas need to be in &quot;online&quot; state.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># The lag in seconds, that must be &lt;= the specified value, is calculated from</span></span>
<span class="line"><span style="color:#24292e;"># the last ping received from the replica, that is usually sent every second.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># This option does not GUARANTEE that N replicas will accept the write, but</span></span>
<span class="line"><span style="color:#24292e;"># will limit the window of exposure for lost writes in case not enough replicas</span></span>
<span class="line"><span style="color:#24292e;"># are available, to the specified number of seconds.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># For example to require at least 3 replicas with a lag &lt;= 10 seconds use:</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># min-replicas-to-write 3</span></span>
<span class="line"><span style="color:#24292e;"># min-replicas-max-lag 10</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Setting one or the other to 0 disables the feature.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># By default min-replicas-to-write is set to 0 (feature disabled) and</span></span>
<span class="line"><span style="color:#24292e;"># min-replicas-max-lag is set to 10.</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># A Redis master is able to list the address and port of the attached</span></span>
<span class="line"><span style="color:#24292e;"># replicas in different ways. For example the &quot;INFO replication&quot; section</span></span>
<span class="line"><span style="color:#24292e;"># offers this information, which is used, among other tools, by</span></span>
<span class="line"><span style="color:#24292e;"># Redis Sentinel in order to discover replica instances.</span></span>
<span class="line"><span style="color:#24292e;"># Another place where this info is available is in the output of the</span></span>
<span class="line"><span style="color:#24292e;"># &quot;ROLE&quot; command of a master.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># The listed IP address and port normally reported by a replica is</span></span>
<span class="line"><span style="color:#24292e;"># obtained in the following way:</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;">#   IP: The address is auto detected by checking the peer address</span></span>
<span class="line"><span style="color:#24292e;">#   of the socket used by the replica to connect with the master.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;">#   Port: The port is communicated by the replica during the replication</span></span>
<span class="line"><span style="color:#24292e;">#   handshake, and is normally the port that the replica is using to</span></span>
<span class="line"><span style="color:#24292e;">#   listen for connections.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># However when port forwarding or Network Address Translation (NAT) is</span></span>
<span class="line"><span style="color:#24292e;"># used, the replica may actually be reachable via different IP and port</span></span>
<span class="line"><span style="color:#24292e;"># pairs. The following two options can be used by a replica in order to</span></span>
<span class="line"><span style="color:#24292e;"># report to its master a specific set of IP and port, so that both INFO</span></span>
<span class="line"><span style="color:#24292e;"># and ROLE will report those values.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># There is no need to use both the options if you need to override just</span></span>
<span class="line"><span style="color:#24292e;"># the port or the IP address.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># replica-announce-ip 5.5.5.5</span></span>
<span class="line"><span style="color:#24292e;"># replica-announce-port 1234</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br><span class="line-number">281</span><br><span class="line-number">282</span><br><span class="line-number">283</span><br><span class="line-number">284</span><br><span class="line-number">285</span><br><span class="line-number">286</span><br><span class="line-number">287</span><br><span class="line-number">288</span><br><span class="line-number">289</span><br><span class="line-number">290</span><br><span class="line-number">291</span><br><span class="line-number">292</span><br><span class="line-number">293</span><br><span class="line-number">294</span><br><span class="line-number">295</span><br><span class="line-number">296</span><br><span class="line-number">297</span><br><span class="line-number">298</span><br><span class="line-number">299</span><br><span class="line-number">300</span><br><span class="line-number">301</span><br><span class="line-number">302</span><br><span class="line-number">303</span><br><span class="line-number">304</span><br><span class="line-number">305</span><br><span class="line-number">306</span><br><span class="line-number">307</span><br><span class="line-number">308</span><br><span class="line-number">309</span><br><span class="line-number">310</span><br></div></div><h2 id="集群配置" tabindex="-1">集群配置 <a class="header-anchor" href="#集群配置" aria-label="Permalink to &quot;集群配置&quot;">​</a></h2><br><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p><a href="https://redis.io/topics/persistence" target="_blank" rel="noreferrer">Redis#persistence</a></p><p><a href="http://antirez.com/post/redis-persistence-demystified.html" target="_blank" rel="noreferrer">redis-persistence-demystified</a></p>`,69),o=[p];function t(i,r,c,d,h,u){return e(),n("div",null,o)}const m=s(l,[["render",t]]);export{y as __pageData,m as default};
