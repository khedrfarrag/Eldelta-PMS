import axios from 'axios'

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  
  verifyToken: () =>
    api.get('/api/auth/verify'),
  
  logout: () =>
    api.post('/api/auth/logout'),
}

export const requestsAPI = {
  getAll: (params?: any) =>
    api.get('/api/requests', { params }),
  
  create: (data: any) =>
    api.post('/api/requests', data),
  
  getById: (id: string) =>
    api.get(`/api/requests/${id}`),
  
  update: (id: string, data: any) =>
    api.put(`/api/requests/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/api/requests/${id}`),
}

export const servicesAPI = {
  // Public APIs
  getAll: (language: string = 'ar', params?: { status?: string }) =>
    api.get('/api/services', { params: { lang: language, ...params } }),
  
  getById: (id: string) =>
    api.get(`/api/services/${id}`),
  
  // Admin APIs  
  admin: {
    getAll: (params?: { status?: string; page?: number; limit?: number; search?: string; lang?: string }) =>
      api.get('/api/admin/services', { params }),
    
    getById: (id: string) =>
      api.get(`/api/admin/services/${id}`),
    
    create: (data: any) =>
      api.post('/api/admin/services', data),
    
    update: (id: string, data: any) =>
      api.put(`/api/admin/services/${id}`, data),
    
    delete: (id: string) =>
      api.delete(`/api/admin/services/${id}`),
  }
}

export const analyticsAPI = {
  getPublic: () =>
    api.get('/api/analytics/public'),
  
  getAdmin: () =>
    api.get('/api/admin/analytics'),
}

// Contacts APIs
export const contactsAPI = {
  // Public - send contact message
  send: (data: { name: string; email: string; message: string; phone?: string }) =>
    api.post('/api/contact', data),

  // Admin
  admin: {
    // list with filters/pagination (admin & super_admin)
    getAll: (params?: { status?: string; page?: number; limit?: number }) =>
      api.get('/api/admin/contact', { params }),

    // get single (admin & super_admin)
    getById: (id: string) =>
      api.get(`/api/admin/contact/${id}`),

    // create (super_admin)
    create: (data: { name: string; email: string; message: string; phone?: string }) =>
      api.post('/api/admin/contact', data),

    // update partial (super_admin) - by id route preferred
    updateById: (id: string, data: Partial<{ name: string; email: string; phone: string; message: string; status: string; notes: string }>) =>
      api.patch(`/api/admin/contact/${id}`, data),

    // delete (super_admin)
    delete: (id: string) =>
      api.delete(`/api/admin/contact/${id}`),
  }
}