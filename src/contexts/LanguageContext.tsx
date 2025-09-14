'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar')

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Apply language to document
    document.documentElement.setAttribute('lang', language)
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    
    // Save to localStorage
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    
    // Note: URL changes will be handled by middleware
    // This context only manages the UI state
  }

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      isRTL
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
