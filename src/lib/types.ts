export type Season = {
  id: string;
  name: string;
  order?: number;
  isActive?: boolean;
};

export type Category = {
  id: string;
  seasonId: string;
  name: string;
  order?: number;
  icon?: string;
};

export type ProductImage = { url: string; publicId: string };

export type Product = {
  id: string;
  seasonId: string;
  categoryId: string;

  modelNumber: number;
  modelSortKey: number;

  title: string;
  description?: string;

  price: number;
  hasDiscount?: boolean;
  discountPrice?: number;

  packQty?: number;
  sizes?: string[];
  colors?: string[];

  images: ProductImage[];
  stockStatus?: "in_stock" | "out_stock";

  createdAt?: any;
  updatedAt?: any;
};

export type CompanyInfo = {
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  telegramUrl?: string;
  factoryLocationUrl?: string;
  shopLocationUrl?: string;
};
