import { defineStore } from 'pinia';
import http from '@/api/httpRequest';

import type { CategoryList, BannerList, GoodsItem } from '@/types/home';

export const useHomeStore = defineStore('homeModule', {
  state: () => {
    return {
      // 所有分类数据
      categoryList: [] as CategoryList,
      // 轮播图数据
      bannerList: [] as BannerList,
      // 新鲜好物数据
      newGoodsList: [] as GoodsItem[],
    };
  },
  actions: {
    /**
     * 获取全部分类数据
     */
    async getAllCategory() {
      const res = await http<CategoryList>('get', '/home/category/head');
      // console.log(res.result);
      this.categoryList = res.result;
    },

    /**
     * 获取轮播图数据
     */
    async getBannerList() {
      const res = await http<BannerList>('GET', '/home/banner');
      this.bannerList = res.result;
    },

    /**
     * 获取新鲜好物数据
     */
    async getNewGoodsList() {
      const res = await http<GoodsItem[]>('GET', '/home/new');
      // console.log("/home/new", res.data.result);
      this.newGoodsList = res.result;
    },
  },
});
