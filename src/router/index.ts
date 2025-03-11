import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store';
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

// 📌需求：已登录的用户才允许访问个人中心。 （未登录怎么？跳转到登录页并携带回跳地址）
// VueRouter4升级: return 取代了以前的 next() 放行函数
// return true 或 undefined(没写return) 都默认放行
router.beforeEach((to) => {
  const userStore = useUserStore();
  // 进行判断：未登录情况但是访问 /profile 开头的路径，需要跳转登录页
  if (!userStore.isLogin && to.path.startsWith('/profile')) {
    return `/login?target=${to.fullPath}`;
  }
});

export default router;
