"use client"

import Link from "next/link"
import { ArrowRight, FileText, TrendingUp } from "lucide-react"

interface Document {
  id: number
  name: string
  views: number
  avgTime: string
  trend: number[]
}

const hotDocuments: Document[] = [
  {
    id: 1,
    name: "TechCorp Pitch Deck",
    views: 23,
    avgTime: "4.2 min",
    trend: [2, 4, 3, 7, 5, 8, 6],
  },
  {
    id: 2,
    name: "FinApp Financial Model",
    views: 15,
    avgTime: "6.1 min",
    trend: [1, 2, 4, 3, 5, 4, 6],
  },
  {
    id: 3,
    name: "CloudAI Market Analysis",
    views: 12,
    avgTime: "3.8 min",
    trend: [3, 2, 4, 5, 3, 4, 5],
  },
]

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 60
  const height = 20
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={width} height={height} className="text-emerald-500">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export function DocumentEngagement() {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="font-semibold text-card-foreground">Document Engagement</h2>
          <p className="text-sm text-muted-foreground">Hot Documents</p>
        </div>
        <Link
          href="/documents/analytics"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View Analytics
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {hotDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{doc.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{doc.views} views</span>
                <span className="text-muted-foreground/50">|</span>
                <span>{doc.avgTime} avg</span>
              </div>
            </div>
            <div className="shrink-0">
              <MiniSparkline data={doc.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
