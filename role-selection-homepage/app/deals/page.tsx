"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DealsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/deals/incoming")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Redirecting to incoming deals...</p>
      </div>
    </div>
  )
}
