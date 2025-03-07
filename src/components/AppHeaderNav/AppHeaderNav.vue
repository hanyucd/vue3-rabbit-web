<script setup lang="ts">
// 小问题：在 nav 组件内部发请求，重复调用 nav 组件就会重复发送请求
// 解决方案：父组件发请求，子组件负责使用
import { useHomeStore } from '@/store';
const homeStore = useHomeStore();
</script>

<template>
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <!-- homeModule 状态下的分类 -->
    <template v-if="homeStore.categoryList.length">
      <li v-for="item in homeStore.categoryList" :key="item.id">
        <RouterLink :to="`/category/${ item.id }`">{{ item.name }}</RouterLink>
      </li>
    </template>
    <!-- <template v-else>
      <li v-for="i in 9" :key="i">
        <XtxSkeleton :width="50" :height="32" bg="rgba(0,0,0,0.2)" />
      </li>
    </template> -->
  </ul>
</template>

<style lang="less" scoped>
.app-header-nav {
  width: 820px;
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
  }
}
</style>
