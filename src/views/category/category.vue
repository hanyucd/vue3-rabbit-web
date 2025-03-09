<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>{{ topCategory?.name }}</XtxBreadItem>
      </XtxBread>

      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory?.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 楼层商品 -->
    <div v-for="item in topCategory?.children" :key="item.id" class="ref-goods">
      <div class="head">
        <h3>- {{ item.name }} -</h3>
        <XtxMore />
      </div>
      <div class="body">
        <GoodsItem v-for="goods in item.goods" :key="goods.id" :goods="goods" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GoodsItem from './components/GoodItem/GoodItem.vue';
import type { TopCategory } from '@/types/category';
import http from '@/api/httpRequest';

const router = useRouter();
const route = useRoute();

// 获取动态路由参数的id
const routeId = ref(route.params.id);

const topCategory = ref<TopCategory>();

console.log(router);
console.log(route);

onMounted(async () => {
  const res = await http<TopCategory>('GET', '/category', { id: routeId.value });
  // console.log(res);
  topCategory.value = res.result;
});
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: space-around;
      padding: 0 40px 30px;
    }
  }
}
</style>
