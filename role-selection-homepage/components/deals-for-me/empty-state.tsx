"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onAdjustFilters: () => void
}

export function EmptyState({ onAdjustFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No deals match your criteria
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Try adjusting your filters or updating your investment preferences to see
        more deals
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" onClick={onAdjustFilters}>
          Adjust Filters
        </Button>
        <Button asChild>
          <Link href="/settings/preferences">Update Preferences</Link>
        </Button>
      </div>
    </div>
  )
}
