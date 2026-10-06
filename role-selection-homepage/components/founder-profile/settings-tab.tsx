"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Bell, 
  Globe, 
  Lock, 
  Mail, 
  Shield, 
  Trash2, 
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  FolderLock,
  Users,
  TrendingUp,
  Filter,
  UserX,
  Calendar,
  Plug,
  Download,
  Building2
} from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export function SettingsTab() {
  const [notifications, setNotifications] = useState({
    investorViews: true,
    newMatches: true,
    documentActivity: true,
    meetingReminders: true,
    weeklyDigest: false,
    emailNotifications: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "logged-in",
    showEmail: false,
    showPhone: false,
    allowMessaging: true,
    requireNDA: false,
  })

  const [fundraising, setFundraising] = useState({
    campaignVisibility: "public",
    autoMatch: true,
    investorTypes: ["vc", "angel", "family-office"],
    minCheckSize: "100000",
    maxCheckSize: "5000000",
  })

  const [blacklistedInvestors, setBlacklistedInvestors] = useState<string[]>([])
  const [newBlacklistEntry, setNewBlacklistEntry] = useState("")

  const handleSave = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Manage your startup profile information and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="TechCorp AI" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue="https://techcorp.ai" type="url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" defaultValue="AI-powered customer insights" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founded">Founded Date</Label>
              <Input id="founded" defaultValue="2023-01" type="month" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select defaultValue="saas">
              <SelectTrigger id="industry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="healthtech">Healthtech</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="ai">AI/ML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">TC</span>
              </div>
              <Button variant="outline" size="sm">Upload New Logo</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile and what information is visible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visibility">Profile Visibility</Label>
            <Select 
              value={privacy.profileVisibility} 
              onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}
            >
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Public - Anyone can view</span>
                  </div>
                </SelectItem>
                <SelectItem value="logged-in">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Logged-in Only - Verified users</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    <span>Private - Invited investors only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-email">Show Email Address</Label>
                <p className="text-sm text-muted-foreground">Display your email on public profile</p>
              </div>
              <Switch 
                id="show-email"
                checked={privacy.showEmail}
                onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-phone">Show Phone Number</Label>
                <p className="text-sm text-muted-foreground">Display your phone on public profile</p>
              </div>
              <Switch 
                id="show-phone"
                checked={privacy.showPhone}
                onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-messaging">Allow Direct Messages</Label>
                <p className="text-sm text-muted-foreground">Let investors contact you directly</p>
              </div>
              <Switch 
                id="allow-messaging"
                checked={privacy.allowMessaging}
                onCheckedChange={(checked) => setPrivacy({...privacy, allowMessaging: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-nda">Require NDA Before Viewing</Label>
                <p className="text-sm text-muted-foreground">Investors must sign NDA to access details</p>
              </div>
              <Switch 
                id="require-nda"
                checked={privacy.requireNDA}
                onCheckedChange={(checked) => setPrivacy({...privacy, requireNDA: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Settings
          </CardTitle>
          <CardDescription>
            Manage company-level access and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataroom-default">Data Room Default Permissions</Label>
            <Select defaultValue="nda-required">
              <SelectTrigger id="dataroom-default">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can view</SelectItem>
                <SelectItem value="logged-in">Logged-in investors only</SelectItem>
                <SelectItem value="nda-required">NDA Required</SelectItem>
                <SelectItem value="manual-approval">Manual Approval Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-access">Team Member Access Levels</Label>
            <Select defaultValue="view-only">
              <SelectTrigger id="team-access">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-access">Full Access - Can edit everything</SelectItem>
                <SelectItem value="edit-profile">Edit Profile - Can modify company info</SelectItem>
                <SelectItem value="view-analytics">View Analytics - Read-only analytics</SelectItem>
                <SelectItem value="view-only">View Only - Cannot make changes</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Default permission level for new team members
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FolderLock className="w-4 h-4" />
              Data Room Folder Permissions
            </Label>
            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pitch Materials</span>
                <Badge variant="secondary">Public</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Financials</span>
                <Badge variant="secondary">NDA Required</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Legal Documents</span>
                <Badge variant="secondary">Manual Approval</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fundraising Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Fundraising Settings
          </CardTitle>
          <CardDescription>
            Configure your fundraising campaign preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-visibility">Campaign Visibility</Label>
            <Select 
              value={fundraising.campaignVisibility}
              onValueChange={(value) => setFundraising({...fundraising, campaignVisibility: value})}
            >
              <SelectTrigger id="campaign-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to all investors</SelectItem>
                <SelectItem value="private">Private - Invited investors only</SelectItem>
                <SelectItem value="hidden">Hidden - Not discoverable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-match">Auto-Match with Investors</Label>
              <p className="text-sm text-muted-foreground">Automatically find matching investors</p>
            </div>
            <Switch 
              id="auto-match"
              checked={fundraising.autoMatch}
              onCheckedChange={(checked) => setFundraising({...fundraising, autoMatch: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Preferred Investor Types
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "vc", label: "Venture Capital" },
                { value: "angel", label: "Angel Investors" },
                { value: "family-office", label: "Family Offices" },
                { value: "corporate", label: "Corporate VCs" },
              ].map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`type-${type.value}`}
                    checked={fundraising.investorTypes.includes(type.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFundraising({
                          ...fundraising,
                          investorTypes: [...fundraising.investorTypes, type.value],
                        })
                      } else {
                        setFundraising({
                          ...fundraising,
                          investorTypes: fundraising.investorTypes.filter((t) => t !== type.value),
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`type-${type.value}`} className="text-sm">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-check">Minimum Check Size</Label>
              <Input 
                id="min-check" 
                type="number" 
                value={fundraising.minCheckSize}
                onChange={(e) => setFundraising({...fundraising, minCheckSize: e.target.value})}
                placeholder="100000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-check">Maximum Check Size</Label>
              <Input 
                id="max-check" 
                type="number"
                value={fundraising.maxCheckSize}
                onChange={(e) => setFundraising({...fundraising, maxCheckSize: e.target.value})}
                placeholder="5000000"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <UserX className="w-4 h-4" />
              Blacklisted Investors
            </Label>
            <p className="text-sm text-muted-foreground">
              Prevent specific investors from viewing your profile
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter investor name or firm..."
                value={newBlacklistEntry}
                onChange={(e) => setNewBlacklistEntry(e.target.value)}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (newBlacklistEntry.trim()) {
                    setBlacklistedInvestors([...blacklistedInvestors, newBlacklistEntry])
                    setNewBlacklistEntry("")
                    toast.success("Investor added to blacklist")
                  }
                }}
              >
                Add
              </Button>
            </div>
            {blacklistedInvestors.length > 0 && (
              <div className="space-y-1 mt-2">
                {blacklistedInvestors.map((investor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{investor}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBlacklistedInvestors(blacklistedInvestors.filter((_, i) => i !== index))
                        toast.success("Investor removed from blacklist")
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what updates you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="investor-views">Investor Profile Views</Label>
                <p className="text-sm text-muted-foreground">When an investor views your profile</p>
              </div>
              <Switch 
                id="investor-views"
                checked={notifications.investorViews}
                onCheckedChange={(checked) => setNotifications({...notifications, investorViews: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-matches">New Investor Matches</Label>
                <p className="text-sm text-muted-foreground">When new matching investors are found</p>
              </div>
              <Switch 
                id="new-matches"
                checked={notifications.newMatches}
                onCheckedChange={(checked) => setNotifications({...notifications, newMatches: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="document-activity">Document Activity</Label>
                <p className="text-sm text-muted-foreground">When documents are viewed or downloaded</p>
              </div>
              <Switch 
                id="document-activity"
                checked={notifications.documentActivity}
                onCheckedChange={(checked) => setNotifications({...notifications, documentActivity: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="meeting-reminders">Meeting Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders for scheduled investor meetings</p>
              </div>
              <Switch 
                id="meeting-reminders"
                checked={notifications.meetingReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, meetingReminders: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-digest">Weekly Activity Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of weekly activity via email</p>
              </div>
              <Switch 
                id="weekly-digest"
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch 
              id="email-notifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="w-5 h-5" />
            Integration Settings
          </CardTitle>
          <CardDescription>
            Connect external services to streamline your workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="font-medium">Calendar Sync</p>
                  <p className="text-sm text-muted-foreground">Google Calendar, Outlook</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Check className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="font-medium">Email Integration</p>
                  <p className="text-sm text-muted-foreground">Gmail, Outlook</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5" />
                <div>
                  <p className="font-medium">Accounting Software</p>
                  <p className="text-sm text-muted-foreground">QuickBooks, Xero</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <div>
                  <p className="font-medium">CRM Export</p>
                  <p className="text-sm text-muted-foreground">Salesforce, HubSpot</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Download your data for backup or analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export Investor List (.CSV)
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export Outreach History (.CSV)
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export Analytics Report (.PDF)
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export All Data (.ZIP)
          </Button>
          <p className="text-xs text-muted-foreground pt-2">
            Exports may take a few minutes to generate. You'll receive an email when ready.
          </p>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Account Management
          </CardTitle>
          <CardDescription>
            Manage your account security and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="founder@techcorp.ai" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Change Password</Label>
            <div className="flex gap-2">
              <Input id="password" type="password" placeholder="New password" />
              <Button variant="outline">Update</Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Two-Factor Authentication</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">2FA Enabled</p>
                  <p className="text-sm text-muted-foreground">Extra security for your account</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Check className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These actions cannot be undone. Please proceed with caution.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
              <div>
                <p className="font-medium">Deactivate Profile</p>
                <p className="text-sm text-muted-foreground">Temporarily hide your profile from investors</p>
              </div>
              <Button variant="outline" size="sm">Deactivate</Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Check className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
