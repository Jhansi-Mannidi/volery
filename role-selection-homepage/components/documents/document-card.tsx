'use client';

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Share2, MoreHorizontal, Download, FileText, Clock, Flame, TrendingUp, Snowflake } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  pages: number
  uploadedBy: { name: string; initials: string }
  uploadedAt: string
  relatedTo: { type: string; name: string; id: string } | null
  views: number
  uniqueViewers: number
  avgTime: string
  completionRate: number
  engagement: string
  thumbnail: string
}

interface DocumentCardProps {
  document: Document
  onPreview: () => void
  onShare: () => void
  onDownload: () => void
}

const EngagementIcon = ({ engagement }: { engagement: string }) => {
  if (engagement === "hot") return <Flame className="w-4 h-4 text-orange-500" />
  if (engagement === "trending") return <TrendingUp className="w-4 h-4 text-blue-500" />
  if (engagement === "cold") return <Snowflake className="w-4 h-4 text-slate-400" />
  return null
}

export default function DocumentCard({ document, onPreview, onShare, onDownload }: DocumentCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const openPreview = () => {
    setDropdownOpen(false)
    setTimeout(() => onPreview(), 0)
  }
  const openShare = () => {
    setDropdownOpen(false)
    setTimeout(() => onShare(), 0)
  }
  const doDownload = () => {
    setDropdownOpen(false)
    setTimeout(() => onDownload(), 0)
  }

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer" onClick={onPreview}>
      <CardContent className="p-4 space-y-3">
        {/* Document Preview */}
        <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <EngagementIcon engagement={document.engagement} />
          </div>
        </div>

        {/* Document Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground truncate">
                {document.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {document.type} • {document.pages} pages
              </p>
            </div>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openPreview(); }}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openShare(); }}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); doDownload(); }}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Related Info */}
          {document.relatedTo && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-xs">
                {document.relatedTo.name}
              </Badge>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{document.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{document.avgTime}</span>
            </div>
          </div>

          {/* Uploaded By */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {document.uploadedBy.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {document.uploadedAt}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
