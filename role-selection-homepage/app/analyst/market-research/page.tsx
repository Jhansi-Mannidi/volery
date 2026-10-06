"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Download,
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  Eye,
  Link2,
  TrendingUp,
  Target,
  Users,
  AlertCircle,
} from "lucide-react"

interface MarketData {
  size: string
  year: number
  cagr: number
  definition: string
  sources: string[]
  assumptions: { key: string; value: string }[]
}

interface Competitor {
  id: string
  name: string
  type: string
  founded: number
  revenue: string
  customers: string
  strengths: string[]
  weaknesses: string[]
}

interface Trend {
  id: string
  title: string
  icon: string
  impact: "High" | "Medium" | "Low"
  timeframe: string
  description: string
  sources: string[]
}

interface GrowthDriver {
  id: string
  name: string
  impact: "High" | "Medium" | "Low"
  probability: "Very High" | "High" | "Medium" | "Low"
  score: number
  type: "driver" | "inhibitor"
}

export default function MarketResearchPage() {
  const [activeTab, setActiveTab] = useState("tam-sam-som")
  const [expandedSection, setExpandedSection] = useState("tam")
  const [editingTAM, setEditingTAM] = useState(false)
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  const [tam, setTam] = useState<MarketData>({
    size: "₹15,000 Cr",
    year: 2025,
    cagr: 18.5,
    definition:
      "The total global market for financial document processing solutions, including manual, semi-automated, and fully automated approaches.",
    sources: ["Gartner Report 2024", "Industry Analysis by McKinsey"],
    assumptions: [
      { key: "Global BFSI IT spend", value: "₹2,50,000 Cr" },
      { key: "Document processing as % of IT spend", value: "6%" },
    ],
  })

  const [sam, setSam] = useState<MarketData>({
    size: "₹3,500 Cr",
    year: 2025,
    cagr: 22,
    definition: "Market addressable for India-specific BFSI document processing",
    sources: ["RBI Report", "Nasscom Analysis"],
    assumptions: [
      { key: "India BFSI IT spend", value: "₹50,000 Cr" },
      { key: "Document processing share", value: "7%" },
    ],
  })

  const [som, setSom] = useState<MarketData>({
    size: "₹450 Cr",
    year: 2025,
    cagr: 35,
    definition: "Market obtainable by AI-powered solutions in India",
    sources: ["Market Analysis"],
    assumptions: [
      { key: "AI adoption rate", value: "30%" },
      { key: "Market penetration", value: "4.3%" },
    ],
  })

  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: "1",
      name: "AWS Textract",
      type: "Global Enterprise",
      founded: 2019,
      revenue: "$500M+",
      customers: "10,000+",
      strengths: ["AWS ecosystem integration", "Massive scale"],
      weaknesses: ["Complex pricing", "Limited customization"],
    },
    {
      id: "2",
      name: "Google Document AI",
      type: "Global Enterprise",
      founded: 2020,
      revenue: "$300M+",
      customers: "5,000+",
      strengths: ["Superior ML models", "GCP integration"],
      weaknesses: ["India support limited", "Higher latency"],
    },
  ])

  const [trends, setTrends] = useState<Trend[]>([
    {
      id: "1",
      title: "AI Adoption in BFSI",
      icon: "📈",
      impact: "High",
      timeframe: "1-2 years",
      description:
        "78% of Indian banks plan to increase AI spending by 2026. Document processing is top use case.",
      sources: ["RBI Report", "Nasscom"],
    },
    {
      id: "2",
      title: "Cloud Migration",
      icon: "☁️",
      impact: "High",
      timeframe: "Now",
      description: "65% of BFSI workloads moving to cloud by 2026.",
      sources: ["IDC India Report"],
    },
  ])

  const [drivers, setDrivers] = useState<GrowthDriver[]>([
    {
      id: "1",
      name: "Digital lending growth (35% YoY)",
      impact: "High",
      probability: "Very High",
      score: 9.2,
      type: "driver",
    },
    {
      id: "2",
      name: "RBI push for automation",
      impact: "High",
      probability: "High",
      score: 8.5,
      type: "driver",
    },
    {
      id: "3",
      name: "Data privacy concerns",
      impact: "High",
      probability: "Medium",
      score: 6.0,
      type: "inhibitor",
    },
  ])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-100 text-red-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const MarketSection = ({
    title,
    data,
    isExpanded,
    onToggle,
  }: {
    title: string
    data: MarketData
    isExpanded: boolean
    onToggle: () => void
  }) => (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{isExpanded ? "▼" : "▶"}</span>
            {title}
          </CardTitle>
          <Button variant="outline" size="sm">
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
        {!isExpanded && (
          <p className="text-sm text-muted-foreground mt-2">
            {data.size} • CAGR {data.cagr}% • Projected 2028:{" "}
            {(parseFloat(data.size.replace(/[^0-9.]/g, "")) * (1 + (data.cagr / 100) * 3)).toFixed(0)}{" "}
            Cr
          </p>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Market Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Market Size</p>
                <p className="font-semibold">{data.size}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="font-semibold">{data.year}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CAGR</p>
                <p className="font-semibold">{data.cagr}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">2028 Projection</p>
                <p className="font-semibold">
                  ₹
                  {(parseFloat(data.size.replace(/[^0-9.]/g, "")) * (1 + (data.cagr / 100) * 3)).toFixed(0)}{" "}
                  Cr
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Definition</h3>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              {data.definition}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center justify-between">
              Sources
              <Button variant="ghost" size="sm" onClick={() => setOpenDialog("add-source")}>
                <Plus className="w-4 h-4" />
              </Button>
            </h3>
            <ul className="space-y-2">
              {data.sources.map((source) => (
                <li key={source} className="text-sm flex items-center justify-between">
                  <Link2 className="w-4 h-4 mr-2 text-muted-foreground" />
                  {source}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center justify-between">
              Assumptions
              <Button variant="ghost" size="sm" onClick={() => setOpenDialog("add-assumption")}>
                <Plus className="w-4 h-4" />
              </Button>
            </h3>
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Assumption</th>
                  <th className="px-3 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.assumptions.map((assumption) => (
                  <tr key={assumption.key} className="border-b hover:bg-muted/50">
                    <td className="px-3 py-2">{assumption.key}</td>
                    <td className="px-3 py-2">{assumption.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  )

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Market Research Builder" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Market Research Builder</h1>
                  <p className="text-muted-foreground mt-1">
                    TechCorp AI - Financial Document Analysis Market
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Auto-Fill
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="tam-sam-som">TAM/SAM/SOM</TabsTrigger>
                  <TabsTrigger value="competitors">Competitors</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="drivers">Growth Drivers</TabsTrigger>
                </TabsList>

                {/* TAM/SAM/SOM Tab */}
                <TabsContent value="tam-sam-som" className="space-y-6">
                  {/* Funnel Visualization */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Market Size Funnel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 text-center">
                          <p className="text-sm font-semibold text-blue-700">TAM</p>
                          <p className="text-2xl font-bold text-blue-900">₹15,000 Cr</p>
                          <p className="text-xs text-blue-600 mt-1">Global Financial Document Processing</p>
                        </div>

                        <div className="bg-gradient-to-b from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-6 text-center">
                          <p className="text-sm font-semibold text-purple-700">SAM</p>
                          <p className="text-2xl font-bold text-purple-900">₹3,500 Cr</p>
                          <p className="text-xs text-purple-600 mt-1">India BFSI Document Processing</p>
                        </div>

                        <div className="bg-gradient-to-b from-teal-50 to-teal-100 border-2 border-teal-200 rounded-lg p-6 text-center">
                          <p className="text-sm font-semibold text-teal-700">SOM</p>
                          <p className="text-2xl font-bold text-teal-900">₹450 Cr</p>
                          <p className="text-xs text-teal-600 mt-1">AI-powered Solutions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* TAM Section */}
                  <MarketSection
                    title="Total Addressable Market (TAM)"
                    data={tam}
                    isExpanded={expandedSection === "tam"}
                    onToggle={() =>
                      setExpandedSection(expandedSection === "tam" ? "" : "tam")
                    }
                  />

                  {/* SAM Section */}
                  <MarketSection
                    title="Serviceable Addressable Market (SAM)"
                    data={sam}
                    isExpanded={expandedSection === "sam"}
                    onToggle={() =>
                      setExpandedSection(expandedSection === "sam" ? "" : "sam")
                    }
                  />

                  {/* SOM Section */}
                  <MarketSection
                    title="Serviceable Obtainable Market (SOM)"
                    data={som}
                    isExpanded={expandedSection === "som"}
                    onToggle={() =>
                      setExpandedSection(expandedSection === "som" ? "" : "som")
                    }
                  />
                </TabsContent>

                {/* Competitors Tab */}
                <TabsContent value="competitors" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Competitors ({competitors.length})</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Competitor
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competitors.map((competitor) => (
                      <Card key={competitor.id} className="flex flex-col">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{competitor.name}</CardTitle>
                              <Badge className="mt-2" variant="outline">
                                {competitor.type}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Founded</p>
                              <p className="font-semibold">{competitor.founded}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Revenue</p>
                              <p className="font-semibold">{competitor.revenue}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Customers</p>
                              <p className="font-semibold">{competitor.customers}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold mb-1">Strengths</p>
                            <ul className="text-xs space-y-1">
                              {competitor.strengths.map((strength) => (
                                <li key={strength}>• {strength}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-xs font-semibold mb-1">Weaknesses</p>
                            <ul className="text-xs space-y-1">
                              {competitor.weaknesses.map((weakness) => (
                                <li key={weakness}>• {weakness}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Eye className="w-3 h-3 mr-1" />
                              Details
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Trends Tab */}
                <TabsContent value="trends" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Market Trends</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Find
                      </Button>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Trend
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trends.map((trend) => (
                      <Card key={trend.id}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <span>{trend.icon}</span>
                            {trend.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex gap-2">
                            <Badge className={getImpactColor(trend.impact)}>
                              Impact: {trend.impact}
                            </Badge>
                            <Badge variant="outline">Timeframe: {trend.timeframe}</Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">{trend.description}</p>

                          <div>
                            <p className="text-xs font-semibold mb-1">Sources</p>
                            <p className="text-xs text-muted-foreground">
                              {trend.sources.join(", ")}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Growth Drivers Tab */}
                <TabsContent value="drivers" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Growth Drivers & Inhibitors</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Analyze
                      </Button>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Growth Drivers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-3 py-2 text-left">Driver</th>
                              <th className="px-3 py-2 text-left">Impact</th>
                              <th className="px-3 py-2 text-left">Probability</th>
                              <th className="px-3 py-2 text-left">Score</th>
                              <th className="px-3 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {drivers
                              .filter((d) => d.type === "driver")
                              .map((driver) => (
                                <tr key={driver.id} className="border-b hover:bg-muted/50">
                                  <td className="px-3 py-2">{driver.name}</td>
                                  <td className="px-3 py-2">
                                    <Badge className={getImpactColor(driver.impact)}>
                                      {driver.impact}
                                    </Badge>
                                  </td>
                                  <td className="px-3 py-2 text-xs">{driver.probability}</td>
                                  <td className="px-3 py-2 font-semibold">{driver.score}</td>
                                  <td className="px-3 py-2">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Growth Inhibitors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-3 py-2 text-left">Inhibitor</th>
                              <th className="px-3 py-2 text-left">Impact</th>
                              <th className="px-3 py-2 text-left">Probability</th>
                              <th className="px-3 py-2 text-left">Score</th>
                              <th className="px-3 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {drivers
                              .filter((d) => d.type === "inhibitor")
                              .map((inhibitor) => (
                                <tr key={inhibitor.id} className="border-b hover:bg-muted/50">
                                  <td className="px-3 py-2">{inhibitor.name}</td>
                                  <td className="px-3 py-2">
                                    <Badge className={getImpactColor(inhibitor.impact)}>
                                      {inhibitor.impact}
                                    </Badge>
                                  </td>
                                  <td className="px-3 py-2 text-xs">{inhibitor.probability}</td>
                                  <td className="px-3 py-2 font-semibold">{inhibitor.score}</td>
                                  <td className="px-3 py-2">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">
                              Net Growth Score: +5.5 (Positive)
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
