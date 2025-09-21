'use client'

import { useState, useEffect } from 'react'
import type { LocaleCode } from '@/lib/blog/types'

interface ClientTableOfContentsProps {
  locale: LocaleCode
}

interface TocItem {
  id: string
  text: string
  level: number
}

export default function ClientTableOfContents({ locale }: ClientTableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const isRTL = locale === 'ar'

  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const tocItems: TocItem[] = []

    headings.forEach((heading, index) => {
      const id = `heading-${index}`
      heading.id = id
      
      tocItems.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      })
    })

    setToc(tocItems)

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%' }
    )

    headings.forEach((heading) => {
      observer.observe(heading)
    })

    return () => {
      headings.forEach((heading) => {
        observer.unobserve(heading)
      })
    }
  }, [])

  if (toc.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {isRTL ? 'جدول المحتويات' : 'Table of Contents'}
      </h3>
      <nav className="space-y-2">
        {toc.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`
              block w-full text-left text-sm transition-colors duration-200
              ${item.level === 1 ? 'pl-0 font-bold' : 
                item.level === 2 ? 'pl-4 font-semibold' : 
                'pl-8 text-gray-600 dark:text-gray-400'}
              ${activeId === item.id 
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400'}
              rounded px-2 py-1
            `}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  )
}
