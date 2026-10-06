import { Hexagon } from "lucide-react"

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex items-center gap-2">
        <Hexagon className="w-6 h-6 text-primary" />
        <span className="text-lg font-medium text-foreground">Loading...</span>
      </div>
    </div>
  )
}
