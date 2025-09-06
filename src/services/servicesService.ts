import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('user_token');
};

// Create axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Service {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicesResponse {
  services: Service[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const servicesService = {
  // Get all services
  getServices: async (params?: {
    search?: string;
    is_active?: boolean;
    per_page?: number;
  }): Promise<ServicesResponse> => {
    const response = await apiClient.get('/services', { params });
    return response.data;
  },

  // Get service by ID
  getService: async (id: number): Promise<Service> => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData: Partial<Service>): Promise<Service> => {
    const response = await apiClient.post('/services', serviceData);
    return response.data;
  },

  // Update service
  updateService: async (id: number, serviceData: Partial<Service>): Promise<Service> => {
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id: number): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },

  // Get all products
  getProducts: async (params?: {
    search?: string;
    is_active?: boolean;
    per_page?: number;
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
