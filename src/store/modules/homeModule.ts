import { defineStore } from 'pinia';
import http from '@/api/httpRequest';

import type { CategoryList } from '@/types/home';

export const useHomeStore = defineStore('homeModule', {
  state: () => {
    return {
      categoryList: [] as CategoryList,
    };
  },
  actions: {
    /**
     * 获取全部分类数据
     */
    async getAllCategory() {
      const res = await http<CategoryList>('get', '/home/category/head');
      console.log(res.result);
      this.categoryList = res.result;
    },
  },
});
