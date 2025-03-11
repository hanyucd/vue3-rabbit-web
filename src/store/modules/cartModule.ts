import { defineStore } from 'pinia';
import { message } from '@/components/XtxUI';
import type { CartItem, CartList } from '@/types/cart';
import { useUserStore } from './userModule';
import http from '@/api/httpRequest';
// 🎯非 vue 组件，导入路由实例
// import router from '@/router';

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
    // 有效商品总数量 把effctiveList中的每一项的count叠加起来
    effectiveListCounts(): number {
      return this.effectiveList.reduce((sum, item) => sum + item.count, 0);
    },
    // 总钱数  = 所有单项的钱数累加  单项的钱数 = 数量 * 单价
    effectiveListPrice(): string {
      return this.effectiveList
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
          // console.log("GET", `/goods/stock/${skuId}`, res.data.result);
          const lastCartInfo = res.result;
          console.log(lastCartInfo);
          // 更新商品现价
          // cartItem.nowPrice = lastCartInfo.nowPrice;
          // 更新商品库存
          // cartItem.stock = lastCartInfo.stock;
          // 更新商品是否有效
          // cartItem.isEffective = lastCartInfo.isEffective;

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
      }
    },
    /**
     * 删除购物车
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
    }
  }
});
