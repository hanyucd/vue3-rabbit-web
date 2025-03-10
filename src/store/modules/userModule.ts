import { defineStore } from 'pinia';
import { message } from '@/components/XtxUI';
import type { Profile } from '@/types/member';
import http from '@/api/httpRequest';
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
     * 用户名密码登录
     */
    async login(param: { account: string; password: string }) {
      // 发送请求
      const res = await http<Profile>('POST', '/login', param);
      // console.log(res);
      this.profile = res.result;

      // 2. 请求成功给用户提示
      message({ type: 'success', text: '登录成功' });
      // 3. 跳转页面
      // 🐛 在非 .vue 组件中 useRoute() 返回 undefined，没法获取当前路由信息
      // 📌 解决方案，通过 router 路由实例 currentRoute 获取
      const { target = '/' } = router.currentRoute.value.query;
      // 跳转到指定地址
      console.log(router.currentRoute.value);
      
      router.push(target as string);
      // router.push('/');
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
    }
  }
});
