import { defineStore } from 'pinia';
import { message } from '@/components/XtxUI';
import type { Profile } from '@/types/member';
import http from '@/api/httpRequest';
// 🎯非 vue 组件，导入路由实例
import router from '@/router';

export const useCartStore = defineStore('cartModule', {
  persist: {
    key: 'cart-store',
    pick: ['profile'],
  },
  state: () => {
    return {
    };
  },
  getters: {
    // isLogin(): boolean {
    //   return Boolean(this.profile.token);
    // },
  },
  actions: {
  }
});
