'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

export default function AdminNav() {
  const { user, logout } = useAuth()
  const { language } = useLanguage()

  const isRTL = language === 'ar'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Right Side - Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                <div className="text-white text-xs font-bold text-center leading-tight">
                  <div>EL</div>
                  <div>DELTA</div>
                </div>
              </div>
              
              {/* Company Name */}
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isRTL ? 'الدلتا للاستيراد والتصدير' : 'Al-Delta Import & Export'}
                </h1>
              </div>
            </div>
          </div>

          {/* Center - User Info */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {isRTL ? 'مرحباً،' : 'Welcome,'} {user?.name}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {user?.role === 'super_admin' ? (isRTL ? 'سوبر أدمن' : 'Super Admin') : (isRTL ? 'أدمن' : 'Admin')}
            </span>
          </div>

          {/* Left Side - Controls */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Theme and Language Toggles */}
            <div className="flex items-center space-x-2 space-x-reverse mr-4">
              <LanguageToggle />
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            {isRTL ? 'مرحباً،' : 'Welcome,'} {user?.name}
          </div>
          <div className="px-3 py-2">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {user?.role === 'super_admin' ? (isRTL ? 'سوبر أدمن' : 'Super Admin') : (isRTL ? 'أدمن' : 'Admin')}
            </span>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
          >
            {isRTL ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  )
}
