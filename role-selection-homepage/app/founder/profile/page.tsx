"use client"

import { Suspense } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import {
  Briefcase,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Settings,
} from "lucide-react"
import { OverviewTab } from "@/components/founder-profile/overview-tab"
import { MetricsTab } from "@/components/founder-profile/metrics-tab"
import { TeamTab } from "@/components/founder-profile/team-tab"
import { FundingTab } from "@/components/founder-profile/funding-tab"
import { DocumentsTab } from "@/components/founder-profile/documents-tab"
import { SettingsTab } from "@/components/founder-profile/settings-tab"

function FounderProfilePage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "overview"
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="My Startup Profile" />
        
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-[1200px] mx-auto">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="flex flex-wrap gap-2 p-1 bg-secondary/50 rounded-lg w-full justify-start md:justify-start mb-6 h-auto">
                  <TabsTrigger value="overview" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md">
                    <Briefcase className="w-4 h-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md">
                    <TrendingUp className="w-4 h-4" />
                    <span>Metrics</span>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md">
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                  </TabsTrigger>
                  <TabsTrigger value="funding" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md">
                    <DollarSign className="w-4 h-4" />
                    <span>Funding</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md">
                    <FileText className="w-4 h-4" />
                    <span>Documents</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <OverviewTab />
                </TabsContent>

                <TabsContent value="metrics" className="space-y-6">
                  <MetricsTab />
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                  <TeamTab />
                </TabsContent>

                <TabsContent value="funding" className="space-y-6">
                  <FundingTab />
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <DocumentsTab />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <SettingsTab />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function FounderProfilePageWrapper() {
  return (
    <Suspense fallback={null}>
      <FounderProfilePage />
    </Suspense>
  )
}
