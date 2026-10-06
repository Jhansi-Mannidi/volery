import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ActivityLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex flex-col w-60 h-screen bg-sidebar border-r border-sidebar-border">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="p-3 border-b border-sidebar-border">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex-1 px-3 py-4 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16 ml-3" />
              <div className="space-y-1">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="h-16 border-b border-border px-4 flex items-center justify-between">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        {/* Content Skeleton */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <Skeleton className="h-4 w-32 mb-4" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32 rounded-lg" />
              <Skeleton className="h-9 w-40 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>

          {/* Activity List */}
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex gap-4 p-4">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2 mt-3">
                      <Skeleton className="h-7 w-24 rounded-md" />
                      <Skeleton className="h-7 w-28 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
