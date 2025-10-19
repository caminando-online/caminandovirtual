import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, Supermarket, Category, Product, SearchFilters, PaginationParams } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Supermercados
  async getSupermarkets(): Promise<Supermarket[]> {
    const response: AxiosResponse<ApiResponse<Supermarket[]>> = await this.api.get('/supermarkets');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Error al obtener supermercados');
  }

  // Categorías
  async getCategories(supermarketId?: string): Promise<Category[]> {
    const params = supermarketId ? { supermarketId } : {};
    const response: AxiosResponse<ApiResponse<Category[]>> = await this.api.get('/categories', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Error al obtener categorías');
  }

  // Productos
  async getProducts(filters: SearchFilters & PaginationParams): Promise<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/products', { params: filters });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Error al obtener productos');
  }

  async getProductById(id: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(`/products/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Error al obtener producto');
  }

  // Búsqueda
  async searchProducts(query: string, filters?: SearchFilters): Promise<Product[]> {
    const params = { q: query, ...filters };
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.api.get('/search', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Error en la búsqueda');
  }

  // Configuración de headers de autenticación
  setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }
}

// Instancia singleton
export const apiService = new ApiService();
export default apiService;