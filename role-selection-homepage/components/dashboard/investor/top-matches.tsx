"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MapPin, TrendingUp, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const matches = [
  {
    id: 1,
    name: "NeuralNet AI",
    tagline: "Enterprise AI automation platform",
    score: 95,
    location: "San Francisco, CA",
    stage: "Series A",
    funding: "$2.5M seeking",
    reason: "Perfect fit: Enterprise SaaS focus, strong team with ML expertise, TAM $50B+",
    tags: ["AI/ML", "Enterprise", "SaaS"],
  },
  {
    id: 2,
    name: "EcoCharge Solutions",
    tagline: "EV charging infrastructure network",
    score: 88,
    location: "Austin, TX",
    stage: "Seed",
    funding: "$1.8M seeking",
    reason: "High potential: Climate tech thesis alignment, proven GTM, 300% YoY growth",
    tags: ["Climate Tech", "Infrastructure", "B2B"],
  },
  {
    id: 3,
    name: "HealthSync Platform",
    tagline: "AI-powered patient care coordination",
    score: 82,
    location: "Boston, MA",
    stage: "Series A",
    funding: "$3M seeking",
    reason: "Strategic fit: Healthcare vertical expansion, regulatory compliance ready",
    tags: ["HealthTech", "AI", "B2B SaaS"],
  },
]

export function TopMatches() {
  const [selectedMatch, setSelectedMatch] = useState<typeof matches[0] | null>(null)
  const [expressInterestOpen, setExpressInterestOpen] = useState(false)
  const [expressedInterests, setExpressedInterests] = useState<number[]>([])
  const [interestMessage, setInterestMessage] = useState("")

  const handleExpressInterest = () => {
    if (selectedMatch) {
      setExpressedInterests([...expressedInterests, selectedMatch.id])
      setInterestMessage("")
      setExpressInterestOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Top Matches (AI-curated)
        </CardTitle>
        <Link href="/matching">
          <Button variant="ghost" size="sm" className="gap-1">
            See All Matches
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{match.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{match.tagline}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-bold">{match.score}%</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {match.location}
                </span>
                <span>•</span>
                <span>{match.stage}</span>
                <span>•</span>
                <span className="font-medium text-foreground">{match.funding}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {match.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* AI Reasoning */}
              <div className="bg-muted/50 rounded-md p-2.5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Why matched: </span>
                  {match.reason}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Link href={`/startups/${match.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                    View Profile
                  </Button>
                </Link>
                <Dialog open={expressInterestOpen && selectedMatch?.id === match.id} onOpenChange={(open) => {
                  if (open) {
                    setSelectedMatch(match)
                    setExpressInterestOpen(true)
                  } else {
                    setExpressInterestOpen(false)
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs gap-1"
                      onClick={() => {
                        setSelectedMatch(match)
                        setExpressInterestOpen(true)
                      }}
                      disabled={expressedInterests.includes(match.id)}
                    >
                      {expressedInterests.includes(match.id) ? (
                        <>
                          <Check className="w-3 h-3" />
                          Interest Sent
                        </>
                      ) : (
                        "Express Interest"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Express Interest</DialogTitle>
                      <DialogDescription>
                        Let {selectedMatch?.name || "this company"} know you're interested. Add a brief message (optional).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm">{selectedMatch?.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedMatch?.tagline}</p>
                      </div>
                      <Textarea
                        placeholder="Tell them why you're interested... (optional)"
                        value={interestMessage}
                        onChange={(e) => setInterestMessage(e.target.value)}
                        className="min-h-24 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setExpressInterestOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleExpressInterest}
                          className="flex-1"
                        >
                          Send Interest
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
