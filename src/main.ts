import { createApp } from 'vue';
// import './style.css';
import App from './App.vue';

import 'normalize.css';
// 按照项目需求，导入全局的公用样式
// 适用于全局样式类，但无法使用 less/scss 变量等，除非每个组件单独导入或使用
import '@/styles/common.less';

createApp(App).mount('#app');

console.log('当前环境：', import.meta.env);
