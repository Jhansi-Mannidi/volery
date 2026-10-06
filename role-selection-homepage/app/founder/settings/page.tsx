"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Users,
  Bell,
  Plug,
  Download,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Shield,
  UserPlus,
  MoreHorizontal,
  Trash2,
  Edit,
  Check,
  X,
  Calendar,
  Mail,
  FileSpreadsheet,
  Database,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Plus,
  Search,
  Ban,
  Sparkles,
  FileText,
  BarChart3,
  Clock,
} from "lucide-react"

// Mock data
const teamMembers = [
  { id: "1", name: "Sarah Chen", email: "sarah@techflow.io", role: "Admin", avatar: "/placeholder-user.jpg", status: "active" },
  { id: "2", name: "Mike Johnson", email: "mike@techflow.io", role: "Editor", avatar: "/placeholder-user.jpg", status: "active" },
  { id: "3", name: "Emily Davis", email: "emily@techflow.io", role: "Viewer", avatar: "/placeholder-user.jpg", status: "pending" },
]

const blacklistedInvestors = [
  { id: "1", name: "Competitive Ventures", reason: "Conflict of interest", addedDate: "2024-01-15" },
  { id: "2", name: "John Smith", reason: "Previous bad experience", addedDate: "2024-02-20" },
]

const integrations = [
  { id: "google-calendar", name: "Google Calendar", icon: Calendar, connected: true, lastSync: "2 hours ago" },
  { id: "outlook", name: "Outlook Calendar", icon: Calendar, connected: false, lastSync: null },
  { id: "gmail", name: "Gmail", icon: Mail, connected: true, lastSync: "1 hour ago" },
  { id: "quickbooks", name: "QuickBooks", icon: FileSpreadsheet, connected: false, lastSync: null },
  { id: "xero", name: "Xero", icon: FileSpreadsheet, connected: false, lastSync: null },
  { id: "hubspot", name: "HubSpot CRM", icon: Database, connected: true, lastSync: "30 minutes ago" },
  { id: "salesforce", name: "Salesforce", icon: Database, connected: false, lastSync: null },
]

const investorTypes = [
  { id: "vc", label: "Venture Capital", checked: true },
  { id: "angel", label: "Angel Investors", checked: true },
  { id: "corporate", label: "Corporate VC", checked: false },
  { id: "family-office", label: "Family Offices", checked: true },
  { id: "accelerator", label: "Accelerators", checked: false },
]

export default function FounderSettingsPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [addTeamMemberOpen, setAddTeamMemberOpen] = useState(false)
  const [addBlacklistOpen, setAddBlacklistOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportType, setExportType] = useState<string | null>(null)

  // Company settings state
  const [profileVisibility, setProfileVisibility] = useState("investors-only")
  const [dataRoomPermissions, setDataRoomPermissions] = useState("request-access")
  const [showMetrics, setShowMetrics] = useState(true)
  const [showTeam, setShowTeam] = useState(true)
  const [showFundingHistory, setShowFundingHistory] = useState(false)

  // Fundraising settings state
  const [campaignVisibility, setCampaignVisibility] = useState("private")
  const [autoMatch, setAutoMatch] = useState(true)
  const [matchThreshold, setMatchThreshold] = useState([75])
  const [selectedInvestorTypes, setSelectedInvestorTypes] = useState(investorTypes)

  // Notification settings state
  const [profileViewAlerts, setProfileViewAlerts] = useState(true)
  const [documentViewAlerts, setDocumentViewAlerts] = useState(true)
  const [matchNotifications, setMatchNotifications] = useState(true)
  const [meetingReminders, setMeetingReminders] = useState(true)
  const [reminderTime, setReminderTime] = useState("30")
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  const handleInvestorTypeToggle = (id: string) => {
    setSelectedInvestorTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, checked: !type.checked } : type
      )
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Settings & Preferences" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
                <TabsTrigger value="company" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Company</span>
                </TabsTrigger>
                <TabsTrigger value="fundraising" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Fundraising</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="gap-2">
                  <Plug className="w-4 h-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-2">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </TabsTrigger>
              </TabsList>

              {/* Company Settings Tab */}
              <TabsContent value="company" className="space-y-6">
                {/* Profile Visibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Company Profile Visibility
                    </CardTitle>
                    <CardDescription>
                      Control who can view your company profile and what information is displayed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Profile Visibility Level</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            profileVisibility === "public" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                          }`}
                          onClick={() => setProfileVisibility("public")}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Public</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Anyone can view your profile
                          </p>
                        </div>
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            profileVisibility === "investors-only" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                          }`}
                          onClick={() => setProfileVisibility("investors-only")}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">Investors Only</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Only verified investors can view
                          </p>
                        </div>
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            profileVisibility === "private" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                          }`}
                          onClick={() => setProfileVisibility("private")}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4 text-orange-600" />
                            <span className="font-medium">Private</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Only invited investors can view
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Information Display Settings</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Key Metrics</p>
                            <p className="text-sm text-muted-foreground">Display ARR, growth rate, and other metrics</p>
                          </div>
                          <Switch checked={showMetrics} onCheckedChange={setShowMetrics} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Team Information</p>
                            <p className="text-sm text-muted-foreground">Display team members and their backgrounds</p>
                          </div>
                          <Switch checked={showTeam} onCheckedChange={setShowTeam} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Funding History</p>
                            <p className="text-sm text-muted-foreground">Display previous funding rounds and investors</p>
                          </div>
                          <Switch checked={showFundingHistory} onCheckedChange={setShowFundingHistory} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Room Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Data Room Default Permissions
                    </CardTitle>
                    <CardDescription>
                      Set default access permissions for your data room documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <Label>Default Access Level</Label>
                      <Select value={dataRoomPermissions} onValueChange={setDataRoomPermissions}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open Access - All verified investors</SelectItem>
                          <SelectItem value="request-access">Request Access - Investors must request</SelectItem>
                          <SelectItem value="invite-only">Invite Only - Manual approval required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Document Watermarking</p>
                          <p className="text-sm text-muted-foreground">
                            All documents shared through the data room are automatically watermarked with the viewer's information for security.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Member Access */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Team Member Access
                        </CardTitle>
                        <CardDescription>
                          Manage team members and their access levels
                        </CardDescription>
                      </div>
                      <Dialog open={addTeamMemberOpen} onOpenChange={setAddTeamMemberOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                            <DialogDescription>
                              Invite a new team member to your organization
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Email Address</Label>
                              <Input placeholder="colleague@company.com" />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Select defaultValue="viewer">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin - Full access</SelectItem>
                                  <SelectItem value="editor">Editor - Can edit content</SelectItem>
                                  <SelectItem value="viewer">Viewer - Read only access</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Personal Message (Optional)</Label>
                              <Textarea placeholder="Add a personal note to the invitation..." />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAddTeamMemberOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setAddTeamMemberOpen(false)}>
                              Send Invitation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[50px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={member.role === "Admin" ? "default" : "secondary"}>
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={member.status === "active" ? "outline" : "secondary"}>
                                {member.status === "active" ? (
                                  <><Check className="w-3 h-3 mr-1" /> Active</>
                                ) : (
                                  <><Clock className="w-3 h-3 mr-1" /> Pending</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
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
              </TabsContent>

              {/* Fundraising Settings Tab */}
              <TabsContent value="fundraising" className="space-y-6">
                {/* Campaign Visibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Campaign Visibility
                    </CardTitle>
                    <CardDescription>
                      Control how your fundraising campaign appears to investors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          campaignVisibility === "public" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                        }`}
                        onClick={() => setCampaignVisibility("public")}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Public</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Visible in marketplace and searchable
                        </p>
                      </div>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          campaignVisibility === "private" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                        }`}
                        onClick={() => setCampaignVisibility("private")}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Private</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Only matched investors can see
                        </p>
                      </div>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          campaignVisibility === "hidden" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                        }`}
                        onClick={() => setCampaignVisibility("hidden")}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <EyeOff className="w-4 h-4 text-orange-600" />
                          <span className="font-medium">Hidden</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Only accessible via direct link
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Auto-Match Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Auto-Match Preferences
                    </CardTitle>
                    <CardDescription>
                      Configure how the AI matching system works for your campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Auto-Matching</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically match with investors based on criteria
                        </p>
                      </div>
                      <Switch checked={autoMatch} onCheckedChange={setAutoMatch} />
                    </div>

                    {autoMatch && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Minimum Match Score</Label>
                            <span className="text-sm font-medium">{matchThreshold[0]}%</span>
                          </div>
                          <Slider
                            value={matchThreshold}
                            onValueChange={setMatchThreshold}
                            max={100}
                            min={50}
                            step={5}
                          />
                          <p className="text-sm text-muted-foreground">
                            Only investors with a match score above {matchThreshold[0]}% will be shown
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Investor Type Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Investor Type Preferences
                    </CardTitle>
                    <CardDescription>
                      Select which types of investors you want to connect with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedInvestorTypes.map((type) => (
                        <div key={type.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={type.id}
                            checked={type.checked}
                            onCheckedChange={() => handleInvestorTypeToggle(type.id)}
                          />
                          <Label htmlFor={type.id} className="cursor-pointer">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Blacklist */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Ban className="w-5 h-5" />
                          Investor Blacklist
                        </CardTitle>
                        <CardDescription>
                          Block specific investors from viewing your profile or contacting you
                        </CardDescription>
                      </div>
                      <Dialog open={addBlacklistOpen} onOpenChange={setAddBlacklistOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Blacklist
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add to Blacklist</DialogTitle>
                            <DialogDescription>
                              Block an investor from viewing your profile
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Search Investor</Label>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input className="pl-9" placeholder="Search by name or firm..." />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Reason (Optional)</Label>
                              <Textarea placeholder="Why are you blocking this investor?" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAddBlacklistOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => setAddBlacklistOpen(false)}>
                              Add to Blacklist
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {blacklistedInvestors.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Investor/Firm</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="w-[50px]" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blacklistedInvestors.map((investor) => (
                            <TableRow key={investor.id}>
                              <TableCell className="font-medium">{investor.name}</TableCell>
                              <TableCell className="text-muted-foreground">{investor.reason}</TableCell>
                              <TableCell className="text-muted-foreground">{investor.addedDate}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon">
                                  <X className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Ban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No blacklisted investors</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Channels
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-sm text-muted-foreground">Summary of activity sent every Monday</p>
                      </div>
                      <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity Alerts</CardTitle>
                    <CardDescription>
                      Configure which activities trigger notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Profile View Alerts</p>
                        <p className="text-sm text-muted-foreground">When an investor views your profile</p>
                      </div>
                      <Switch checked={profileViewAlerts} onCheckedChange={setProfileViewAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Document View Alerts</p>
                        <p className="text-sm text-muted-foreground">When an investor views your documents</p>
                      </div>
                      <Switch checked={documentViewAlerts} onCheckedChange={setDocumentViewAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Match Notifications</p>
                        <p className="text-sm text-muted-foreground">When you get a new investor match</p>
                      </div>
                      <Switch checked={matchNotifications} onCheckedChange={setMatchNotifications} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Meeting Reminders</p>
                        <p className="text-sm text-muted-foreground">Reminders before scheduled meetings</p>
                      </div>
                      <Switch checked={meetingReminders} onCheckedChange={setMeetingReminders} />
                    </div>
                    {meetingReminders && (
                      <div className="ml-4 pl-4 border-l">
                        <Label className="text-sm">Remind me before meetings</Label>
                        <Select value={reminderTime} onValueChange={setReminderTime}>
                          <SelectTrigger className="w-48 mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes before</SelectItem>
                            <SelectItem value="30">30 minutes before</SelectItem>
                            <SelectItem value="60">1 hour before</SelectItem>
                            <SelectItem value="1440">1 day before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Calendar Integration
                    </CardTitle>
                    <CardDescription>
                      Sync your calendar for meeting scheduling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {integrations.filter(i => i.id.includes("calendar") || i.id === "outlook").map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <integration.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            {integration.connected && integration.lastSync && (
                              <p className="text-sm text-muted-foreground">
                                Last synced {integration.lastSync}
                              </p>
                            )}
                          </div>
                        </div>
                        {integration.connected ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <Check className="w-3 h-3 mr-1" /> Connected
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm">Connect</Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Integration
                    </CardTitle>
                    <CardDescription>
                      Connect your email for outreach tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {integrations.filter(i => i.id === "gmail").map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <integration.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            {integration.connected && integration.lastSync && (
                              <p className="text-sm text-muted-foreground">
                                Last synced {integration.lastSync}
                              </p>
                            )}
                          </div>
                        </div>
                        {integration.connected ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <Check className="w-3 h-3 mr-1" /> Connected
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm">Connect</Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5" />
                      Accounting Software
                    </CardTitle>
                    <CardDescription>
                      Connect for automatic financial data sync
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {integrations.filter(i => i.id === "quickbooks" || i.id === "xero").map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <integration.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Auto-sync financials to your data room
                            </p>
                          </div>
                        </div>
                        <Button size="sm">Connect</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      CRM Integration
                    </CardTitle>
                    <CardDescription>
                      Export investor data to your CRM
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {integrations.filter(i => i.id === "hubspot" || i.id === "salesforce").map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <integration.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            {integration.connected && integration.lastSync && (
                              <p className="text-sm text-muted-foreground">
                                Last synced {integration.lastSync}
                              </p>
                            )}
                          </div>
                        </div>
                        {integration.connected ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <Check className="w-3 h-3 mr-1" /> Connected
                            </Badge>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm">Connect</Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Export Tab */}
              <TabsContent value="export" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Export Your Data
                    </CardTitle>
                    <CardDescription>
                      Download your data in various formats for backup or analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => { setExportType("investors"); setExportDialogOpen(true); }}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Investor List</h3>
                            <p className="text-sm text-muted-foreground">
                              Export all investors you've interacted with
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => { setExportType("outreach"); setExportDialogOpen(true); }}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Outreach History</h3>
                            <p className="text-sm text-muted-foreground">
                              Export all outreach communications
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => { setExportType("analytics"); setExportDialogOpen(true); }}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <BarChart3 className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Analytics Data</h3>
                            <p className="text-sm text-muted-foreground">
                              Export profile views, engagement metrics
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Exports</CardTitle>
                    <CardDescription>
                      Your previously exported data files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Download className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No recent exports</p>
                      <p className="text-sm">Your exported files will appear here</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Dialog */}
                <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export {exportType === "investors" ? "Investor List" : exportType === "outreach" ? "Outreach History" : "Analytics Data"}</DialogTitle>
                      <DialogDescription>
                        Choose your export format and date range
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select defaultValue="csv">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV (.csv)</SelectItem>
                            <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                            <SelectItem value="json">JSON (.json)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="year">Last 12 Months</SelectItem>
                            <SelectItem value="quarter">Last 3 Months</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setExportDialogOpen(false)}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
