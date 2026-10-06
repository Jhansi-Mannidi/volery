"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { DealPipeline } from "@/components/dashboard/deal-pipeline"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { AIMatching } from "@/components/dashboard/ai-matching"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { DocumentEngagement } from "@/components/dashboard/document-engagement"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth-context"

// Institutional Investor Components
import { DealFlowSummary } from "@/components/dashboard/investor/deal-flow-summary"
import { PipelineSnapshot } from "@/components/dashboard/investor/pipeline-snapshot"
import { UpcomingMeetings } from "@/components/dashboard/investor/upcoming-meetings"
import { PortfolioAlerts } from "@/components/dashboard/investor/portfolio-alerts"
import { TopMatches } from "@/components/dashboard/investor/top-matches"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import { AngelDashboard } from "@/components/dashboard/angel/angel-dashboard"
import { Toaster } from "@/components/ui/toaster"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function DashboardPage() {
  const greeting = getGreeting()
  const currentDate = getCurrentDate()
  const { user } = useAuth()
  
  // Get the user's first name for greeting
  const userName = user?.name || "there"
  
  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"
  const isAngelInvestor = user?.activeRole === "angel-investor"

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Dashboard" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main
            className={`flex-1 overflow-auto pb-20 md:pb-6 ${
              isAngelInvestor ? "px-3 md:px-4 py-4 md:py-6" : "p-4 md:p-6"
            }`}
          >
            <div
              className={
                isAngelInvestor
                  ? "w-full space-y-6"
                  : "max-w-[1600px] mx-auto space-y-6"
              }
            >
              {!isAngelInvestor && (
                <PageBreadcrumb segments={[{ label: "Dashboard" }]} />
              )}

              {isAngelInvestor ? (
                <AngelDashboard
                  userName={userName.split(/\s+/)[0] || userName}
                />
              ) : isInstitutionalInvestor ? (
                <>
                  {/* Greeting Section with Portfolio Summary */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                        {greeting}, {userName}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        Here's what's happening with your portfolio today
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-muted/50 px-4 py-3 rounded-lg border border-border">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Portfolio Value</p>
                        <p className="text-xl font-semibold">₹500 Cr</p>
                      </div>
                      <div className="h-10 w-px bg-border" />
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Active Deals</p>
                        <p className="text-xl font-semibold">18</p>
                      </div>
                    </div>
                  </div>

                  {/* Deal Flow Summary Card */}
                  <DealFlowSummary />

                  {/* Main Content - 2 Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Pipeline Snapshot */}
                      <PipelineSnapshot />

                      {/* Upcoming Meetings */}
                      <UpcomingMeetings />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Portfolio Alerts */}
                      <PortfolioAlerts />

                      {/* Top Matches */}
                      <TopMatches />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Default Dashboard (Other Roles) */}
                  {/* Greeting Section */}
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                      {greeting}, {userName}
                    </h1>
                    <p className="text-muted-foreground mt-1">{currentDate}</p>
                  </div>

                  {/* Quick Stats Row */}
                  <MetricsCards />

                  {/* Main Content - 2 Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
                    {/* Left Column (65%) */}
                    <div className="space-y-6">
                      {/* Pipeline Snapshot */}
                      <DealPipeline />

                      {/* Recent Activity Feed */}
                      <ActivityFeed />

                      {/* My Tasks */}
                      <UpcomingTasks />
                    </div>

                    {/* Right Column (35%) */}
                    <div className="space-y-6">
                      {/* Top Matches This Week */}
                      <AIMatching />

                      {/* Document Engagement */}
                      <DocumentEngagement />

                      {/* Quick Actions */}
                      <QuickActions />
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </ProtectedRoute>
  )
}
