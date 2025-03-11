<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckBox v-model="isAllSelected">全选</XtxCheckBox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="item in cartStore.effectiveList" :key="item.skuId">
              <td>
                <XtxCheckBox
                  :model-value="item.selected"
                  @change="(selected) => changeSeleted(item.skuId, selected)"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/goods/${item.id}`">
                    <img :src="item.picture" :alt="item.name" />
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ item.name }}
                    </p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="tc">
                <XtxCount
                  :model-value="item.count"
                  @change="(count) => changeCount(item.skuId, count)"
                />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{ (item.count * Number(item.nowPrice)).toFixed(2) }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a
                    class="green"
                    href="javascript:;"
                    @click="cartStore.deleteCart([item.skuId])"
                  >
                    删除
                  </a>
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
            <!-- 删除光购物车之后使用元素占位 -->
            <tr v-if="cartStore.effectiveList.length === 0">
              <td colspan="6">
                <div class="cart-none" style="text-align: center">
                  <img src="@/assets/images/none.png" alt="" />
                  <p>购物车内暂时没有商品</p>
                  <div class="btn" style="margin: 20px">
                    <XtxButton type="primary" @click="$router.push('/')">
                      继续逛逛
                    </XtxButton>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch"></div>
        <div class="total">
          共 {{ effectiveListCounts }} 件有效商品， 已选择
          {{ selectedListCounts }} 件， 商品合计：
          <span class="red">¥{{ selectedListPrice }}</span>
          <XtxButton type="primary" @click="goToCheckout">下单结算</XtxButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { message } from '@/components/XtxUI';
import { useRouter } from 'vue-router';
import { useUserStore, useCartStore } from '@/store';

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const { effectiveListCounts, selectedListCounts, selectedListPrice } = storeToRefs(cartStore);

// 点击全选/取消全选按钮
const isAllSelected = computed({
  get(): boolean {
    // 计算全选状态
    return cartStore.isAllSelected;
  },
  set(selected: boolean) {
    // 调用接口修改状态
    cartStore.updateCartAllSelected({ selected: selected, ids: [] });
  },
});

// 点击单选按钮
const changeSeleted = (skuId: string, selected: boolean) => {
  // console.log({ skuId, selected });
  // 调用接口，更新服务器端的购物车信息
  cartStore.updateCart(skuId, { selected: selected });
};

// 点击修改数量
const changeCount = (skuId: string, count: number) => {
  // console.log({ skuId, count });
  cartStore.updateCart(skuId, { count: count });
};

// 点击下单结算按钮
const goToCheckout = () => {
  // 1. 是否登录
  if (!userStore.isLogin) {
    return message({ type: 'warn', text: '请登录后操作~' });
  }
  // 2. 是否选中商品
  if (cartStore.selectedListCounts === 0) {
    return message({ type: 'warn', text: '请选择下单商品~' });
  }
  // 3. 跳转到下单结算页
  router.push('/checkout');
};
</script>

<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
