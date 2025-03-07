<template>
  <div class="home-category">
    <ul v-if="leftCategoryList.length > 0" class="menu">
      <li v-for="item in leftCategoryList" :key="item.id">
        <RouterLink to="/">{{ item.name }}</RouterLink>
        <RouterLink v-for="item2 in item.children" :key="item2.id" to="/">
          {{ item2.name }}
        </RouterLink>

        <!-- 弹层layer位置 -->
        <div class="layer">
          <h4>分类推荐 <small>根据您的购买或浏览记录推荐</small></h4>
          <ul>
            <li v-for="goods in item.goods" :key="goods.id">
              <!-- <RouterLink to="/"> -->
              <RouterLink :to="`/product/${item.id}`">
                <img :src="goods.picture" alt="" />
                <div class="info">
                  <p class="name ellipsis-2">
                    {{ goods.name }}
                  </p>
                  <p class="desc ellipsis">{{ goods.desc }}</p>
                  <p class="price"><i>¥</i>{{ goods.price }}</p>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>

    <!-- 占位图 -->
    <ul v-else class="menu">
      <li v-for="i in 9" :key="i">
        <XtxSkeleton :width="50" :height="24" style="margin-right: 5px" bg="rgba(255,255,255,0.2)" />
        <XtxSkeleton :width="50" :height="20" bg="rgba(255,255,255,0.2)" style="margin-right: 5px" />
        <XtxSkeleton :width="50" :height="20" bg="rgba(255,255,255,0.2)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/store';
const homeStore = useHomeStore();

// 计算函数：处理左侧分类所需的数据格式
const leftCategoryList = computed(() => {
  // 基于 Pinia 中的分类数据处理
  return homeStore.categoryList.map((item) => ({
    id: item.id,
    name: item.name,
    // 只需要截取前两个二级分类
    children: item.children.slice(0, 2),
    // 弹出层商品列表
    goods: item.goods,
  }));
});
</script>

<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 55px;
      line-height: 55px;
      &:hover {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
      .layer {
        width: 990px;
        height: 500px;
        background: rgba(255, 255, 255, 1);
        position: absolute;
        left: 250px;
        top: 0;
        display: none;
        padding: 0 15px;
        h4 {
          font-size: 20px;
          font-weight: normal;
          line-height: 80px;
          small {
            font-size: 16px;
            color: #666;
          }
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 310px;
            height: 120px;
            margin-right: 15px;
            margin-bottom: 15px;
            border: 1px solid #eee;
            border-radius: 4px;
            background: #fff;
            &:nth-child(3n) {
              margin-right: 0;
            }
            a {
              display: flex;
              width: 100%;
              height: 100%;
              align-items: center;
              padding: 10px;
              &:hover {
                background: #e3f9f4;
              }
              img {
                width: 95px;
                height: 95px;
              }
              .info {
                padding-left: 10px;
                line-height: 24px;
                overflow: hidden;
                .name {
                  font-size: 16px;
                  color: #666;
                }
                .desc {
                  color: #999;
                }
                .price {
                  font-size: 22px;
                  color: @priceColor;
                  i {
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
      }
      &:hover {
        .layer {
          display: block;
        }
      }
    }
  }
}
</style>
