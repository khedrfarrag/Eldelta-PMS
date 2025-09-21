'use client'

import { useState } from 'react'
import type { LocaleCode } from '@/lib/blog/types'

interface FloatingTOCProps {
  locale: LocaleCode
}

export default function FloatingTOC({ locale }: FloatingTOCProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isRTL = locale === 'ar'

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        aria-label={isRTL ? 'جدول المحتويات' : 'Table of Contents'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {isRTL ? 'جدول المحتويات' : 'Table of Contents'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            <nav className="space-y-2">
              {Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((heading, index) => {
                const id = `heading-${index}`
                const level = parseInt(heading.tagName.charAt(1))
                const text = heading.textContent || ''
                
                const scrollToHeading = () => {
                  heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setIsOpen(false)
                }

                return (
                  <button
                    key={id}
                    onClick={scrollToHeading}
                    className={`
                      block w-full text-left text-sm transition-colors duration-200
                      ${level === 1 ? 'pl-0 font-bold' : 
                        level === 2 ? 'pl-4 font-semibold' : 
                        'pl-8 text-gray-600 dark:text-gray-400'}
                      text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400
                      rounded px-2 py-1
                    `}
                  >
                    {text}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
