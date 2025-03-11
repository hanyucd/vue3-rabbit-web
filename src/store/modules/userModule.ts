import { defineStore } from 'pinia';
import http from '@/api/httpRequest';
import { message } from '@/components/XtxUI';
import type { Profile } from '@/types/member';
import { useCartStore } from './cartModule';
// 🎯非 vue 组件，导入路由实例
import router from '@/router';

export const useUserStore = defineStore('userModule', {
  persist: {
    key: 'user-store',
    pick: ['profile'],
  },
  state: () => {
    return {
      // 用户信息
      profile: {} as Profile,
    };
  },
  getters: {
    isLogin(): boolean {
      return Boolean(this.profile.token);
    },
  },
  actions: {
    /**
     * 登录成功后的复用逻辑封装
     */
    _loginSuccess() {
      const cartStore = useCartStore();
      // 📌主动合并本地购物车
      cartStore.mergeLocalCart();

      // 登录成功提示
      message({ type: 'success', text: '登录成功' });

      // 🐛 在非 .vue 组件中 useRoute() 返回 undefined，没法使用
      // 📌 解决方案，通过 router 路由实例 currentRoute 获取
      const route = router.currentRoute.value;
      // console.log(route.path);
      if (route.query.target) {
        // 跳转到指定地址
        router.push(decodeURIComponent(route.query.target as string));
      } else {
        // 跳转到首页
        router.push('/');
      }
    },
    /**
     * 用户名密码登录
     */
    async login(param: { account: string; password: string }) {
      // 发送请求
      const res = await http<Profile>('POST', '/login', param);
      // console.log(res);
      this.profile = res.result;
      // 调用登录成功后的逻辑
      this._loginSuccess();
    },
    /**
     * 退出登录
     */
    logout() {
      console.log('退出登录');

      // 1. 清理 Pinia 用户信息
      this.profile = {} as Profile;
      // 2. 提示用户
      message({ type: 'success', text: '退出成功' });
      // 3. 跳转页面
      router.push('/login');
      // 退出登录-主动清空购物车数据
      const cartStore = useCartStore();
      cartStore.clearCart();
    }
  }
});
