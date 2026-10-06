"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  FileText,
  FileSpreadsheet,
  Receipt,
  Award,
  TrendingUp,
  IndianRupee,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  exportPortfolioSummaryPdf,
  exportToCsv,
} from "@/lib/export-utils"
import type { FilterStatus } from "./types"
import { PortfolioCard } from "./portfolio-card"
import { PortfolioSummary } from "./portfolio-summary"
import { MOCK_PORTFOLIO_ITEMS, MOCK_PORTFOLIO_SUMMARY } from "./mock-portfolio"

const FILTERS: {
  id: FilterStatus
  label: string
  count: number
  dotClassName?: string
}[] = [
  { id: "all", label: "All", count: 20 },
  { id: "performing", label: "Performing", count: 12, dotClassName: "fill-green-500 text-green-500" },
  { id: "watch", label: "Watch", count: 5, dotClassName: "fill-amber-500 text-amber-500" },
  { id: "at-risk", label: "At Risk", count: 3, dotClassName: "fill-red-500 text-red-500" },
]

export function PortfolioTrackerFeed() {
  const router = useRouter()
  const { toast } = useToast()
  const [filter, setFilter] = React.useState<FilterStatus>("all")
  const [items] = React.useState(MOCK_PORTFOLIO_ITEMS)

  const filteredItems = React.useMemo(() => {
    if (filter === "all") return items
    return items.filter((i) => i.status === filter)
  }, [items, filter])

  const handleExportPdf = () => {
    exportPortfolioSummaryPdf({
      totalInvested: "₹2.4 Cr",
      portfolioCompanies: 20,
      avgReturn: "2.8x",
      newDealsToday: 0,
      date: new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    })
    toast({
      title: "Portfolio Summary PDF",
      description: "Print window opened. Choose “Save as PDF” to download.",
    })
  }

  const handleTaxReport = () => {
    toast({
      title: "Tax Report",
      description: "Tax report for CA will be generated. Opening print dialog.",
    })
    window.print()
  }

  const handleInvestmentHistory = () => {
    const headers = [
      "Company",
      "Stage",
      "Invested",
      "Current Value",
      "Multiple",
      "Status",
      "Date",
    ]
    const rows = items.map((i) => [
      i.name,
      i.stage,
      i.invested,
      i.currentValue,
      `${i.multiple}x`,
      i.status,
      i.investmentDate,
    ])
    exportToCsv({ headers, rows, filename: "investment-history.csv" })
    toast({
      title: "Investment History",
      description: "Investment History Excel (CSV) downloaded.",
    })
  }

  const handleValuationCertificate = () => {
    toast({
      title: "Valuation Certificate",
      description: "Valuation certificate will be generated. Opening print dialog.",
    })
    window.print()
  }

  return (
    <div className="flex flex-col min-h-0">
      {/* Header - minimal side padding for full width */}
      <div className="border-b border-border bg-background px-2 py-4 md:px-3">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground truncate">
              My Investments
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Export">
                <Download className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileText className="h-4 w-4 mr-2" />
                Portfolio Summary PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTaxReport}>
                <Receipt className="h-4 w-4 mr-2" />
                Tax Report (for CA)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleInvestmentHistory}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Investment History Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleValuationCertificate}>
                <Award className="h-4 w-4 mr-2" />
                Valuation Certificate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Portfolio overview */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Portfolio Value
          </p>
          <p className="text-lg font-semibold text-foreground">
            ₹2.4 Crore invested across 20 companies
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 shrink-0" />
              Current Value: ₹6.8 Cr (est.)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
              Overall Multiple: 2.8x
            </span>
          </div>
        </div>
      </div>

      {/* Quick filters */}
      <div className="border-b border-border bg-muted/30 px-2 py-3 md:px-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border text-foreground hover:bg-muted"
              )}
            >
              {f.dotClassName && (
                <Circle className={cn("h-2 w-2 shrink-0", f.dotClassName)} aria-hidden />
              )}
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio cards - full width, minimal side padding */}
      <div className="flex-1 overflow-auto px-2 py-4 md:px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>

        {/* Portfolio Summary (expandable) */}
        <div className="mt-6 w-full">
          <PortfolioSummary data={MOCK_PORTFOLIO_SUMMARY} />
        </div>
      </div>
    </div>
  )
}
