"use client"

import * as React from "react"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileDown, FileSpreadsheet, FileText, Hand } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  exportPortfolioSummaryPdf,
  exportInvestmentReportExcel,
} from "@/lib/export-utils"
import { AngelQuickStats } from "./angel-quick-stats"
import { AngelHotDeals } from "./angel-hot-deals"
import { AngelPortfolioAlerts } from "./angel-portfolio-alerts"
import { AngelSyndicateActivity } from "./angel-syndicate-activity"
import { cn } from "@/lib/utils"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

interface AngelDashboardProps {
  userName: string
  className?: string
}

export function AngelDashboard({ userName, className }: AngelDashboardProps) {
  const { toast } = useToast()

  const handleExportPdf = () => {
    exportPortfolioSummaryPdf({
      totalInvested: "₹2.4 Cr",
      portfolioCompanies: 20,
      avgReturn: "2.8x",
      newDealsToday: 3,
      date: new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    })
    toast({
      title: "Portfolio Summary",
      description: "Print window opened. Choose “Save as PDF” to download.",
    })
  }

  const handleExportExcel = () => {
    exportInvestmentReportExcel()
    toast({
      title: "Investment Report",
      description: "Investment-Report.csv downloaded. Open in Excel.",
    })
  }

  const greeting = getGreeting()

  return (
    <div
      className={cn(
        "space-y-6 w-full min-w-0",
        className
      )}
    >
      {/* Breadcrumb: Home > Dashboard */}
      <PageBreadcrumb
        segments={[{ label: "Dashboard" }]}
        homeHref="/"
      />


      {/* Greeting Section */}
      <section>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
          {greeting}, {userName}!
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-md text-muted-foreground">
          <span>3 new deals match your criteria</span>
          <span className="text-muted-foreground/60">·</span>
          <span>2 portfolio updates</span>
        </div>
      </section>

      {/* Quick Stats - horizontal scroll on mobile */}
      <AngelQuickStats />

      {/* Export dropdown - desktop: top right of stats; mobile: below stats */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPdf}>
              <FileText className="h-4 w-4 mr-2" />
              Portfolio Summary PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Investment Report Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content: mobile single column; desktop 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr] gap-6">
        {/* Column 1 (40%): Hot Deals */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm">
            <AngelHotDeals />
          </div>
        </div>

        {/* Column 2 (35%): Portfolio Alerts */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm">
            <AngelPortfolioAlerts />
          </div>
        </div>

        {/* Column 3 (25%): Syndicate + optional Community/Events placeholder */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm">
            <AngelSyndicateActivity />
          </div>
        </div>
      </div>
    </div>
  )
}
