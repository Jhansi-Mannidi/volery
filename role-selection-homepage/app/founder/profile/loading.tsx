import { Skeleton } from "@/components/ui/skeleton"

export default function FounderProfileLoading() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 bg-sidebar" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-border bg-card" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Tab navigation */}
            <div className="flex gap-4 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>

            {/* Content skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
