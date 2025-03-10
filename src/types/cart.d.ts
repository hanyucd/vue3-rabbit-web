// 单个购物车商品
export interface CartItem {
  id: string;
  skuId: string;
  name: string;
  attrsText: string;
  // specs: any[];
  picture: string;
  price: string;
  nowPrice: string;
  nowOriginalPrice: string;
  selected: boolean;
  stock: number;
  count: number;
  isEffective: boolean;
  // discount?: any;
  isCollect: boolean;
  postFee: number;
}

// 购物车列表
export type CartList = CartItem[];
