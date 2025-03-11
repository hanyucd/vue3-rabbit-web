<template>
  <div class="member-home">
    <!-- <HomeOverview /> -->
    <!-- <HomePanel title="我的收藏" /> -->
    <!-- <HomePanel title="我的足迹" /> -->

    <!-- 概览 -->
    <div class="home-overview">
      <!-- 用户信息 -->
      <div class="user-meta">
        <div class="avatar">
          <!-- @error 图片加载失败触发的事件 -->
          <img :src="profile.avatar" @error="imgError" />
        </div>
        <h4>
          <!-- 按照书写顺序优先显示：昵称 或 账号名 或 手机号 -->
          {{ profile.nickname || profile.account || profile.mobile }}
        </h4>
      </div>
      <div class="item">
        <a href="javascript:;">
          <span class="iconfont icon-hy"></span>
          <p>会员中心</p>
        </a>
        <a href="javascript:;">
          <span class="iconfont icon-aq"></span>
          <p>安全设置</p>
        </a>
        <a href="javascript:;">
          <span class="iconfont icon-dw"></span>
          <p>地址管理</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store';
import defaultImg from '@/assets/images/200.png';

const userStore = useUserStore();
// 解构 profile 并保持响应式
const { profile } = storeToRefs(userStore);

// 图片加载失败会触发 error 事件，加载失败使用默认占位图
const imgError = () => {
  profile.value.avatar = defaultImg;
};
</script>

<style scoped lang="less">
.home-overview {
  height: 132px;
  background: url(@/assets/images/center-bg.png) no-repeat center / cover;
  display: flex;
  .user-meta {
    flex: 1;
    display: flex;
    align-items: center;
    .avatar {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    h4 {
      padding-left: 26px;
      font-size: 18px;
      font-weight: normal;
      color: white;
    }
  }
  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    &:first-child {
      border-right: 1px solid #f4f4f4;
    }
    a {
      color: white;
      font-size: 16px;
      text-align: center;
      .iconfont {
        font-size: 32px;
      }
      p {
        line-height: 32px;
      }
    }
  }
}
</style>
