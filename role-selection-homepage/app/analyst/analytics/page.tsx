"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const completionData = [
  { month: "Jan", completed: 8, target: 10 },
  { month: "Feb", completed: 12, target: 15 },
  { month: "Mar", completed: 15, target: 18 },
  { month: "Apr", completed: 18, target: 20 },
  { month: "May", completed: 22, target: 25 },
]

const efficiencyData = [
  { month: "Jan", efficiency: 72 },
  { month: "Feb", efficiency: 78 },
  { month: "Mar", efficiency: 82 },
  { month: "Apr", efficiency: 85 },
  { month: "May", efficiency: 88 },
]

const sectorData = [
  { name: "SaaS", value: 35 },
  { name: "FinTech", value: 25 },
  { name: "HealthTech", value: 20 },
  { name: "CleanTech", value: 15 },
  { name: "Other", value: 5 },
]

const COLORS = ["#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B", "#6B7280"]

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Analytics" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">Your Analytics</h1>
                <p className="text-muted-foreground mt-1">Track your research performance metrics</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Analyses This Year</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">75</p>
                    <p className="text-xs text-green-600 mt-2">↑ 12% vs last year</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg Quality Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">8.4/10</p>
                    <p className="text-xs text-green-600 mt-2">↑ 0.3 improvement</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Partner Approvals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">92%</p>
                    <p className="text-xs text-muted-foreground mt-2">First submission approval</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Report Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">1.2K</p>
                    <p className="text-xs text-green-600 mt-2">↑ 45% engagement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completion vs Target */}
                <Card>
                  <CardHeader>
                    <CardTitle>Completion vs Target</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={completionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#06B6D4" name="Completed" />
                        <Bar dataKey="target" fill="#D1D5DB" name="Target" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Efficiency Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Research Efficiency Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={efficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Line type="monotone" dataKey="efficiency" stroke="#06B6D4" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Sector Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analyses by Sector</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} (${value}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Performing Sectors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">SaaS Analysis Quality</span>
                        <span className="text-sm font-medium">8.8/10</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[88%] bg-cyan-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Report Timeliness</span>
                        <span className="text-sm font-medium">9.2/10</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Data Accuracy</span>
                        <span className="text-sm font-medium">8.6/10</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[86%] bg-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
