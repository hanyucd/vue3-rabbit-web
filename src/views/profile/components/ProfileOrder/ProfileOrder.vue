<script setup lang="ts">
// import { orderStatus } from '@/consts/order';
import OrderItem from './components/OrderItem/OrderItem.vue';
import http from '@/api/httpRequest';
import type { OrderListInfo } from '@/types/order';

// 用于双向绑定高亮的名称
// const activeName = ref(orderStatus[0].name);

// 对象结构确定，可以用 reactive 定义响应式对象
const query = reactive({
  orderState: 0,
  page: 1,
  pageSize: 5,
});

// 订单列表总信息
const orderListInfo = ref<OrderListInfo>();

const loadData = async () => {
  // 根据参数获取订单列表信息
  const res = await http<OrderListInfo>('GET', '/member/order', query);
  console.log('GET', '/member/order', res.result);
  orderListInfo.value = res.result;
};

// tabs切换时更新 orderState 参数
// const changeTabs = (index: number) => {
//   query.orderState = index;
// };

// 根据变化的 query 重新获取订单列表数据
watch(query, () => {
    loadData();
  },
  // 立刻执行
  { immediate: true }
);
</script>

<template>
  <div class="member-order">
    <!-- 1. 头部 Tabs 组件 -->
    <!-- <XtxTabs v-model="activeName" @tab-click="({ index }) => changeTabs(index)">
      <XtxTabPane
        v-for="item in orderStatus"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      />
    </XtxTabs> -->

    <!-- 2. 订单列表 -->
    <div class="order-list">
      <OrderItem
        v-for="item in orderListInfo?.items"
        :key="item.id"
        :order="item"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.order-list {
  background-color: #fff;
  padding: 20px;
}
</style>
