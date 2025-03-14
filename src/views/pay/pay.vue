<template>
  <div class="xtx-pay-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付订单</XtxBreadItem>
      </XtxBread>
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>
            支付还剩
            <span>{{ countTimeText }}</span>
            , 超时后将取消订单
          </p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ orderPayInfo?.payMoney }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;"></a>
          <a class="btn alipay" :href="payUrl"></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import http from '@/api/httpRequest';
import type { OrderPayInfo } from '@/types/order';
import { useCountDown } from '@/hooks';
import { message } from '@/components/XtxUI';

// 获取路由信息
const route = useRoute();
const router = useRouter();
// 获取订单 id
const { id } = route.query;
// console.log(id);
// 存储订单信息
const orderPayInfo = ref<OrderPayInfo>();

onMounted(async () => {
  const res = await http<OrderPayInfo>('GET', `/member/order/${id}`);
  // console.log('GET', `/member/order/${id}`, res.result);
  // 获取倒计时秒数
  const { countdown } = res.result;
  // 如果后端秒数返回 -1 ，表示订单超时，不展示支付详情页
  if (countdown === -1) {
    // 跳转页面
    router.replace('/cart');
    // 提醒用户
    return message({ type: 'warn', text: '订单已超时，请重新下单~' });
  }
  // 存储订单信息，用于页面渲染
  orderPayInfo.value = res.result;
  // 在启动倒计时的时候再传递时间
  start(countdown);
});

// countTime 数据需要模板渲染，useCountDown 只能再顶层调用
const { countTime, countTimeText, start } = useCountDown();

// 监听倒计时秒数，如果倒计时结束，跳转页面
watch(countTime, (val) => {
  if (val <= 0) {
    // 跳转页面，并提醒用户
    router.replace('/cart');
    return message({ type: 'warn', text: '订单已超时，请重新下单~' });
  }
});

// 支付宝跳转链接
// const payUrl = '后台服务基准地址+支付页面地址+订单ID+回跳地址'
const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/';
const redirectUrl = encodeURIComponent('http://127.0.0.1:8080/pay/callback');
const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.id}&redirect=${redirectUrl}`;
</script>

<style scoped lang="less">
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
        no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
        no-repeat center / contain;
    }
  }
}
</style>
