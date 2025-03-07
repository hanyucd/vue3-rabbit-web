
<template>
  <div class="app-header-sticky" :class="{ show: showSticky }">
    <div class="container">
      <RouterLink class="logo" to="/" />
      <!-- 2. 导航条 -->
      <AppHeaderNav />
      
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showSticky = ref(false);

onMounted(() => {
  window.addEventListener('scroll', handlerScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handlerScroll);
});

// 考虑优化，组件挂载时绑定事件，组件卸载时移除事件
const handlerScroll = () => {
  const y = document.documentElement.scrollTop;
  // console.log(y);
  
  if (y >= 78) {
    showSticky.value = true;
  } else {
    showSticky.value = false;
  }
};
</script>

<style scoped lang="less">
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  // 此处为关键样式!!!
  // 默认情况下完全把自己移动到上面
  transform: translateY(-100%);
  // 完全透明
  opacity: 0;
  // 显示出来的类名
  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url("@/assets/images/logo.png") no-repeat right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
