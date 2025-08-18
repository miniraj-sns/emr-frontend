import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    is_active: boolean
    roles: string[]
    permissions: string[]
  }
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  is_active: boolean
  roles: string[]
  permissions: string[]
}

class AuthService {
  private api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
  })

  constructor() {
    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/login', credentials)
      return response.data
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Login failed. Please try again.')
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/logout')
    } catch (error) {
      // Even if logout fails, clear local storage
      console.warn('Logout request failed, but clearing local storage')
    } finally {
      localStorage.removeItem('token')
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get('/me')
      return response.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        throw new Error('Authentication required')
      }
      throw new Error('Failed to get user information')
    }
  }

  async refreshToken(): Promise<{ access_token: string; token_type: string }> {
    try {
      const response = await this.api.post('/auth/refresh')
      return response.data
    } catch (error: any) {
      localStorage.removeItem('token')
      throw new Error('Token refresh failed')
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }
}

export const authService = new AuthService() 