import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import XtxUI from './components/XtxUI';

import 'normalize.css';
// 按照项目需求，导入全局的公用样式
// 适用于全局样式类，但无法使用 less/scss 变量等，除非每个组件单独导入或使用
import '@/styles/common.less';

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(XtxUI); // 使用 XtxUI
app.mount('#app');

console.log('当前环境：', import.meta.env);
