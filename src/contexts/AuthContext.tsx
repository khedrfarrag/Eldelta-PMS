'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/axios'
import { toast } from 'react-toastify'

interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'visitor'
  status: 'active' | 'pending' | 'inactive'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await authAPI.verifyToken()
      if (response.data.success) {
        // Create user object from response data
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          status: response.data.user.status
        }
        setUser(userData)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authAPI.login({ email, password })
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        
        // Create user object from response data
        const userData = {
          id: response.data.id || 'unknown',
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          status: 'active' as const
        }
        
        setUser(userData)
        toast.success('تم تسجيل الدخول بنجاح')
        
        // Redirect based on role
        if (response.data.role === 'super_admin') {
          router.push('/super-admin/dashboard')
        } else if (response.data.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
        
        return true
      } else {
        toast.error(response.data.error || 'فشل في تسجيل الدخول')
        return false
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.error || 'حدث خطأ أثناء تسجيل الدخول'
      toast.error(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authAPI.register({ name, email, password })
      
      if (response.data.success) {
        toast.success('تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني')
        router.push('/login')
        return true
      } else {
        toast.error(response.data.error || 'فشل في إنشاء الحساب')
        return false
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      const errorMessage = error.response?.data?.error || 'حدث خطأ أثناء إنشاء الحساب'
      toast.error(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('تم تسجيل الخروج بنجاح')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
