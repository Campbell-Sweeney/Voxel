export interface Product {
  id: number;
  name: string;
  price: number;
  tax: number;
  tariffs: number;
  description: string;
  image?: string; // URL or base64 string for the product image
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AppConfig {
  password: string;
  announcement: string;
  products: Product[];
} 