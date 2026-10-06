import { Skeleton } from "@/components/ui/skeleton"

export default function ReportGeneratorLoading() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="h-16 border-b px-6 flex items-center">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r">
          <Skeleton className="h-full w-full" />
        </div>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    </div>
  )
}
