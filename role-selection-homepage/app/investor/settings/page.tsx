"use client"

import React from "react"

import { useState } from "react"
import {
  Users,
  Shield,
  Bell,
  Plug,
  Target,
  Inbox,
  Plus,
  MoreHorizontal,
  Search,
  Mail,
  Check,
  X,
  ChevronRight,
  Edit,
  Trash2,
  UserPlus,
  Calendar,
  RefreshCw,
  ExternalLink,
  Clock,
  Save,
  Copy,
  Sliders,
  Archive,
  Zap,
  FileText,
  BarChart3,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Types
type SettingsTab = "criteria" | "dealflow" | "notifications" | "team" | "integrations"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "partner" | "associate" | "analyst"
  permissions: string[]
  lastActive: string
  avatar?: string
}

interface CriteriaPreset {
  id: string
  name: string
  description: string
  isDefault: boolean
  sectors: string[]
  stages: string[]
  checkSize: { min: number; max: number }
}

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  connected: boolean
  lastSync?: string
}

// Sample data
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@sequoiacap.com",
    role: "admin",
    permissions: ["all"],
    lastActive: "Just now",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Michael Roberts",
    email: "michael@sequoiacap.com",
    role: "partner",
    permissions: ["view_deals", "manage_pipeline", "approve_investments"],
    lastActive: "2 hours ago",
  },
  {
    id: "3",
    name: "Emily Zhang",
    email: "emily@sequoiacap.com",
    role: "associate",
    permissions: ["view_deals", "manage_pipeline"],
    lastActive: "1 day ago",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@sequoiacap.com",
    role: "analyst",
    permissions: ["view_deals"],
    lastActive: "3 days ago",
  },
]

const criteriaPresets: CriteriaPreset[] = [
  {
    id: "1",
    name: "Default Criteria",
    description: "Standard investment criteria for all deal flow",
    isDefault: true,
    sectors: ["SaaS", "FinTech", "AI/ML"],
    stages: ["Seed", "Series A"],
    checkSize: { min: 500000, max: 5000000 },
  },
  {
    id: "2",
    name: "Growth Stage Focus",
    description: "For Series B+ opportunities",
    isDefault: false,
    sectors: ["Enterprise SaaS", "Infrastructure"],
    stages: ["Series B", "Series C"],
    checkSize: { min: 5000000, max: 25000000 },
  },
  {
    id: "3",
    name: "Deep Tech",
    description: "AI/ML and technical infrastructure plays",
    isDefault: false,
    sectors: ["AI/ML", "Developer Tools", "Infrastructure"],
    stages: ["Seed", "Series A"],
    checkSize: { min: 1000000, max: 10000000 },
  },
]

const integrations: Integration[] = [
  {
    id: "1",
    name: "Google Calendar",
    description: "Sync meetings and schedule investor calls",
    icon: <Calendar className="w-5 h-5" />,
    connected: true,
    lastSync: "5 mins ago",
  },
  {
    id: "2",
    name: "Outlook Calendar",
    description: "Microsoft calendar integration",
    icon: <Calendar className="w-5 h-5" />,
    connected: false,
  },
  {
    id: "3",
    name: "Gmail",
    description: "Email tracking and founder communication",
    icon: <Mail className="w-5 h-5" />,
    connected: true,
    lastSync: "2 mins ago",
  },
  {
    id: "4",
    name: "Carta",
    description: "LP reporting and cap table management",
    icon: <FileText className="w-5 h-5" />,
    connected: true,
    lastSync: "1 hour ago",
  },
  {
    id: "5",
    name: "Affinity",
    description: "CRM and relationship intelligence",
    icon: <Users className="w-5 h-5" />,
    connected: false,
  },
  {
    id: "6",
    name: "PitchBook",
    description: "Market data and deal sourcing",
    icon: <BarChart3 className="w-5 h-5" />,
    connected: true,
    lastSync: "30 mins ago",
  },
]

const settingsTabs = [
  { id: "criteria" as SettingsTab, label: "Investment Criteria", icon: Target },
  { id: "dealflow" as SettingsTab, label: "Deal Flow Preferences", icon: Inbox },
  { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
  { id: "team" as SettingsTab, label: "Team Settings", icon: Users },
  { id: "integrations" as SettingsTab, label: "Integrations", icon: Plug },
]

export default function InvestorSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("criteria")
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [presetModalOpen, setPresetModalOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<CriteriaPreset | null>(null)
  
  // Deal flow preferences state
  const [sourcePreferences, setSourcePreferences] = useState({
    directOutreach: true,
    referrals: true,
    platformMatches: true,
    coldInbound: false,
  })
  const [autoArchiveDays, setAutoArchiveDays] = useState(30)
  const [matchScoreThreshold, setMatchScoreThreshold] = useState([70])
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    newMatchAlerts: true,
    highMatchAlerts: true,
    portfolioUpdates: true,
    monthlyReports: true,
    meetingReminders: true,
    meetingReminderTime: "30",
    teamActivity: false,
    digestFrequency: "daily",
  })

  const handleSave = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Settings" />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex gap-6">
              {/* Settings Navigation */}
              <div className="w-64 shrink-0">
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Settings Content */}
              <div className="flex-1 max-w-4xl">
                {/* Investment Criteria Tab */}
                {activeTab === "criteria" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">Investment Criteria</h2>
                        <p className="text-sm text-muted-foreground">
                          Manage your investment criteria and create presets for different strategies
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="bg-transparent" onClick={() => window.location.href = "/criteria"}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Full Criteria
                        </Button>
                        <Button onClick={() => { setEditingPreset(null); setPresetModalOpen(true) }}>
                          <Plus className="w-4 h-4 mr-2" />
                          New Preset
                        </Button>
                      </div>
                    </div>

                    {/* Criteria Presets */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Criteria Presets</CardTitle>
                        <CardDescription>
                          Save different criteria configurations for various investment strategies
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {criteriaPresets.map((preset) => (
                            <div
                              key={preset.id}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-lg border",
                                preset.isDefault && "border-primary bg-primary/5"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                  <Sliders className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{preset.name}</span>
                                    {preset.isDefault && (
                                      <Badge variant="secondary" className="text-xs">Default</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {preset.sectors.join(", ")}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {preset.stages.join(", ")}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      ${(preset.checkSize.min / 1000000).toFixed(1)}M - ${(preset.checkSize.max / 1000000).toFixed(1)}M
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {!preset.isDefault && (
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    Set as Default
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => { setEditingPreset(preset); setPresetModalOpen(true) }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Copy className="w-4 h-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Edit Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Current Active Criteria</CardTitle>
                        <CardDescription>
                          Quick summary of your default investment criteria
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Target Sectors</p>
                            <div className="flex flex-wrap gap-1">
                              {["SaaS", "FinTech", "AI/ML"].map((sector) => (
                                <Badge key={sector} variant="secondary" className="text-xs">{sector}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Target Stages</p>
                            <div className="flex flex-wrap gap-1">
                              {["Seed", "Series A"].map((stage) => (
                                <Badge key={stage} variant="secondary" className="text-xs">{stage}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Check Size Range</p>
                            <p className="font-medium">$500K - $5M</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Deal Flow Preferences Tab */}
                {activeTab === "dealflow" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold">Deal Flow Preferences</h2>
                      <p className="text-sm text-muted-foreground">
                        Configure how deals are sourced, filtered, and managed
                      </p>
                    </div>

                    {/* Source Preferences */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Source Preferences</CardTitle>
                        <CardDescription>
                          Choose which deal sources to prioritize in your pipeline
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Direct Founder Outreach</p>
                              <p className="text-sm text-muted-foreground">
                                Deals from founders who reach out directly
                              </p>
                            </div>
                            <Switch
                              checked={sourcePreferences.directOutreach}
                              onCheckedChange={(checked) =>
                                setSourcePreferences({ ...sourcePreferences, directOutreach: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Network Referrals</p>
                              <p className="text-sm text-muted-foreground">
                                Deals referred by your network and portfolio
                              </p>
                            </div>
                            <Switch
                              checked={sourcePreferences.referrals}
                              onCheckedChange={(checked) =>
                                setSourcePreferences({ ...sourcePreferences, referrals: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Platform Matches</p>
                              <p className="text-sm text-muted-foreground">
                                AI-matched deals based on your criteria
                              </p>
                            </div>
                            <Switch
                              checked={sourcePreferences.platformMatches}
                              onCheckedChange={(checked) =>
                                setSourcePreferences({ ...sourcePreferences, platformMatches: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Cold Inbound</p>
                              <p className="text-sm text-muted-foreground">
                                Unsolicited deal submissions
                              </p>
                            </div>
                            <Switch
                              checked={sourcePreferences.coldInbound}
                              onCheckedChange={(checked) =>
                                setSourcePreferences({ ...sourcePreferences, coldInbound: checked })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Auto-Archive Rules */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Auto-Archive Rules</CardTitle>
                        <CardDescription>
                          Automatically archive deals that haven&apos;t been actioned
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Archive inactive deals after</p>
                              <p className="text-sm text-muted-foreground">
                                Deals with no activity will be auto-archived
                              </p>
                            </div>
                            <Select
                              value={autoArchiveDays.toString()}
                              onValueChange={(value) => setAutoArchiveDays(Number.parseInt(value))}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="14">14 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="0">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                            <Archive className="w-5 h-5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Currently <span className="font-medium text-foreground">12 deals</span> will be auto-archived in the next 7 days
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Match Score Threshold */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Match Score Thresholds</CardTitle>
                        <CardDescription>
                          Set minimum match scores for deal visibility
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Minimum match score for inbox</Label>
                              <span className="text-sm font-medium">{matchScoreThreshold[0]}%</span>
                            </div>
                            <Slider
                              value={matchScoreThreshold}
                              onValueChange={setMatchScoreThreshold}
                              max={100}
                              min={0}
                              step={5}
                              className="w-full"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              Deals below this score will be hidden from your main inbox
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">85%+</div>
                              <p className="text-xs text-muted-foreground">High Priority</p>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">70-84%</div>
                              <p className="text-xs text-muted-foreground">Review</p>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-muted-foreground">&lt;70%</div>
                              <p className="text-xs text-muted-foreground">Auto-filtered</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold">Notification Settings</h2>
                      <p className="text-sm text-muted-foreground">
                        Configure how and when you receive alerts
                      </p>
                    </div>

                    {/* Match Alerts */}
                    <Card>
                      <CardHeader>
                        <CardTitle>New Match Alerts</CardTitle>
                        <CardDescription>
                          Get notified when new deals match your criteria
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">All new matches</p>
                              <p className="text-sm text-muted-foreground">
                                Receive alerts for every new matching deal
                              </p>
                            </div>
                            <Switch
                              checked={notifications.newMatchAlerts}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, newMatchAlerts: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">High-score matches only (85%+)</p>
                              <p className="text-sm text-muted-foreground">
                                Only notify for exceptional matches
                              </p>
                            </div>
                            <Switch
                              checked={notifications.highMatchAlerts}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, highMatchAlerts: checked })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Portfolio Updates */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Updates</CardTitle>
                        <CardDescription>
                          Stay informed about your portfolio companies
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Company updates</p>
                              <p className="text-sm text-muted-foreground">
                                News, milestones, and metric changes
                              </p>
                            </div>
                            <Switch
                              checked={notifications.portfolioUpdates}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, portfolioUpdates: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Monthly portfolio reports</p>
                              <p className="text-sm text-muted-foreground">
                                Consolidated monthly summary of all portfolio activity
                              </p>
                            </div>
                            <Switch
                              checked={notifications.monthlyReports}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, monthlyReports: checked })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Meeting Reminders */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Meeting Reminders</CardTitle>
                        <CardDescription>
                          Configure reminders for scheduled meetings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Meeting reminders</p>
                              <p className="text-sm text-muted-foreground">
                                Get reminded before scheduled meetings
                              </p>
                            </div>
                            <Switch
                              checked={notifications.meetingReminders}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, meetingReminders: checked })
                              }
                            />
                          </div>
                          {notifications.meetingReminders && (
                            <div className="flex items-center justify-between py-2 pl-4 border-l-2 border-muted">
                              <div>
                                <p className="font-medium">Reminder time</p>
                                <p className="text-sm text-muted-foreground">
                                  How early to send the reminder
                                </p>
                              </div>
                              <Select
                                value={notifications.meetingReminderTime}
                                onValueChange={(value) =>
                                  setNotifications({ ...notifications, meetingReminderTime: value })
                                }
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="15">15 minutes</SelectItem>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="60">1 hour</SelectItem>
                                  <SelectItem value="1440">1 day</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Digest Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Digest</CardTitle>
                        <CardDescription>
                          Consolidated summary of activity
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Digest frequency</p>
                            <p className="text-sm text-muted-foreground">
                              How often to receive activity summaries
                            </p>
                          </div>
                          <Select
                            value={notifications.digestFrequency}
                            onValueChange={(value) =>
                              setNotifications({ ...notifications, digestFrequency: value })
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">Real-time</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Notifications
                      </Button>
                    </div>
                  </div>
                )}

                {/* Team Settings Tab */}
                {activeTab === "team" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">Team Settings</h2>
                        <p className="text-sm text-muted-foreground">
                          Manage team members, permissions, and deal assignments
                        </p>
                      </div>
                      <Button onClick={() => setInviteModalOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Member
                      </Button>
                    </div>

                    {/* Team Members */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                          {teamMembers.length} members in your organization
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Member</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Last Active</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamMembers.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                      <AvatarFallback>
                                        {member.name.split(" ").map((n) => n[0]).join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{member.name}</p>
                                      <p className="text-xs text-muted-foreground">{member.email}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={member.role === "admin" ? "default" : "secondary"}
                                    className="capitalize"
                                  >
                                    {member.role}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {member.lastActive}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Permissions
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Shield className="w-4 h-4 mr-2" />
                                        Change Role
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive">
                                        <X className="w-4 h-4 mr-2" />
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Deal Assignment Rules */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Deal Assignment Rules</CardTitle>
                        <CardDescription>
                          Configure how deals are automatically assigned to team members
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b">
                            <div>
                              <p className="font-medium">Round-robin assignment</p>
                              <p className="text-sm text-muted-foreground">
                                Evenly distribute deals among team members
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b">
                            <div>
                              <p className="font-medium">Sector-based assignment</p>
                              <p className="text-sm text-muted-foreground">
                                Assign deals based on team member expertise
                              </p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium">Source-based assignment</p>
                              <p className="text-sm text-muted-foreground">
                                Assign based on deal source (referrals, inbound, etc.)
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Permissions Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Role Permissions</CardTitle>
                        <CardDescription>
                          Overview of what each role can do
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                          {[
                            { role: "Admin", permissions: ["Full access", "Manage team", "Settings", "Billing"] },
                            { role: "Partner", permissions: ["View all deals", "Manage pipeline", "Approve investments", "IC voting"] },
                            { role: "Associate", permissions: ["View deals", "Manage pipeline", "Add notes", "Screen deals"] },
                            { role: "Analyst", permissions: ["View deals", "Add notes", "Research"] },
                          ].map((item) => (
                            <div key={item.role} className="p-4 rounded-lg border">
                              <p className="font-medium mb-2">{item.role}</p>
                              <ul className="space-y-1">
                                {item.permissions.map((perm) => (
                                  <li key={perm} className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Check className="w-3 h-3 text-green-600" />
                                    {perm}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Integrations Tab */}
                {activeTab === "integrations" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold">Integrations</h2>
                      <p className="text-sm text-muted-foreground">
                        Connect your tools and services for seamless workflows
                      </p>
                    </div>

                    {/* Connected Integrations */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Connected</CardTitle>
                        <CardDescription>
                          Active integrations syncing with your account
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {integrations.filter((i) => i.connected).map((integration) => (
                            <div
                              key={integration.id}
                              className="flex items-center justify-between p-4 rounded-lg border bg-card"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted border flex items-center justify-center">
                                  {integration.icon}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{integration.name}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      <Check className="w-3 h-3 mr-1 text-green-600" />
                                      Connected
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                                  {integration.lastSync && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      <RefreshCw className="w-3 h-3 inline mr-1" />
                                      Last synced {integration.lastSync}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Sync
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Configure
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <X className="w-4 h-4 mr-2" />
                                      Disconnect
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Available Integrations */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Available Integrations</CardTitle>
                        <CardDescription>
                          Connect more tools to enhance your workflow
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {integrations.filter((i) => !i.connected).map((integration) => (
                            <div
                              key={integration.id}
                              className="flex items-center justify-between p-4 rounded-lg border"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                  {integration.icon}
                                </div>
                                <div>
                                  <span className="font-medium">{integration.name}</span>
                                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                                </div>
                              </div>
                              <Button variant="outline" className="bg-transparent">
                                <Plug className="w-4 h-4 mr-2" />
                                Connect
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* LP Reporting Tools */}
                    <Card>
                      <CardHeader>
                        <CardTitle>LP Reporting Tools</CardTitle>
                        <CardDescription>
                          Connect your LP reporting and fund administration tools
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg border">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium">Carta Fund Admin</p>
                                <Badge variant="outline" className="text-xs text-green-600">Connected</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Automatic sync of portfolio valuations and LP reports
                            </p>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              Configure
                            </Button>
                          </div>
                          <div className="p-4 rounded-lg border border-dashed">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <Plus className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Add Custom Tool</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Connect via API or webhook integration
                            </p>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              Add Integration
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Invite Member Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="colleague@firm.com" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="associate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="associate">Associate</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Personal Message (optional)</Label>
              <Input placeholder="Welcome to the team!" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setInviteModalOpen(false); toast.success("Invitation sent!") }}>
              <Mail className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preset Modal */}
      <Dialog open={presetModalOpen} onOpenChange={setPresetModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPreset ? "Edit Preset" : "Create New Preset"}</DialogTitle>
            <DialogDescription>
              {editingPreset ? "Update your criteria preset" : "Save a new criteria configuration"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Preset Name</Label>
              <Input
                placeholder="e.g., Growth Stage Focus"
                defaultValue={editingPreset?.name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of this criteria set"
                defaultValue={editingPreset?.description || ""}
              />
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                This preset will use your current investment criteria settings. You can edit the full criteria from the Investment Criteria page.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setPresetModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setPresetModalOpen(false); toast.success(editingPreset ? "Preset updated!" : "Preset created!") }}>
              <Save className="w-4 h-4 mr-2" />
              {editingPreset ? "Update Preset" : "Create Preset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
