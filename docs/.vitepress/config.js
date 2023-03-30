export default {
  lang: 'zh-CN',
  title: 'Gnl',
  description: '',
  head: [
    [
      'link',
      { rel: 'icon', href: './img/logo.jpeg' }
    ]
  ],
  // base: '/',
  ignoreDeadLinks: true,
  // lastUpdated: true,
  // lastUpdatedText: 'Updated Date',
  // outDir: '../dist', // build 文件输出目录
  cleanUrls: true, // Allows removing trailing .html from URLs.

  // rewrites: {
  //   'posts/:categories/:article': '/:categories/:article',
  // },

  // Theme related configurations.
  themeConfig: {
    logo: './logo.jpeg',
    nav: [
      { text: 'Recently', link: '/recently' },
      { text: '算法', link: 'posts/al/index/' },
      { 
        text: '前端',
        items: [
          { text: 'JavaScript', link: '/posts/fe/javascript/JavaScript' }, 
          { text: 'Vue.js', link: '/posts/fe/vuejs/Vuejs' }, 
          { text: 'React', link: '/posts/fe/react/React' }, 
          { text: 'TypeScript', link: '/posts/fe/typescript/TypeScript' }, 
        ]
       },
      { 
        text: '后端', 
        items: [
          { text: 'Java', link: '/posts/be/java/index/Java' }, 
          { text: 'Spring5', link: '/posts/be/spring/Spring5' }, 
          { text: 'Spring MVC', link: '/posts/be/springmvc/SpringMVC' }, 
          { text: 'Spring Boot', link: '/posts/be/springboot/SpringBoot' }, 
          { text: 'Spring Security', link: '/posts/be/springsecurity/SpringSecurity' }, 
          { text: 'Spring Cloud', link: '/posts/be/springcloud/SpringCloud' }, 
          { text: 'MyBatis', link: '/posts/be/mybatis/MyBatis' },
        ]
      },
      {
        text: '数据库',
        items: [ 
          { text: 'MySQL', link: '/posts/db/mysql/MySQL' }, 
          { text: 'Redis', link: '/posts/db/redis/Redis' }, 
        ]
      },
      {
        text: '中间件',
        items: [ 
          { text: 'RocketMQ', link: '/posts/mw/rocketmq/RocketMQ' }, 
          { text: 'ElasticSearch', link: '/posts/mw/elasticsearch/ElasticSearch' }, 
          { text: 'Kafka', link: '/posts/mw/kafka/Kafka' }, 
          { text: 'Nginx', link: '/posts/mw/nginx/Nginx' }, 
        ]
      },
      // { text: 'About', link: '/about' },
    ],
    sidebar: [
      // { text: 'Home', link: '/' },
      // {
      //   text: 'Recently Renew',
      //   collapsible: true,
      //   collapsed: true,
      //   items: [ 
      //     { text: 'MySQL', link: '/posts/renew/mysql/MySQL' }, 
      //     { text: 'Redis 配置详解', link: '/posts/renew/redis/Redis-配置详解' }, 
      //     { text: 'Redis 数据类型', link: '/posts/renew/redis/Redis-数据类型' }, 
      //     { text: 'Spring6', link: '/posts/renew/spring/Spring6' }, 
      //   ]
      // },
      {
        text: '算法',
        collapsible: true,
        collapsed: true,
        items: [ 
          { text: 'Guide', link: '/posts/al/index/' }, 
          { text: '位运算', link: '/posts/al/位运算' }, 
          { text: '常见算法', link: '/posts/al/常见算法' }, 
        ]
      },
      {
        text: '设计模式',
        collapsible: true,
        collapsed: true,
        items: [ 
          { text: 'Guide', link: '/posts/dp/index/' }, 
          { text: '设计模式', link: '/posts/dp/设计模式' }, 
        ]
      },
      {
        text: '前端',
        collapsible: true,
        collapsed: true,
        items: [ 
          { text: 'Guide', link: '/posts/fe/index/' }, 
          { text: 'JavaScript', link: '/posts/fe/javascript/JavaScript' }, 
          { text: 'Vue.js', link: '/posts/fe/vuejs/Vuejs' }, 
          { text: 'React', link: '/posts/fe/react/React' }, 
          { text: 'TypeScript', link: '/posts/fe/typescript/TypeScript' }, 
        ]
      },
      {
        text: '后端',
        collapsible: true,
        collapsed: true,
        items: [ 
          { text: 'Guide', link: '/posts/be/index/' }, 
          { 
            text: 'Java', 
            link: '/posts/be/java/index/Java',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Java 基础', link: '/posts/be/java/java-basic/Java-基础' }, 
              { text: 'Java 集合', link: '/posts/be/java/java-collection/Java-集合' }, 
              { text: 'Java 多线程', link: '/posts/be/java/java-thread/Java-多线程' }, 
              { text: 'Java 线程池', link: '/posts/be/java/java-threadpool/Java-线程池' }, 
              { text: 'Java JUC', link: '/posts/be/java/java-juc/Java-JUC' }, 
              { text: 'Java IO', link: '/posts/be/java/io/Java-IO' }, 
              { text: 'Java 进阶', link: '/posts/be/java/java-advance/Java-进阶' }, 

            ]
          },  
          { text: 'JVM', link: '/posts/be/java/jvm/JVM' }, 
          { text: 'Spring5', link: '/posts/be/spring/Spring5' }, 
          { text: 'Spring MVC', link: '/posts/be/springmvc/SpringMVC' }, 
          { text: 'Spring Boot', link: '/posts/be/springboot/SpringBoot' }, 
          { text: 'Spring Security', link: '/posts/be/springsecurity/SpringSecurity' }, 
          { text: 'Spring Cloud', link: '/posts/be/springcloud/SpringCloud' },
          { text: 'MyBatis', link: '/posts/be/mybatis/MyBatis' },
        ]
      },
      {
        text: '数据库',
        collapsible: true,
        collapsed: true,
        items: [ 
          { text: 'Guide', link: '/posts/db/index/' }, 
          { text: 'MySQL', link: '/posts/db/mysql/MySQL' }, 
          { text: 'Redis', link: '/posts/db/redis/Redis' }, 
        ]
      },
      {
        text: '中间件',
        collapsible: true,
        collapsed: true,
        items: [ 
          { text: 'Guide', link: '/posts/mw/index/' }, 
          { text: 'RocketMQ', link: '/posts/mw/rocketmq/RocketMQ' }, 
          { text: 'ElasticSearch', link: '/posts/mw/elasticsearch/ElasticSearch' }, 
          { text: 'Kafka', link: '/posts/mw/kafka/Kafka' }, 
          { text: 'Nginx', link: '/posts/mw/nginx/Nginx' }, 
        ]
      },
    ],
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/gnl00' },
    // ],
    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },
    footer: {
      message: 'Power by Vitepress & Github Page',
      copyright: 'Copyright © 2021-present GnL'
    },
    // editLink: {
    //   pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
    //   text: 'Edit this page on GitHub'
    // },
  },
  markdown: {
    // theme: 'material-theme-palenight',
    lineNumbers: true,
    // toc: '', // TocPluginOptions
  }
}