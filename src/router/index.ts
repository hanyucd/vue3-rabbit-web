import { createRouter, createWebHistory } from 'vue-router';
import constantRoutes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior: () => {
    // 始终滚动到顶部
    return { left: 0, top: 0 };
  },
});

export default router;
