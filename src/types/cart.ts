export type PackSize = '10ml' | '15ml' | '15g' | '30g' | '50g';

export interface CartItem {
  key: string;
  groupCode: string;
  shadeCode: string;
  packSize: PackSize;
  qty: number;
  moq: number;
  productName?: string;
}

export interface CartState {
  items: CartItem[];
}