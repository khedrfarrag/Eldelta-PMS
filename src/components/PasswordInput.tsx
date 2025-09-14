'use client'
import { useState, useRef } from 'react'

interface PasswordInputProps {
  register: any
  error?: string
  placeholder?: string
  autoComplete?: string
}

export default function PasswordInput({ 
  register, 
  error, 
  placeholder = "أدخل كلمة المرور",
  autoComplete = "current-password"
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
    // Keep focus on input after toggling
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  // react-hook-form register returns an object with a ref we must forward.
  const { ref: rhfRef, ...registerProps } = register || {}

  return (
    <div>
      <div className="relative">
        <input
          {...registerProps}
          ref={(element) => {
            if (typeof rhfRef === 'function') {
              rhfRef(element)
            } else if (rhfRef) {
              // @ts-ignore allow assigning element to possible MutableRefObject
              rhfRef.current = element
            }
            inputRef.current = element as HTMLInputElement | null
          }}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          className="mt-1 appearance-none relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            togglePasswordVisibility()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute inset-y-0 left-0 pl-3 flex items-center z-20"
          style={{ pointerEvents: 'auto' }}
        >
          {showPassword ? (
            // Eye with slash icon (hide password)
            <svg 
              className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" 
              />
            </svg>
          ) : (
            // Eye icon (show password)
            <svg 
              className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
