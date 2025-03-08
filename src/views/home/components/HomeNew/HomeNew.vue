<template>
  <div class="home-new">
    <HomePanel ref="target" title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right><XtxMore path="/" /></template>
      <!-- 面板内容 -->
      <ul v-if="homeStore.newGoodsList.length > 0" class="goods-list">
        <li v-for="item in homeStore.newGoodsList" :key="item.id">
          <RouterLink :to="`/goods/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
      
      <!-- 占位图 -->
      <ul v-else class="goods-list">
        <li v-for="item in homeStore.newGoodsList" :key="item.id">
          <XtxSkeleton :width="306" :height="406" bg="rgba(0,0,0,0.2)" />
        </li>
      </ul>
    </HomePanel>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/store';
const homeStore = useHomeStore();

import { useObserver } from '@/hooks';

const { target } = useObserver(homeStore.getNewGoodsList);
// homeStore.getNewGoodsList();
</script>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
