'use client';

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Share2, MoreHorizontal, Download, FileText, Flame, TrendingUp, Snowflake } from "lucide-react"

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

interface DocumentTableRowProps {
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

export default function DocumentTableRow({ document, onPreview, onShare, onDownload }: DocumentTableRowProps) {
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
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onPreview}>
      <TableCell>
        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{document.name}</div>
            <div className="text-xs text-muted-foreground">{document.pages} pages</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-xs">
          {document.type}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{document.size}</TableCell>
      <TableCell>
        {document.relatedTo ? (
          <Badge variant="outline" className="text-xs">
            {document.relatedTo.name}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {document.uploadedBy.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{document.uploadedBy.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{document.uploadedAt}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <EngagementIcon engagement={document.engagement} />
          <span className="text-sm">{document.views}</span>
          <span className="text-xs text-muted-foreground">
            ({document.uniqueViewers} unique)
          </span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{document.avgTime}</TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  )
}
