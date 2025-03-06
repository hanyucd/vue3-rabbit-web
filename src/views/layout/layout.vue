<template>
  <div>
    <!-- 顶部通栏 -->
    <AppTopnav />
    <!-- 头部组件 -->
    <AppHeader />
    
    <!-- 主体内容 -->
    <main class="app-body">
      <RouterView />
    </main>
    
    <!-- 底部组件 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppTopnav from './components/AppTopnav.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<style lang="less" scoped>

</style>
