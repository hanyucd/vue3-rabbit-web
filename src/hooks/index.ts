import dayjs from 'dayjs';
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core';

/**
 * 请求按需加载
 * @param apiFn 发送请求函数
 * @returns  🚨 target 用于模板绑定
 */
export const useObserver = (apiFn: () => void) => {
  // 准备个 ref 用于绑定模板中的某个目标元素(DOM节点或组件)
  const target = ref(null);
  const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
    console.log('是否进入可视区域', isIntersecting);
    if (isIntersecting) {
      // 当目标元素进入可视区域时，才发送请求
      apiFn();
      // 请求已发送，主动停止检查
      stop();
    }
  });
  // 🚨返回 ref 用于模板绑定，建议返回对象格式支持解构获取
  return { target };
};

/**
 * 倒计时封装
 * @param seconds 倒计时秒数
 */
export const useCountDown = (seconds = 60) => {
  // 倒计时时间
  const countTime = ref(0);
  // 根据秒数格式化成 mm分ss秒 格式文本
  const countTimeText = computed(() => {
    return dayjs.unix(countTime.value).format('mm分ss秒');
  });
  
  // pause   暂停
  // resume  启动
  const { pause, resume } = useIntervalFn(
    // 等于以前写 setInterval 的回调函数
    () => {
      // 倒计时减少
      countTime.value--;
      // 是否到 0
      if (countTime.value <= 0) {
        // 暂停定时器
        pause();
      }
    },
    // 等于以前写 setInterval 的时间间隔
    1000,
    // 额外封装的 immediate 是否立刻执行
    { immediate: false }
  );

  // 初始化倒计时
  const start = (startTime?: number) => {
    // 初始化倒计时时间，startTime 优先级更高
    countTime.value = startTime || seconds;
    // 启动定时器
    resume();
  };

  // return 给组件使用
  return { countTime, pause, resume, start, countTimeText };
};
