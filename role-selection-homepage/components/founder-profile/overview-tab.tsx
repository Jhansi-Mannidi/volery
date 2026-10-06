"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Edit2,
  Eye,
  Link2,
  Download,
  Lock,
  Users,
  Globe,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ProfileSection {
  id: string
  title: string
  content: string
  isEmpty: boolean
}

export function OverviewTab() {
  const [editMode, setEditMode] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const profileSections: ProfileSection[] = [
    {
      id: "description",
      title: "Company Description",
      content:
        "TechCorp AI is an AI-powered SaaS platform that helps enterprises automate complex business processes using advanced machine learning. We're built on a foundation of 15+ years of combined fintech and AI expertise.",
      isEmpty: false,
    },
    {
      id: "problem",
      title: "Problem & Solution",
      content:
        "Problem: Enterprises spend millions on custom integration & automation across legacy systems. Solution: Our no-code AI platform enables non-technical teams to automate 80% of workflows in hours, not months.",
      isEmpty: false,
    },
    {
      id: "market",
      title: "Target Market",
      content: "Mid-market to enterprise companies in APAC region with $100M+ annual revenue. Primary focus: Financial Services, Manufacturing, and Logistics sectors.",
      isEmpty: false,
    },
    {
      id: "model",
      title: "Business Model",
      content:
        "SaaS subscription model with tiered pricing: Starter ($2K/mo), Professional ($8K/mo), Enterprise (custom). Implementation services at $50K per engagement. Growing adoption in India, with plans to expand to SE Asia in 2026.",
      isEmpty: false,
    },
    {
      id: "traction",
      title: "Traction Highlights",
      content:
        "- 12 paying enterprise customers with $450K ARR\n- 3 customers in Fortune 500 Indian companies\n- 45% MoM growth in last quarter\n- Team expanded from 8 to 15 people in 6 months",
      isEmpty: false,
    },
    {
      id: "advantage",
      title: "Competitive Advantage",
      content:
        "1. Deep domain expertise in financial automation\n2. Proprietary ML model trained on 10M+ transactions\n3. 5x faster implementation than competitors\n4. 15+ patents pending in process automation",
      isEmpty: false,
    },
  ]

  const completenessScore = 85

  return (
    <div className="space-y-6">
      {/* Company Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo and Basic Info */}
            <div className="flex gap-4 flex-1">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-logo.png" alt="TechCorp AI" />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">TC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">TechCorp AI</h2>
                    <p className="text-muted-foreground mt-1">AI-Powered Enterprise Automation Platform</p>
                  </div>
                  <Button
                    variant={editMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {editMode ? "Done Editing" : "Edit Profile"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    www.techcorp.ai
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Founded: March 2023
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="gap-2 bg-transparent" asChild>
                <Link href="/founder/profile/preview" target="_blank">
                  <Eye className="w-4 h-4" />
                  Preview Public Profile
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-transparent"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + "/founder/profile/preview")
                  toast.success("Link copied to clipboard!")
                }}
              >
                <Link2 className="w-4 h-4" />
                Copy Shareable Link
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-transparent"
                onClick={() => {
                  toast.info("Generating one-pager PDF...")
                  // In production, this would trigger PDF generation
                  setTimeout(() => toast.success("One-pager downloaded!"), 1500)
                }}
              >
                <Download className="w-4 h-4" />
                Download One-Pager
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completeness */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Profile {completenessScore}% complete
                  </p>
                  <p className="text-sm text-amber-800/70 dark:text-amber-200/70">
                    Add team bios to reach 100% and improve visibility with investors
                  </p>
                </div>
              </div>
            </div>
            <Progress value={completenessScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Editable Content Sections */}
      <div className="space-y-4">
        {profileSections.map((section) => (
          <Card key={section.id} className={editMode ? "border-primary/50" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-3">
                  <div className="border rounded-lg p-3 bg-background">
                    <div className="flex gap-1 pb-2 mb-2 border-b">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <span className="font-bold">B</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <span className="italic">I</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <span className="underline">U</span>
                      </Button>
                      <div className="w-px bg-border mx-1" />
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        List
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        Link
                      </Button>
                    </div>
                    <Textarea
                      defaultValue={section.content}
                      placeholder={`Enter your ${section.title.toLowerCase()}...`}
                      className="min-h-32 resize-none border-0 focus-visible:ring-0 p-0"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Check className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : section.isEmpty ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">{section.title} not added yet</p>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add {section.title}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-foreground whitespace-pre-wrap">{section.content}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visibility Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Visibility Settings</CardTitle>
          <CardDescription>Control what investors can see on your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                title: "Public Profile",
                description: "Your profile is visible to all registered users",
                icon: Globe,
                current: true,
              },
              {
                title: "Logged-In Only",
                description: "Only logged-in investors can view your profile",
                icon: Users,
                current: false,
              },
              {
                title: "NDA Required",
                description: "Investors must sign an NDA to view sensitive information",
                icon: Lock,
                current: false,
              },
            ].map((setting, i) => {
              const Icon = setting.icon
              return (
                <div
                  key={i}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors",
                    setting.current ? "border-primary bg-primary/5" : "hover:border-primary/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 mt-1", setting.current ? "border-primary bg-primary" : "border-border")}>
                      {setting.current && <Check className="w-3 h-3 text-white -mt-0.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm">{setting.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
