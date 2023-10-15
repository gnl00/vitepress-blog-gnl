import{_ as s,o as n,c as a,Q as e}from"./chunks/framework.834b76fb.js";const m=JSON.parse('{"title":"Nginx","description":"","frontmatter":{},"headers":[],"relativePath":"posts/dpl/nginx/Nginx.md","filePath":"posts/dpl/nginx/Nginx.md"}'),l={name:"posts/dpl/nginx/Nginx.md"},p=e(`<h1 id="nginx" tabindex="-1">Nginx <a class="header-anchor" href="#nginx" aria-label="Permalink to &quot;Nginx&quot;">​</a></h1><blockquote><p>Nginx（Ngine X），是一个高性能，高可用的Web和方向代理服务器，可用于HTTP、HTTPS、SMTP、POP3和IMAP协议。它的设计不像传统的服务器一样使用线程处理请求，而是采用事件驱动机制，即一种异步的时间驱动结构。</p></blockquote><h2 id="操作" tabindex="-1">操作 <a class="header-anchor" href="#操作" aria-label="Permalink to &quot;操作&quot;">​</a></h2><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># 启动 nginx 服务</span></span>
<span class="line"><span style="color:#B392F0;">start</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">nginx</span><span style="color:#E1E4E8;"> </span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 修改配置后重新加载生效</span></span>
<span class="line"><span style="color:#B392F0;">nginx</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-s</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 重新打开日志文件</span></span>
<span class="line"><span style="color:#B392F0;">nginx</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-s</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">reopen</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 测试nginx配置文件是否正确</span></span>
<span class="line"><span style="color:#B392F0;">nginx</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-t</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-c</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/path/to/nginx.conf</span><span style="color:#E1E4E8;"> </span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 验证配置是否正确</span></span>
<span class="line"><span style="color:#B392F0;">nginx</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 查看Nginx的版本号</span></span>
<span class="line"><span style="color:#B392F0;">nginx</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-V</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 快速停止或关闭 Nginx</span></span>
<span class="line"><span style="color:#B392F0;">nginx</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-s</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">stop</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 正常停止或关闭 Nginx：</span></span>
<span class="line"><span style="color:#B392F0;">nginx</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-s</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">quit</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># 启动 nginx 服务</span></span>
<span class="line"><span style="color:#6F42C1;">start</span><span style="color:#24292E;"> </span><span style="color:#032F62;">nginx</span><span style="color:#24292E;"> </span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 修改配置后重新加载生效</span></span>
<span class="line"><span style="color:#6F42C1;">nginx</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-s</span><span style="color:#24292E;"> </span><span style="color:#032F62;">reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 重新打开日志文件</span></span>
<span class="line"><span style="color:#6F42C1;">nginx</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-s</span><span style="color:#24292E;"> </span><span style="color:#032F62;">reopen</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 测试nginx配置文件是否正确</span></span>
<span class="line"><span style="color:#6F42C1;">nginx</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-t</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-c</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/path/to/nginx.conf</span><span style="color:#24292E;"> </span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 验证配置是否正确</span></span>
<span class="line"><span style="color:#6F42C1;">nginx</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 查看Nginx的版本号</span></span>
<span class="line"><span style="color:#6F42C1;">nginx</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-V</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 快速停止或关闭 Nginx</span></span>
<span class="line"><span style="color:#6F42C1;">nginx</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-s</span><span style="color:#24292E;"> </span><span style="color:#032F62;">stop</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 正常停止或关闭 Nginx：</span></span>
<span class="line"><span style="color:#6F42C1;">nginx</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-s</span><span style="color:#24292E;"> </span><span style="color:#032F62;">quit</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h2 id="特点" tabindex="-1">特点 <a class="header-anchor" href="#特点" aria-label="Permalink to &quot;特点&quot;">​</a></h2><ul><li>高并发，高性能。Nginx可以比其他服务器更快地响应请求</li><li>模块化架构，且模块之间耦合度低，使得它的扩展性非常好</li><li>异步非阻塞的事件驱动模型，与<code>Node.js</code>类似</li><li>支持热部署、平滑升级，相对于其它服务器来说，它可以连续几个月甚至更长的时间不需要重启服务器，使得它具有高可靠性</li><li>低内存消耗</li></ul><h2 id="功能" tabindex="-1">功能 <a class="header-anchor" href="#功能" aria-label="Permalink to &quot;功能&quot;">​</a></h2><h3 id="动静分离-处理静态资源" tabindex="-1">动静分离/处理静态资源 <a class="header-anchor" href="#动静分离-处理静态资源" aria-label="Permalink to &quot;动静分离/处理静态资源&quot;">​</a></h3><blockquote><p>动静分离即处理静态资源服务，动静分离是指在 <code>web</code> 服务器架构中，将静态页面与动态页面或者静态内容接口和动态内容接口分开不同系统访问的架构设计方法，进而提升整个服务的访问性和可维护性</p></blockquote><p><strong>特点</strong></p><ul><li><p>由于 <code>Nginx</code> 的高并发和静态资源缓存等特性，经常将静态资源部署在 <code>Nginx</code> 上</p></li><li><p>如果请求的是静态资源，直接到静态资源目录获取资源，如果是动态资源的请求，则利用反向代理的原理，把请求转发给对应后台应用去处理，从而实现动静分离</p></li><li><p>优点</p><p>使用前后端分离后，可以很大程度提升静态资源的访问速度，即使动态服务不可用，静态资源的访问也不会受到影响</p></li></ul><p><strong>配置</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">	# 处理静态资源</span></span>
<span class="line"><span style="color:#e1e4e8;">	server {</span></span>
<span class="line"><span style="color:#e1e4e8;">	    listen 80;</span></span>
<span class="line"><span style="color:#e1e4e8;">	    </span></span>
<span class="line"><span style="color:#e1e4e8;">	    location /static/ {</span></span>
<span class="line"><span style="color:#e1e4e8;">	        # 使用alias的话路径后必须要加 / ==&gt; /etc/nginx/static/</span></span>
<span class="line"><span style="color:#e1e4e8;">	        alias  /静态资源存放路径/;</span></span>
<span class="line"><span style="color:#e1e4e8;">	        autoindex on;</span></span>
<span class="line"><span style="color:#e1e4e8;">	    }</span></span>
<span class="line"><span style="color:#e1e4e8;">	}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">	# 处理静态资源</span></span>
<span class="line"><span style="color:#24292e;">	server {</span></span>
<span class="line"><span style="color:#24292e;">	    listen 80;</span></span>
<span class="line"><span style="color:#24292e;">	    </span></span>
<span class="line"><span style="color:#24292e;">	    location /static/ {</span></span>
<span class="line"><span style="color:#24292e;">	        # 使用alias的话路径后必须要加 / ==&gt; /etc/nginx/static/</span></span>
<span class="line"><span style="color:#24292e;">	        alias  /静态资源存放路径/;</span></span>
<span class="line"><span style="color:#24292e;">	        autoindex on;</span></span>
<span class="line"><span style="color:#24292e;">	    }</span></span>
<span class="line"><span style="color:#24292e;">	}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="正向代理" tabindex="-1">正向代理 <a class="header-anchor" href="#正向代理" aria-label="Permalink to &quot;正向代理&quot;">​</a></h3><blockquote><p>为客户端（用户）代理。意思是一个位于客户端和原始服务器(Origin Server)之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端</p></blockquote><p><strong>特点</strong></p><ul><li>正向代理是为用户服务的，即为客户端服务的，客户端可以根据正向代理访问到它本身无法访问到的服务器资源</li><li>正向代理对用户是透明的，对服务端是非透明的，即服务端并不知道自己收到的是来自代理的访问还是来自真实客户端的访问</li></ul><h3 id="反向代理" tabindex="-1">反向代理 <a class="header-anchor" href="#反向代理" aria-label="Permalink to &quot;反向代理&quot;">​</a></h3><blockquote><p>为服务器代理，反向代理（Reverse Proxy）方式是指以代理服务器来接受网络上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给网络上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器</p></blockquote><p><strong>特点</strong></p><ul><li>反向代理是为服务端服务的，反向代理可以帮助服务器接收来自客户端的请求，帮助服务器做请求转发，负载均衡等</li><li>反向代理对服务端是透明的，对用户是非透明的，即用户并不知道自己访问的是代理服务器，而服务器知道反向代理在为他服务</li><li>优点 <ol><li>隐藏真实服务器</li><li>动静分离，提升系统性能</li><li>负载均衡，便于横向扩充后端动态服务</li></ol></li></ul><p><strong>参数</strong></p><p><strong>proxy_pass</strong>，，定义在<code>location</code>块中，用于配置代理服务器</p><ul><li><p>语法为<code>proxy_pass URL</code></p></li><li><p><code>URL</code> 必须以 <code>http</code> 或 <code>https</code> 开头</p></li><li><p><code>URL</code> 中可以携带变量</p></li><li><p><code>URL</code> 中是否带 <code>URI</code> ，会直接影响发往上游请求的 <code>URL</code></p></li><li><p>两种常见的 <code>URL</code> 用法</p><ol><li><p><code>proxy_pass http://127.0.0.1:8080</code></p></li><li><p><code>proxy_pass http://127.0.0.1:8080/</code></p><p>两种用法的区别就是带 <code>/</code> 和不带 <code>/</code></p><ul><li>不带<code>/</code>，用户请求 <code>URL</code> ：<code>/bbs/abc/test.html</code>，请求到达上游应用服务器的 <code>URL</code> ：<code>/bbs/abc/test.html</code></li><li>带 <code>/</code> ，用户请求 <code>URL</code> ：<code>/bbs/abc/test.html</code>，请求到达上游应用服务器的 <code>URL</code> ：<code>/abc/test.html</code></li></ul></li></ol></li></ul><p><strong>配置</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">    # 反向代理设置</span></span>
<span class="line"><span style="color:#e1e4e8;">    server {</span></span>
<span class="line"><span style="color:#e1e4e8;">        # 监听80端口</span></span>
<span class="line"><span style="color:#e1e4e8;">        listen 80;</span></span>
<span class="line"><span style="color:#e1e4e8;">        server_name localhost;</span></span>
<span class="line"><span style="color:#e1e4e8;">        </span></span>
<span class="line"><span style="color:#e1e4e8;">        # 代理路径 将对 localhost:80/ 的访问代理到 proxy_pass http://127.0.0.1:8082/</span></span>
<span class="line"><span style="color:#e1e4e8;">        # / 为基础配置，一般配置在其他location的最下方</span></span>
<span class="line"><span style="color:#e1e4e8;">        location / {</span></span>
<span class="line"><span style="color:#e1e4e8;">            proxy_pass http://127.0.0.1:8082;</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">    </span></span>
<span class="line"><span style="color:#e1e4e8;">    # 反向代理设置</span></span>
<span class="line"><span style="color:#e1e4e8;">    server {</span></span>
<span class="line"><span style="color:#e1e4e8;">        listen 80;</span></span>
<span class="line"><span style="color:#e1e4e8;">        server_name www.nginx-test.com;</span></span>
<span class="line"><span style="color:#e1e4e8;">        </span></span>
<span class="line"><span style="color:#e1e4e8;">        # 匹配 www.nginx-test.com/8082/* 路径</span></span>
<span class="line"><span style="color:#e1e4e8;">        location /8082/ {</span></span>
<span class="line"><span style="color:#e1e4e8;">            proxy_pass http://127.0.0.1:8082;</span></span>
<span class="line"><span style="color:#e1e4e8;">            </span></span>
<span class="line"><span style="color:#e1e4e8;">            rewrite &quot;^/8082/(.*)$&quot; /$1 break;</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">    # 反向代理设置</span></span>
<span class="line"><span style="color:#24292e;">    server {</span></span>
<span class="line"><span style="color:#24292e;">        # 监听80端口</span></span>
<span class="line"><span style="color:#24292e;">        listen 80;</span></span>
<span class="line"><span style="color:#24292e;">        server_name localhost;</span></span>
<span class="line"><span style="color:#24292e;">        </span></span>
<span class="line"><span style="color:#24292e;">        # 代理路径 将对 localhost:80/ 的访问代理到 proxy_pass http://127.0.0.1:8082/</span></span>
<span class="line"><span style="color:#24292e;">        # / 为基础配置，一般配置在其他location的最下方</span></span>
<span class="line"><span style="color:#24292e;">        location / {</span></span>
<span class="line"><span style="color:#24292e;">            proxy_pass http://127.0.0.1:8082;</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">    </span></span>
<span class="line"><span style="color:#24292e;">    # 反向代理设置</span></span>
<span class="line"><span style="color:#24292e;">    server {</span></span>
<span class="line"><span style="color:#24292e;">        listen 80;</span></span>
<span class="line"><span style="color:#24292e;">        server_name www.nginx-test.com;</span></span>
<span class="line"><span style="color:#24292e;">        </span></span>
<span class="line"><span style="color:#24292e;">        # 匹配 www.nginx-test.com/8082/* 路径</span></span>
<span class="line"><span style="color:#24292e;">        location /8082/ {</span></span>
<span class="line"><span style="color:#24292e;">            proxy_pass http://127.0.0.1:8082;</span></span>
<span class="line"><span style="color:#24292e;">            </span></span>
<span class="line"><span style="color:#24292e;">            rewrite &quot;^/8082/(.*)$&quot; /$1 break;</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">server {</span></span>
<span class="line"><span style="color:#e1e4e8;">    listen       80;</span></span>
<span class="line"><span style="color:#e1e4e8;">    server_name  sk-test.com;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    # 浏览器访问 http://sk-test.com/sk/** 实际访问 http://127.0.0.1:8888/sk/***</span></span>
<span class="line"><span style="color:#e1e4e8;">    location ~ /sk/ {</span></span>
<span class="line"><span style="color:#e1e4e8;">    proxy_pass http://127.0.0.1:8888;</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">server {</span></span>
<span class="line"><span style="color:#24292e;">    listen       80;</span></span>
<span class="line"><span style="color:#24292e;">    server_name  sk-test.com;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    # 浏览器访问 http://sk-test.com/sk/** 实际访问 http://127.0.0.1:8888/sk/***</span></span>
<span class="line"><span style="color:#24292e;">    location ~ /sk/ {</span></span>
<span class="line"><span style="color:#24292e;">    proxy_pass http://127.0.0.1:8888;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="负载均衡" tabindex="-1">负载均衡 <a class="header-anchor" href="#负载均衡" aria-label="Permalink to &quot;负载均衡&quot;">​</a></h3><blockquote><p>当⽤⼾访问⽹站的时候，先访问⼀个中间服务器，再让这个中间服务器根据定制好的负载均衡算法，在服务器集群中选择合适服务器，然后将该访问请求引⼊选择的服务器所以，⽤⼾每次访问，都会保证服务器集群中的每个服务器压⼒趋于平衡，分担了服务器压⼒，避免了服务器崩溃的情况</p></blockquote><p><strong>负载均衡策略</strong></p><ol><li>轮询策略 <ul><li>默认情况下采用的策略，将所有客户端请求轮询分配给服务端</li><li>如果其中某一台服务器压力太大，出现延迟，会影响所有分配在这台服务器下的用户</li></ul></li><li><code>ip_hash</code><ul><li>来自同一个 <code>ip</code> 的请求永远只分配一台服务器。每个请求按请求ip的Hash结果分配，这样每个ip都能固定访问一个后端的服务器，可以解决Session的问题。但Session问题不推荐使用Nginx解决，推荐Redis</li></ul></li><li>最小连接数策略，将请求优先分配给压力较小的服务器，它可以平衡每个队列的长度，并避免向压力大的服务器添加更多的请求</li><li>最快响应时间策略，优先分配给响应时间最短的服务器</li></ol><p><strong>参数</strong></p><p><strong>upstream</strong>，定义在<code>http</code>块中，用于定义上游服务器（指的就是后台提供的应用服务器）的相关信息</p><ul><li><code>keepalive</code> 对上游服务启用长连接</li><li><code>keepalive_requests</code> 一个长连接最多请求 <code>HTTP</code> 的个数</li><li><code>keepalive_timeout</code> 空闲情形下，一个长连接的超时时长</li><li><code>hash</code> 哈希负载均衡算法</li><li><code>ip_hash</code> 依据 <code>IP</code> 进行哈希计算的负载均衡算法</li><li><code>least_conn</code> 最少连接数负载均衡算法</li><li><code>least_time</code> 最短响应时间负载均衡算法</li><li><code>random</code> 随机负载均衡算法</li><li><code>server</code> 定义上游服务器地址 <ul><li><code>weight=number</code> 权重值，默认为1</li><li><code>max_conns=number</code> 上游服务器的最大并发连接数</li><li><code>backup</code> 备份服务器，仅当其他服务器都不可用时才会启用</li></ul></li></ul><p><strong>配置</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">    # 负载均衡设置一组针对 proxy_pass http://nginx-test.com 服务的负载均衡</span></span>
<span class="line"><span style="color:#e1e4e8;">    upstream nginx-test.com {</span></span>
<span class="line"><span style="color:#e1e4e8;">        # 设置负载均衡机制，默认使用轮询机制</span></span>
<span class="line"><span style="color:#e1e4e8;">        # 将同一个用户的请求指向一个服务器，可解决分布式情况下Session的问题（但Session问题不推荐使用Nginx解决，推荐Redis）</span></span>
<span class="line"><span style="color:#e1e4e8;">        # ip_hash;</span></span>
<span class="line"><span style="color:#e1e4e8;">        </span></span>
<span class="line"><span style="color:#e1e4e8;">        # weight 配置每个服务器的权重，指定服务器轮询比例，weight和访问比例成正比，用于后端服务器性能不均的情况</span></span>
<span class="line"><span style="color:#e1e4e8;">		server 127.0.0.1:8080 weight=1;</span></span>
<span class="line"><span style="color:#e1e4e8;">		server 127.0.0.1:8082 weight=1;</span></span>
<span class="line"><span style="color:#e1e4e8;">	}</span></span>
<span class="line"><span style="color:#e1e4e8;">	</span></span>
<span class="line"><span style="color:#e1e4e8;">	server {</span></span>
<span class="line"><span style="color:#e1e4e8;">	    listen 80;</span></span>
<span class="line"><span style="color:#e1e4e8;">	    server_name www.nginx-test.com;</span></span>
<span class="line"><span style="color:#e1e4e8;">	    </span></span>
<span class="line"><span style="color:#e1e4e8;">	    location / {</span></span>
<span class="line"><span style="color:#e1e4e8;">	        proxy_pass http://nginx-test.com;</span></span>
<span class="line"><span style="color:#e1e4e8;">	    }</span></span>
<span class="line"><span style="color:#e1e4e8;">	}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">    # 负载均衡设置一组针对 proxy_pass http://nginx-test.com 服务的负载均衡</span></span>
<span class="line"><span style="color:#24292e;">    upstream nginx-test.com {</span></span>
<span class="line"><span style="color:#24292e;">        # 设置负载均衡机制，默认使用轮询机制</span></span>
<span class="line"><span style="color:#24292e;">        # 将同一个用户的请求指向一个服务器，可解决分布式情况下Session的问题（但Session问题不推荐使用Nginx解决，推荐Redis）</span></span>
<span class="line"><span style="color:#24292e;">        # ip_hash;</span></span>
<span class="line"><span style="color:#24292e;">        </span></span>
<span class="line"><span style="color:#24292e;">        # weight 配置每个服务器的权重，指定服务器轮询比例，weight和访问比例成正比，用于后端服务器性能不均的情况</span></span>
<span class="line"><span style="color:#24292e;">		server 127.0.0.1:8080 weight=1;</span></span>
<span class="line"><span style="color:#24292e;">		server 127.0.0.1:8082 weight=1;</span></span>
<span class="line"><span style="color:#24292e;">	}</span></span>
<span class="line"><span style="color:#24292e;">	</span></span>
<span class="line"><span style="color:#24292e;">	server {</span></span>
<span class="line"><span style="color:#24292e;">	    listen 80;</span></span>
<span class="line"><span style="color:#24292e;">	    server_name www.nginx-test.com;</span></span>
<span class="line"><span style="color:#24292e;">	    </span></span>
<span class="line"><span style="color:#24292e;">	    location / {</span></span>
<span class="line"><span style="color:#24292e;">	        proxy_pass http://nginx-test.com;</span></span>
<span class="line"><span style="color:#24292e;">	    }</span></span>
<span class="line"><span style="color:#24292e;">	}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h3 id="缓存" tabindex="-1">缓存 <a class="header-anchor" href="#缓存" aria-label="Permalink to &quot;缓存&quot;">​</a></h3><blockquote><p>开启缓存可以存储一些之前被访问过、而且可能将要被再次访问的资源，使用户可以直接从代理服务器获得，从而减少上游服务器的压力</p></blockquote><p><strong>参数</strong></p><ul><li><strong>proxy_cache</strong>，定义在<code>location</code>块中，存储一些之前被访问过、而且可能将要被再次访问的资源，使用户可以直接从代理服务器获得，从而减少上游服务器的压力，加快整个访问速度 <ul><li><code>proxy_cache zone | off </code>，zone 是共享内存的名称</li><li>默认值<code>off</code></li></ul></li><li>proxy_cache_path，设置缓存文件的存放路径</li><li>proxy_cache_key，设置缓存文件的 <code>key</code></li><li>proxy_cache_valid，配置什么状态码可以被缓存，以及缓存时长</li></ul><p><strong>配置</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">server {</span></span>
<span class="line"><span style="color:#e1e4e8;">  listen 80;</span></span>
<span class="line"><span style="color:#e1e4e8;">  server_name localhost;</span></span>
<span class="line"><span style="color:#e1e4e8;">  location / {</span></span>
<span class="line"><span style="color:#e1e4e8;">    proxy_cache cache_zone; # 设置缓存内存</span></span>
<span class="line"><span style="color:#e1e4e8;">    proxy_cache_valid 200 5m; # 缓存状态为200的请求，缓存时长为5分钟</span></span>
<span class="line"><span style="color:#e1e4e8;">    proxy_cache_key $request_uri; # 缓存文件的key为请求的URI</span></span>
<span class="line"><span style="color:#e1e4e8;">    add_header Nginx-Cache-Status $upstream_cache_status # 把缓存状态设置为头部信息，响应给客户端</span></span>
<span class="line"><span style="color:#e1e4e8;">    proxy_pass http://cache_server; # 代理转发</span></span>
<span class="line"><span style="color:#e1e4e8;">  }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">server {</span></span>
<span class="line"><span style="color:#24292e;">  listen 80;</span></span>
<span class="line"><span style="color:#24292e;">  server_name localhost;</span></span>
<span class="line"><span style="color:#24292e;">  location / {</span></span>
<span class="line"><span style="color:#24292e;">    proxy_cache cache_zone; # 设置缓存内存</span></span>
<span class="line"><span style="color:#24292e;">    proxy_cache_valid 200 5m; # 缓存状态为200的请求，缓存时长为5分钟</span></span>
<span class="line"><span style="color:#24292e;">    proxy_cache_key $request_uri; # 缓存文件的key为请求的URI</span></span>
<span class="line"><span style="color:#24292e;">    add_header Nginx-Cache-Status $upstream_cache_status # 把缓存状态设置为头部信息，响应给客户端</span></span>
<span class="line"><span style="color:#24292e;">    proxy_pass http://cache_server; # 代理转发</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h3 id="限流" tabindex="-1">限流 <a class="header-anchor" href="#限流" aria-label="Permalink to &quot;限流&quot;">​</a></h3><blockquote><p>Nginx的限流模块，是基于漏桶算法实现的，在⾼并发的场景下⾮常实⽤</p></blockquote><p><strong>参数</strong></p><ul><li><strong>limit_req_zone</strong>，定义在<code>http</code>块中，</li><li>zone，<code>zone = ip状态:共享内存区域</code>，定义IP状态及URL访问频率的共享内存区域，zone=keyword标识区域的名字，以及冒号后⾯跟区域⼤⼩</li><li>rate，定义最⼤请求速率</li></ul><p><strong>配置</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">http {</span></span>
<span class="line"><span style="color:#e1e4e8;">    # $binary_remote_addr 表⽰保存客⼾端IP地址的⼆进制形式</span></span>
<span class="line"><span style="color:#e1e4e8;">    # mylimit zone=keyword标识区域的名字</span></span>
<span class="line"><span style="color:#e1e4e8;">    # 10m 16000个IP地址的状态信息约1MB，所以⽰例中10m区域可以存储160000个IP地址</span></span>
<span class="line"><span style="color:#e1e4e8;">    # rate=100r/s 速率不能超过每秒100个请求</span></span>
<span class="line"><span style="color:#e1e4e8;">    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=100r/s;</span></span>
<span class="line"><span style="color:#e1e4e8;">    </span></span>
<span class="line"><span style="color:#e1e4e8;">    server {</span></span>
<span class="line"><span style="color:#e1e4e8;">        location / {</span></span>
<span class="line"><span style="color:#e1e4e8;">            # burst 排队⼤⼩</span></span>
<span class="line"><span style="color:#e1e4e8;">            # nodelay 不限制单个请求间的时间</span></span>
<span class="line"><span style="color:#e1e4e8;">            limit_req zone = mylimit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#e1e4e8;">        }</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">http {</span></span>
<span class="line"><span style="color:#24292e;">    # $binary_remote_addr 表⽰保存客⼾端IP地址的⼆进制形式</span></span>
<span class="line"><span style="color:#24292e;">    # mylimit zone=keyword标识区域的名字</span></span>
<span class="line"><span style="color:#24292e;">    # 10m 16000个IP地址的状态信息约1MB，所以⽰例中10m区域可以存储160000个IP地址</span></span>
<span class="line"><span style="color:#24292e;">    # rate=100r/s 速率不能超过每秒100个请求</span></span>
<span class="line"><span style="color:#24292e;">    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=100r/s;</span></span>
<span class="line"><span style="color:#24292e;">    </span></span>
<span class="line"><span style="color:#24292e;">    server {</span></span>
<span class="line"><span style="color:#24292e;">        location / {</span></span>
<span class="line"><span style="color:#24292e;">            # burst 排队⼤⼩</span></span>
<span class="line"><span style="color:#24292e;">            # nodelay 不限制单个请求间的时间</span></span>
<span class="line"><span style="color:#24292e;">            limit_req zone = mylimit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#24292e;">        }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h3 id="黑白名单" tabindex="-1">黑白名单 <a class="header-anchor" href="#黑白名单" aria-label="Permalink to &quot;黑白名单&quot;">​</a></h3><blockquote><p>可以拒绝某个（某组）IP访问</p></blockquote><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">location / {</span></span>
<span class="line"><span style="color:#e1e4e8;">    deny 121.43.102.159;</span></span>
<span class="line"><span style="color:#e1e4e8;">    deny 121.84.165.0/24;</span></span>
<span class="line"><span style="color:#e1e4e8;">    deny all;</span></span>
<span class="line"><span style="color:#e1e4e8;">    </span></span>
<span class="line"><span style="color:#e1e4e8;">    allow 12.2.3.5;</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">location / {</span></span>
<span class="line"><span style="color:#24292e;">    deny 121.43.102.159;</span></span>
<span class="line"><span style="color:#24292e;">    deny 121.84.165.0/24;</span></span>
<span class="line"><span style="color:#24292e;">    deny all;</span></span>
<span class="line"><span style="color:#24292e;">    </span></span>
<span class="line"><span style="color:#24292e;">    allow 12.2.3.5;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="https" tabindex="-1">HTTPS <a class="header-anchor" href="#https" aria-label="Permalink to &quot;HTTPS&quot;">​</a></h3><blockquote><p>使用Nginx配置HTTPS支持</p></blockquote><p><strong>HTTPS工作流程</strong></p><ol><li>客户端（浏览器）访问 <code>https://www.baidu.com</code> 百度网站；</li><li>百度服务器返回 <code>HTTPS</code> 使用的 <code>CA</code> 证书；</li><li>浏览器验证 <code>CA</code> 证书是否为合法证书；</li><li>验证通过，证书合法，生成一串随机数并使用公钥（证书中提供的）进行加密；</li><li>发送公钥加密后的随机数给百度服务器；</li><li>百度服务器拿到密文，通过私钥进行解密，获取到随机数（公钥加密，私钥解密，反之也可以）；</li><li>百度服务器把要发送给浏览器的内容，使用随机数进行加密后传输给浏览器；</li><li>此时浏览器可以使用公钥进行解密，获取到服务器的真实传输内容；</li></ol><p>这就是 <code>HTTPS</code> 的基本运作原理，对称加密和非对称加密配合使用，保证传输内容的安全性</p><p><strong>配置证书</strong></p><p>下载HTTPS证书的压缩文件，里面有个 <code>Nginx</code> 文件夹，把 <code>xxx.crt</code> 和 <code>xxx.key</code> 文件拷贝到服务器目录，再进行配置</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">server {</span></span>
<span class="line"><span style="color:#e1e4e8;">  listen 443 ssl http2 default_server;   # SSL 访问端口号为 443</span></span>
<span class="line"><span style="color:#e1e4e8;">  server_name nginx-test.com;         # 填写绑定证书的域名</span></span>
<span class="line"><span style="color:#e1e4e8;">  ssl_certificate /etc/nginx/https/nginx-test.com_bundle.crt;   # 证书地址</span></span>
<span class="line"><span style="color:#e1e4e8;">  ssl_certificate_key /etc/nginx/https/nginx-test.com.key;      # 私钥地址</span></span>
<span class="line"><span style="color:#e1e4e8;">  ssl_session_timeout 10m;</span></span>
<span class="line"><span style="color:#e1e4e8;">  ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # 支持ssl协议版本，默认为后三个，主流版本是[TLSv1.2]</span></span>
<span class="line"><span style="color:#e1e4e8;"> </span></span>
<span class="line"><span style="color:#e1e4e8;">  location / {</span></span>
<span class="line"><span style="color:#e1e4e8;">    root         /usr/share/nginx/html;</span></span>
<span class="line"><span style="color:#e1e4e8;">    index        index.html index.htm;</span></span>
<span class="line"><span style="color:#e1e4e8;">  }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">server {</span></span>
<span class="line"><span style="color:#24292e;">  listen 443 ssl http2 default_server;   # SSL 访问端口号为 443</span></span>
<span class="line"><span style="color:#24292e;">  server_name nginx-test.com;         # 填写绑定证书的域名</span></span>
<span class="line"><span style="color:#24292e;">  ssl_certificate /etc/nginx/https/nginx-test.com_bundle.crt;   # 证书地址</span></span>
<span class="line"><span style="color:#24292e;">  ssl_certificate_key /etc/nginx/https/nginx-test.com.key;      # 私钥地址</span></span>
<span class="line"><span style="color:#24292e;">  ssl_session_timeout 10m;</span></span>
<span class="line"><span style="color:#24292e;">  ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # 支持ssl协议版本，默认为后三个，主流版本是[TLSv1.2]</span></span>
<span class="line"><span style="color:#24292e;"> </span></span>
<span class="line"><span style="color:#24292e;">  location / {</span></span>
<span class="line"><span style="color:#24292e;">    root         /usr/share/nginx/html;</span></span>
<span class="line"><span style="color:#24292e;">    index        index.html index.htm;</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="跨域访问" tabindex="-1">跨域访问 <a class="header-anchor" href="#跨域访问" aria-label="Permalink to &quot;跨域访问&quot;">​</a></h3><blockquote><p>跨域，通过不同IP或端口进行资源访问</p></blockquote><p><strong>配置</strong></p><p>如</p><ul><li>前端服务为<code>fronten.server.com</code>，后端服务为<code>backen.server.com</code></li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">server {</span></span>
<span class="line"><span style="color:#e1e4e8;">    listen 80;</span></span>
<span class="line"><span style="color:#e1e4e8;">    server_name  fronten.server.com;</span></span>
<span class="line"><span style="color:#e1e4e8;">    </span></span>
<span class="line"><span style="color:#e1e4e8;">    location / {</span></span>
<span class="line"><span style="color:#e1e4e8;">        proxy_pass backen.server.com;</span></span>
<span class="line"><span style="color:#e1e4e8;">    }</span></span>
<span class="line"><span style="color:#e1e4e8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">server {</span></span>
<span class="line"><span style="color:#24292e;">    listen 80;</span></span>
<span class="line"><span style="color:#24292e;">    server_name  fronten.server.com;</span></span>
<span class="line"><span style="color:#24292e;">    </span></span>
<span class="line"><span style="color:#24292e;">    location / {</span></span>
<span class="line"><span style="color:#24292e;">        proxy_pass backen.server.com;</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div>`,65),o=[p];function c(r,i,t,b,y,d){return n(),a("div",null,o)}const h=s(l,[["render",c]]);export{m as __pageData,h as default};
