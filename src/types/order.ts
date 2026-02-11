// Order-related TypeScript types

export interface Product {
  category: string;
  subcategory: string;
  product_name: string;
  code: string;
  size: string;
  unit: string;
  price: string;
  moq: string;
  image_url: string;
  notes: string;
  active: string;
}

export interface OrderLine {
  code: string;
  product_name: string;
  size: string;
  unit: string;
  quantity: number;
  moq: string;
  notes?: string;
}

export interface CustomerDetails {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  vat_number?: string;
  shipping_address: string;
  additional_comments?: string;
}

export interface OrderSubmission {
  customer: CustomerDetails;
  items: OrderLine[];
  order_date: string;
}

export interface OrderResponse {
  success: boolean;
  order_id?: string;
  message?: string;
  error?: string;
}
