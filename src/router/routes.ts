import { type RouteRecordRaw } from 'vue-router';

// 指定 RouteRecordRaw[] 类型后，书写的时候就有 TS 的类型提示和检查了
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/layout.vue'),
    children: [
      { path: '/', component: () => import('@/views/home/home.vue') },
      { path: '/category/:id', component: () => import('@/views/category/category.vue'), },
      { path: '/goods/:id', component: () => import('@/views/goods/goods.vue') },
      { path: '/cart', component: () => import('@/views/cart/cart.vue') },
      { path: '/checkout', component: () => import('@/views/checkout/checkout.vue'), },
      { path: '/pay', component: () => import('@/views/pay/pay.vue'), },
      { path: '/pay/callback', component: () => import('@/views/pay-callback/pay-callback.vue'), },
      {
        path: '/profile',
        component: () => import('@/views/profile/profile.vue'),
        children: [
          { path: '', component: () => import('@/views/profile/components/ProfileUser/ProfileUser.vue') },
          { path: '/profile/order', component: () => import('@/views/profile/components/ProfileOrder/ProfileOrder.vue') },
        ]
      },
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
  }
];

export default constantRoutes;
