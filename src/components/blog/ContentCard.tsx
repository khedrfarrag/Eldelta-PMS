'use client'

import { useState, ReactNode } from 'react'
import type { LocaleCode } from '@/lib/blog/types'

interface ContentCardProps {
  title: string
  icon: ReactNode
  children: ReactNode
  locale: LocaleCode
  defaultExpanded?: boolean
  cardType?: 'info' | 'warning' | 'success' | 'tip' | 'default'
  className?: string
}

export default function ContentCard({ 
  title, 
  icon, 
  children, 
  locale, 
  defaultExpanded = true,
  cardType = 'default',
  className = ''
}: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const isRTL = locale === 'ar'

  const cardStyles = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    tip: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  }

  const iconColors = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    success: 'text-green-600 dark:text-green-400',
    tip: 'text-purple-600 dark:text-purple-400',
    default: 'text-cyan-600 dark:text-cyan-400'
  }

  return (
    <div className={`
      ${cardStyles[cardType]}
      border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
      transform hover:-translate-y-1 mb-8
      ${className}
    `}>
      {/* Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className={`
              p-3 rounded-lg bg-white dark:bg-gray-700 shadow-md
              ${iconColors[cardType]}
            `}>
              {icon}
            </div>
            <h3 className={`
              text-xl font-bold text-gray-900 dark:text-white
              ${isRTL ? 'text-right' : 'text-left'}
            `}>
              {title}
            </h3>
          </div>
          
          <button className={`
            p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors
            ${iconColors[cardType]}
          `}>
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
