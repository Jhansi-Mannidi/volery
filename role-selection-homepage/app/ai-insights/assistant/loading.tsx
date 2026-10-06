import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-20 w-96 rounded-2xl" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-12 w-80 rounded-2xl" />
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-32 w-[500px] rounded-2xl" />
            </div>
          </div>
        </div>

        <div className="border-t bg-card px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      <div className="w-80 border-l bg-card p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
