"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, FileText, Lightbulb, StickyNote, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface MeetingPrepCardProps {
  meeting: {
    investorName: string
    investorFirm: string
    date: string
    time: string
    summary: string
    talkingPoints: string[]
    previousNotes: string[]
    documents: string[]
  }
}

export function MeetingPrepCard({ meeting }: MeetingPrepCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardContent className="p-4">
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <h3 className="font-semibold text-base">{meeting.investorName}</h3>
                <p className="text-sm text-muted-foreground">{meeting.investorFirm}</p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              <Calendar className="w-3 h-3 mr-1" />
              {meeting.time}
            </Badge>
          </div>

          {/* Quick Summary */}
          <div className="bg-muted/50 rounded-lg p-3 mb-3">
            <p className="text-sm leading-relaxed">{meeting.summary}</p>
          </div>

          {/* Expand/Collapse */}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-center gap-2 mb-3">
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View Full Prep
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4">
            {/* Talking Points */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-semibold">Key Talking Points</h4>
              </div>
              <ul className="space-y-2">
                {meeting.talkingPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Previous Notes */}
            {meeting.previousNotes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-semibold">Previous Notes</h4>
                </div>
                <div className="space-y-2">
                  {meeting.previousNotes.map((note, index) => (
                    <div key={index} className="bg-muted/50 rounded p-2 text-sm">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents to Discuss */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-500" />
                <h4 className="text-sm font-semibold">Documents to Discuss</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {meeting.documents.map((doc, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
