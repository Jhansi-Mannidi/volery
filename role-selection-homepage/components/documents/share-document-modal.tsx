"use client"

import React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Bell,
  Calendar,
  Check,
  Copy,
  Download,
  Eye,
  FileText,
  Globe,
  Link2,
  Lock,
  Mail,
  QrCode,
  Send,
  Shield,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface ShareDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: {
    id: string
    name: string
    type: string
    size: string
    pages: number
  }
}

export function ShareDocumentModal({ open, onOpenChange, document }: ShareDocumentModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [passwordProtection, setPasswordProtection] = useState(false)
  const [password, setPassword] = useState("")
  const [expirationEnabled, setExpirationEnabled] = useState(false)
  const [expirationDays, setExpirationDays] = useState("7")
  const [viewLimitEnabled, setViewLimitEnabled] = useState(false)
  const [viewLimit, setViewLimit] = useState("10")
  const [allowDownload, setAllowDownload] = useState(false)
  const [requireEmail, setRequireEmail] = useState(true)
  const [watermark, setWatermark] = useState(false)
  const [trackViews, setTrackViews] = useState(true)
  const [trackPages, setTrackPages] = useState(true)
  const [notifyOnView, setNotifyOnView] = useState(true)
  const [allowedDomains, setAllowedDomains] = useState("")
  const [emailRecipients, setEmailRecipients] = useState("")
  const [emailSubject, setEmailSubject] = useState(`Sharing: ${document.name}`)
  const [emailMessage, setEmailMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("default")

  const generatedLink = `https://volery.app/docs/${document.id}/${Math.random().toString(36).substring(7)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-primary"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            Share Document
          </DialogTitle>
          <DialogDescription>
            Configure sharing options for "{document.name}"
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="flex-1 flex flex-col min-h-0 px-6">
          <TabsList className="grid w-full grid-cols-2 shrink-0">
            <TabsTrigger value="link">
              <Link2 className="w-4 h-4 mr-2" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Send via Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4 flex-1 overflow-y-auto pr-2 data-[state=inactive]:hidden" forceMount>
            <div className="space-y-6">
              {/* Generated Link */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Shareable Link</Label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 border rounded-lg">
                    <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate">{generatedLink}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toast({ title: "QR code", description: "QR code generated for this link." })}
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Link Settings */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Link Settings
                </h4>

                <div className="space-y-4">
                  {/* Password Protection */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Password Protection</Label>
                        <p className="text-xs text-muted-foreground">Require a password to view</p>
                      </div>
                    </div>
                    <Switch checked={passwordProtection} onCheckedChange={setPasswordProtection} />
                  </div>
                  {passwordProtection && (
                    <div className="ml-7">
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Expiration Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Expiration Date</Label>
                        <p className="text-xs text-muted-foreground">Link expires after set time</p>
                      </div>
                    </div>
                    <Switch checked={expirationEnabled} onCheckedChange={setExpirationEnabled} />
                  </div>
                  {expirationEnabled && (
                    <div className="ml-7">
                      <Select value={expirationDays} onValueChange={setExpirationDays}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select expiration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* View Limit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">View Limit</Label>
                        <p className="text-xs text-muted-foreground">Limit number of views</p>
                      </div>
                    </div>
                    <Switch checked={viewLimitEnabled} onCheckedChange={setViewLimitEnabled} />
                  </div>
                  {viewLimitEnabled && (
                    <div className="ml-7">
                      <Input
                        type="number"
                        placeholder="Max views"
                        className="w-[180px]"
                        value={viewLimit}
                        onChange={(e) => setViewLimit(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Allow Download */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Allow Download</Label>
                        <p className="text-xs text-muted-foreground">Let viewers download the file</p>
                      </div>
                    </div>
                    <Switch checked={allowDownload} onCheckedChange={setAllowDownload} />
                  </div>

                  {/* Require Email */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Require Email to View</Label>
                        <p className="text-xs text-muted-foreground">Collect viewer's email before viewing</p>
                      </div>
                    </div>
                    <Switch checked={requireEmail} onCheckedChange={setRequireEmail} />
                  </div>

                  {/* Watermark */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Watermark</Label>
                        <p className="text-xs text-muted-foreground">Add watermark with viewer's email</p>
                      </div>
                    </div>
                    <Switch checked={watermark} onCheckedChange={setWatermark} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Allowed Domains */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Allowed Email Domains (Whitelist)</Label>
                <Input
                  placeholder="e.g., sequoia.com, accel.com (comma separated)"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to allow all domains
                </p>
              </div>

              <Separator />

              {/* Tracking Options */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Tracking Options
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Track who views</Label>
                    <Switch checked={trackViews} onCheckedChange={setTrackViews} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Track page-by-page engagement</Label>
                    <Switch checked={trackPages} onCheckedChange={setTrackPages} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Notify me when someone views</Label>
                    <Switch checked={notifyOnView} onCheckedChange={setNotifyOnView} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 pb-6 sticky bottom-0 bg-background">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    toast({ title: "Link created", description: "Shareable link has been created." })
                    onOpenChange(false)
                  }}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Create Link
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-4 flex-1 overflow-y-auto pr-2 data-[state=inactive]:hidden" forceMount>
            <div className="space-y-4">
              {/* Recipients */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Recipients</Label>
                <Textarea
                  placeholder="Enter email addresses (comma separated)"
                  rows={2}
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
              </div>

              {/* Email Template */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Email Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="pitch-deck">Pitch Deck Share</SelectItem>
                    <SelectItem value="due-diligence">Due Diligence Report</SelectItem>
                    <SelectItem value="term-sheet">Term Sheet Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Subject</Label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              {/* Message */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Message (Optional)</Label>
                <Textarea
                  placeholder="Add a personal message..."
                  rows={4}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </div>

              {/* Document Preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{document.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {document.type} &middot; {document.size} &middot; {document.pages} pages
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Attached</Badge>
              </div>

              {/* Email Tracking */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Track email opens</span>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end gap-2 pt-4 pb-6 sticky bottom-0 bg-background">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    if (!emailRecipients.trim()) {
                      toast({ title: "Recipients required", description: "Enter at least one email address.", variant: "destructive" })
                      return
                    }
                    toast({ title: "Email sent", description: `Document shared with ${emailRecipients.split(",").length} recipient(s).` })
                    onOpenChange(false)
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
