"use client"

import { useState } from "react"
import { Mic, Save, Flame, Thermometer, Snowflake, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface PostMeetingNoteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  investorName: string
}

export function PostMeetingNote({ open, onOpenChange, investorName }: PostMeetingNoteProps) {
  const [rating, setRating] = useState<"hot" | "warm" | "cold" | null>(null)
  const [notes, setNotes] = useState("")
  const [followUpTask, setFollowUpTask] = useState("")
  const [followUpDate, setFollowUpDate] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true)
      toast.info("Voice recording started...")
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false)
        setNotes(notes + "\n[Voice note: Meeting went well, discussed term sheet details...]")
        toast.success("Voice note added")
      }, 3000)
    }
  }

  const handleSave = () => {
    if (!rating) {
      toast.error("Please select a meeting rating")
      return
    }
    toast.success("Meeting notes saved!")
    onOpenChange(false)
  }

  const getRatingButton = (type: "hot" | "warm" | "cold", icon: any, label: string, color: string) => {
    const Icon = icon
    return (
      <button
        onClick={() => setRating(type)}
        className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
          rating === type
            ? `${color} border-current`
            : "border-border bg-background hover:bg-muted"
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className="text-sm font-medium">{label}</span>
      </button>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle>Meeting with {investorName}</SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Meeting Rating</Label>
              <div className="grid grid-cols-3 gap-3">
                {getRatingButton("hot", Flame, "Hot", "bg-red-50 text-red-600 border-red-600")}
                {getRatingButton("warm", Thermometer, "Warm", "bg-amber-50 text-amber-600 border-amber-600")}
                {getRatingButton("cold", Snowflake, "Cold", "bg-blue-50 text-blue-600 border-blue-600")}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Notes</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={isRecording}
                  className="gap-2 bg-transparent"
                >
                  <Mic className={`w-4 h-4 ${isRecording ? "text-red-500 animate-pulse" : ""}`} />
                  {isRecording ? "Recording..." : "Voice Note"}
                </Button>
              </div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you discuss? Any concerns? Next steps?"
                className="min-h-[150px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Capture key takeaways, concerns raised, and commitments made
              </p>
            </div>

            {/* Follow-up Task */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Create Follow-up Task
              </Label>
              <Input
                value={followUpTask}
                onChange={(e) => setFollowUpTask(e.target.value)}
                placeholder="e.g., Send updated financial model"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Due Date</Label>
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Priority</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t bg-background">
            <Button className="w-full" size="lg" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Meeting Notes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
