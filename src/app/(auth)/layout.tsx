'use client'
import { ReactNode } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['visitor']} redirectTo="/login">
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  )
}


