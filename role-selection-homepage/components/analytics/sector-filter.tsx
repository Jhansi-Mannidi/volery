"use client"

import { useState, useRef, useEffect } from "react"
import { Filter, ChevronDown, Check } from "lucide-react"

interface FilterOption {
  id: string
  label: string
  count?: number
}

const sectorOptions: FilterOption[] = [
  { id: "all", label: "All Sectors", count: 142 },
  { id: "saas", label: "SaaS", count: 45 },
  { id: "fintech", label: "Fintech", count: 32 },
  { id: "healthtech", label: "HealthTech", count: 18 },
  { id: "edtech", label: "EdTech", count: 15 },
  { id: "ecommerce", label: "E-Commerce", count: 12 },
  { id: "aiml", label: "AI/ML", count: 28 },
  { id: "cleantech", label: "CleanTech", count: 8 },
  { id: "logistics", label: "Logistics", count: 10 },
  { id: "deeptech", label: "DeepTech", count: 6 },
]

const stageOptions: FilterOption[] = [
  { id: "all", label: "All Stages" },
  { id: "preseed", label: "Pre-Seed" },
  { id: "seed", label: "Seed" },
  { id: "seriesA", label: "Series A" },
  { id: "seriesB", label: "Series B" },
  { id: "seriesC", label: "Series C+" },
]

interface SectorFilterProps {
  selectedSectors: string[]
  selectedStages: string[]
  onSectorChange: (sectors: string[]) => void
  onStageChange: (stages: string[]) => void
}

export function SectorFilter({
  selectedSectors,
  selectedStages,
  onSectorChange,
  onStageChange,
}: SectorFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"sector" | "stage">("sector")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleSector = (sectorId: string) => {
    if (sectorId === "all") {
      onSectorChange(["all"])
    } else {
      const newSectors = selectedSectors.includes(sectorId)
        ? selectedSectors.filter((s) => s !== sectorId)
        : [...selectedSectors.filter((s) => s !== "all"), sectorId]
      onSectorChange(newSectors.length ? newSectors : ["all"])
    }
  }

  const toggleStage = (stageId: string) => {
    if (stageId === "all") {
      onStageChange(["all"])
    } else {
      const newStages = selectedStages.includes(stageId)
        ? selectedStages.filter((s) => s !== stageId)
        : [...selectedStages.filter((s) => s !== "all"), stageId]
      onStageChange(newStages.length ? newStages : ["all"])
    }
  }

  const clearAllFilters = () => {
    onSectorChange(["all"])
    onStageChange(["all"])
  }

  const activeFilterCount =
    (selectedSectors.includes("all") ? 0 : selectedSectors.length) +
    (selectedStages.includes("all") ? 0 : selectedStages.length)

  const getDisplayLabel = () => {
    if (activeFilterCount === 0) return "All Filters"
    if (selectedSectors.length === 1 && !selectedSectors.includes("all")) {
      return sectorOptions.find((s) => s.id === selectedSectors[0])?.label || "Filtered"
    }
    return `${activeFilterCount} filters`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
          activeFilterCount > 0
            ? "bg-primary/10 border-primary text-primary"
            : "bg-background border-input text-foreground hover:border-primary"
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>{getDisplayLabel()}</span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-input rounded-xl shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-input">
            <h4 className="font-medium text-foreground">Filters</h4>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-input">
            <button
              onClick={() => setActiveTab("sector")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "sector"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Sector
            </button>
            <button
              onClick={() => setActiveTab("stage")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "stage"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Stage
            </button>
          </div>

          {/* Options */}
          <div className="py-2 max-h-64 overflow-y-auto">
            {activeTab === "sector" ? (
              sectorOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleSector(option.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedSectors.includes(option.id) ||
                        (option.id === "all" && selectedSectors.includes("all"))
                          ? "bg-primary border-primary"
                          : "border-input"
                      }`}
                    >
                      {(selectedSectors.includes(option.id) ||
                        (option.id === "all" && selectedSectors.includes("all"))) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="text-sm text-foreground">{option.label}</span>
                  </div>
                  {option.count && <span className="text-xs text-muted-foreground">{option.count}</span>}
                </button>
              ))
            ) : (
              stageOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleStage(option.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedStages.includes(option.id) ||
                      (option.id === "all" && selectedStages.includes("all"))
                        ? "bg-primary border-primary"
                        : "border-input"
                    }`}
                  >
                    {(selectedStages.includes(option.id) ||
                      (option.id === "all" && selectedStages.includes("all"))) && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{option.label}</span>
                </button>
              ))
            )}
          </div>

          {/* Apply Button */}
          <div className="p-3 border-t border-input">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
