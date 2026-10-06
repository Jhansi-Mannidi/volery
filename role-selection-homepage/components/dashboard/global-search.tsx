"use client"

import Link from "next/link"

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  X,
  Building2,
  Users,
  FileText,
  Plus,
  Sparkles,
  Upload,
  Clock,
  ArrowRight,
  CornerDownLeft,
  ChevronUp,
  ChevronDown,
  Briefcase,
  TrendingUp,
  FolderOpen,
  Rocket,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"

interface SearchResult {
  id: string
  type: "startup" | "investor" | "document"
  title: string
  subtitle: string
  href: string
}

interface QuickAction {
  id: string
  icon: React.ElementType
  label: string
  href: string
}

// Mock data for search results
const mockStartups: SearchResult[] = [
  { id: "s1", type: "startup", title: "TechCorp AI", subtitle: "Fintech · Seed · @Priya", href: "/startups/techcorp-ai" },
  { id: "s2", type: "startup", title: "TechStack Solutions", subtitle: "SaaS · Series A · @Rahul", href: "/startups/techstack" },
  { id: "s3", type: "startup", title: "TechFlow Systems", subtitle: "Enterprise · Series B · @John", href: "/startups/techflow" },
  { id: "s4", type: "startup", title: "CloudAI Innovations", subtitle: "AI/ML · Seed · @Priya", href: "/startups/cloudai" },
  { id: "s5", type: "startup", title: "FinApp Inc", subtitle: "Fintech · Series A · @Rahul", href: "/startups/finapp" },
  { id: "s6", type: "startup", title: "HealthBridge", subtitle: "HealthTech · Pre-Seed · @John", href: "/startups/healthbridge" },
]

const mockInvestors: SearchResult[] = [
  { id: "i1", type: "investor", title: "Sequoia Capital", subtitle: "VC · Series A-C · $5M-$50M", href: "/investors/sequoia" },
  { id: "i2", type: "investor", title: "Andreessen Horowitz", subtitle: "VC · Seed-Series C · $1M-$100M", href: "/investors/a16z" },
  { id: "i3", type: "investor", title: "ABC Fund", subtitle: "Family Office · Seed-Series A · $500K-$5M", href: "/investors/abc-fund" },
  { id: "i4", type: "investor", title: "Tiger Global", subtitle: "VC · Series B+ · $10M-$200M", href: "/investors/tiger" },
]

const mockDocuments: SearchResult[] = [
  { id: "d1", type: "document", title: "TechCorp_PitchDeck_v2.pdf", subtitle: "Uploaded 2 days ago · 23 views", href: "/documents/techcorp-deck" },
  { id: "d2", type: "document", title: "FinApp_Financials_Q4.xlsx", subtitle: "Uploaded 5 days ago · 12 views", href: "/documents/finapp-financials" },
  { id: "d3", type: "document", title: "CloudAI_Due_Diligence.pdf", subtitle: "Uploaded 1 week ago · 8 views", href: "/documents/cloudai-dd" },
]

const recentSearches: SearchResult[] = [
  { id: "r1", type: "startup", title: "TechCorp AI", subtitle: "Fintech · Seed", href: "/startups/techcorp-ai" },
  { id: "r2", type: "investor", title: "Sequoia Capital", subtitle: "VC · Series A-C", href: "/investors/sequoia" },
  { id: "r3", type: "document", title: "Q4 Pipeline Report", subtitle: "Viewed yesterday", href: "/documents/q4-report" },
]

// Role-specific quick actions
const roleQuickActions: Record<UserRole, QuickAction[]> = {
  "investment-banker": [
    { id: "qa1", icon: Building2, label: "Add new startup", href: "/startups/new" },
    { id: "qa2", icon: Users, label: "Add new investor", href: "/investors/new" },
    { id: "qa3", icon: Sparkles, label: "Go to matching", href: "/matching" },
    { id: "qa4", icon: Upload, label: "Upload document", href: "/documents/upload" },
  ],
  "institutional-investor": [
    { id: "qa1", icon: Building2, label: "Browse startups", href: "/startups" },
    { id: "qa2", icon: Briefcase, label: "View portfolio", href: "/portfolio" },
    { id: "qa3", icon: FileText, label: "Review documents", href: "/documents" },
    { id: "qa4", icon: TrendingUp, label: "Deal pipeline", href: "/pipeline" },
  ],
  "angel-investor": [
    { id: "qa1", icon: Building2, label: "Discover startups", href: "/startups" },
    { id: "qa2", icon: Users, label: "Join syndicate", href: "/syndicates" },
    { id: "qa3", icon: Briefcase, label: "My investments", href: "/portfolio" },
    { id: "qa4", icon: Sparkles, label: "Get matched", href: "/matching" },
  ],
  "startup-founder": [
    { id: "qa1", icon: Users, label: "Find investors", href: "/investors" },
    { id: "qa2", icon: Rocket, label: "My raises", href: "/raises" },
    { id: "qa3", icon: Upload, label: "Upload pitch deck", href: "/documents/upload" },
    { id: "qa4", icon: FolderOpen, label: "Data room", href: "/documents" },
  ],
  "research-analyst": [
    { id: "qa1", icon: Building2, label: "Browse startups", href: "/startups" },
    { id: "qa2", icon: TrendingUp, label: "Market reports", href: "/reports" },
    { id: "qa3", icon: FileText, label: "Analysis docs", href: "/documents" },
    { id: "qa4", icon: Sparkles, label: "Generate report", href: "/reports/new" },
  ],
  "corporate-development": [
    { id: "qa1", icon: Building2, label: "Scout targets", href: "/startups" },
    { id: "qa2", icon: TrendingUp, label: "M&A pipeline", href: "/pipeline" },
    { id: "qa3", icon: FileText, label: "Due diligence", href: "/documents" },
    { id: "qa4", icon: Users, label: "Strategic partners", href: "/investors" },
  ],
}

// Role-specific search categories
const roleSearchCategories: Record<UserRole, { id: string; label: string; count?: number }[]> = {
  "investment-banker": [
    { id: "all", label: "All" },
    { id: "startups", label: "Startups" },
    { id: "investors", label: "Investors" },
    { id: "documents", label: "Documents" },
  ],
  "institutional-investor": [
    { id: "all", label: "All" },
    { id: "startups", label: "Startups" },
    { id: "portfolio", label: "Portfolio" },
    { id: "documents", label: "Documents" },
  ],
  "angel-investor": [
    { id: "all", label: "All" },
    { id: "startups", label: "Startups" },
    { id: "syndicates", label: "Syndicates" },
    { id: "portfolio", label: "My Deals" },
  ],
  "startup-founder": [
    { id: "all", label: "All" },
    { id: "investors", label: "Investors" },
    { id: "documents", label: "Documents" },
    { id: "raises", label: "My Raises" },
  ],
  "research-analyst": [
    { id: "all", label: "All" },
    { id: "startups", label: "Startups" },
    { id: "reports", label: "Reports" },
    { id: "market-data", label: "Market Data" },
  ],
  "corporate-development": [
    { id: "all", label: "All" },
    { id: "targets", label: "Targets" },
    { id: "deals", label: "Deals" },
    { id: "pipeline", label: "Pipeline" },
  ],
}

// Default quick actions fallback
const quickActions: QuickAction[] = roleQuickActions["investment-banker"]

const typeIcons = {
  startup: Building2,
  investor: Users,
  document: FileText,
}

const typeColors = {
  startup: "text-primary",
  investor: "text-emerald-500",
  document: "text-amber-500",
}

const typeBgColors = {
  startup: "bg-primary/10",
  investor: "bg-emerald-500/10",
  document: "bg-amber-500/10",
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  searchPlaceholder?: string
}

export function GlobalSearch({ open, onOpenChange, searchPlaceholder }: GlobalSearchProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Get role-specific configuration
  const currentRole = user?.activeRole || "investment-banker"
  const currentQuickActions = roleQuickActions[currentRole] || quickActions
  const currentCategories = roleSearchCategories[currentRole] || roleSearchCategories["investment-banker"]

  // Get search placeholder based on role (or use prop if provided)
  const getSearchPlaceholder = () => {
    if (searchPlaceholder) return searchPlaceholder
    switch (currentRole) {
      case "startup-founder":
        return "Search investors, documents, my raises..."
      case "institutional-investor":
      case "angel-investor":
        return "Search startups, portfolio, documents..."
      case "research-analyst":
        return "Search reports, startups, market data..."
      case "corporate-development":
        return "Search targets, deals, M&A pipeline..."
      default:
        return "Search startups, investors, documents..."
    }
  }

  // Filter results based on query
  const filteredStartups = query
    ? mockStartups.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const filteredInvestors = query
    ? mockInvestors.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const filteredDocuments = query
    ? mockDocuments.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : []

  // Get results based on active category
  const getVisibleResults = () => {
    if (!query) return []
    switch (activeCategory) {
      case "startups":
        return filteredStartups
      case "investors":
        return filteredInvestors
      case "documents":
        return filteredDocuments
      default:
        return [...filteredStartups.slice(0, 3), ...filteredInvestors.slice(0, 2), ...filteredDocuments.slice(0, 2)]
    }
  }

  const visibleResults = getVisibleResults()
  const totalResults = filteredStartups.length + filteredInvestors.length + filteredDocuments.length

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return

      const maxIndex = query ? visibleResults.length - 1 : recentSearches.length + quickActions.length - 1

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, maxIndex))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "Tab":
          if (query) {
            e.preventDefault()
            const categories: ("all" | "startups" | "investors" | "documents")[] = ["all", "startups", "investors", "documents"]
            const currentIndex = categories.indexOf(activeCategory)
            const nextIndex = e.shiftKey
              ? (currentIndex - 1 + categories.length) % categories.length
              : (currentIndex + 1) % categories.length
            setActiveCategory(categories[nextIndex])
            setSelectedIndex(0)
          }
          break
        case "Enter":
          e.preventDefault()
          if (query && visibleResults[selectedIndex]) {
            router.push(visibleResults[selectedIndex].href)
            onOpenChange(false)
          } else if (!query) {
            if (selectedIndex < recentSearches.length) {
              router.push(recentSearches[selectedIndex].href)
              onOpenChange(false)
            } else {
              const actionIndex = selectedIndex - recentSearches.length
              if (quickActions[actionIndex]) {
                router.push(quickActions[actionIndex].href)
                onOpenChange(false)
              }
            }
          }
          break
        case "Escape":
          onOpenChange(false)
          break
      }
    },
    [open, query, visibleResults, selectedIndex, activeCategory, router, onOpenChange]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      setActiveCategory("all")
      setShowAdvanced(false)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [onOpenChange])

  const handleResultClick = (href: string) => {
    router.push(href)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder={getSearchPlaceholder()}
            className="flex-1 text-base bg-transparent border-0 outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs (when searching) - Role-specific */}
        {query && totalResults > 0 && (
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30">
            {currentCategories.map((cat) => {
              // Get count based on category
              let count = 0
              if (cat.id === "all") count = totalResults
              else if (cat.id === "startups" || cat.id === "targets") count = filteredStartups.length
              else if (cat.id === "investors") count = filteredInvestors.length
              else if (cat.id === "documents" || cat.id === "reports") count = filteredDocuments.length
              else count = Math.floor(Math.random() * 5) // Demo count for other categories

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setSelectedIndex(0)
                  }}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    activeCategory === cat.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.label}
                  {count > 0 && (
                    <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Results Area */}
        <div ref={resultsRef} className="max-h-[400px] overflow-y-auto">
          {/* Before Typing - Recent & Quick Actions */}
          {!query && (
            <div className="p-2 space-y-4">
              {/* Recent Searches */}
              <div>
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider">
                  RECENT SEARCHES
                </p>
                <div className="space-y-0.5">
                  {recentSearches.map((item, index) => {
                    const Icon = typeIcons[item.type]
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item.href)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors",
                          selectedIndex === index ? "bg-muted" : "hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("p-1.5 rounded", typeBgColors[item.type])}>
                          <Icon className={cn("w-4 h-4", typeColors[item.type])} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                        </div>
                        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quick Actions - Role Specific */}
              <div>
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider">
                  QUICK ACTIONS
                </p>
                <div className="space-y-0.5">
                  {currentQuickActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleResultClick(action.href)}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors",
                        selectedIndex === recentSearches.length + index ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="p-1.5 rounded bg-muted">
                        <action.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">{action.label}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && totalResults > 0 && (
            <div className="p-2">
              {activeCategory === "all" ? (
                <>
                  {/* Grouped Results */}
                  {filteredStartups.length > 0 && (
                    <ResultGroup
                      title="Startups"
                      count={filteredStartups.length}
                      results={filteredStartups.slice(0, 3)}
                      selectedIndex={selectedIndex}
                      baseIndex={0}
                      onResultClick={handleResultClick}
                    />
                  )}
                  {filteredInvestors.length > 0 && (
                    <ResultGroup
                      title="Investors"
                      count={filteredInvestors.length}
                      results={filteredInvestors.slice(0, 2)}
                      selectedIndex={selectedIndex}
                      baseIndex={Math.min(filteredStartups.length, 3)}
                      onResultClick={handleResultClick}
                    />
                  )}
                  {filteredDocuments.length > 0 && (
                    <ResultGroup
                      title="Documents"
                      count={filteredDocuments.length}
                      results={filteredDocuments.slice(0, 2)}
                      selectedIndex={selectedIndex}
                      baseIndex={Math.min(filteredStartups.length, 3) + Math.min(filteredInvestors.length, 2)}
                      onResultClick={handleResultClick}
                    />
                  )}
                </>
              ) : (
                <div className="space-y-0.5">
                  {visibleResults.map((result, index) => (
                    <SearchResultItem
                      key={result.id}
                      result={result}
                      isSelected={selectedIndex === index}
                      onClick={() => handleResultClick(result.href)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* View All Results Link */}
        {query && totalResults > 0 && (
          <div className="px-2 py-2 border-t border-border">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-primary hover:bg-muted rounded-lg transition-colors"
            >
              <span>View all {totalResults} results</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ResultGroup({
  title,
  count,
  results,
  selectedIndex,
  baseIndex,
  onResultClick,
}: {
  title: string
  count: number
  results: SearchResult[]
  selectedIndex: number
  baseIndex: number
  onResultClick: (href: string) => void
}) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{title}</p>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{count}</span>
      </div>
      <div className="space-y-0.5">
        {results.map((result, index) => (
          <SearchResultItem
            key={result.id}
            result={result}
            isSelected={selectedIndex === baseIndex + index}
            onClick={() => onResultClick(result.href)}
          />
        ))}
      </div>
    </div>
  )
}

function SearchResultItem({
  result,
  isSelected,
  onClick,
}: {
  result: SearchResult
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = typeIcons[result.type]

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors",
        isSelected ? "bg-muted" : "hover:bg-muted/50"
      )}
    >
      <div className={cn("p-1.5 rounded", typeBgColors[result.type])}>
        <Icon className={cn("w-4 h-4", typeColors[result.type])} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
      </div>
      {isSelected && (
        <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] text-muted-foreground">
          <CornerDownLeft className="w-3 h-3 inline" />
        </kbd>
      )}
    </button>
  )
}
