
export type CategoryChildren = {
  id: string;
  name: string;
  picture: string;
};

export type CategoryGoods = {
  desc: string;
  id: string;
  name: string;
  picture: string;
  price: string;
};

// 分类数据
export type CategoryItem = {
  id: string;
  name: string;
  picture: string;
  children: CategoryChildren[];
  goods: CategoryGoods[];
};

// 存一个更有语义的类型名字
export type GoodsItem = CategoryGoods;

export type CategoryList = CategoryItem[];

// 轮播图类型
export type BannerItem = {
  id: string;
  imgUrl: string;
  hrefUrl: string;
  type: string;
};

export type BannerList = BannerItem[];
