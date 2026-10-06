"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronDown, Check } from "lucide-react"

interface DateRangeOption {
  id: string
  label: string
  getValue: () => { startDate: Date; endDate: Date }
}

const dateRangeOptions: DateRangeOption[] = [
  {
    id: "today",
    label: "Today",
    getValue: () => {
      const today = new Date()
      return { startDate: today, endDate: today }
    },
  },
  {
    id: "yesterday",
    label: "Yesterday",
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return { startDate: yesterday, endDate: yesterday }
    },
  },
  {
    id: "last7days",
    label: "Last 7 days",
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return { startDate: start, endDate: end }
    },
  },
  {
    id: "last30days",
    label: "Last 30 days",
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)
      return { startDate: start, endDate: end }
    },
  },
  {
    id: "last90days",
    label: "Last 90 days",
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 90)
      return { startDate: start, endDate: end }
    },
  },
  {
    id: "thisMonth",
    label: "This month",
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { startDate: start, endDate: now }
    },
  },
  {
    id: "lastMonth",
    label: "Last month",
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { startDate: start, endDate: end }
    },
  },
  {
    id: "thisQuarter",
    label: "This quarter",
    getValue: () => {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3)
      const start = new Date(now.getFullYear(), quarter * 3, 1)
      return { startDate: start, endDate: now }
    },
  },
  {
    id: "thisYear",
    label: "This year",
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      return { startDate: start, endDate: now }
    },
  },
  {
    id: "custom",
    label: "Custom range",
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return { startDate: start, endDate: end }
    },
  },
]

interface DateRangeFilterProps {
  value: string
  onChange: (rangeId: string, dates: { startDate: Date; endDate: Date }) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = dateRangeOptions.find((opt) => opt.id === value) || dateRangeOptions[2]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowCustomPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option: DateRangeOption) => {
    if (option.id === "custom") {
      setShowCustomPicker(true)
    } else {
      onChange(option.id, option.getValue())
      setIsOpen(false)
      setShowCustomPicker(false)
    }
  }

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onChange("custom", {
        startDate: new Date(customStart),
        endDate: new Date(customEnd),
      })
      setIsOpen(false)
      setShowCustomPicker(false)
      setCustomStart("")
      setCustomEnd("")
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-lg text-sm hover:border-primary transition-colors"
      >
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">{selectedOption.label}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-input rounded-xl shadow-lg z-50">
          {!showCustomPicker ? (
            <div className="py-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors ${value === option.id ? "text-primary font-medium" : "text-foreground"}`}
                >
                  <span>{option.label}</span>
                  {value === option.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <h4 className="font-medium text-foreground">Custom Date Range</h4>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomPicker(false)}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-lg hover:bg-muted"
                >
                  Back
                </button>
                <button
                  onClick={handleCustomApply}
                  className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
