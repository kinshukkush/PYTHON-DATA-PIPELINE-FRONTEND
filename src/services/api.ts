import { API_BASE_URL } from '../config';
import type { Product, Order, AnalyticsSummary, HealthCheck } from '../types';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error: Unable to connect to API');
  }
}

export async function getHealth(): Promise<HealthCheck> {
  return fetchApi<HealthCheck>('/');
}

export async function getProducts(): Promise<Product[]> {
  return fetchApi<Product[]>('/products/');
}

export async function getOrders(): Promise<Order[]> {
  return fetchApi<Order[]>('/orders/');
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return fetchApi<AnalyticsSummary>('/analytics/summary');
}

// POST methods for bulk insert
export async function bulkInsertProducts(products: Omit<Product, 'id'>[]): Promise<any> {
  return fetchApi('/products/bulk-ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(products),
  });
}

export async function bulkInsertOrders(orders: Omit<Order, 'id'>[]): Promise<any> {
  return fetchApi('/orders/bulk-ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orders),
  });
}
