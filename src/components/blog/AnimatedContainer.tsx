'use client'

import { useState, useEffect, ReactNode } from 'react'

interface AnimatedContainerProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function AnimatedContainer({ children, delay = 0, className = '' }: AnimatedContainerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`
      transition-all duration-1000 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      ${className}
    `}>
      {children}
    </div>
  )
}
