
<template>
  <!-- 🐛当元素祖先出现 `transform`，对话框固定定位出问题 -->
  <div style="transform: translate(0)">
    <!-- 🚨Teleport 传送门组件，传送内容到指定结构 #model 中 -->
    <Teleport to="#model">
      <!-- 被传送的内容 -->
      <XtxDialog title="切换收货地址" :visible="visible" @close="visible = false">
        <template #default>
          <div class="addressWrapper">
            <div v-for="item in addressList" :key="item.id" :class="{ active: tempAddress?.id === item.id }" class="text item" @click="tempAddress = item">
              <ul>
                <li><span>收&ensp;货&ensp;人：</span>{{ item.receiver }}</li>
                <li><span>联系方式：</span>{{ hidePhone(item.contact) }}</li>
                <li>
                  <span>收货地址：</span>{{ item.fullLocation + item.address }}
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template #footer>
          <XtxButton type="gray" style="margin-right: 20px" @click="cancelAddress">取 消</XtxButton>
          <XtxButton type="primary" @click="confirmAddress">确 认</XtxButton>
        </template>
      </XtxDialog>
    </Teleport>
  </div>
  
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>填写订单</XtxBreadItem>
      </XtxBread>

      <div v-if="checkoutInfo" class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <ul v-if="currAddress?.receiver">
                <!-- &ensp; 表示半个字符大小 -->
                <!-- &emsp; 表示一个字符大小 -->
                <li>
                  <span>收&ensp;货&ensp;人：</span>{{ currAddress.receiver }}
                </li>
                <li>
                  <span>联系方式：</span>{{ hidePhone(currAddress.contact) }}
                </li>
                <li>
                  <span>收货地址： </span>
                  {{ currAddress.fullLocation + currAddress.address }}
                </li>
              </ul>
              <div v-else class="none">您需要先添加收货地址才可提交订单。</div>
            </div>
            <div class="action">
              <XtxButton class="btn" @click="visible = true">
                切换地址
              </XtxButton>
              <XtxButton class="btn">添加地址</XtxButton>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in checkoutInfo.goods" :key="item.skuId">
                <td>
                  <RouterLink :to="`/goods/${item.id}`" class="info">
                    <img :src="item.picture" alt="" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </RouterLink>
                </td>
                <td>&yen;{{ item.payPrice }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a
            class="my-btn active"
            href="javascript:;"
          >不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color: #999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkoutInfo.summary.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkoutInfo.summary.totalPrice }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkoutInfo.summary.postFee }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥{{ checkoutInfo.summary.totalPayPrice }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton type="primary" @click="submitCheckout">提交订单</XtxButton>
        </div>
      </div>
      <!-- loading 加载 -->
      <div v-else class="wrapper loading"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CheckoutInfo, UserAddresse, OrderResponse } from '@/types/order';
import { message } from '@/components/XtxUI';
import http from '@/api/httpRequest';
import { useCartStore } from '@/store';
import { useRouter } from 'vue-router';
import { hidePhone } from '@/utils';

const cartStore = useCartStore();
const router = useRouter();

// 订单完整信息
const checkoutInfo = ref<CheckoutInfo>();
// 当前展示的收货地址
const currAddress = ref<UserAddresse>();
// 收货地址列表
const addressList = ref<UserAddresse[]>([]);
// 列表中临时选择的地址(高亮)
const tempAddress = ref<UserAddresse>();

// 对话框是否可见
const visible = ref(false);

onMounted(async () => {
  const res = await http<CheckoutInfo>('GET', '/member/order/pre');
  // 存储订单完整信息
  checkoutInfo.value = res.result;
  // 存储当前展示的收货地址
  tempAddress.value = currAddress.value = res.result.userAddresses[0] || {};
  // 存储收货地址列表
  addressList.value = res.result.userAddresses;
});

/**
 * 用户点击确定按钮
 */
const confirmAddress = () => {
  // 把临时高亮的地址赋值给收货地址(用于订单收货)
  currAddress.value = tempAddress.value;
  // 隐藏对话框
  visible.value = false;
};

/**
 * 用户点击取消按钮
 */
const cancelAddress = () => {
  // 收货地址赋值给临时地址(用于打开时高亮)
  tempAddress.value = currAddress.value;
  // 隐藏对话框
  visible.value = false;
};

/**
 * 提交订单
 */
const submitCheckout = async () => {
  // 没有收货地址提示
  if (!currAddress.value?.id) return message({ type: 'warn', text: '请选择收货地址' });

  // 准备提交订单后端所需参数
  const data = {
    // 商品集合
    goods: checkoutInfo.value?.goods.map(({ skuId, count }) => ({ skuId, count })),
    // 所选地址 id
    addressId: currAddress.value?.id,
    // 其他字段比较简单就不额外处理了
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: '',
  };
  // 提交订单
  const res = await http<OrderResponse>('POST', '/member/order', data);
  // 成功提醒用户
  message({ type: 'success', text: '下单成功~' });
  // 🔔重新获取购物车列表
  cartStore.getCartList();
  // 🚨替换成订单支付页(不能后退回来了)
  router.replace(`/pay?id=${res.result.id}`);
};
</script>

<style scoped lang="less">
// loading 效果添加权重，.wrapper.loading 表示同时存在两个类名
.wrapper.loading {
  min-height: 500px;
  background: #fff url("@/assets/images/loading.gif") no-repeat center;
}
.wrapper {
  background: #fff;
  padding: 0 20px;
  .box-title {
    font-size: 16px;
    font-weight: normal;
    padding-left: 10px;
    line-height: 70px;
    border-bottom: 1px solid #f5f5f5;
  }
  .box-body {
    padding: 20px 0;
  }
}
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,
  &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
// 对话框地址列表
.xtx-dialog {
  .addressWrapper {
    max-height: 500px;
    overflow-y: auto;
  }
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
