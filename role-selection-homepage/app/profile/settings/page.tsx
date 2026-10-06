"use client"

import { useState } from "react"
import {
  Users,
  Shield,
  Building2,
  CreditCard,
  Lock,
  FileText,
  Plus,
  MoreHorizontal,
  Search,
  Mail,
  Crown,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  UserPlus,
  Key,
  AlertTriangle,
  AlertCircle,
  Globe,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Clock,
  Filter,
  Home,
  Smartphone,
  Monitor,
  Laptop,
  Sun,
  Moon,
  ToggleRight,
  Zap,
  User,
  Bell,
  Palette,
  Database,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User, category: "PROFILE" },
  { id: "password", label: "Password & Auth", icon: Lock, category: "PROFILE" },
  { id: "connected-accounts", label: "Connected Accounts", icon: Zap, category: "PROFILE" },
  { id: "notifications", label: "Notifications", icon: Bell, category: "NOTIFICATIONS" },
  { id: "appearance", label: "Appearance", icon: Palette, category: "PREFERENCES" },
  { id: "preferences", label: "Preferences", icon: ToggleRight, category: "PREFERENCES" },
  { id: "organization", label: "Organization", icon: Users, category: "ORGANIZATION" },
  { id: "billing", label: "Billing & Subscription", icon: CreditCard, category: "ORGANIZATION" },
  { id: "integrations", label: "Integrations", icon: Zap, category: "INTEGRATIONS" },
  { id: "privacy", label: "Privacy", icon: Eye, category: "PRIVACY & SECURITY" },
  { id: "security", label: "Security", icon: Shield, category: "PRIVACY & SECURITY" },
  { id: "data", label: "Data & Export", icon: Database, category: "PRIVACY & SECURITY" },
]

// Group tabs by category
const groupedTabs = settingsTabs.reduce((acc, tab) => {
  const category = acc.find(c => c.category === tab.category)
  if (category) {
    category.tabs.push(tab)
  } else {
    acc.push({ category: tab.category, tabs: [tab] })
  }
  return acc
}, [] as Array<{ category: string; tabs: typeof settingsTabs }>)

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [newPassword, setNewPassword] = useState("")
  
  // Account settings
  const [account, setAccount] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@anthillventures.com",
    username: "johndoe",
    language: "en-us",
    timezone: "Asia/Kolkata",
  })

  // Connected accounts
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: { connected: true, connectedDate: "Jan 15, 2024", email: "john@gmail.com" },
    linkedin: { connected: false },
    github: { connected: false },
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    // Deal Activity
    newDealAdded: true,
    dealStageChanges: true,
    dealAssigned: true,
    dailyDealSummary: false,
    // Investor Activity
    investorViewsDocs: true,
    newInvestorMatches: true,
    investorResponse: true,
    // Team Activity
    mentionedInComments: true,
    taskAssigned: true,
    weeklyTeamSummary: false,
    // Push
    pushEnabled: true,
    pushUrgentDeals: true,
    pushDocViews: true,
    pushMessages: true,
    pushAllActivity: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    // In-App
    showBadge: true,
    playSound: false,
    desktopNotifications: true,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    defaultPipelineView: "kanban",
    defaultInvestorView: "card",
    sidebarMode: "expanded",
    compactMode: false,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    currency: "INR",
    numberFormat: "indian",
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "team",
    showInDirectory: true,
    showActivityStatus: true,
    showEmail: false,
    showPhone: false,
    shareActivityWithTeam: true,
    includeInAnalytics: true,
    allowProductImprovement: true,
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    twoFactorMethod: "authenticator",
    backupCodesRemaining: 3,
    loginNotifications: true,
  })

  // Sessions
  const sessions = [
    { id: 1, device: "Chrome on MacOS", icon: Laptop, location: "Bangalore, India", lastActive: "Active now", current: true },
    { id: 2, device: "Volery iOS App", icon: Smartphone, location: "Mumbai, India", lastActive: "2 hours ago", current: false },
    { id: 3, device: "Firefox on Windows", icon: Monitor, location: "Delhi, India", lastActive: "3 days ago", current: false },
  ]

  // Login History
  const loginHistory = [
    { id: 1, time: "Today, 9:30 AM", device: "Chrome, MacOS", location: "Bangalore", success: true },
    { id: 2, time: "Yesterday, 6:15 PM", device: "iOS App", location: "Mumbai", success: true },
    { id: 3, time: "Jan 22, 10:00 AM", device: "Chrome, MacOS", location: "Bangalore", success: true },
    { id: 4, time: "Jan 21, 2:30 PM", device: "Firefox, Windows", location: "Delhi", success: true },
    { id: 5, time: "Jan 20, 3:00 AM", device: "Unknown", location: "New York", success: false, blocked: true },
  ]

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[^A-Za-z0-9]/.test(password)) strength += 20
    return strength
  }

  const passwordStrength = getPasswordStrength(newPassword)
  const getStrengthColor = (strength: number) => {
    if (strength <= 20) return "bg-destructive"
    if (strength <= 40) return "bg-orange-500"
    if (strength <= 60) return "bg-amber-500"
    if (strength <= 80) return "bg-emerald-400"
    return "bg-emerald-500"
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account preferences"
        breadcrumbs={[{ label: "Settings" }]}
      />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-auto pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column - Settings Tabs */}
              <div className="w-full md:w-64 shrink-0">
                <nav className="space-y-4">
                  {groupedTabs.map((group) => (
                    <div key={group.category}>
                      <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.category}
                      </p>
                      <div className="space-y-1">
                        {group.tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                              "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors",
                              activeTab === tab.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Right Column - Content Area */}
              <div className="flex-1 space-y-6">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Profile Information</CardTitle>
                      <CardDescription>Update your basic profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input 
                            value={account.firstName}
                            onChange={(e) => setAccount({ ...account, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input 
                            value={account.lastName}
                            onChange={(e) => setAccount({ ...account, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <div className="relative">
                          <Input 
                            value={account.email} 
                            disabled 
                            className="pr-10 bg-muted"
                          />
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">Your email is managed by your organization</p>
                        <Button variant="link" className="h-auto p-0 text-xs text-primary">
                          Request Email Change
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input 
                          value={account.username}
                          onChange={(e) => setAccount({ ...account, username: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Used for @mentions and your profile URL</p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select value={account.language} onValueChange={(v) => setAccount({ ...account, language: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-us">English (US)</SelectItem>
                            <SelectItem value="en-gb">English (UK)</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select value={account.timezone} onValueChange={(v) => setAccount({ ...account, timezone: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">(GMT+5:30) India Standard Time</SelectItem>
                            <SelectItem value="America/New_York">(GMT-5:00) Eastern Time</SelectItem>
                            <SelectItem value="Europe/London">(GMT+0:00) London</SelectItem>
                            <SelectItem value="Asia/Singapore">(GMT+8:00) Singapore</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Password & Auth Tab */}
                {activeTab === "password" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Change Password</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Current Password *</Label>
                          <div className="relative">
                            <Input 
                              type={showCurrentPassword ? "text" : "password"} 
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>New Password *</Label>
                          <div className="relative">
                            <Input 
                              type={showNewPassword ? "text" : "password"} 
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Password strength:</span>
                            <div className="flex-1 max-w-32">
                              <Progress value={passwordStrength} className={cn("h-1.5", getStrengthColor(passwordStrength))} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {passwordStrength === 0 ? "Enter password" : passwordStrength <= 40 ? "Weak" : passwordStrength <= 60 ? "Fair" : passwordStrength <= 80 ? "Good" : "Strong"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Confirm New Password *</Label>
                          <Input type="password" placeholder="Confirm new password" />
                        </div>

                        <div className="space-y-2 p-3 bg-muted rounded-lg">
                          <p className="text-xs font-medium text-foreground">Password requirements:</p>
                          <div className="grid grid-cols-2 gap-1">
                            {[
                              { check: newPassword.length >= 8, label: "At least 8 characters" },
                              { check: /[A-Z]/.test(newPassword), label: "One uppercase letter" },
                              { check: /[a-z]/.test(newPassword), label: "One lowercase letter" },
                              { check: /[0-9]/.test(newPassword), label: "One number" },
                              { check: /[^A-Za-z0-9]/.test(newPassword), label: "One special character" },
                            ].map((req, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                {req.check ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-muted-foreground" />
                                )}
                                <span className={cn("text-xs", req.check ? "text-foreground" : "text-muted-foreground")}>
                                  {req.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button>Update Password</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Connected Accounts Tab */}
                {activeTab === "connected-accounts" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Connected Accounts</CardTitle>
                      <CardDescription>Manage third-party services connected to your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Google */}
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Google</p>
                            {connectedAccounts.google.connected ? (
                              <p className="text-xs text-muted-foreground">Connected as {connectedAccounts.google.email}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">Not connected</p>
                            )}
                          </div>
                        </div>
                        <Button variant={connectedAccounts.google.connected ? "outline" : "default"} size="sm">
                          {connectedAccounts.google.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>

                      {/* LinkedIn */}
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">LinkedIn</p>
                            <p className="text-xs text-muted-foreground">Not connected</p>
                          </div>
                        </div>
                        <Button variant="default" size="sm">Connect</Button>
                      </div>

                      {/* GitHub */}
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">GitHub</p>
                            <p className="text-xs text-muted-foreground">Not connected</p>
                          </div>
                        </div>
                        <Button variant="default" size="sm">Connect</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Preferences</CardTitle>
                      <CardDescription>Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Date Format</Label>
                        <Select value={appearance.dateFormat} onValueChange={(v) => setAppearance({ ...appearance, dateFormat: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Time Format</Label>
                        <Select value={appearance.timeFormat} onValueChange={(v) => setAppearance({ ...appearance, timeFormat: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12-hour (3:30 PM)</SelectItem>
                            <SelectItem value="24h">24-hour (15:30)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={appearance.currency} onValueChange={(v) => setAppearance({ ...appearance, currency: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">₹ Indian Rupee</SelectItem>
                            <SelectItem value="USD">$ US Dollar</SelectItem>
                            <SelectItem value="EUR">€ Euro</SelectItem>
                            <SelectItem value="GBP">£ British Pound</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Number Format</Label>
                        <Select value={appearance.numberFormat} onValueChange={(v) => setAppearance({ ...appearance, numberFormat: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indian">Indian (10,00,000)</SelectItem>
                            <SelectItem value="western">Western (1,000,000)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Preferences</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Organization Tab */}
                {activeTab === "organization" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Organization Settings</CardTitle>
                      <CardDescription>Manage your organization</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg bg-muted/30">
                          <p className="text-sm font-medium text-foreground">Anthill Ventures</p>
                          <p className="text-xs text-muted-foreground mt-1">Investment firm • 5 members</p>
                          <Button variant="link" className="h-auto p-0 text-xs mt-2">View organization settings →</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Billing Tab */}
                {activeTab === "billing" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Billing & Subscription</CardTitle>
                      <CardDescription>Manage your subscription plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">Professional Plan</p>
                            <Badge>Active</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">$299/month • Renews on Feb 15, 2025</p>
                          <Button variant="outline" size="sm">Manage Subscription</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Integrations Tab */}
                {activeTab === "integrations" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Integrations</CardTitle>
                      <CardDescription>Connect third-party apps and services</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground p-4 border border-border rounded-lg text-center">
                          <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p>No integrations configured yet</p>
                          <Button variant="link" className="h-auto p-0 text-xs mt-2">Browse available integrations →</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Deal Activity */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Deal Activity</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">New deal added to pipeline</p>
                                <p className="text-xs text-muted-foreground">Get notified when a new startup is added</p>
                              </div>
                              <Switch
                                checked={notifications.newDealAdded}
                                onCheckedChange={(c) => setNotifications({ ...notifications, newDealAdded: c })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Deal stage changes</p>
                                <p className="text-xs text-muted-foreground">When deals you own move to a new stage</p>
                              </div>
                              <Switch
                                checked={notifications.dealStageChanges}
                                onCheckedChange={(c) => setNotifications({ ...notifications, dealStageChanges: c })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Deal assigned to you</p>
                                <p className="text-xs text-muted-foreground">{"When you're assigned as deal owner"}</p>
                              </div>
                              <Switch
                                checked={notifications.dealAssigned}
                                onCheckedChange={(c) => setNotifications({ ...notifications, dealAssigned: c })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Daily deal summary</p>
                                <p className="text-xs text-muted-foreground">Receive a daily digest of all deal activity</p>
                              </div>
                              <Switch
                                checked={notifications.dailyDealSummary}
                                onCheckedChange={(c) => setNotifications({ ...notifications, dailyDealSummary: c })}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Investor Activity */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Investor Activity</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Investor views your shared documents</p>
                                <p className="text-xs text-muted-foreground">Real-time notification when docs are viewed</p>
                              </div>
                              <Switch
                                checked={notifications.investorViewsDocs}
                                onCheckedChange={(c) => setNotifications({ ...notifications, investorViewsDocs: c })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">New investor matches</p>
                                <p className="text-xs text-muted-foreground">When AI finds high-quality matches (85%+)</p>
                              </div>
                              <Switch
                                checked={notifications.newInvestorMatches}
                                onCheckedChange={(c) => setNotifications({ ...notifications, newInvestorMatches: c })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Investor response received</p>
                                <p className="text-xs text-muted-foreground">When an investor responds to outreach</p>
                              </div>
                              <Switch
                                checked={notifications.investorResponse}
                                onCheckedChange={(c) => setNotifications({ ...notifications, investorResponse: c })}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Team Activity */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Team Activity</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Mentioned in comments</p>
                                <p className="text-xs text-muted-foreground">When someone @mentions you</p>
                              </div>
                              <Switch
                                checked={notifications.mentionedInComments}
                                onCheckedChange={(c) => setNotifications({ ...notifications, mentionedInComments: c })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Task assigned to you</p>
                                <p className="text-xs text-muted-foreground">When a task is assigned</p>
                              </div>
                              <Switch
                                checked={notifications.taskAssigned}
                                onCheckedChange={(c) => setNotifications({ ...notifications, taskAssigned: c })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground">Weekly team summary</p>
                                <p className="text-xs text-muted-foreground">Weekly digest of team activity</p>
                              </div>
                              <Switch
                                checked={notifications.weeklyTeamSummary}
                                onCheckedChange={(c) => setNotifications({ ...notifications, weeklyTeamSummary: c })}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Push Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">Enable push notifications</p>
                            <p className="text-xs text-muted-foreground">Receive notifications in your browser</p>
                          </div>
                          <Switch
                            checked={notifications.pushEnabled}
                            onCheckedChange={(c) => setNotifications({ ...notifications, pushEnabled: c })}
                          />
                        </div>

                        {notifications.pushEnabled && (
                          <>
                            <Separator />
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">When enabled, notify me about:</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Checkbox 
                                    id="urgent" 
                                    checked={notifications.pushUrgentDeals}
                                    onCheckedChange={(c) => setNotifications({ ...notifications, pushUrgentDeals: c as boolean })}
                                  />
                                  <Label htmlFor="urgent" className="text-sm">Urgent deal updates</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox 
                                    id="docviews" 
                                    checked={notifications.pushDocViews}
                                    onCheckedChange={(c) => setNotifications({ ...notifications, pushDocViews: c as boolean })}
                                  />
                                  <Label htmlFor="docviews" className="text-sm">Document views in real-time</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox 
                                    id="messages" 
                                    checked={notifications.pushMessages}
                                    onCheckedChange={(c) => setNotifications({ ...notifications, pushMessages: c as boolean })}
                                  />
                                  <Label htmlFor="messages" className="text-sm">New messages and mentions</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox 
                                    id="all" 
                                    checked={notifications.pushAllActivity}
                                    onCheckedChange={(c) => setNotifications({ ...notifications, pushAllActivity: c as boolean })}
                                  />
                                  <Label htmlFor="all" className="text-sm text-muted-foreground">All activity (may be frequent)</Label>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <Label className="text-sm">Quiet Hours:</Label>
                              <div className="flex items-center gap-2">
                                <Select value={notifications.quietHoursStart} onValueChange={(v) => setNotifications({ ...notifications, quietHoursStart: v })}>
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="20:00">8:00 PM</SelectItem>
                                    <SelectItem value="21:00">9:00 PM</SelectItem>
                                    <SelectItem value="22:00">10:00 PM</SelectItem>
                                    <SelectItem value="23:00">11:00 PM</SelectItem>
                                  </SelectContent>
                                </Select>
                                <span className="text-sm text-muted-foreground">to</span>
                                <Select value={notifications.quietHoursEnd} onValueChange={(v) => setNotifications({ ...notifications, quietHoursEnd: v })}>
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="06:00">6:00 AM</SelectItem>
                                    <SelectItem value="07:00">7:00 AM</SelectItem>
                                    <SelectItem value="08:00">8:00 AM</SelectItem>
                                    <SelectItem value="09:00">9:00 AM</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <p className="text-xs text-muted-foreground">No notifications during these hours</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          In-App Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Show notification badge</p>
                            <p className="text-xs text-muted-foreground">Display unread count on bell icon</p>
                          </div>
                          <Switch
                            checked={notifications.showBadge}
                            onCheckedChange={(c) => setNotifications({ ...notifications, showBadge: c })}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Play notification sound</p>
                            <p className="text-xs text-muted-foreground">Audio alert for new notifications</p>
                          </div>
                          <Switch
                            checked={notifications.playSound}
                            onCheckedChange={(c) => setNotifications({ ...notifications, playSound: c })}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Desktop notifications</p>
                            <p className="text-xs text-muted-foreground">Show notifications even when tab is not active</p>
                          </div>
                          <Switch
                            checked={notifications.desktopNotifications}
                            onCheckedChange={(c) => setNotifications({ ...notifications, desktopNotifications: c })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Theme</CardTitle>
                        <CardDescription>Choose your preferred theme</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={appearance.theme}
                          onValueChange={(v) => setAppearance({ ...appearance, theme: v })}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="light" id="light" className="peer sr-only" />
                            <Label
                              htmlFor="light"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <Sun className="w-6 h-6 mb-2" />
                              <span className="text-sm font-medium">Light</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                            <Label
                              htmlFor="dark"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <Moon className="w-6 h-6 mb-2" />
                              <span className="text-sm font-medium">Dark</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="system" id="system" className="peer sr-only" />
                            <Label
                              htmlFor="system"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                            >
                              <Monitor className="w-6 h-6 mb-2" />
                              <span className="text-sm font-medium">System</span>
                            </Label>
                          </div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground mt-3">
                          Light: Classic white background | Dark: Easier on the eyes | System: Match device settings
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Display Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Default Pipeline View</Label>
                          <Select value={appearance.defaultPipelineView} onValueChange={(v) => setAppearance({ ...appearance, defaultPipelineView: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kanban">Kanban Board</SelectItem>
                              <SelectItem value="list">List View</SelectItem>
                              <SelectItem value="table">Table View</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Default Investor View</Label>
                          <Select value={appearance.defaultInvestorView} onValueChange={(v) => setAppearance({ ...appearance, defaultInvestorView: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">Card Grid</SelectItem>
                              <SelectItem value="list">List View</SelectItem>
                              <SelectItem value="table">Table View</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Sidebar</Label>
                          <RadioGroup value={appearance.sidebarMode} onValueChange={(v) => setAppearance({ ...appearance, sidebarMode: v })}>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="expanded" id="sb-expanded" />
                              <Label htmlFor="sb-expanded" className="text-sm">Expanded (show labels)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="collapsed" id="sb-collapsed" />
                              <Label htmlFor="sb-collapsed" className="text-sm">Collapsed (icons only)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="auto" id="sb-auto" />
                              <Label htmlFor="sb-auto" className="text-sm">Auto-collapse on small screens</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">Compact Mode</p>
                            <p className="text-xs text-muted-foreground">Reduce spacing for more content on screen</p>
                          </div>
                          <Switch
                            checked={appearance.compactMode}
                            onCheckedChange={(c) => setAppearance({ ...appearance, compactMode: c })}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Date & Number Format</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Date Format</Label>
                          <RadioGroup value={appearance.dateFormat} onValueChange={(v) => setAppearance({ ...appearance, dateFormat: v })}>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="DD/MM/YYYY" id="df-dmy" />
                              <Label htmlFor="df-dmy" className="text-sm">DD/MM/YYYY (24/01/2026)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="MM/DD/YYYY" id="df-mdy" />
                              <Label htmlFor="df-mdy" className="text-sm">MM/DD/YYYY (01/24/2026)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="YYYY-MM-DD" id="df-ymd" />
                              <Label htmlFor="df-ymd" className="text-sm">YYYY-MM-DD (2026-01-24)</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Time Format</Label>
                          <RadioGroup value={appearance.timeFormat} onValueChange={(v) => setAppearance({ ...appearance, timeFormat: v })}>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="12h" id="tf-12" />
                              <Label htmlFor="tf-12" className="text-sm">12-hour (2:30 PM)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="24h" id="tf-24" />
                              <Label htmlFor="tf-24" className="text-sm">24-hour (14:30)</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Currency Display</Label>
                          <Select value={appearance.currency} onValueChange={(v) => setAppearance({ ...appearance, currency: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Number Format</Label>
                          <RadioGroup value={appearance.numberFormat} onValueChange={(v) => setAppearance({ ...appearance, numberFormat: v })}>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="international" id="nf-int" />
                              <Label htmlFor="nf-int" className="text-sm">International (1,234,567.89)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="indian" id="nf-ind" />
                              <Label htmlFor="nf-ind" className="text-sm">Indian (12,34,567.89)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Profile Visibility</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Who can see your profile:</Label>
                          <RadioGroup value={privacy.profileVisibility} onValueChange={(v) => setPrivacy({ ...privacy, profileVisibility: v })}>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="everyone" id="pv-all" />
                              <Label htmlFor="pv-all" className="text-sm">Everyone on Volery</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="team" id="pv-team" />
                              <Label htmlFor="pv-team" className="text-sm">Team members only</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="private" id="pv-me" />
                              <Label htmlFor="pv-me" className="text-sm">Only me (private)</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Show in team directory</p>
                            <p className="text-xs text-muted-foreground">Allow team members to find you</p>
                          </div>
                          <Switch
                            checked={privacy.showInDirectory}
                            onCheckedChange={(c) => setPrivacy({ ...privacy, showInDirectory: c })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Show activity status</p>
                            <p className="text-xs text-muted-foreground">Others can see when you were last active</p>
                          </div>
                          <Switch
                            checked={privacy.showActivityStatus}
                            onCheckedChange={(c) => setPrivacy({ ...privacy, showActivityStatus: c })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Show email address</p>
                            <p className="text-xs text-muted-foreground">Display email on your profile</p>
                          </div>
                          <Switch
                            checked={privacy.showEmail}
                            onCheckedChange={(c) => setPrivacy({ ...privacy, showEmail: c })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Show phone number</p>
                            <p className="text-xs text-muted-foreground">Display phone on your profile</p>
                          </div>
                          <Switch
                            checked={privacy.showPhone}
                            onCheckedChange={(c) => setPrivacy({ ...privacy, showPhone: c })}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Data Sharing</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Share activity with team</p>
                            <p className="text-xs text-muted-foreground">Team can see your deal activity in feeds</p>
                          </div>
                          <Switch
                            checked={privacy.shareActivityWithTeam}
                            onCheckedChange={(c) => setPrivacy({ ...privacy, shareActivityWithTeam: c })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Include in analytics</p>
                            <p className="text-xs text-muted-foreground">Your activity counts toward team analytics</p>
                          </div>
                          <Switch
                            checked={privacy.includeInAnalytics}
                            onCheckedChange={(c) => setPrivacy({ ...privacy, includeInAnalytics: c })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">Allow product improvement data</p>
                            <p className="text-xs text-muted-foreground">Help us improve Volery with anonymized usage data</p>
                          </div>
                          <Switch
                            checked={privacy.allowProductImprovement}
                            onCheckedChange={(c) => setPrivacy({ ...privacy, allowProductImprovement: c })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Two-Factor Authentication
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            security.twoFactorEnabled ? "bg-emerald-500" : "bg-muted"
                          )} />
                          <span className="text-sm font-medium">
                            Status: {security.twoFactorEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Two-factor authentication adds an extra layer of security to your account by requiring a code in addition to your password.
                        </p>

                        {security.twoFactorEnabled && (
                          <>
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm text-foreground">
                                Current Method: <span className="font-medium">Authenticator App (Google Authenticator)</span>
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Change Method</Button>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">Disable 2FA</Button>
                            </div>

                            <Separator />

                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">Backup Codes:</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                {security.backupCodesRemaining} of 10 backup codes remaining
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">View Backup Codes</Button>
                                <Button variant="outline" size="sm">Generate New Codes</Button>
                              </div>
                            </div>
                          </>
                        )}

                        {!security.twoFactorEnabled && (
                          <Button>Enable Two-Factor Authentication</Button>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Active Sessions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <session.icon className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground">{session.device}</p>
                                  {session.current && (
                                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                      Current Session
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{session.location} - {session.lastActive}</p>
                              </div>
                            </div>
                            {!session.current && (
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                Revoke
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button variant="outline" className="w-full bg-transparent">
                          Sign Out All Other Sessions
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Login History</CardTitle>
                        <Button variant="link" size="sm" className="h-auto p-0">View All</Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {loginHistory.map((login) => (
                          <div key={login.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {login.success ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-destructive" />
                              )}
                              <span className="text-muted-foreground">{login.time}</span>
                              <span className="text-foreground">{login.device}</span>
                              <span className="text-muted-foreground">{login.location}</span>
                            </div>
                            {login.blocked && (
                              <Badge variant="destructive" className="text-[10px]">Blocked</Badge>
                            )}
                          </div>
                        ))}
                        {loginHistory.some(l => l.blocked) && (
                          <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="text-xs text-destructive">Suspicious login attempt blocked</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Data & Export Tab */}
                {activeTab === "data" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Export My Data</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Download a copy of your Volery data. This includes:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                          <li>Your profile information</li>
                          <li>Activity history</li>
                          <li>Deals you own</li>
                          <li>Notes and comments</li>
                          <li>Saved searches and preferences</li>
                        </ul>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Format:</Label>
                          <RadioGroup defaultValue="csv">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="json" id="exp-json" />
                              <Label htmlFor="exp-json" className="text-sm">JSON (machine-readable)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="csv" id="exp-csv" />
                              <Label htmlFor="exp-csv" className="text-sm">CSV (spreadsheet)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="pdf" id="exp-pdf" />
                              <Label htmlFor="exp-pdf" className="text-sm">PDF (human-readable report)</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Button>
                          <Download className="w-4 h-4 mr-2" />
                          Request Data Export
                        </Button>

                        <p className="text-xs text-muted-foreground">
                          Last export: Never | Note: Export may take up to 24 hours to prepare
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-destructive/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          Delete Account
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your Volery account and all associated data. This action cannot be undone.
                        </p>

                        <div className="p-3 bg-muted rounded-lg space-y-2">
                          <p className="text-sm font-medium text-foreground">Before deleting:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                            <li>Export your data using the option above</li>
                            <li>Transfer ownership of deals to other team members</li>
                            <li>Notify your team admin</li>
                          </ul>
                        </div>

                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Note: As a Partner (Admin), you must transfer admin rights before deleting your account.
                        </p>

                        <Button variant="destructive" onClick={() => setShowDeleteAccountDialog(true)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete My Account
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Account Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc my-2">
            <li>Your profile and all personal data</li>
            <li>All notes and comments you have made</li>
            <li>Your notification preferences</li>
            <li>Access to Anthill Ventures workspace</li>
          </ul>
          <p className="text-sm font-medium text-destructive">This action cannot be undone.</p>
          <div className="py-4">
            <Label className="text-sm text-muted-foreground">
              Type <span className="font-mono font-bold text-foreground">DELETE</span> to confirm:
            </Label>
            <Input 
              className="mt-2" 
              placeholder="Type DELETE to confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteConfirmText !== "DELETE"}
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
