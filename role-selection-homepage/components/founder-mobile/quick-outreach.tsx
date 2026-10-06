"use client"

import { useState } from "react"
import { Send, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface QuickOutreachProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  investorName: string
}

const emailTemplates = {
  cold: "Hi [Name],\n\nI'm reaching out because I noticed your investment in [Similar Company]. We're building [Your Company] to solve [Problem].\n\nWould love to share our deck and see if there's a potential fit.\n\nBest,\n[Your Name]",
  intro: "Hi [Name],\n\n[Mutual Connection] suggested I reach out. We're raising [Amount] to [Goal].\n\nI'd love to send over our materials and schedule a brief call.\n\nBest,\n[Your Name]",
  followup: "Hi [Name],\n\nFollowing up on my previous email. Would you be open to a quick call to discuss [Your Company]?\n\nHappy to work around your schedule.\n\nBest,\n[Your Name]",
}

export function QuickOutreach({ open, onOpenChange, investorName }: QuickOutreachProps) {
  const [template, setTemplate] = useState<string>("cold")
  const [message, setMessage] = useState(emailTemplates.cold)
  const [attachDeck, setAttachDeck] = useState(false)

  const handleTemplateChange = (value: string) => {
    setTemplate(value)
    setMessage(emailTemplates[value as keyof typeof emailTemplates])
  }

  const handleSend = () => {
    toast.success("Email sent to " + investorName)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle>Send to {investorName}</SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Template Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Template</label>
              <Select value={template} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold Outreach</SelectItem>
                  <SelectItem value="intro">Warm Introduction</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[280px] resize-none text-base"
                placeholder="Type your message..."
              />
              <p className="text-xs text-muted-foreground">{message.length} characters</p>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments</label>
              <div className="flex items-center gap-2">
                <Button
                  variant={attachDeck ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAttachDeck(!attachDeck)}
                  className="gap-2"
                >
                  <Paperclip className="w-4 h-4" />
                  Pitch Deck
                </Button>
                {attachDeck && (
                  <Badge variant="secondary" className="gap-1">
                    pitch-deck-v3.pdf
                    <button onClick={() => setAttachDeck(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t bg-background">
            <Button className="w-full" size="lg" onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
