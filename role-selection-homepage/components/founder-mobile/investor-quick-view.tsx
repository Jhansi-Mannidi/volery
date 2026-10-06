"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Mail, Phone, Linkedin, ExternalLink, Star, Eye, Clock, FileText, Plus, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface InvestorQuickViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  investor: {
    id: string
    name: string
    firm: string
    type: string
    logo: string
    matchScore: number
    email: string
    phone: string
    linkedin: string
    recentActivity: Array<{
      type: "view" | "download" | "share"
      content: string
      timestamp: string
    }>
  }
}

export function InvestorQuickView({ open, onOpenChange, investor }: InvestorQuickViewProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="w-4 h-4 text-blue-500" />
      case "download":
        return <FileText className="w-4 h-4 text-green-500" />
      case "share":
        return <ExternalLink className="w-4 h-4 text-purple-500" />
      default:
        return null
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-amber-600 bg-amber-50"
    return "text-slate-600 bg-slate-50"
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 border-2 border-border">
                <AvatarImage src={investor.logo || "/placeholder.svg"} alt={investor.name} />
                <AvatarFallback className="text-lg">{investor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl font-semibold truncate">{investor.name}</SheetTitle>
                <p className="text-sm text-muted-foreground truncate">{investor.firm}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">{investor.type}</Badge>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getMatchColor(investor.matchScore)}`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-semibold">{investor.matchScore}% Match</span>
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Quick Contact Buttons */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="flex-col h-auto py-3 gap-2 bg-transparent" asChild>
                <a href={`mailto:${investor.email}`}>
                  <Mail className="w-5 h-5" />
                  <span className="text-xs">Email</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-auto py-3 gap-2 bg-transparent" asChild>
                <a href={`tel:${investor.phone}`}>
                  <Phone className="w-5 h-5" />
                  <span className="text-xs">Call</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-auto py-3 gap-2 bg-transparent" asChild>
                <a href={investor.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                  <span className="text-xs">LinkedIn</span>
                </a>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {investor.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.content}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="p-6 pt-4 space-y-3">
            <Button className="w-full" size="lg" asChild>
              <Link href={`/founder/investors/${investor.id}`}>
                View Full Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              <Bookmark className="w-4 h-4 mr-2" />
              Add to List
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
