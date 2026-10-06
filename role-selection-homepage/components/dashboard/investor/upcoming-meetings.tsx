"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Video, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const meetings = [
  {
    id: 1,
    type: "IC Meeting",
    title: "TechFlow AI Investment Review",
    time: "Today, 2:00 PM",
    duration: "60 min",
    participants: 5,
    badge: "Critical",
    badgeVariant: "destructive" as const,
  },
  {
    id: 2,
    type: "Founder Call",
    title: "GreenEnergy Solutions - Series A",
    time: "Today, 4:30 PM",
    duration: "30 min",
    participants: 3,
    badge: "High Priority",
    badgeVariant: "default" as const,
  },
  {
    id: 3,
    type: "IC Meeting",
    title: "HealthTech Ventures Portfolio Review",
    time: "Tomorrow, 10:00 AM",
    duration: "45 min",
    participants: 6,
    badge: "Scheduled",
    badgeVariant: "secondary" as const,
  },
]

export function UpcomingMeetings() {
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetings[0] | null>(null)
  const [rescheduled, setRescheduled] = useState<number[]>([])
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [joinedMeetings, setJoinedMeetings] = useState<number[]>([])

  const handleJoinMeeting = (meetingId: number) => {
    setJoinedMeetings([...joinedMeetings, meetingId])
  }

  const handleRescheduleMeeting = () => {
    if (selectedMeeting && !rescheduled.includes(selectedMeeting.id)) {
      setRescheduled([...rescheduled, selectedMeeting.id])
      setRescheduleOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Meetings
        </CardTitle>
        <Link href="/tasks">
          <Button variant="ghost" size="sm" className="gap-1">
            View Calendar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="mt-1">
                {meeting.type === "IC Meeting" ? (
                  <Users className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Video className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm leading-none">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{meeting.type}</p>
                  </div>
                  <Badge variant={meeting.badgeVariant} className="text-xs">
                    {meeting.badge}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {meeting.time}
                  </span>
                  <span>•</span>
                  <span>{meeting.duration}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meeting.participants}
                  </span>
                </div>
                <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs bg-transparent"
                    onClick={() => handleJoinMeeting(meeting.id)}
                    disabled={joinedMeetings.includes(meeting.id)}
                  >
                    {joinedMeetings.includes(meeting.id) ? "Joined" : "Join Meeting"}
                  </Button>
                  <Dialog open={rescheduleOpen && selectedMeeting?.id === meeting.id} onOpenChange={(open) => {
                    if (open) {
                      setSelectedMeeting(meeting)
                      setRescheduleOpen(true)
                    } else {
                      setRescheduleOpen(false)
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex-1 text-xs"
                        variant={rescheduled.includes(meeting.id) ? "outline" : "default"}
                        onClick={() => {
                          setSelectedMeeting(meeting)
                          setRescheduleOpen(true)
                        }}
                      >
                        {rescheduled.includes(meeting.id) ? "Rescheduled" : "Reschedule"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reschedule Meeting</DialogTitle>
                        <DialogDescription>
                          Choose a new time for your meeting
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-medium text-sm">{selectedMeeting?.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{selectedMeeting?.type}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">New Meeting Time</label>
                          <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                            defaultValue={selectedMeeting?.time}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setRescheduleOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleRescheduleMeeting}
                            className="flex-1"
                          >
                            Confirm Reschedule
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
