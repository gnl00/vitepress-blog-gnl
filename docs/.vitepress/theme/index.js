import DefaultTheme  from "vitepress/theme";
import Catalog from './component/Catalog';
import './style.css';

import vitepressBackToTop from 'vitepress-plugin-back-to-top'
import 'vitepress-plugin-back-to-top/dist/style.css'

console.log('theme config');

export default {
  ...DefaultTheme,
  
  // NotFound: () => 'Page not found', // 可重写 404 page
  enhanceApp({app}) {
    // The enhanceApp function receives the Vue app instance,
    // you can register components as you would do in a regular Vue application
    vitepressBackToTop({
      // default
      threshold:300
    })
    // 注册全局组件
    app.component('Catalog', Catalog)
    // app.component('Button', Button)
  },
  // Layout, // 还没想好 Layout 放什么内容
}