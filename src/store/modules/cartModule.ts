import { defineStore } from 'pinia';
import { message } from '@/components/XtxUI';
import type { CartItem, CartList } from '@/types/cart';
import { useUserStore } from './userModule';
import http from '@/api/httpRequest';

export const useCartStore = defineStore('cartModule', {
  persist: {
    key: 'cart-store',
    pick: ['cartList'],
  },
  state: () => {
    return {
      // 购物车列表
      cartList: [] as CartList,
    };
  },
  getters: {
    isLogin(): boolean {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
    // 计算有效商品列表 isEffective = true  filter
    effectiveList(): CartList {
      return this.cartList.filter((v) => v.stock > 0 && v.isEffective);
    },
    // 计算有效商品总数量 把 effctiveList中的每一项的count叠加起来
    effectiveListCounts(): number {
      return this.effectiveList.reduce((sum, item) => sum + item.count, 0);
    },
    // 计算有效商品总钱数  = 所有单项的钱数累加  单项的钱数 = 数量 * 单价
    effectiveListPrice(): string {
      return this.effectiveList
        .reduce((sum, item) => sum + item.count * Number(item.nowPrice), 0)
        .toFixed(2);
    },
    // 计算全选状态
    isAllSelected(): boolean {
      return (
        this.effectiveList.length !== 0 &&
        this.effectiveList.every((item) => item.selected)
      );
    },
    // 计算选中商品列表
    selectedList(): CartList {
      return this.effectiveList.filter((item) => item.selected);
    },
    // 计算选中商品总件数
    selectedListCounts(): number {
      return this.selectedList.reduce((sum, item) => sum + item.count, 0);
    },
    // 计算选中商品总钱数
    selectedListPrice(): string {
      return this.selectedList
        .reduce((sum, item) => sum + item.count * Number(item.nowPrice), 0)
        .toFixed(2);
    },
  },
  actions: {
    /**
     * 获取购物车列表
     */
    async getCartList() {
      if (this.isLogin) {
        const res = await http<CartList>('GET', '/member/cart');
        // 保存购物车列表数据
        this.cartList = res.result;
      } else {
        // console.log("未登录-本地操作");
        // 本地存储的库存信息和价格**不是服务器最新的**，所以需**要主动获取**最新商品信息。
        this.cartList.forEach(async (cartItem) => {
          const { skuId } = cartItem;
          // 根据 skuId 获取最新商品信息
          const res = await http<CartItem>('GET', `/goods/stock/${skuId}`);
          const lastCartInfo = res.result;
          console.log(lastCartInfo);
          // 更新商品现价
          cartItem.nowPrice = lastCartInfo.nowPrice;
          // 更新商品库存
          cartItem.stock = lastCartInfo.stock;
          // 更新商品是否有效
          cartItem.isEffective = lastCartInfo.isEffective;

          // 📌TS中 遍历 可配合 Reflect 操作
          // for (const key in lastCartInfo) {
          //   // lastCartInfo[key]       🐛传统获取报错
          //   const value = Reflect.get(lastCartInfo, key);
          //   // cartItem[key] = value   🐛传统设置报错
          //   if (value !== null) {
          //     Reflect.set(cartItem, key, value);
          //   }
          // }
        });
      }
    },
    /**
     * 加入购物车
     */
    async addCart(data: CartItem) {
      // console.log('加入购物车', data);
      if (this.isLogin) {
        const { skuId, count } = data;
        const res = await http('POST', '/member/cart', { skuId, count });
        console.log('POST', '/member/cart', res.result);
        message({ type: 'success', text: '添加成功~' });
        // 🐛获取最新购物车列表
        this.getCartList();
      } else {
        console.log('未登录-本地操作', data);

        // 添加商品分两种情况：
        const { skuId, count } = data;
        const goodsItem = this.cartList.find((item) => item.skuId === skuId);
        if (!goodsItem) {
          // 情况1：新添加的商品，前添加到数组中
          this.cartList.unshift(data);
        } else {
          // 情况2：已添加过的的商品，累加数量即可
          goodsItem.count += count;
        }

        message({ type: 'success', text: '添加成功~' });
      }
    },
    /**
     * 删除购物车商品
     */
    async deleteCart(skuIds: string[]) {
      if (this.isLogin) {
        const res = await http('DELETE', '/member/cart', { ids: skuIds });
        // console.log("DELETE", "/member/cart", res.data.result);
        if (res.result) {
          message({ type: 'success', text: '删除成功~' });
          // 获取购物车列表
          this.getCartList();
        } else {
          message({ type: 'warn', text: '删除失败' });
        }
      } else {
        // console.log("未登录-本地操作", skuIds);
        this.cartList = this.cartList.filter((item) => !skuIds.includes(item.skuId));
      }
    },
    /**
     * 修改购物车商品-修改选中/修改数量
     */
    async updateCart( skuId: string, data: { selected?: boolean; count?: number } ) {
      if (this.isLogin) {
        const res = await http('PUT', `/member/cart/${skuId}`, data);
        console.log('PUT', `/member/cart/${skuId}`, res.result);
        // 获取购物车列表
        this.getCartList();
      } else {
        // console.log("未登录-本地操作");
        const { selected, count } = data;
        // 根据 skuId 查找要进行修改的商品
        const cartItem = this.cartList.find((item) => item.skuId === skuId);
        if (cartItem) {
          // 如果有 count 才更新 count
          if (count !== undefined) cartItem.count = count;
          // 🐛 注意 false 也是假值，判断的时候要小心
          if (selected !== undefined) cartItem.selected = selected;
        }
      }
    },
    /**
     * 购物车全选/取消全选
     */
    async updateCartAllSelected(data: { selected: boolean; ids: string[] }) {
      if (this.isLogin) {
        const res = await http('PUT', '/member/cart/selected', data);
        console.log('PUT', '/member/cart/selected', res.result);
        // 获取购物车列表
        this.getCartList();
      } else {
        // console.log("未登录-本地操作");
        const { selected } = data;
        this.cartList.forEach((item) => {
          item.selected = selected;
        });
      }
    },
    /**
     * 合并本地购物车
     */
    async mergeLocalCart() {
      // 准备后端所需的参数格式
      const data = this.cartList.map(({ skuId, selected, count }) => ({ skuId, selected, count, }));
      // 合并本地购物车到服务器
      await http('POST', '/member/cart/merge', data);
      // 主动更新购物车列表
      this.getCartList();
    },
    /**
     * 清空购物车
     */
    clearCart() {
      this.cartList = [];
    },
  }
});
