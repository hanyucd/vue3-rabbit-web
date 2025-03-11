<script setup lang="ts">
import ProfileAside from './components/ProfileAside/ProfileAside.vue';
</script>

<template>
  <div class="container">
    <!-- 左：侧边栏组件 -->
    <ProfileAside />
    
    <!-- 右：个人中心内容 -->
    <div class="article">
      <!-- 三级路由的出口 -->
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>
