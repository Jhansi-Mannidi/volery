"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Sparkles, IndianRupee, TrendingUp, Leaf, Bookmark, ThumbsDown, Zap, Flame, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PassReasonModal } from "./pass-reason-modal"

export interface AngelDeal {
  id: string
  name: string
  tagline: string
  matchPct: number
  raising: string
  stage: string
  highlight: string
  highlightIcon?: "growth" | "first"
}

const MOCK_DEALS: AngelDeal[] = [
  {
    id: "1",
    name: "TechCorp AI",
    tagline: "AI-powered fintech",
    matchPct: 94,
    raising: "₹8Cr raising • Series A",
    stage: "Series A",
    highlight: "180% YoY growth",
    highlightIcon: "growth",
  },
  {
    id: "2",
    name: "GreenLeaf Energy",
    tagline: "Clean energy startup",
    matchPct: 89,
    raising: "₹5Cr raising • Seed",
    stage: "Seed",
    highlight: "First institutional",
    highlightIcon: "first",
  },
]

const SWIPE_THRESHOLD = 60

interface DealCardProps {
  deal: AngelDeal
  onSave: (id: string) => void
  onPass: (id: string, name: string) => void
  onQuickReview: (id: string) => void
}

function DealCard({ deal, onSave, onPass, onQuickReview }: DealCardProps) {
  const { toast } = useToast()
  const [dragX, setDragX] = React.useState(0)
  const touchStart = React.useRef<number>(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX - touchStart.current
    setDragX(Math.max(-120, Math.min(120, x)))
  }
  const handleTouchEnd = () => {
    if (dragX > SWIPE_THRESHOLD) {
      onSave(deal.id)
      toast({ title: "Saved", description: `${deal.name} added to Saved Deals.` })
    } else if (dragX < -SWIPE_THRESHOLD) {
      onPass(deal.id, deal.name)
    }
    setDragX(0)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave(deal.id)
    toast({ title: "Saved", description: `${deal.name} added to Saved Deals.` })
  }
  const handlePass = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onPass(deal.id, deal.name)
  }
  const handleQuickReview = (e: React.MouseEvent) => {
    e.preventDefault()
    onQuickReview(deal.id)
  }

  return (
    <div
      className="relative rounded-xl border border-border bg-card overflow-hidden shadow-sm touch-manipulation"
      style={{ minHeight: "180px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe feedback */}
      {dragX > 30 && (
        <div className="absolute inset-y-0 left-0 w-24 bg-green-500/20 flex items-center justify-center text-green-700 dark:text-green-400 font-medium text-sm">
          Save
        </div>
      )}
      {dragX < -30 && (
        <div className="absolute inset-y-0 right-0 w-24 bg-red-500/20 flex items-center justify-center text-red-700 dark:text-red-400 font-medium text-sm">
          Pass
        </div>
      )}

      <div
        className="relative p-4 transition-transform bg-card"
        style={{ transform: `translateX(${dragX}px)` }}
      >
        <div
          className="cursor-pointer"
          onClick={handleQuickReview}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleQuickReview(e as unknown as React.MouseEvent)}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">{deal.name}</h3>
              <p className="text-sm text-muted-foreground">{deal.tagline}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <p className="flex items-center gap-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{deal.matchPct}% Match</span>
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              {deal.raising}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {deal.highlightIcon === "growth" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <Leaf className="h-4 w-4" />
              )}
              {deal.highlight}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="flex-1 min-w-[100px] touch-manipulation"
            onClick={handleQuickReview}
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Quick Review
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="touch-manipulation"
            onClick={handleSave}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="touch-manipulation"
            onClick={handlePass}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AngelHotDeals() {
  const router = useRouter()
  const [deals, setDeals] = React.useState<AngelDeal[]>(MOCK_DEALS)
  const [passModal, setPassModal] = React.useState<{ id: string; name: string } | null>(null)

  const handleSave = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id))
  }
  const handlePass = (id: string, name: string) => {
    setPassModal({ id, name })
  }
  const confirmPass = (reason: string, _note?: string) => {
    if (passModal) {
      setDeals((prev) => prev.filter((d) => d.id !== passModal.id))
      setPassModal(null)
    }
  }
  const handleQuickReview = (id: string) => {
    router.push(`/deals/quick-review?id=${id}`)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Flame className="h-5 w-5 angel-accent shrink-0" />
            Hot Deals For You
          </h2>
          <Link
            href="/matching"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            See all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {deals.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No hot deals right now. Check back later or browse all deals.
            </p>
          ) : (
            deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onSave={handleSave}
                onPass={handlePass}
                onQuickReview={handleQuickReview}
              />
            ))
          )}
        </div>
      </div>

      <PassReasonModal
        open={!!passModal}
        onOpenChange={(open) => !open && setPassModal(null)}
        dealName={passModal?.name ?? ""}
        onPass={confirmPass}
      />
    </>
  )
}
