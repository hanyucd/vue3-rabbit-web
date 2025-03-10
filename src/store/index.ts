import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 导出 pinia 实例,给 main 使用
export default pinia;

export * from './modules/homeModule';
export * from './modules/userModule';
export * from './modules/cartModule';
