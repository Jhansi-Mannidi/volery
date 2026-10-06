import { Skeleton } from "@/components/ui/skeleton"

export default function ICMemoLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r border-border p-4">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border px-6 flex items-center">
          <Skeleton className="h-6 w-48" />
        </div>
        
        <div className="flex-1 flex">
          {/* Section nav */}
          <div className="w-72 border-r border-border p-4">
            <Skeleton className="h-20 w-full mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          
          {/* Content area */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
