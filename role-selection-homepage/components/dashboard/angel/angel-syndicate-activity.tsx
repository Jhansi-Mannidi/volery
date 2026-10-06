"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Users } from "lucide-react"

const activity = {
  syndicate: "Rajan's Tech Fund",
  action: "is investing in CloudSync AI (₹15L spots)",
  closes: "Closes in 3 days",
  cta: "Join Investment",
}

export function AngelSyndicateActivity() {
  const { toast } = useToast()

  const handleJoin = () => {
    toast({
      title: "Opening syndicate flow",
      description: "Redirecting to investment flow for CloudSync AI.",
    })
    // router.push("/syndicate/join/...")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Users className="h-5 w-5" />
        Syndicate Activity
      </h2>
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <p className="text-sm text-foreground font-medium">
          {activity.syndicate} {activity.action}
        </p>
        <p className="text-xs text-muted-foreground">{activity.closes}</p>
        <Button
          size="sm"
          className="w-full touch-manipulation"
          onClick={handleJoin}
        >
          {activity.cta}
        </Button>
      </div>
    </div>
  )
}
