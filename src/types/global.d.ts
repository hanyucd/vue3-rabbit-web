export {};

// 为引擎对象添加全局类似声明
declare global {
  /**
   * 响应数据
   */
  interface IResponseData<T = any> {
    code?: string;
    msg: string;
    result: T;
  }
}
