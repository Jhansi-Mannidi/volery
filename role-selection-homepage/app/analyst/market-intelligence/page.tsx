"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Database, RefreshCw } from "lucide-react"

const insights = [
  {
    id: 1,
    type: "market_trend",
    title: "SaaS Valuations Rising",
    description: "Enterprise SaaS median multiples increased by 15% YoY",
    confidence: "High",
    icon: Zap,
  },
  {
    id: 2,
    type: "gap",
    title: "Healthcare AI Opportunity",
    description: "Limited analysis in healthcare AI space - emerging market with 12+ new startups",
    confidence: "Medium",
    icon: Database,
  },
  {
    id: 3,
    type: "trend",
    title: "Founder Background Pattern",
    description: "Founders with previous exit experience have 3.2x higher success rate",
    confidence: "High",
    icon: Sparkles,
  },
]

export default function MarketIntelligencePage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Market Intelligence" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1200px] mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Market Intelligence</h1>
                  <p className="text-muted-foreground mt-1">AI-generated insights from recent analyses</p>
                </div>
                <Button variant="outline" className="gap-2 w-full md:w-auto bg-transparent">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Insights
                </Button>
              </div>

              {/* Insights Grid */}
              <div className="grid gap-4">
                {insights.map((insight) => {
                  const IconComponent = insight.icon
                  return (
                    <Card key={insight.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="mt-1">
                            <IconComponent className="w-6 h-6 text-cyan-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{insight.title}</h3>
                              <Badge 
                                className={`text-xs ${
                                  insight.confidence === "High"
                                    ? "bg-green-500/20 text-green-700"
                                    : "bg-yellow-500/20 text-yellow-700"
                                }`}
                              >
                                {insight.confidence} Confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">Learn More</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Recommendations */}
              <Card className="bg-cyan-500/5 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-600" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Research 5 new healthcare AI startups to close sector gap</p>
                  <p className="text-sm">• Create comprehensive SaaS valuation benchmark report</p>
                  <p className="text-sm">• Analyze founder background patterns across portfolio</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
