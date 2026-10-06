"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreate?: (task: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
    dueDate: string
    assignedTo: string
  }) => void
}

const priorityConfig = {
  high: { 
    label: "High", 
    dotColor: "bg-red-500",
  },
  medium: { 
    label: "Medium", 
    dotColor: "bg-amber-500",
  },
  low: { 
    label: "Low", 
    dotColor: "bg-green-500",
  },
}

export function CreateTaskModal({ open, onOpenChange, onTaskCreate }: CreateTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [relatedTo, setRelatedTo] = useState("")
  const [assignTo, setAssignTo] = useState("you")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [tags, setTags] = useState("")

  const handleCreate = () => {
    if (!taskTitle.trim()) {
      return
    }

    // Combine date and time if both are provided
    const fullDueDate = dueDate && dueTime ? `${dueDate} ${dueTime}` : dueDate || "Today"

    // Call the callback to add task to the list
    if (onTaskCreate) {
      onTaskCreate({
        title: taskTitle,
        description: taskDescription,
        priority,
        dueDate: fullDueDate,
        assignedTo: assignTo,
      })
    }

    // Reset form and close modal
    setTaskTitle("")
    setTaskDescription("")
    setRelatedTo("")
    setAssignTo("you")
    setDueDate("")
    setDueTime("")
    setPriority("medium")
    setTags("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="task-title">Task Title</Label>
            <Input 
              id="task-title" 
              placeholder="Enter task title..." 
              className="mt-1.5"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Add details about this task..."
              className="mt-1.5 min-h-[100px]"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Related to</Label>
              <Select value={relatedTo} onValueChange={setRelatedTo}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select startup or investor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finapp">FinApp Inc</SelectItem>
                  <SelectItem value="cloudai">CloudAI Systems</SelectItem>
                  <SelectItem value="healthbridge">HealthBridge</SelectItem>
                  <SelectItem value="sequoia">Sequoia Capital</SelectItem>
                  <SelectItem value="abc">ABC Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assign to</Label>
              <Select value={assignTo} onValueChange={setAssignTo}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="you">You</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="sarah">Sarah Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date</Label>
              <Input 
                type="date" 
                className="mt-1.5"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Due Time</Label>
              <Input 
                type="time" 
                className="mt-1.5"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Priority</Label>
            <div className="flex items-center gap-4 mt-2">
              {(["high", "medium", "low"] as const).map((p) => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="priority" 
                    value={p} 
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                    className="sr-only peer" 
                  />
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors peer-checked:border-primary peer-checked:bg-primary/5",
                      "hover:bg-muted"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", priorityConfig[p].dotColor)} />
                    <span className="text-sm">{priorityConfig[p].label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="task-tags">Tags</Label>
            <Select value={tags} onValueChange={setTags}>
              <SelectTrigger className="mt-1.5" id="task-tags">
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="due-diligence">Due Diligence</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!taskTitle.trim()}
            >
              Create Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
