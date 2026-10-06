"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Calendar,
  ArrowUp,
  ArrowDown,
  Zap,
  Target,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample metric data
const financialMetrics = [
  {
    label: "MRR",
    value: "$125,000",
    change: "+12%",
    trend: "up",
    chart: [85, 90, 88, 95, 100, 108, 112, 115, 120, 122, 125],
    visibleToInvestors: true,
  },
  {
    label: "ARR",
    value: "$1.5M",
    change: "+15%",
    trend: "up",
    chart: [1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5],
    visibleToInvestors: true,
  },
  {
    label: "Revenue Growth (MoM)",
    value: "12%",
    change: "+2%",
    trend: "up",
    chart: [8, 9, 10, 11, 10, 11, 12, 11, 12, 13, 12],
    visibleToInvestors: true,
  },
  {
    label: "Burn Rate",
    value: "$45K/mo",
    change: "-8%",
    trend: "up",
    chart: [55, 53, 52, 50, 48, 47, 46, 45, 45, 45, 45],
    visibleToInvestors: false,
  },
  {
    label: "Runway",
    value: "18 months",
    change: "+2 mo",
    trend: "up",
    chart: [14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 18],
    visibleToInvestors: false,
  },
  {
    label: "Gross Margin",
    value: "72%",
    change: "+3%",
    trend: "up",
    chart: [65, 66, 67, 68, 69, 70, 70, 71, 71, 72, 72],
    visibleToInvestors: true,
  },
]

const growthMetrics = [
  {
    label: "Total Customers",
    value: "2,847",
    change: "+156",
    trend: "up",
    chart: [2400, 2500, 2550, 2600, 2650, 2700, 2730, 2760, 2800, 2820, 2847],
    visibleToInvestors: true,
  },
  {
    label: "New Customers (MoM)",
    value: "156",
    change: "+23%",
    trend: "up",
    chart: [98, 105, 112, 118, 125, 130, 135, 142, 148, 150, 156],
    visibleToInvestors: true,
  },
  {
    label: "Churn Rate",
    value: "2.8%",
    change: "-0.5%",
    trend: "up",
    chart: [4.2, 4.0, 3.8, 3.6, 3.5, 3.3, 3.1, 3.0, 2.9, 2.85, 2.8],
    visibleToInvestors: true,
  },
  {
    label: "Net Revenue Retention",
    value: "115%",
    change: "+5%",
    trend: "up",
    chart: [105, 106, 108, 109, 110, 111, 112, 113, 114, 114, 115],
    visibleToInvestors: true,
  },
]

const productMetrics = [
  {
    label: "Daily Active Users",
    value: "12,450",
    change: "+8%",
    trend: "up",
    chart: [10500, 10800, 11000, 11200, 11400, 11600, 11800, 12000, 12200, 12300, 12450],
    visibleToInvestors: true,
  },
  {
    label: "Monthly Active Users",
    value: "45,230",
    change: "+12%",
    trend: "up",
    chart: [38000, 39000, 40000, 41000, 42000, 42500, 43000, 43500, 44000, 44500, 45230],
    visibleToInvestors: true,
  },
  {
    label: "DAU/MAU Ratio",
    value: "27.5%",
    change: "+1.2%",
    trend: "up",
    chart: [24, 24.5, 25, 25.2, 25.5, 26, 26.2, 26.5, 27, 27.2, 27.5],
    visibleToInvestors: false,
  },
  {
    label: "Feature Adoption",
    value: "68%",
    change: "+5%",
    trend: "up",
    chart: [58, 60, 61, 62, 63, 64, 65, 66, 67, 67.5, 68],
    visibleToInvestors: false,
  },
]

function MetricCard({ metric }: { metric: any }) {
  const [showInvestorView, setShowInvestorView] = useState(false)

  return (
    <Card className={cn(!metric.visibleToInvestors && showInvestorView && "opacity-50 border-dashed")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              {!metric.visibleToInvestors && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Hidden
                </Badge>
              )}
            </div>
            <p className="text-2xl font-semibold">{metric.value}</p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "flex items-center gap-1",
              metric.trend === "up"
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
            )}
          >
            {metric.trend === "up" ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {metric.change}
          </Badge>
        </div>
        
        {/* Mini Chart */}
        <div className="h-12 flex items-end justify-between gap-1">
          {metric.chart.map((value: number, index: number) => {
            const maxValue = Math.max(...metric.chart)
            const height = (value / maxValue) * 100
            return (
              <div
                key={index}
                className="flex-1 bg-primary/20 rounded-sm transition-all hover:bg-primary/40"
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsTab() {
  const [showInvestorView, setShowInvestorView] = useState(false)
  const [timePeriod, setTimePeriod] = useState("30days")
  const [addMetricOpen, setAddMetricOpen] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      // In production, parse and process the CSV file
      console.log("[v0] CSV file uploaded:", file.name)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Metrics Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your key performance indicators and growth metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={showInvestorView ? "default" : "outline"}
            onClick={() => setShowInvestorView(!showInvestorView)}
            className="gap-2"
          >
            {showInvestorView ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Investor View
          </Button>

          <Dialog open={addMetricOpen} onOpenChange={setAddMetricOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Metric
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Metric</DialogTitle>
                <DialogDescription>
                  Manually enter a metric or import from a CSV file
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="import">Import CSV</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metric-name">Metric Name</Label>
                    <Input id="metric-name" placeholder="e.g., Customer Acquisition Cost" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Current Value</Label>
                    <Input id="value" placeholder="e.g., 125" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="visible" className="rounded" />
                    <Label htmlFor="visible" className="text-sm font-normal">
                      Visible to investors
                    </Label>
                  </div>
                  <Button className="w-full">Add Metric</Button>
                </TabsContent>
                <TabsContent value="import" className="space-y-4 pt-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {csvFile ? csvFile.name : "Drop your CSV file here or click to browse"}
                    </p>
                    <input
                      type="file"
                      id="csv-upload"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="csv-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    CSV should include columns: metric_name, value, date, category
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showInvestorView && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Investor View Active
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  You're seeing what investors can view. Metrics marked as "Hidden" are only visible to you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Financial Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financialMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      {/* Growth Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Growth Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {growthMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      {/* Product Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Product Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Benchmark Comparison
            <Badge variant="secondary" className="ml-2">
              SaaS Industry Average
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Revenue Growth Rate</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Your: 12%</span>
                  <span className="text-sm text-muted-foreground">Industry: 8%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-primary rounded" style={{ width: "60%" }} />
                <div className="flex-1 h-2 bg-muted rounded" style={{ width: "40%" }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Churn Rate</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Your: 2.8%</span>
                  <span className="text-sm text-muted-foreground">Industry: 5.2%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-green-500 rounded" style={{ width: "35%" }} />
                <div className="flex-1 h-2 bg-muted rounded" style={{ width: "65%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Gross Margin</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Your: 72%</span>
                  <span className="text-sm text-muted-foreground">Industry: 70%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-primary rounded" style={{ width: "51%" }} />
                <div className="flex-1 h-2 bg-muted rounded" style={{ width: "49%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start gap-2 bg-transparent">
              <BarChart3 className="w-4 h-4" />
              Connect Stripe
            </Button>
            <Button variant="outline" className="justify-start gap-2 bg-transparent">
              <Upload className="w-4 h-4" />
              Import Historical Data
            </Button>
            <Button variant="outline" className="justify-start gap-2 bg-transparent">
              <Target className="w-4 h-4" />
              Set Growth Targets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
