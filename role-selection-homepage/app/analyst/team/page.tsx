'use client'

import React from "react"

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  Settings,
  Plus,
  UserPlus,
  LayoutGrid,
  List,
  Building2,
  Calendar,
  Star,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'

// Mock data for Kanban board
const mockColumns = [
  { id: 'todo', title: 'TODO', icon: '📥', count: 5 },
  { id: 'inprogress', title: 'IN PROGRESS', icon: '🔄', count: 3 },
  { id: 'review', title: 'REVIEW', icon: '👁️', count: 2 },
  { id: 'done', title: 'DONE', icon: '✅', count: 8 },
]

const mockTasks = {
  todo: [
    {
      id: 1,
      title: 'DataMesh Research',
      company: 'DataMesh',
      assignee: 'AM',
      assigneeName: 'Arjun',
      dueDate: 'Jan 28',
      priority: 'medium',
    },
    {
      id: 2,
      title: 'GreenLeaf DD',
      company: 'GreenLeaf',
      assignee: 'SK',
      assigneeName: 'Sanjay',
      dueDate: 'Jan 30',
      priority: 'low',
    },
  ],
  inprogress: [
    {
      id: 3,
      title: 'TechCorp DD Report',
      company: 'TechCorp AI',
      assignee: 'AM',
      assigneeName: 'Arjun',
      dueDate: 'Today',
      progress: 80,
      priority: 'high',
    },
    {
      id: 4,
      title: 'HealthBridge Analysis',
      company: 'HealthBridge',
      assignee: 'RM',
      assigneeName: 'Rahul',
      dueDate: 'Jan 29',
      progress: 45,
      priority: 'medium',
    },
  ],
  review: [
    {
      id: 5,
      title: 'Fintech Market Analysis',
      company: 'Fintech Sector',
      assignee: 'SK',
      assigneeName: 'Sanjay',
      dueDate: 'Jan 27',
      priority: 'high',
    },
    {
      id: 6,
      title: 'GreenEnergy DD',
      company: 'GreenEnergy',
      assignee: 'PS',
      assigneeName: 'Priya',
      dueDate: 'Jan 26',
      priority: 'high',
    },
  ],
  done: [
    {
      id: 7,
      title: 'FinSecure Completed',
      company: 'FinSecure',
      completedDate: 'Jan 22',
      rating: 5,
    },
  ],
}

// Mock activity feed
const mockActivities = [
  {
    id: 1,
    user: 'AM Arjun',
    action: 'completed',
    target: 'TechCorp AI Financial Analysis',
    time: '5 min ago',
    status: 'success',
  },
  {
    id: 2,
    user: 'SK Sanjay',
    action: 'commented on',
    target: 'Fintech Market Analysis',
    time: '15 min ago',
    status: 'success',
  },
  {
    id: 3,
    user: 'PS Priya',
    action: 'requested review for',
    target: 'GreenEnergy DD',
    time: '1 hour ago',
    status: 'warning',
  },
  {
    id: 4,
    user: 'RM Rahul',
    action: 'uploaded new documents for',
    target: 'HealthBridge',
    time: '2 hours ago',
    status: 'success',
  },
]

// Mock team members
const mockTeamMembers = [
  {
    id: 1,
    initials: 'AM',
    name: 'Arjun Malhotra',
    role: 'Senior Analyst',
    status: 'online',
    tasksActive: 3,
    isYou: true,
  },
  {
    id: 2,
    initials: 'SK',
    name: 'Sanjay Kumar',
    role: 'Analyst',
    status: 'online',
    tasksActive: 2,
    isYou: false,
  },
  {
    id: 3,
    initials: 'PS',
    name: 'Priya Sharma',
    role: 'Partner',
    status: 'idle',
    tasksActive: 0,
    activity: 'Reviewing',
    isYou: false,
  },
  {
    id: 4,
    initials: 'RM',
    name: 'Rahul Mehta',
    role: 'Analyst',
    status: 'offline',
    tasksActive: 0,
    activity: 'Away',
    isYou: false,
  },
]

export default function TeamWorkspacePage() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [tasks, setTasks] = useState(mockTasks)
  const [draggedTask, setDraggedTask] = useState<any>(null)
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null)

  const handleDragStart = (task: any, columnId: string) => {
    setDraggedTask(task)
    setDraggedFrom(columnId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask || !draggedFrom) return

    // Remove task from source column
    const newTasks = { ...tasks }
    newTasks[draggedFrom] = newTasks[draggedFrom].filter((t) => t.id !== draggedTask.id)
    
    // Add task to target column
    newTasks[targetColumnId] = [...(newTasks[targetColumnId] || []), draggedTask]
    
    setTasks(newTasks)
    setDraggedTask(null)
    setDraggedFrom(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'idle':
        return 'bg-amber-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '🟢'
      case 'warning':
        return '🟡'
      default:
        return '🔵'
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Team Workspace" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                      <Users className="w-8 h-8 text-cyan-600" />
                      Team Workspace
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm text-muted-foreground">
                        Active Project: <span className="font-medium text-foreground">Q1 2026 Deal Flow Analysis</span>
                      </p>
                      <Badge variant="secondary" className="gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        4 members online
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      New Project
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <UserPlus className="w-4 h-4" />
                      Invite Member
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* Main Kanban Board */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-600" />
                      <CardTitle>Q1 2026 Deal Flow Analysis</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'board' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('board')}
                        className={viewMode === 'board' ? '' : 'bg-transparent'}
                      >
                        <LayoutGrid className="w-4 h-4 mr-1" />
                        Board
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? '' : 'bg-transparent'}
                      >
                        <List className="w-4 h-4 mr-1" />
                        List
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Board View */}
                    {viewMode === 'board' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mockColumns.map((column) => (
                          <div key={column.id} className="flex flex-col">
                            {/* Column Header */}
                            <div className="bg-muted/50 rounded-t-lg p-3 border border-b-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <span>{column.icon}</span>
                                  <span>{column.title}</span>
                                  <Badge variant="outline" className="ml-1 text-xs">
                                    {tasks[column.id]?.length || 0}
                                  </Badge>
                                </h3>
                              </div>
                            </div>

                            {/* Column Content */}
                            <div 
                              className="flex-1 bg-muted/20 rounded-b-lg p-3 border border-t-0 min-h-[400px] space-y-3"
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop(column.id)}
                            >
                              {tasks[column.id]?.map((task) => (
                                <Card
                                  key={task.id}
                                  draggable
                                  onDragStart={() => handleDragStart(task, column.id)}
                                  className="cursor-move hover:shadow-md transition-shadow border-l-4 border-l-cyan-500"
                                >
                                  <CardContent className="p-3 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-cyan-600" />
                                        <span className="text-xs font-semibold text-foreground">
                                          {task.company}
                                        </span>
                                      </div>
                                      {task.priority && (
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${getPriorityColor(task.priority)}`}
                                        >
                                          {task.priority}
                                        </Badge>
                                      )}
                                    </div>

                                    <h4 className="text-sm font-medium text-foreground">{task.title}</h4>

                                    {task.progress !== undefined && (
                                      <div className="space-y-1">
                                        <Progress value={task.progress} className="h-1.5" />
                                        <p className="text-xs text-muted-foreground text-right">
                                          {task.progress}%
                                        </p>
                                      </div>
                                    )}

                                    {task.rating && (
                                      <div className="flex items-center gap-1">
                                        {Array.from({ length: task.rating }).map((_, i) => (
                                          <Star
                                            key={i}
                                            className="w-3 h-3 fill-amber-400 text-amber-400"
                                          />
                                        ))}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-between pt-2 border-t">
                                      {task.assignee && (
                                        <div className="flex items-center gap-2">
                                          <Avatar className="w-6 h-6">
                                            <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">
                                              {task.assignee}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs text-muted-foreground">
                                            {task.assigneeName}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {task.dueDate === 'Today' ? (
                                            <span className="text-red-600 font-medium">Today</span>
                                          ) : (
                                            task.dueDate || task.completedDate
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            {/* Add Task Button */}
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-muted-foreground hover:text-foreground"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Task
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                      <div className="space-y-6">
                        {mockColumns.map((column) => (
                          <div key={column.id} className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b">
                              <span className="text-xl">{column.icon}</span>
                              <h3 className="text-base font-semibold text-foreground">
                                {column.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {tasks[column.id]?.length || 0}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {tasks[column.id]?.map((task) => (
                                <Card 
                                  key={task.id}
                                  className="hover:shadow-md transition-shadow"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                      <Building2 className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="text-sm font-semibold text-foreground">
                                            {task.company}
                                          </h4>
                                          {task.priority && (
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${getPriorityColor(task.priority)}`}
                                            >
                                              {task.priority}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {task.title}
                                        </p>
                                        {task.progress !== undefined && (
                                          <div className="flex items-center gap-2 mt-2">
                                            <Progress value={task.progress} className="h-1.5 flex-1 max-w-[200px]" />
                                            <span className="text-xs text-muted-foreground">
                                              {task.progress}%
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 flex-shrink-0">
                                        {task.assignee && (
                                          <div className="flex items-center gap-2">
                                            <Avatar className="w-7 h-7">
                                              <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">
                                                {task.assignee}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-muted-foreground">
                                              {task.assigneeName}
                                            </span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-[90px]">
                                          <Calendar className="w-4 h-4" />
                                          <span>
                                            {task.dueDate === 'Today' ? (
                                              <span className="text-red-600 font-medium">Today</span>
                                            ) : (
                                              task.dueDate || task.completedDate
                                            )}
                                          </span>
                                        </div>
                                        {task.rating && (
                                          <div className="flex items-center gap-0.5">
                                            {Array.from({ length: task.rating }).map((_, i) => (
                                              <Star
                                                key={i}
                                                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                                              />
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                              {(!tasks[column.id] || tasks[column.id].length === 0) && (
                                <p className="text-sm text-muted-foreground italic py-4 text-center">
                                  No tasks in this column
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Bottom Section: Activity Feed + Team Members */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Team Activity Feed */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-cyan-600" />
                        Team Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-lg">{getActivityIcon(activity.status)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground">
                                <span className="font-medium">{activity.user}</span>{' '}
                                <span className="text-muted-foreground">{activity.action}</span>{' '}
                                <span className="font-medium">&quot;{activity.target}&quot;</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="link" className="w-full mt-4">
                        View All Activity
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Team Members Panel */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-600" />
                        Team Members
                        <Badge variant="outline" className="ml-1">
                          4
                        </Badge>
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockTeamMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">
                                  {member.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                                  member.status
                                )}`}
                              ></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {member.name}
                                  {member.isYou && (
                                    <span className="text-xs text-muted-foreground ml-1">(You)</span>
                                  )}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {member.tasksActive > 0 ? (
                                  <span>
                                    {member.tasksActive} task{member.tasksActive > 1 ? 's' : ''} active
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">{member.activity}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
