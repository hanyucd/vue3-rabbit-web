<template>
  <div class="xtx-pay-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付结果</XtxBreadItem>
      </XtxBread>
      <!-- 支付结果 -->
      <div class="pay-result">
        <span class="iconfont icon-queren2 green"></span>
        <!-- <span class="iconfont icon-shanchu red" ></span> -->
        <p class="tit">订单支付成功</p>
        <p class="tip">我们将尽快为您发货，收货期间请保持手机畅通</p>
        <p>
          支付方式：
          <span>
            {{ orderPayInfo?.payChannel === 1 ? "支付宝支付" : "微信支付" }}
          </span>
        </p>
        <p>
          支付金额：
          <span style="color: red"> ¥{{ orderPayInfo?.payMoney }} </span>
        </p>
        <div class="btn">
          <XtxButton type="primary" style="margin-right: 20px" @click="$router.push('/')">
            查看订单
          </XtxButton>
          <XtxButton type="gray" @click="$router.push('/')">进入首页</XtxButton>
        </div>
        <p class="alert">
          <span class="iconfont icon-tip"></span>
          温馨提示：小兔鲜儿不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，保护资产、谨慎操作。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderPayInfo } from '@/types/order';
import http from '@/api/httpRequest';

// 获取订单 id
const route = useRoute();
const { orderId: id } = route.query;

// 根据订单 id 获取订单详情，用于界面渲染
const orderPayInfo = ref<OrderPayInfo>();

onMounted(async () => {
  const res = await http<OrderPayInfo>('GET', `/member/order/${id}`);
  orderPayInfo.value = res.result;
});
</script>

<style scoped lang="less">
.pay-result {
  padding: 100px 0;
  background: #fff;
  text-align: center;
  > .iconfont {
    font-size: 100px;
  }
  .green {
    color: #1dc779;
  }
  .red {
    color: @priceColor;
  }
  .tit {
    font-size: 24px;
  }
  .tip {
    color: #999;
  }
  p {
    line-height: 40px;
    font-size: 16px;
  }
  .btn {
    margin-top: 50px;
  }
  .alert {
    font-size: 12px;
    color: #999;
    margin-top: 50px;
  }
}
</style>
