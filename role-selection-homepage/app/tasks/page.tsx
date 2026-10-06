"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Edit,
  Filter,
  Flag,
  Home,
  MoreHorizontal,
  Plus,
  Search,
  SortAsc,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"

interface Task {
  id: string
  title: string
  description?: string
  relatedTo?: {
    type: "startup" | "investor"
    name: string
    avatar?: string
  }
  assignedTo: {
    name: string
    avatar?: string
  }
  dueDate: string
  dueTime?: string
  priority: "high" | "medium" | "low"
  tags: string[]
  completed: boolean
  status: "todo" | "in-progress" | "blocked"
}

const allTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with FinApp founders",
    description: "Discuss their Q4 metrics and funding timeline",
    relatedTo: { type: "startup", name: "FinApp Inc" },
    assignedTo: { name: "You" },
    dueDate: "Today",
    dueTime: "2:00 PM",
    priority: "high",
    tags: ["Follow-up", "Urgent"],
    completed: false,
    status: "todo",
  },
  {
    id: "2",
    title: "Review CloudAI financials for DD",
    description: "Complete financial due diligence review",
    relatedTo: { type: "startup", name: "CloudAI Systems" },
    assignedTo: { name: "You" },
    dueDate: "Today",
    dueTime: "4:00 PM",
    priority: "high",
    tags: ["Due Diligence", "Financials"],
    completed: false,
    status: "in-progress",
  },
  {
    id: "3",
    title: "Send investor update to ABC Fund",
    description: "Monthly portfolio update email",
    relatedTo: { type: "investor", name: "ABC Fund" },
    assignedTo: { name: "You" },
    dueDate: "Today",
    dueTime: "5:00 PM",
    priority: "medium",
    tags: ["Outreach"],
    completed: false,
    status: "todo",
  },
  {
    id: "4",
    title: "Schedule call with Sequoia Capital",
    description: "Intro call for TechCorp investment",
    relatedTo: { type: "investor", name: "Sequoia Capital" },
    assignedTo: { name: "You" },
    dueDate: "Tomorrow",
    dueTime: "10:00 AM",
    priority: "medium",
    tags: ["Outreach", "Investor"],
    completed: false,
    status: "todo",
  },
  {
    id: "5",
    title: "Prepare weekly pipeline report",
    description: "Compile data for Monday standup",
    relatedTo: undefined,
    assignedTo: { name: "You" },
    dueDate: "Jan 27, 2026",
    priority: "medium",
    tags: ["Reporting"],
    completed: false,
    status: "todo",
  },
  {
    id: "6",
    title: "Send intro email to TechCorp founders",
    description: "Warm introduction from mutual contact",
    relatedTo: { type: "startup", name: "TechCorp AI" },
    assignedTo: { name: "You" },
    dueDate: "Jan 27, 2026",
    priority: "low",
    tags: ["Outreach"],
    completed: false,
    status: "todo",
  },
  {
    id: "7",
    title: "Update due diligence checklist",
    description: "Add regulatory compliance items",
    relatedTo: undefined,
    assignedTo: { name: "You" },
    dueDate: "Jan 28, 2026",
    priority: "medium",
    tags: ["Documentation"],
    completed: false,
    status: "todo",
  },
  {
    id: "8",
    title: "Review term sheet draft",
    description: "Legal review of Series A terms",
    relatedTo: { type: "startup", name: "HealthBridge" },
    assignedTo: { name: "You" },
    dueDate: "Jan 28, 2026",
    priority: "high",
    tags: ["Legal", "Due Diligence"],
    completed: false,
    status: "todo",
  },
  {
    id: "9",
    title: "Send NDA to HealthBridge",
    description: "Standard NDA for data room access",
    relatedTo: { type: "startup", name: "HealthBridge" },
    assignedTo: { name: "You" },
    dueDate: "Jan 20, 2026",
    priority: "high",
    tags: ["Legal", "Document"],
    completed: false,
    status: "blocked",
  },
  // Completed tasks
  {
    id: "10",
    title: "Initial screening call with EduTech",
    relatedTo: { type: "startup", name: "EduTech Pro" },
    assignedTo: { name: "You" },
    dueDate: "Jan 18, 2026",
    priority: "medium",
    tags: ["Screening"],
    completed: true,
    status: "todo",
  },
  {
    id: "11",
    title: "Update investor CRM records",
    assignedTo: { name: "You" },
    dueDate: "Jan 17, 2026",
    priority: "low",
    tags: ["Admin"],
    completed: true,
    status: "todo",
  },
  {
    id: "12",
    title: "Send intro deck to GreenFund",
    relatedTo: { type: "investor", name: "GreenFund Partners" },
    assignedTo: { name: "You" },
    dueDate: "Jan 16, 2026",
    priority: "medium",
    tags: ["Outreach"],
    completed: true,
    status: "todo",
  },
]

const priorityConfig = {
  high: { 
    label: "High", 
    dotColor: "bg-red-500", 
    badgeClass: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-800" 
  },
  medium: { 
    label: "Medium", 
    dotColor: "bg-amber-500", 
    badgeClass: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950 dark:border-amber-800" 
  },
  low: { 
    label: "Low", 
    dotColor: "bg-green-500", 
    badgeClass: "text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950 dark:border-green-800" 
  },
}

const taskTemplates = [
  { name: "Founder Follow-up", icon: User },
  { name: "Document Review", icon: Flag },
  { name: "Investor Outreach", icon: User },
  { name: "Due Diligence Checklist", icon: CheckCircle2 },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(allTasks)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("due-date")
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [changePriorityOpen, setChangePriorityOpen] = useState(false)
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium")
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [newDueDate, setNewDueDate] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Task action handlers
  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter((task) => task.id !== selectedTask.id))
      setDeleteConfirmOpen(false)
      setSelectedTask(null)
    }
  }

  const handleCreateTask = (newTaskData: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
    dueDate: string
    assignedTo: string
  }) => {
    const newTask: Task = {
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      title: newTaskData.title,
      description: newTaskData.description,
      status: "todo",
      priority: newTaskData.priority,
      dueDate: newTaskData.dueDate,
      completed: false,
      assignedTo: {
        name: newTaskData.assignedTo === "you" ? "You" : newTaskData.assignedTo,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + newTaskData.assignedTo,
      },
      tags: [],
    }
    setTasks([...tasks, newTask])
  }

  const handleChangePriority = () => {
    if (selectedTask) {
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? { ...task, priority: newPriority } : task)))
      setChangePriorityOpen(false)
      setNewPriority(selectedTask.priority)
    }
  }

  const handleRescheduleTask = () => {
    if (selectedTask && newDueDate) {
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? { ...task, dueDate: newDueDate } : task)))
      setRescheduleOpen(false)
      setNewDueDate("")
    }
  }

  // Filter tasks
  const today = new Date()
  const isToday = (dateStr: string) => dateStr === "Today" || dateStr.includes("Today")
  const isOverdue = (task: Task) => {
    if (task.completed) return false
    if (task.dueDate === "Today" || task.dueDate === "Tomorrow") return false
    const dateMatch = task.dueDate.match(/Jan (\d+)/)
    if (dateMatch) {
      const day = parseInt(dateMatch[1])
      return day < 24 // Assuming today is Jan 24
    }
    return false
  }
  const isThisWeek = (dateStr: string) => {
    if (dateStr === "Today" || dateStr === "Tomorrow") return true
    const dateMatch = dateStr.match(/Jan (\d+)/)
    if (dateMatch) {
      const day = parseInt(dateMatch[1])
      return day >= 24 && day <= 30
    }
    return false
  }

  const dueTodayTasks = tasks.filter((t) => !t.completed && isToday(t.dueDate))
  const thisWeekTasks = tasks.filter((t) => !t.completed && isThisWeek(t.dueDate))
  const overdueTasks = tasks.filter((t) => isOverdue(t))
  const completedTasks = tasks.filter((t) => t.completed)
  const incompleteTasks = tasks.filter((t) => !t.completed)

  const getFilteredTasks = () => {
    let filtered = tasks

    // Tab filter
    switch (activeTab) {
      case "today":
        filtered = dueTodayTasks
        break
      case "week":
        filtered = thisWeekTasks
        break
      case "overdue":
        filtered = overdueTasks
        break
      case "completed":
        filtered = completedTasks
        break
      default:
        filtered = tasks
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((t) => selectedPriorities.includes(t.priority))
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((t) => selectedStatuses.includes(t.status))
    }

    // Sort
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        filtered = [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        break
      case "created":
        filtered = [...filtered].reverse()
        break
      default:
        // due-date is default
        break
    }

    return filtered
  }

  const filteredTasks = getFilteredTasks()

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  }

  const getDueDateBadgeClass = (task: Task) => {
    if (task.completed) return "bg-muted text-muted-foreground"
    if (isOverdue(task)) return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    if (task.dueDate === "Today") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    if (task.dueDate === "Tomorrow") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="My Tasks" />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/role-selection" className="hover:text-foreground flex items-center gap-1">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">My Tasks</span>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-[30px] font-semibold text-foreground">My Tasks</h1>
                <p className="text-muted-foreground mt-1">Manage your tasks and stay on top of your workflow</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Priority Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Flag className="w-4 h-4" />
                      <span className="hidden sm:inline">Priority</span>
                      {selectedPriorities.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{selectedPriorities.length}</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="p-2 space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Filter by Priority</Label>
                      <div className="space-y-2">
                        {["high", "medium", "low"].map((priority) => (
                          <div key={priority} className="flex items-center gap-2">
                            <Checkbox
                              id={`priority-${priority}`}
                              checked={selectedPriorities.includes(priority)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPriorities([...selectedPriorities, priority])
                                } else {
                                  setSelectedPriorities(selectedPriorities.filter((p) => p !== priority))
                                }
                              }}
                            />
                            <Label htmlFor={`priority-${priority}`} className="capitalize cursor-pointer text-sm">
                              {priority}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedPriorities.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setSelectedPriorities([])}
                          >
                            Clear
                          </Button>
                        </>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">Status</span>
                      {selectedStatuses.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{selectedStatuses.length}</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="p-2 space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Filter by Status</Label>
                      <div className="space-y-2">
                        {["todo", "in-progress", "blocked"].map((status) => (
                          <div key={status} className="flex items-center gap-2">
                            <Checkbox
                              id={`status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedStatuses([...selectedStatuses, status])
                                } else {
                                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                                }
                              }}
                            />
                            <Label htmlFor={`status-${status}`} className="capitalize cursor-pointer text-sm">
                              {status.replace("-", " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedStatuses.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setSelectedStatuses([])}
                          >
                            Clear
                          </Button>
                        </>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <SortAsc className="w-4 h-4" />
                      <span className="hidden sm:inline">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setSortBy("due-date")} className={sortBy === "due-date" ? "bg-muted" : ""}>
                      <Check className="w-4 h-4 mr-2" style={{ visibility: sortBy === "due-date" ? "visible" : "hidden" }} />
                      Due date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("priority")} className={sortBy === "priority" ? "bg-muted" : ""}>
                      <Check className="w-4 h-4 mr-2" style={{ visibility: sortBy === "priority" ? "visible" : "hidden" }} />
                      Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("created")} className={sortBy === "created" ? "bg-muted" : ""}>
                      <Check className="w-4 h-4 mr-2" style={{ visibility: sortBy === "created" ? "visible" : "hidden" }} />
                      Created date
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => setNewTaskOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Task</span>
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{dueTodayTasks.length}</p>
                      <p className="text-xs text-muted-foreground">Due Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{thisWeekTasks.length}</p>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{overdueTasks.length}</p>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{completedTasks.length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              {/* Task List */}
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="all" className="gap-1">
                      All
                      <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">{tasks.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="today" className="gap-1">
                      Due Today
                      <span className="ml-1 text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded">
                        {dueTodayTasks.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="week" className="gap-1">
                      This Week
                      <span className="ml-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded">
                        {thisWeekTasks.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="gap-1">
                      Overdue
                      <span className="ml-1 text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded">
                        {overdueTasks.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-1">
                      Completed
                      <span className="ml-1 text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 px-1.5 py-0.5 rounded">
                        {completedTasks.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-4">
                    <Card>
                      <CardContent className="p-0">
                        {filteredTasks.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              Create your first task to get started
                            </p>
                            <Button onClick={() => setNewTaskOpen(true)} className="gap-2">
                              <Plus className="w-4 h-4" />
                              Create Task
                            </Button>
                          </div>
                        ) : (
                          <div className="divide-y divide-border">
                            {filteredTasks.map((task) => (
                              <div
                                key={task.id}
                                className={cn(
                                  "group flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors",
                                  isOverdue(task) && "border-l-2 border-l-red-500"
                                )}
                              >
                                <button
                                  onClick={() => toggleTaskComplete(task.id)}
                                  className="mt-1 shrink-0"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                                  )}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h3
                                      className={cn(
                                        "text-sm font-medium text-foreground",
                                        task.completed && "line-through text-muted-foreground"
                                      )}
                                    >
                                      {task.title}
                                    </h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <div className={cn("w-2 h-2 rounded-full", priorityConfig[task.priority].dotColor)} />
                                      <Badge variant="outline" className={cn("text-xs", getDueDateBadgeClass(task))}>
                                        <Clock className="w-3 h-3 mr-1" />
                                        {task.dueDate}
                                        {task.dueTime && `, ${task.dueTime}`}
                                      </Badge>
                                    </div>
                                  </div>

                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                      {task.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-3 mt-2">
                                    {task.relatedTo && (
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                                          <span className="text-[10px] font-medium text-primary">
                                            {task.relatedTo.name.charAt(0)}
                                          </span>
                                        </div>
                                        <span>{task.relatedTo.name}</span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      <User className="w-3.5 h-3.5" />
                                      <span>{task.assignedTo.name}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {task.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  {/* Quick Actions */}
                                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 text-xs"
                                      onClick={() => {
                                        setSelectedTask(task)
                                        setViewDetailsOpen(true)
                                      }}
                                    >
                                      View Details
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 text-xs"
                                      onClick={() => {
                                        setSelectedTask(task)
                                        setEditTaskOpen(true)
                                      }}
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 text-xs text-destructive hover:text-destructive"
                                      onClick={() => {
                                        setSelectedTask(task)
                                        setDeleteConfirmOpen(true)
                                      }}
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                    {!task.completed && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-green-600 hover:text-green-600"
                                        onClick={() => toggleTaskComplete(task.id)}
                                      >
                                        <Check className="w-3 h-3 mr-1" />
                                        Mark Complete
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedTask(task)
                                      setViewDetailsOpen(true)
                                    }}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedTask(task)
                                      setEditTaskOpen(true)
                                    }}>
                                      Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedTask(task)
                                      setNewPriority(task.priority)
                                      setChangePriorityOpen(true)
                                    }}>
                                      Change Priority
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedTask(task)
                                      setNewDueDate(task.dueDate)
                                      setRescheduleOpen(true)
                                    }}>
                                      Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => {
                                        setSelectedTask(task)
                                        setDeleteConfirmOpen(true)
                                      }}
                                    >
                                      Delete Task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4 hidden lg:block">
                {/* Quick Filters */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Quick Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Priority</p>
                      <div className="space-y-2">
                        {(["high", "medium", "low"] as const).map((priority) => (
                          <label key={priority} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedPriorities.includes(priority)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPriorities([...selectedPriorities, priority])
                                } else {
                                  setSelectedPriorities(selectedPriorities.filter((p) => p !== priority))
                                }
                              }}
                            />
                            <div className={cn("w-2 h-2 rounded-full", priorityConfig[priority].dotColor)} />
                            <span className="text-sm">{priorityConfig[priority].label}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({incompleteTasks.filter((t) => t.priority === priority).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
                      <div className="space-y-2">
                        {[
                          { value: "todo", label: "To Do" },
                          { value: "in-progress", label: "In Progress" },
                          { value: "blocked", label: "Blocked" },
                        ].map((status) => (
                          <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedStatuses.includes(status.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedStatuses([...selectedStatuses, status.value])
                                } else {
                                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status.value))
                                }
                              }}
                            />
                            <span className="text-sm">{status.label}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({incompleteTasks.filter((t) => t.status === status.value).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Templates */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Task Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {taskTemplates.map((template) => (
                      <button
                        key={template.name}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setNewTaskOpen(true)}
                      >
                        <template.icon className="w-4 h-4" />
                        <span>{template.name}</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Task Modal */}
      <CreateTaskModal 
        open={newTaskOpen} 
        onOpenChange={setNewTaskOpen}
        onTaskCreate={handleCreateTask}
      />

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
              <p className="text-sm mt-2">{selectedTask?.description || "No description"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Priority</Label>
                <p className="text-sm mt-2 capitalize">{selectedTask?.priority}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
                <p className="text-sm mt-2 capitalize">{selectedTask?.status.replace("-", " ")}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Due Date</Label>
                <p className="text-sm mt-2">{selectedTask?.dueDate}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Assigned To</Label>
                <p className="text-sm mt-2">{selectedTask?.assignedTo.name}</p>
              </div>
            </div>
            <Button onClick={() => setViewDetailsOpen(false)} className="w-full">Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-title">Task Title</Label>
              <Input id="edit-title" placeholder="Enter task title..." defaultValue={selectedTask?.title} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" placeholder="Enter task description..." defaultValue={selectedTask?.description} className="mt-1.5 min-h-24" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setEditTaskOpen(false)
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Priority Dialog */}
      <Dialog open={changePriorityOpen} onOpenChange={setChangePriorityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Priority</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select new priority for <span className="font-medium">{selectedTask?.title}</span></p>
            <div className="space-y-3">
              {(["high", "medium", "low"] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setNewPriority(priority)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors",
                    newPriority === priority ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full", priorityConfig[priority].dotColor)} />
                  <span className="text-sm font-medium capitalize">{priority} Priority</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setChangePriorityOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleChangePriority} className="flex-1">
                Change Priority
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select new due date for <span className="font-medium">{selectedTask?.title}</span></p>
            <div>
              <Label htmlFor="reschedule-date">New Due Date</Label>
              <Input
                id="reschedule-date"
                type="text"
                placeholder="e.g., Today, Tomorrow, Jan 28"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setRescheduleOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleRescheduleTask} className="flex-1">
                Reschedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium">{selectedTask?.title}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleDeleteTask} variant="destructive" className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
