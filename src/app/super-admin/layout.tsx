'use client'
import { ReactNode, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import SuperAdminSidebar from '@/components/SuperAdminSidebar'
import SuperAdminHeader from '@/components/SuperAdminHeader'

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="min-h-screen transition-colors duration-300">
        {/* Header + Sidebar in same row */}
        <div className="flex">
          {/* Sidebar */}
          <SuperAdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <SuperAdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            {/* Page Content */}
            <main className="flex-1 py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}


