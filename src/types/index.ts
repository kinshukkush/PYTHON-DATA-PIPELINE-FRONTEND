export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  in_stock: boolean;
}

export interface OrderItem {
  sku: string;
  quantity: number;
}

export interface Order {
  id: string;
  order_id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  created_at: string;
}

export interface RevenueByDate {
  date: string;
  total_revenue: number;
}

export interface TopProduct {
  sku: string;
  total_quantity: number;
  total_revenue: number;
}

export interface AnalyticsSummary {
  total_orders: number;
  total_revenue: number;
  revenue_by_date: RevenueByDate[];
  top_products: TopProduct[];
}

export interface HealthCheck {
  message: string;
}
