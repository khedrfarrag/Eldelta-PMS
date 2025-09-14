'use client'

import { ToastContainer } from 'react-toastify'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ToastProvider() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={isRTL}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  )
}


