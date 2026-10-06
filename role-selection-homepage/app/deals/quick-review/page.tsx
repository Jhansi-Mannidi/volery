"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function QuickReviewPage() {
  const searchParams = useSearchParams()
  const dealId = searchParams.get("id")

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Quick Review" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <PageBreadcrumb
                segments={[
                  { label: "Deals", href: "/matching" },
                  { label: "Quick Review" },
                ]}
                homeHref="/"
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">
                  Quick Review swipe interface
                  {dealId && (
                    <span className="ml-2 font-medium text-foreground">
                      (Deal ID: {dealId})
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Swipe or use actions below to Save or Pass on this deal.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href="/matching">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Deals
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
