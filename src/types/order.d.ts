export interface UserAddresse {
  id: string;
  receiver: string;
  contact: string;
  provinceCode: string;
  cityCode: string;
  countyCode: string;
  address: string;
  isDefault: number;
  fullLocation: string;
  postalCode: string;
  addressTags: string;
}

export interface Good {
  id: string;
  name: string;
  picture: string;
  count: number;
  skuId: string;
  attrsText: string;
  price: string;
  payPrice: string;
  totalPrice: string;
  totalPayPrice: string;
}

export interface Summary {
  goodsCount: number;
  totalPrice: number;
  totalPayPrice: number;
  postFee: number;
  discountPrice: number;
}

// 订单信息
export interface CheckoutInfo {
  userAddresses: UserAddresse[];
  goods: Good[];
  summary: Summary;
}

// 下单后的返回值
export interface OrderResponse {
  id: string;
  createTime: string;
  payType: number;
  orderState: number;
  payLatestTime: string;
  postFee: number;
  payMoney: number;
  totalMoney: number;
  totalNum: number;
  // skus?: any;
  payChannel: number;
  // countdown?: any;
}

export interface Property {
  propertyMainName: string;
  propertyValueName: string;
}

export interface Sku {
  id: string;
  spuId: string;
  name: string;
  quantity: number;
  image: string;
  realPay: number;
  curPrice: number;
  // totalMoney?: any;
  properties: Property[];
  attrsText: string;
}

// 支付订单信息
export interface OrderPayInfo {
  id: string;
  createTime: string;
  payType: number;
  orderState: number;
  payLatestTime: string;
  countdown: number;
  postFee: number;
  payMoney: number;
  payChannel: number;
  payState: number;
  totalMoney: number;
  totalNum: number;
  deliveryTimeType: number;
  receiverContact: string;
  receiverMobile: string;
  provinceCode: string;
  cityCode: string;
  countyCode: string;
  receiverAddress: string;
  // payTime?: any;
  // consignTime?: any;
  // endTime?: any;
  closeTime: string;
  // evaluationTime?: any;
  skus: Sku[];
  // arrivalEstimatedTime?: any;
}

// 订单项
export interface OrderItem {
  id: string;
  createTime: string;
  payType: number;
  orderState: number;
  payLatestTime: string;
  postFee: number;
  payMoney: number;
  totalMoney: number;
  totalNum: number;
  skus: Sku[];
  payChannel: number;
  countdown: number;
}

// 订单列表
export type OrderItemList = OrderItem[];

// 订单列表总信息
export interface OrderListInfo {
  counts: number;
  pageSize: number;
  pages: number;
  page: number;
  items: OrderItemList;
}
