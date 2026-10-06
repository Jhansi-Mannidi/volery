"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock, TrendingUp, FileText, Users, ArrowRight, Zap } from "lucide-react"

const researchData = [
  { month: "Jan", completed: 8, pending: 4 },
  { month: "Feb", completed: 12, pending: 6 },
  { month: "Mar", completed: 15, pending: 5 },
  { month: "Apr", completed: 18, pending: 3 },
  { month: "May", completed: 22, pending: 8 },
]

const recentResearch = [
  { id: 1, company: "TechCorp AI", status: "In Research", priority: "High", progress: 65 },
  { id: 2, company: "FinStart Labs", status: "Pending Review", priority: "Medium", progress: 90 },
  { id: 3, company: "HealthIO", status: "Pending Review", priority: "High", progress: 85 },
  { id: 4, company: "CleanEnergy Co", status: "In Research", priority: "Low", progress: 40 },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function AnalystDashboard() {
  const greeting = getGreeting()
  const { user } = useAuth()
  const userName = user?.name || "Analyst"

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Analyst Dashboard" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Greeting Section */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{greeting}, {userName}</h1>
                  <p className="text-muted-foreground mt-1">Track your research progress and insights</p>
                </div>
                <div className="flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20">
                  <Zap className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-700">Research Score: 8.7/10</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">12</span>
                      <span className="text-sm text-green-600 mb-1">↑ 3</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Companies in queue</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">22</span>
                      <span className="text-sm text-green-600 mb-1">↑ 8%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Analyses completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">8</span>
                      <span className="text-sm text-orange-600 mb-1">↑ 2</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Awaiting partner review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg Analysis Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">4.2</span>
                      <span className="text-sm text-muted-foreground mb-1">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Per company</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Charts */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Research Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Research Progress</CardTitle>
                      <CardDescription>Completed analyses vs pending reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={researchData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip />
                          <Bar dataKey="completed" fill="#14B8A6" name="Completed" />
                          <Bar dataKey="pending" fill="#8B5CF6" name="Pending" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Recent Research Queue */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Research Queue</CardTitle>
                        <CardDescription>Companies requiring analysis</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-700 border-cyan-500/20">12 Active</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentResearch.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.company}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {item.status}
                                </Badge>
                                <Badge variant={item.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                                  {item.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-1">{item.progress}%</p>
                              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-cyan-500 transition-all"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Quick Actions & Insights */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <FileText className="w-4 h-4" />
                        New Analysis
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <Zap className="w-4 h-4" />
                        AI Research Assistant
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <Users className="w-4 h-4" />
                        Team Workspace
                      </Button>
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card className="border-cyan-500/20 bg-cyan-500/5">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-600" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>📊 <strong>Market Trend:</strong> SaaS valuations rising</p>
                      <p>🔍 <strong>Gap:</strong> Missing HealthTech analysis</p>
                      <p>⏱️ <strong>Optimization:</strong> Reduce analysis time by 15%</p>
                      <Button variant="ghost" size="sm" className="w-full mt-2 justify-center">
                        View More <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Completed TechCorp analysis</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">FinStart review approved</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Generated market report</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
