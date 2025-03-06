import axios from 'axios';
import type { Method } from 'axios';

// 创建 axios 实例
const http = axios.create({
  // baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/',
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 50000
});

// 添加请求拦截器
http.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    return config;
  }, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(response => {
  console.log('response', response);

  const resData = response.data;

  return resData;
  // return response;
  
  }, error  => {
    // 对响应错误做点什么
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
