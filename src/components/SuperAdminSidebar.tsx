'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

const navigation = [
  { name: 'لوحة التحكم', href: '/super-admin/dashboard', icon: '📊' },
  { name: 'إدارة المشرفين', href: '/super-admin/admins', icon: '👥' },
  { name: 'طلبات الخدمات', href: '/super-admin/requests', icon: '📋' },
  { name: 'إدارة الخدمات', href: '/super-admin/services', icon: '⚙️' },
  { name: 'التقارير المفصلة', href: '/super-admin/analytics', icon: '📈' },
  { name: 'الإعدادات', href: '/super-admin/settings', icon: '🔧' },
]

interface SuperAdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function SuperAdminSidebar({ sidebarOpen, setSidebarOpen }: SuperAdminSidebarProps) {
  const pathname = usePathname()
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('superAdminSidebarOpen')
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState))
    }
  }, [setSidebarOpen])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('superAdminSidebarOpen', JSON.stringify(sidebarOpen))
  }, [sidebarOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key to close sidebar
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
      // Ctrl/Cmd + B to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault()
        setSidebarOpen(!sidebarOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen, setSidebarOpen])

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
        
        {/* Sidebar */}
        <div className="relative flex flex-col w-full h-full bg-white dark:bg-gray-800 transition-colors duration-300">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 dark:bg-teal-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {isRTL ? 'الدلتا سوبر أدمن' : 'Delta Super Admin'}
              </h1>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="إغلاق الشريط الجانبي"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)} // Close sidebar on mobile when navigating
                className={`${
                  pathname === item.href
                    ? 'bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-teal-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                } group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
            {/* Header with toggle button */}
            <div className={`flex items-center  ${sidebarOpen ? 'justify-between p-4' : 'justify-center p-2'}`}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-teal-600 dark:bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                {sidebarOpen && (
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ml-3">
                    {isRTL ? 'الدلتا سوبر أدمن' : 'Delta Super Admin'}
                  </h1>
                )}
              </div>
              
              {/* Toggle button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${sidebarOpen ? 'p-2' : 'p-1'}`}
                aria-label={sidebarOpen ? "تصغير الشريط الجانبي" : "تكبير الشريط الجانبي"}
                title={sidebarOpen ? "تصغير الشريط الجانبي (Ctrl+B)" : "تكبير الشريط الجانبي (Ctrl+B)"}
              >
                <svg className="h-5 w-5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {sidebarOpen ? (
                    // Arrow left (تصغير)
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  ) : (
                    // Arrow right (تكبير)
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
              <nav className={`flex-1 space-y-1 ${sidebarOpen ? 'px-3' : 'px-2'}`}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-teal-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    } group flex items-center font-medium rounded-lg transition-colors duration-200 ${
                      sidebarOpen ? 'px-3 py-2 text-sm' : 'px-2 py-3 justify-center'
                    }`}
                    title={!sidebarOpen ? item.name : ''}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="ml-3 text-sm">{item.name}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
