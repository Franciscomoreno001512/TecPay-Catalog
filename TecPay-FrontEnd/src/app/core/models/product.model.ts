export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProduct {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  categoryId: number;
}

export interface UpdateProduct {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
}
