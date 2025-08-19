import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL;
const BASE_URL = API_URL.replace('/api', ''); // Remove /api for OAuth endpoints
const CLIENT_ID = (import.meta as any).env.VITE_CLIENT_ID;
const CLIENT_SECRET = (import.meta as any).env.VITE_CLIENT_SECRET;

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management
let clientToken: string | null = null;
let clientTokenExpiry: number | null = null;

// Interface for login response
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

// Interface for client credentials response
export interface ClientCredentialsResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Get client credentials token
export const getClientToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (clientToken && clientTokenExpiry && Date.now() < clientTokenExpiry) {
    return clientToken;
  }

  try {
    const response: AxiosResponse<ClientCredentialsResponse> = await axios.post(
      `${BASE_URL}/oauth/token`,
      {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    clientToken = response.data.access_token;
    clientTokenExpiry = Date.now() + (response.data.expires_in * 1000);

    return clientToken;
  } catch (error) {
    console.error('Failed to get client token:', error);
    throw new Error('Failed to authenticate with the server');
  }
};

// Set up request interceptor to add client token
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // Add client token for all requests
    const token = await getClientToken();
    if (config.headers && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Set up response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear client token on 401
      clientToken = null;
      clientTokenExpiry = null;
    }
    return Promise.reject(error);
  }
);

// User authentication methods
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await apiClient.post('/login', {
      email,
      password,
    });

    // Store user token
    localStorage.setItem('user_token', response.data.access_token);
    localStorage.setItem('user_data', JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please try again.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    const userToken = localStorage.getItem('user_token');
    if (userToken) {
      await apiClient.post('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
  }
};

export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      throw new Error('No token to refresh');
    }

    const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    // Update stored token
    localStorage.setItem('user_token', response.data.access_token);
    localStorage.setItem('user_data', JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    // Clear invalid token
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    throw new Error('Token refresh failed');
  }
};

export const getCurrentUser = async (): Promise<any> => {
  try {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      throw new Error('No user token');
    }

    const response = await apiClient.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error('Failed to get current user');
  }
};

export const getUserPermissions = async (): Promise<string[]> => {
  try {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      return [];
    }

    const response = await apiClient.get('/auth/me/permissions', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    return response.data.permissions || [];
  } catch (error) {
    return [];
  }
};

// Export the configured apiClient for other services
export { apiClient }; 