import { useState, useEffect } from 'react'
import { servicesAPI } from '@/lib/axios'
import { translateService } from '@/lib/translationService'

export interface Service {
  _id: string
  name: string | { ar: string; en: string }
  description: string | { ar: string; en: string }
  features: (string | { ar: string; en: string })[]
  status: 'active' | 'inactive'
  order: number
  createdAt: string
  updatedAt: string
}

export interface ServicesResponse {
  success: boolean
  services: Service[]
}

export interface AdminServicesResponse {
  success: boolean
  services: Service[]
  pagination: {
    CurrentPage: number
    PageSize: number
    TotalCount: number
    TotalPages: number
  }
}

export const useServices = (language: string = 'ar') => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async (lang: string = language) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await servicesAPI.getAll(lang)
      
      if (response.data.success) {
        setServices(response.data.services)
      } else {
        setError('Failed to fetch services')
      }
    } catch (err: any) {
      console.error('Error fetching services:', err)
      setError(err.response?.data?.error || 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices(language)
  }, [language])

  return {
    services,
    loading,
    error,
    refetch: () => fetchServices(language)
  }
}

// Hook for admin services management
export const useAdminServices = (language: string = 'ar') => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TotalCount: 0,
    TotalPages: 0
  })

  const fetchAdminServices = async (params?: {
    status?: string
    page?: number
    limit?: number
    search?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await servicesAPI.admin.getAll({ ...params, lang: language })
      
      if (response.data.success) {
        // Translate services to the current language
        const translatedServices = response.data.services.map((service: any) => 
          translateService(service, language as 'ar' | 'en')
        )
        setServices(translatedServices)
        setPagination(response.data.pagination)
      } else {
        setError('Failed to fetch services')
      }
    } catch (err: any) {
      console.error('Error fetching admin services:', err)
      setError(err.response?.data?.error || 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const createService = async (data: {
    name: string | { ar: string; en: string }
    description: string | { ar: string; en: string }
    features: (string | { ar: string; en: string })[]
    status?: 'active' | 'inactive'
    order?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await servicesAPI.admin.create(data)
      
      if (response.data.success) {
        // Refresh the services list
        await fetchAdminServices()
        return { success: true, service: response.data.service }
      } else {
        setError(response.data.error || 'Failed to create service')
        return { success: false, error: response.data.error }
      }
    } catch (err: any) {
      console.error('Error creating service:', err)
      const errorMsg = err.response?.data?.error || 'Failed to create service'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const updateService = async (id: string, data: {
    name: string | { ar: string; en: string }
    description: string | { ar: string; en: string }
    features: (string | { ar: string; en: string })[]
    status?: 'active' | 'inactive'
    order?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await servicesAPI.admin.update(id, data)
      
      if (response.data.success) {
        // Refresh the services list
        await fetchAdminServices()
        return { success: true, service: response.data.service }
      } else {
        setError(response.data.error || 'Failed to update service')
        return { success: false, error: response.data.error }
      }
    } catch (err: any) {
      console.error('Error updating service:', err)
      const errorMsg = err.response?.data?.error || 'Failed to update service'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const deleteService = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await servicesAPI.admin.delete(id)
      
      if (response.data.success) {
        // Refresh the services list
        await fetchAdminServices()
        return { success: true }
      } else {
        setError(response.data.error || 'Failed to delete service')
        return { success: false, error: response.data.error }
      }
    } catch (err: any) {
      console.error('Error deleting service:', err)
      const errorMsg = err.response?.data?.error || 'Failed to delete service'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const getServiceById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await servicesAPI.admin.getById(id)
      
      if (response.data.success) {
        return { success: true, service: response.data.service }
      } else {
        setError(response.data.error || 'Failed to fetch service')
        return { success: false, error: response.data.error }
      }
    } catch (err: any) {
      console.error('Error fetching service:', err)
      const errorMsg = err.response?.data?.error || 'Failed to fetch service'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  return {
    services,
    loading,
    error,
    pagination,
    fetchAdminServices,
    createService,
    updateService,
    deleteService,
    getServiceById
  }
}
