<template>
  <div>
    <!-- 顶部通栏 -->
    <AppTopnav />
    <!-- 头部组件 -->
    <AppHeader />
    <!-- 吸顶头部 -->
    <AppHeaderSticky />
    <!-- 主体内容 -->
    <main class="app-body">
      <!-- 预留路由出口，添加添加 :key 解决路由缓存的问题 -->
      <RouterView :key="$route.fullPath" />
      <!-- fulllPath   /category/1029487?username=zs&age=18 -->
      <!-- path        /category/1029487 -->
    </main>
    
    <!-- 底部组件 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppTopnav from './components/AppTopnav.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

import { useHomeStore } from '@/store';

const homeStore = useHomeStore();

// 在父组件发送请求更合理，分类请求只需要发一次即可
homeStore.getAllCategory();
</script>

<style lang="less" scoped>

</style>
