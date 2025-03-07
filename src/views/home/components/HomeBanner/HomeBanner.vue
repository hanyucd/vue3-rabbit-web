<template>
  <div class="home-banner">
    <XtxSlider :sliders="homeStore.bannerList" auto-play />
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/store';
const homeStore = useHomeStore();

homeStore.getBannerList();
</script>

<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
</style>
