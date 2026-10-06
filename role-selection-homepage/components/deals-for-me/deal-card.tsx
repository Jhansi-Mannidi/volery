"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building2,
  Sparkles,
  BarChart2,
  IndianRupee,
  Target,
  Clock,
  Users,
  AlertTriangle,
  Bookmark,
  ThumbsDown,
  Zap,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { DealForMe } from "./types"
import { PassReasonModal } from "@/components/dashboard/angel/pass-reason-modal"

interface DealCardProps {
  deal: DealForMe
  onSave: (id: string) => void
  onPass: (id: string, name: string) => void
}

export function DealCard({ deal, onSave, onPass }: DealCardProps) {
  const { toast } = useToast()
  const [passModal, setPassModal] = React.useState(false)

  const handleSave = () => {
    onSave(deal.id)
    toast({ title: "Saved", description: `${deal.name} added to Saved Deals.` })
  }
  const handlePass = () => setPassModal(true)
  const confirmPass = () => {
    onPass(deal.id, deal.name)
    setPassModal(false)
  }

  const isExcellent = deal.variant === "excellent"
  const isSyndicate = deal.variant === "syndicate"
  const isLower = deal.variant === "lower"

  return (
    <>
      <article
        className={cn(
          "rounded-xl border border-border bg-card overflow-hidden shadow-sm",
          "flex flex-col"
        )}
      >
        {/* Top: Company + Match */}
        <div className="p-4 md:p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{deal.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {deal.tagline}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium",
                  isExcellent && "text-green-600 dark:text-green-400",
                  isSyndicate && "text-amber-600 dark:text-amber-400",
                  isLower && "text-amber-600 dark:text-amber-400"
                )}
              >
                <Sparkles className="h-4 w-4" />
                {deal.matchPct}% Match
              </span>
              {isSyndicate && deal.syndicateLabel && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Syndicate
                </Badge>
              )}
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-xs font-normal">
              {deal.sector}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {deal.stage}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {deal.location}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {deal.age}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="px-4 md:px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <BarChart2 className="h-3.5 w-3.5" />
            Key Metrics
          </p>
          <ul className="space-y-1 text-sm text-foreground">
            {deal.metrics.map((m, i) => (
              <li key={i}>
                • {m.label}: {m.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Raising / Ticket / Closing */}
        <div className="px-4 md:px-5 py-3 border-b border-border space-y-1.5 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="h-4 w-4 shrink-0" />
            {deal.raising} @ {deal.valuation} valuation
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4 shrink-0" />
            {deal.minTicket}
          </p>
          {deal.closing && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              {deal.closing}
            </p>
          )}
        </div>

        {/* AI Says / AI Concerns */}
        {deal.aiSays && (
          <div className="px-4 md:px-5 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              AI Says
            </p>
            <p className="text-sm text-foreground italic">&ldquo;{deal.aiSays}&rdquo;</p>
          </div>
        )}
        {deal.aiConcerns && deal.aiConcerns.length > 0 && (
          <div className="px-4 md:px-5 py-3 border-b border-border">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              AI Concerns
            </p>
            <ul className="space-y-1 text-sm text-foreground">
              {deal.aiConcerns.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Also interested */}
        {deal.alsoInterested && (
          <div className="px-4 md:px-5 py-3 border-b border-border">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4 shrink-0" />
              Also interested: {deal.alsoInterested}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 md:p-5 flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/startups/${deal.id}`}>
              {isSyndicate ? "View Details" : "View Full Details"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          {isSyndicate ? (
            <Button size="sm">
              <Users className="h-4 w-4 mr-1.5" />
              Join Syndicate
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href={`/deals/quick-review?id=${deal.id}`}>
                <Zap className="h-4 w-4 mr-1.5" />
                Quick DD
              </Link>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleSave}>
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handlePass}>
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </article>

      <PassReasonModal
        open={passModal}
        onOpenChange={setPassModal}
        dealName={deal.name}
        onPass={confirmPass}
      />
    </>
  )
}
