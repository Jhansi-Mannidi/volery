'use client'

import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { CompetitiveLandscapeMapper } from '@/components/competitive/landscape-mapper'
import { Button } from '@/components/ui/button'
import { Download, Share2, Plus } from 'lucide-react'

export default function CompetitiveLandscapePage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Competitive Landscape Mapper" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Competitive Landscape Mapper
                    </h1>
                    <p className="text-muted-foreground mt-1">For: TechCorp AI</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 bg-transparent"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Add Competitor
                    </Button>
                  </div>
                </div>

                {/* Main Content - Competitive Landscape Mapper Component */}
                <CompetitiveLandscapeMapper />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
