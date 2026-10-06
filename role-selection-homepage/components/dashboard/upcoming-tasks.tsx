"use client"

import { useState } from "react"
import { Plus, Circle, CheckCircle2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import { cn } from "@/lib/utils"

interface Task {
  id: number
  title: string
  dueDate: string
  dueTime?: string
  completed: boolean
  overdue?: boolean
}

const tasksByTab: Record<string, Task[]> = {
  today: [
    { id: 1, title: "Follow up with FinApp founders", dueDate: "Today", dueTime: "2pm", completed: false },
    { id: 2, title: "Review CloudAI financials", dueDate: "Today", dueTime: "4pm", completed: false },
    { id: 3, title: "Send investor update to ABC Fund", dueDate: "Today", dueTime: "5pm", completed: false },
  ],
  week: [
    { id: 4, title: "Follow up with FinApp founders", dueDate: "Today", dueTime: "2pm", completed: false },
    { id: 5, title: "Review CloudAI financials", dueDate: "Tomorrow", completed: false },
    { id: 6, title: "Schedule call with investor XYZ", dueDate: "Jan 25", completed: false },
    { id: 7, title: "Prepare weekly pipeline report", dueDate: "Jan 26", completed: false },
    { id: 8, title: "Send intro to TechCorp founders", dueDate: "Jan 26", completed: false },
    { id: 9, title: "Update due diligence checklist", dueDate: "Jan 27", completed: false },
    { id: 10, title: "Review term sheet draft", dueDate: "Jan 27", completed: false },
    { id: 11, title: "Complete investor CRM updates", dueDate: "Jan 28", completed: false },
  ],
  overdue: [
    { id: 12, title: "Send NDA to HealthBridge", dueDate: "Jan 20", completed: false, overdue: true },
  ],
}

const tabs = [
  { id: "today", label: "Due Today", count: 3 },
  { id: "week", label: "This Week", count: 8 },
  { id: "overdue", label: "Overdue", count: 1 },
]

export function UpcomingTasks() {
  const [activeTab, setActiveTab] = useState("today")
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const tasks = tasksByTab[activeTab]

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-card-foreground">My Tasks</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-primary h-8"
          onClick={() => setCreateTaskOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-card-foreground"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "ml-1 px-1.5 py-0.5 rounded text-xs",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : tab.id === "overdue"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer",
              task.overdue && "bg-red-500/5"
            )}
          >
            <button className="mt-0.5">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium text-card-foreground",
                  task.completed && "line-through opacity-50"
                )}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span className={cn(task.overdue && "text-red-500")}>
                  Due: {task.dueDate}
                  {task.dueTime && `, ${task.dueTime}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </div>
  )
}
