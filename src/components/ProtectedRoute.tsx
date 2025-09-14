'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ('super_admin' | 'admin' | 'visitor')[]
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['super_admin', 'admin', 'visitor'],
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      const currentRole = isAuthenticated && user ? user.role : 'visitor'

      if (!allowedRoles.includes(currentRole)) {
        // If not authenticated and visitor not allowed → go to login (or provided redirect)
        if (currentRole === 'visitor') {
          router.push(redirectTo)
          return
        }

        // Authenticated but not allowed → keep within their area
        if (currentRole === 'super_admin') {
          router.push('/super-admin/dashboard')
        } else if (currentRole === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
        return
      }
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, redirectTo, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  // Determine effective role for rendering
  const currentRole = isAuthenticated && user ? user.role : 'visitor'

  // Don't render children if role not allowed
  if (!allowedRoles.includes(currentRole)) {
    return null
  }

  return <>{children}</>
}
