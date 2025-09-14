'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'
type PrimaryColor = '#2A7280' | '#FAA533' | '#192845'
type SecondaryPalette = '#2A7280' | '#FAA533' | '#192845'|'#0BA6DF'


interface ThemeContextType {
  theme: Theme
  primaryColor: PrimaryColor
  secondaryColor: SecondaryPalette
  toggleTheme: () => void
  setPrimaryColor: (color: PrimaryColor) => void
  cycleSecondaryPalette: () => void
  setSecondaryColor: (color: SecondaryPalette) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>('#2A7280')
  const secondaryPalette: SecondaryPalette[] = ['#2A7280', '#FAA533', '#192845','#0BA6DF']
  const [secondaryIndex, setSecondaryIndex] = useState<number>(1) // default to #7F8685 as in globals.css
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load theme from localStorage in client only
    const savedTheme = (typeof window !== 'undefined' && localStorage.getItem('theme')) as Theme
    const savedPrimaryColor = (typeof window !== 'undefined' && localStorage.getItem('primaryColor')) as PrimaryColor
    const savedSecondaryIndex = (typeof window !== 'undefined' && localStorage.getItem('secondaryIndex'))
    if (savedTheme) setTheme(savedTheme)
    if (savedPrimaryColor) setPrimaryColorState(savedPrimaryColor)
    if (savedSecondaryIndex !== null && savedSecondaryIndex !== undefined) {
      const idx = Number(savedSecondaryIndex)
      if (!Number.isNaN(idx) && idx >= 0 && idx < secondaryPalette.length) {
        setSecondaryIndex(idx)
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    
    // Apply theme classes using documentElement only; avoid body mutations to prevent hydration flicker
    const html = document.documentElement
    html.classList.remove('dark', 'light')
    html.classList.add(theme)
    html.style.setProperty('--color-primary', primaryColor)
    html.style.setProperty('--color-secondary', secondaryPalette[secondaryIndex])
    try {
      localStorage.setItem('theme', theme)
      localStorage.setItem('primaryColor', primaryColor)
      localStorage.setItem('secondaryIndex', String(secondaryIndex))
    } catch {}
  }, [theme, primaryColor, secondaryIndex, isInitialized])

  // Apply theme immediately on mount
  useEffect(() => {
    const html = document.documentElement
    html.classList.add(theme)
    html.style.setProperty('--color-primary', primaryColor)
    html.style.setProperty('--color-secondary', secondaryPalette[secondaryIndex])
  }, [])

  const applyThemeToAllElements = (theme: Theme) => {
    const html = document.documentElement
    html.classList.remove('dark', 'light')
    html.classList.add(theme)
  }

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      // Apply documentElement class asap post-toggle
      setTimeout(() => applyThemeToAllElements(newTheme), 0)
      return newTheme
    })
  }

  const setPrimaryColor = (color: PrimaryColor) => {
    setPrimaryColorState(color)
  }

  const cycleSecondaryPalette = () => {
    setSecondaryIndex(prev => (prev + 1) % secondaryPalette.length)
  }

  const setSecondaryColor = (color: SecondaryPalette) => {
    const idx = secondaryPalette.indexOf(color)
    if (idx !== -1) {
      setSecondaryIndex(idx)
    }
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      primaryColor,
      secondaryColor: secondaryPalette[secondaryIndex],
      toggleTheme,
      setPrimaryColor,
      cycleSecondaryPalette,
      setSecondaryColor
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
