'use client'

import { useState, ReactNode } from 'react'
import type { LocaleCode } from '@/lib/blog/types'

interface ReadMoreSectionProps {
  children: ReactNode
  locale: LocaleCode
  previewLength?: number
  showReadMore?: boolean
  className?: string
}

export default function ReadMoreSection({ 
  children, 
  locale, 
  previewLength = 200,
  showReadMore = true,
  className = ''
}: ReadMoreSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isRTL = locale === 'ar'

  // Extract text content for preview
  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return node.toString()
    if (Array.isArray(node)) return node.map(getTextContent).join('')
    if (node && typeof node === 'object' && 'props' in node) {
      return getTextContent(node.props.children)
    }
    return ''
  }

  const textContent = getTextContent(children)
  const shouldTruncate = textContent.length > previewLength && showReadMore
  const previewText = shouldTruncate ? textContent.substring(0, previewLength) + '...' : textContent

  if (!shouldTruncate) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={className}>
      {isExpanded ? (
        <div className="space-y-4">
          {children}
          <button
            onClick={() => setIsExpanded(false)}
            className={`
              inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 
              text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 
              dark:hover:bg-gray-600 transition-colors duration-200
              ${isRTL ? 'ml-auto' : 'mr-auto'}
            `}
          >
            <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {isRTL ? 'اقرأ أقل' : 'Read Less'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {previewText}
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className={`
              inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 
              text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 
              transition-all duration-300 transform hover:scale-105 shadow-lg
              ${isRTL ? 'ml-auto' : 'mr-auto'}
            `}
          >
            <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {isRTL ? 'اقرأ المزيد' : 'Read More'}
          </button>
        </div>
      )}
    </div>
  )
}
