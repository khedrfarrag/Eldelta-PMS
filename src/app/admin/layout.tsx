'use client'
import { ReactNode } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminHeader from '@/components/AdminHeader'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <AdminHeader />
        <AdminSidebar />
        {/* Page Content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}


