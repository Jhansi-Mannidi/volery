'use client'

import { createContext, useContext, useState, useLayoutEffect, ReactNode } from 'react'

export type ColorPreset =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'violet'
  | 'rose'
  | 'blue'

const VALID_PRESETS: ColorPreset[] = [
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'violet',
  'rose',
  'blue',
]
const VALID_PRESETS_WITH_LEGACY = [...VALID_PRESETS, 'purple', 'zinc'] as string[]

interface ThemeContextType {
  colorPreset: ColorPreset
  setColorPreset: (preset: ColorPreset) => void
  resetToDefault: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const COLOR_PRESET_STORAGE_KEY = 'volery-color-preset'

function applyPresetToDocument(preset: ColorPreset) {
  document.documentElement.setAttribute('data-color-preset', preset)
}

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [colorPreset, setColorPresetState] = useState<ColorPreset>('blue')

  // Apply saved color preset before paint so the correct color shows immediately
  useLayoutEffect(() => {
    let preset: ColorPreset = 'blue'
    try {
      const saved = localStorage.getItem(COLOR_PRESET_STORAGE_KEY)
      if (saved && VALID_PRESETS_WITH_LEGACY.includes(saved)) {
        if (saved === 'purple') preset = 'violet'
        else if (saved === 'zinc') preset = 'default'
        else preset = saved as ColorPreset
      }
    } catch {
      /* ignore */
    }
    setColorPresetState(preset)
    applyPresetToDocument(preset)
  }, [])

  const setColorPreset = (preset: ColorPreset) => {
    setColorPresetState(preset)
    applyPresetToDocument(preset)
    try {
      localStorage.setItem(COLOR_PRESET_STORAGE_KEY, preset)
    } catch {
      /* ignore */
    }
  }

  const resetToDefault = () => {
    setColorPreset('blue')
  }

  return (
    <ThemeContext.Provider value={{ colorPreset, setColorPreset, resetToDefault }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useColorPreset() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Return default values during SSR or if context is not available
    return {
      colorPreset: 'blue' as ColorPreset,
      setColorPreset: () => {},
      resetToDefault: () => {},
    }
  }
  return context
}
