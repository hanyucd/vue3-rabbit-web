import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');

console.log('当前环境：', import.meta.env);
