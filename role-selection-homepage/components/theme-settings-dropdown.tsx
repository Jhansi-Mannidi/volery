'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette, Sun, Moon, RotateCcw, Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useColorPreset } from '@/lib/theme-context'
import { ColorPreset } from '@/lib/theme-context'

const colorPresets: { id: ColorPreset; label: string; color: string }[] = [
  { id: 'default', label: 'Default', color: '#6b7280' },
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'orange', label: 'Orange', color: '#f97316' },
  { id: 'yellow', label: 'Yellow', color: '#eab308' },
  { id: 'green', label: 'Green', color: '#10b981' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
]

function ThemeSettingsDropdownContent() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const { colorPreset, setColorPreset, resetToDefault } = useColorPreset()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Theme settings"
        disabled
      >
        <Palette className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Palette Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Theme settings"
        aria-expanded={isOpen}
      >
        <Palette className="w-5 h-5" />
      </button>

      {/* Dropdown Menu - uses card tokens to match app cards in light and dark theme */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 min-w-0 rounded-xl shadow-lg z-50 bg-card text-card-foreground border border-border">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Theme Settings</h3>
          </div>

          <div className="p-4 space-y-5">
            {/* Theme Mode */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Theme Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Light Mode Button */}
                <button
                  onClick={() => setTheme('light')}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                    border transition-all text-sm font-medium
                    ${theme === 'light'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/80'
                    }
                  `}
                >
                  <Sun className="w-4 h-4" />
                  Light
                  {theme === 'light' && <Check className="w-4 h-4 ml-1" />}
                </button>

                {/* Dark Mode Button */}
                <button
                  onClick={() => setTheme('dark')}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                    border transition-all text-sm font-medium
                    ${theme === 'dark'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/80'
                    }
                  `}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                  {theme === 'dark' && <Check className="w-4 h-4 ml-1" />}
                </button>
              </div>
            </div>

            {/* Color Presets */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Color Presets
              </label>
              <div className="grid grid-cols-3 gap-2 min-w-0">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setColorPreset(preset.id)}
                    className={`
                      flex items-center gap-2 min-w-0 overflow-hidden px-3 py-2.5 rounded-lg border
                      transition-all text-sm font-medium
                      ${colorPreset === preset.id
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:bg-muted'
                      }
                    `}
                  >
                    <span
                      className="w-4 h-4 rounded-full border-2 border-border shadow-sm shrink-0 flex-shrink-0"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span
                      className={`flex-1 min-w-0 truncate text-left ${colorPreset === preset.id ? 'text-foreground' : 'text-muted-foreground'}`}
                      title={preset.label}
                    >
                      {preset.label}
                    </span>
                    {colorPreset === preset.id && (
                      <Check className="w-4 h-4 shrink-0 text-primary ml-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                resetToDefault()
                setTheme('light')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                         rounded-lg border border-border
                         bg-muted/50 hover:bg-muted
                         text-muted-foreground hover:text-foreground text-sm font-medium
                         transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ThemeSettingsDropdown() {
  return <ThemeSettingsDropdownContent />
}
