import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex flex-col h-screen w-60 bg-sidebar border-r border-sidebar-border">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-24 h-5" />
        </div>
        <div className="p-3 border-b border-sidebar-border">
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
        <div className="flex-1 p-4 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-16 h-3" />
              <div className="space-y-1">
                <Skeleton className="w-full h-8 rounded-lg" />
                <Skeleton className="w-full h-8 rounded-lg" />
                <Skeleton className="w-full h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6">
          <Skeleton className="w-64 h-10 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>

        <main className="flex-1 p-6">
          <div className="max-w-[1600px] mx-auto">
            {/* Breadcrumb */}
            <Skeleton className="w-48 h-4 mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Skeleton className="w-48 h-8 mb-2" />
                <Skeleton className="w-64 h-4" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-36 h-10 rounded-lg" />
                <Skeleton className="w-32 h-10 rounded-lg" />
                <Skeleton className="w-40 h-10 rounded-lg" />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div>
                        <Skeleton className="w-12 h-7 mb-1" />
                        <Skeleton className="w-24 h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="flex gap-4 mb-6">
              <Skeleton className="w-80 h-10 rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-8 rounded-full" />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-6">
              {/* Cards Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div>
                            <Skeleton className="w-32 h-5 mb-1" />
                            <Skeleton className="w-48 h-3" />
                          </div>
                        </div>
                        <Skeleton className="w-20 h-6 rounded-full" />
                      </div>
                      <div className="space-y-2 mb-3">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                      </div>
                      <div className="space-y-2 mb-3">
                        <Skeleton className="w-24 h-3" />
                        <Skeleton className="w-full h-3" />
                        <Skeleton className="w-full h-3" />
                      </div>
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="w-12 h-5 rounded-full" />
                        <Skeleton className="w-16 h-5 rounded-full" />
                        <Skeleton className="w-14 h-5 rounded-full" />
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t">
                        <Skeleton className="flex-1 h-8 rounded-lg" />
                        <Skeleton className="flex-1 h-8 rounded-lg" />
                        <Skeleton className="flex-1 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Right Sidebar */}
              <div className="hidden xl:block w-80 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <Skeleton className="w-32 h-4" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-8 rounded-lg" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
