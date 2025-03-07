<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- banner轮播图 -->
        <HomeBanner />
      </div>
    </div>
    <!-- home-entry 同级添加面板 -->
    <!-- <HomeNew /> -->
  </div>
</template>

<script setup lang="ts">
import HomeBanner from './components/HomeBanner/HomeBanner.vue';
import HomeCategory from './components/HomeCategory/HomeCategory.vue';
// import HomeNew from "./components/home-new.vue";
</script>

<style lang="less" scoped>

</style>
