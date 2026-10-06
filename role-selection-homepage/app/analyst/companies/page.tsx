"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const placeholderPages = [
  { name: "Companies", href: "/analyst/companies" },
  { name: "Data Extraction", href: "/analyst/data-extraction" },
  { name: "Competitive Analysis", href: "/analyst/competitive-analysis" },
  { name: "Report Generator", href: "/analyst/report-generator" },
  { name: "Source Aggregator", href: "/analyst/source-aggregator" },
  { name: "AI Dashboard", href: "/analyst/ai-insights" },
  { name: "Due Diligence", href: "/analyst/due-diligence" },
  { name: "Market Maps", href: "/analyst/market-maps" },
  { name: "Templates", href: "/analyst/templates" },
  { name: "Notes", href: "/analyst/notes" },
]

export default function PlaceholderPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Navigation" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1200px] mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-6">Analyst Role Navigation</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {placeholderPages.map((page) => (
                  <Card key={page.href} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <p className="font-medium mb-2">{page.name}</p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Page
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
