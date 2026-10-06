"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const QUICK_REASONS = [
  "Not my sector",
  "Check size too large",
  "Timing not right",
  "Already invested in similar",
  "Other",
]

interface PassReasonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dealName: string
  onPass: (reason: string, note?: string) => void
}

export function PassReasonModal({
  open,
  onOpenChange,
  dealName,
  onPass,
}: PassReasonModalProps) {
  const [selectedReason, setSelectedReason] = React.useState<string>("")
  const [note, setNote] = React.useState("")

  const handleSubmit = () => {
    onPass(selectedReason || "Other", note || undefined)
    setSelectedReason("")
    setNote("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pass on deal</DialogTitle>
          <DialogDescription>
            Why are you passing on {dealName}? (Optional)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Quick select</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    selectedReason === reason
                      ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "border-border bg-muted/50 hover:bg-muted"
                  )}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass-note">Note (optional)</Label>
            <Textarea
              id="pass-note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Pass</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
