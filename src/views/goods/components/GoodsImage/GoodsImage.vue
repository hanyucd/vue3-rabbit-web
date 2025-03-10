<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div
      v-show="showFlag"
      class="large"
      :style="[
        {
          backgroundImage: `url(${imageList[curIndex]})`,
          backgroundPositionX: positionX + 'px',
          backgroundPositionY: positionY + 'px',
        },
      ]"
    ></div>

    <!-- 左侧大图-->
    <div ref="target" class="middle">
      <img :src="imageList[curIndex]" alt="" />
      <!-- 蒙层小滑块 -->
      <div v-show="showFlag" class="layer" :style="{ left: left + 'px', top: top + 'px' }"></div>
    </div>

    <!-- 右侧小图列表 -->
    <ul class="small">
      <li v-for="(img, i) in imageList" :key="i" :class="{ active: i === curIndex }" @mouseenter="mouseEnterFn(i)">
        <img :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core';

interface IProps {
  imageList: string[];
}

withDefaults(defineProps<IProps>(), {
  imageList: () => [] as string[],
});

// 当前预览图的索引
const curIndex = ref(0);
// 鼠标移动处理
const mouseEnterFn = (i: number) => {
  curIndex.value = i;
};

// 使用useMouseInElement得到基于元素左上角的坐标和是否离开元素数据
const target = ref(null);
// elementX:相较于我们盒子左侧的距离  refObj
// elementY:相较于盒子顶部的距离 refObj
// isOutSide: 鼠标是否在盒子外部  true代表在外部  refObj
const { elementX, elementY, isOutside } = useMouseInElement(target);

// 是否显示遮罩和大图 false 代表不显示 (直接使用isOutside 会有闪动bug)
const showFlag = ref(false);
// 遮罩的坐标
const left = ref(0);
const top = ref(0);
// 大图背景定位
const positionX = ref(0);
const positionY = ref(0);

watch([elementX, elementY, isOutside], () => {
  // 是否显示遮罩
  showFlag.value = !isOutside.value;
  // 只有进入到容器中才开始做移动判断
  if (isOutside.value) return false;

  // 根据鼠标的坐标变化控制我们滑块的位移 left top值

  // 1. 横向-有效移动范围内的逻辑
  if (elementX.value > 300) { left.value = 200; }
  if (elementX.value < 100) { left.value = 0; }
  if (elementX.value < 300 && elementX.value > 100) {
    left.value = elementX.value - 100;
  }

  // 2. 纵向-有效移动范围内的逻辑
  if (elementY.value > 300) { top.value = 200; }
  if (elementY.value < 100) { top.value = 0; }
  if (elementY.value < 300 && elementY.value > 100) {
    top.value = elementY.value - 100;
  }

  // 控制背景大图的移动 (背景图的移动 是跟着 滑块的移动走的)
  // 1.鼠标的移动的方向和大图的方向是相反的 (正负)
  // 2.鼠标每移动一个像素 大图背景移动俩个像素 (x2)
  positionX.value = -left.value * 2;
  positionY.value = -top.value * 2;
});
</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    // 背景图:盒子的大小 = 2:1  将来控制背景图的移动来实现放大的效果查看 background-position
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      // 绝对定位 然后跟随咱们鼠标控制left和top属性就可以让滑块移动起来
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
