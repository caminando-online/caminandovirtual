// Tipos básicos de la aplicación
export interface Supermarket {
  id: string;
  name: string;
  logo: string;
  baseUrl: string;
}

export interface Category {
  id: string;
  name: string;
  supermarketId: string;
  url: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string;
  productUrl: string;
  supermarketId: string;
  categoryId: string;
  subcategoryId?: string;
  unit?: string;
  weight?: string;
  description?: string;
  availability: boolean;
  lastUpdated: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  favoriteSupermarkets: string[];
  notifications: boolean;
  language: 'es' | 'en';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  supermarketId?: string;
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  availability?: boolean;
  discount?: boolean;
}

// Estados de navegación
export type AppSection =
  | 'supermarket'
  | 'categories'
  | 'subcategories'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'profile'
  | 'orders';

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Configuración de la aplicación
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'test';
  version: string;
}