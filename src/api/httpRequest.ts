import axios from 'axios';
import type { Method } from 'axios';

import { message } from '@/components/XtxUI';
import { useUserStore } from '@/store';

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 50000
});

// 添加请求拦截器
http.interceptors.request.use(config => {
    // ✅ 在组件外，哪里使用，写哪里(消费前获取)
    const userStore = useUserStore();

    // 1. 获取token
    const { token } = userStore.profile;
    // 2. 如果有 token 同时 headers 非空
    if (token && config.headers) {
      // 3. 请求头中携带 token 信息
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(response => {
  // 如果请求成功成功 2xx 就直接返回 data 中的数据
  const resData = response.data;

  return resData;
}, error => {
    console.log(error);

    // 对响应错误做点什么
    if (error.code === 'ERR_NETWORK') {
      // 无网络，错误提示
      message({ type: 'error', text: '亲，换个网络试试~' });
    } else {
      // 有网络，但后端认为有错误，提示后端响应的错误
      message({ type: 'error', text: error.response.data.message });
    }
    // 控制台显示错误
    return Promise.reject(error);
  }
);

/**
 * axios 二次封装
 * @param {String} url  请求地址
 * @param {String} method  请求类型
 * @param {Object} submitData  对象类型，提交数据
 */
const httpRequest = <T>(method: Method, url: string, submitData?: unknown) => {
  return http.request<T, IResponseData<T>>({
    url,
    method,
    // 🔔 自动设置合适的 params/data 键名称，如果 method 为 get 用 params 传请求参数，否则用 data
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData,
  });
};

export default httpRequest;
