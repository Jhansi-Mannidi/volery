"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

export function SettingsPageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <DashboardHeader title="Settings" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className={cn("flex-1 overflow-y-auto", className)}>{children}</main>
      </div>
    </div>
  )
}
