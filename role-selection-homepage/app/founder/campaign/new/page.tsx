"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  DollarSign,
  Target,
  Users,
  FolderOpen,
  Settings,
  Rocket,
  Calendar,
  TrendingUp,
  Building2,
  MapPin,
  Upload,
  FileText,
  Eye,
  EyeOff,
  Bell,
} from "lucide-react"

type Step = "round-details" | "investor-profile" | "data-room" | "settings" | "summary"

interface CampaignData {
  roundType: string
  targetAmount: string
  currency: string
  minTicket: string
  valuation: string
  closeDate: string
  investorTypes: string[]
  sectorExpertise: string
  stagePreference: string
  geography: string
  valueAdd: string[]
  documents: {
    pitchDeck: boolean
    financialModel: boolean
    capTable: boolean
    termSheet: boolean
    customerReferences: boolean
  }
  visibility: string
  autoMatch: boolean
  notifications: boolean
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("round-details")
  const [campaignData, setCampaignData] = useState<CampaignData>({
    roundType: "",
    targetAmount: "",
    currency: "INR",
    minTicket: "",
    valuation: "",
    closeDate: "",
    investorTypes: [],
    sectorExpertise: "",
    stagePreference: "",
    geography: "",
    valueAdd: [],
    documents: {
      pitchDeck: false,
      financialModel: false,
      capTable: false,
      termSheet: false,
      customerReferences: false,
    },
    visibility: "public",
    autoMatch: true,
    notifications: true,
  })

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: "round-details", label: "Round Details", icon: DollarSign },
    { id: "investor-profile", label: "Investor Profile", icon: Users },
    { id: "data-room", label: "Data Room", icon: FolderOpen },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "summary", label: "Summary", icon: Check },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex].id)
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setStep(steps[prevIndex].id)
    }
  }

  const handleSaveDraft = () => {
    console.log("[v0] Saving draft:", campaignData)
    router.push("/founder/dashboard")
  }

  const handleLaunch = () => {
    console.log("[v0] Launching campaign:", campaignData)
    router.push("/founder/dashboard")
  }

  const toggleInvestorType = (type: string) => {
    setCampaignData((prev) => ({
      ...prev,
      investorTypes: prev.investorTypes.includes(type)
        ? prev.investorTypes.filter((t) => t !== type)
        : [...prev.investorTypes, type],
    }))
  }

  const toggleValueAdd = (value: string) => {
    setCampaignData((prev) => ({
      ...prev,
      valueAdd: prev.valueAdd.includes(value)
        ? prev.valueAdd.filter((v) => v !== value)
        : [...prev.valueAdd, value],
    }))
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
              <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => router.push("/founder/dashboard")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <h1 className="text-lg font-semibold text-foreground">Create Fundraising Campaign</h1>
                </div>
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
              </div>
            </header>

            <main className="py-8 px-6">
              <div className="max-w-4xl mx-auto">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {steps.map((s, index) => {
                    const Icon = s.icon
                    const isActive = s.id === step
                    const isCompleted = index < currentStepIndex

                    return (
                      <div key={s.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? "bg-primary text-primary-foreground"
                                : isActive
                                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                          </div>
                          <span
                            className={`text-xs font-medium hidden sm:block ${
                              isActive ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 -mx-4 ${isCompleted ? "bg-primary" : "bg-muted"}`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Step Content */}
                <Card>
                  <CardContent className="p-6">
                    {/* Step 1: Round Details */}
                    {step === "round-details" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground mb-2">Round Details</h2>
                          <p className="text-muted-foreground">
                            Provide the key details about your fundraising round
                          </p>
                        </div>

                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="round-type">Round Type *</Label>
                            <Select
                              value={campaignData.roundType}
                              onValueChange={(value) =>
                                setCampaignData((prev) => ({ ...prev, roundType: value }))
                              }
                            >
                              <SelectTrigger id="round-type">
                                <SelectValue placeholder="Select round type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                                <SelectItem value="seed">Seed</SelectItem>
                                <SelectItem value="series-a">Series A</SelectItem>
                                <SelectItem value="series-b">Series B+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="currency">Currency *</Label>
                              <Select
                                value={campaignData.currency}
                                onValueChange={(value) =>
                                  setCampaignData((prev) => ({ ...prev, currency: value }))
                                }
                              >
                                <SelectTrigger id="currency">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="INR">₹ INR</SelectItem>
                                  <SelectItem value="USD">$ USD</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="target-amount">Target Amount *</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  id="target-amount"
                                  type="number"
                                  placeholder="5000000"
                                  className="pl-10"
                                  value={campaignData.targetAmount}
                                  onChange={(e) =>
                                    setCampaignData((prev) => ({ ...prev, targetAmount: e.target.value }))
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="min-ticket">Minimum Ticket Size *</Label>
                            <div className="relative">
                              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="min-ticket"
                                type="number"
                                placeholder="100000"
                                className="pl-10"
                                value={campaignData.minTicket}
                                onChange={(e) =>
                                  setCampaignData((prev) => ({ ...prev, minTicket: e.target.value }))
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="valuation">Pre-Money Valuation (Optional)</Label>
                            <div className="relative">
                              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="valuation"
                                type="number"
                                placeholder="20000000"
                                className="pl-10"
                                value={campaignData.valuation}
                                onChange={(e) =>
                                  setCampaignData((prev) => ({ ...prev, valuation: e.target.value }))
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="close-date">Target Close Date *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="close-date"
                                type="date"
                                className="pl-10"
                                value={campaignData.closeDate}
                                onChange={(e) =>
                                  setCampaignData((prev) => ({ ...prev, closeDate: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Ideal Investor Profile */}
                    {step === "investor-profile" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Ideal Investor Profile
                          </h2>
                          <p className="text-muted-foreground">
                            Help us match you with the right investors
                          </p>
                        </div>

                        <div className="grid gap-6">
                          <div className="space-y-3">
                            <Label>Investor Types Wanted *</Label>
                            <div className="grid grid-cols-2 gap-3">
                              {["VC", "Angel", "Family Office", "CVC"].map((type) => (
                                <Card
                                  key={type}
                                  className={`cursor-pointer transition-all ${
                                    campaignData.investorTypes.includes(type)
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                  onClick={() => toggleInvestorType(type)}
                                >
                                  <CardContent className="p-4 flex items-center justify-between">
                                    <span className="font-medium text-sm">{type}</span>
                                    {campaignData.investorTypes.includes(type) && (
                                      <Check className="w-4 h-4 text-primary" />
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sector">Sector Expertise Desired</Label>
                            <Select
                              value={campaignData.sectorExpertise}
                              onValueChange={(value) =>
                                setCampaignData((prev) => ({ ...prev, sectorExpertise: value }))
                              }
                            >
                              <SelectTrigger id="sector">
                                <SelectValue placeholder="Select sector" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fintech">FinTech</SelectItem>
                                <SelectItem value="saas">SaaS</SelectItem>
                                <SelectItem value="ecommerce">E-Commerce</SelectItem>
                                <SelectItem value="healthtech">HealthTech</SelectItem>
                                <SelectItem value="edtech">EdTech</SelectItem>
                                <SelectItem value="ai-ml">AI/ML</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="stage">Stage Preference</Label>
                            <Select
                              value={campaignData.stagePreference}
                              onValueChange={(value) =>
                                setCampaignData((prev) => ({ ...prev, stagePreference: value }))
                              }
                            >
                              <SelectTrigger id="stage">
                                <SelectValue placeholder="Select stage" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                                <SelectItem value="seed">Seed</SelectItem>
                                <SelectItem value="early">Early Stage</SelectItem>
                                <SelectItem value="growth">Growth Stage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="geography">Geographic Preference</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="geography"
                                placeholder="e.g., India, Southeast Asia, Global"
                                className="pl-10"
                                value={campaignData.geography}
                                onChange={(e) =>
                                  setCampaignData((prev) => ({ ...prev, geography: e.target.value }))
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label>Value-Add Priorities</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {["Network", "Expertise", "Follow-on", "Brand", "Operations"].map(
                                (value) => (
                                  <Card
                                    key={value}
                                    className={`cursor-pointer transition-all ${
                                      campaignData.valueAdd.includes(value)
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                    onClick={() => toggleValueAdd(value)}
                                  >
                                    <CardContent className="p-4 flex items-center justify-between">
                                      <span className="font-medium text-sm">{value}</span>
                                      {campaignData.valueAdd.includes(value) && (
                                        <Check className="w-4 h-4 text-primary" />
                                      )}
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Data Room Setup */}
                    {step === "data-room" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Data Room Setup
                          </h2>
                          <p className="text-muted-foreground">
                            Upload documents that investors will need to review
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Label>Required Documents</Label>
                            <div className="space-y-2">
                              {Object.entries({
                                pitchDeck: "Pitch Deck",
                                financialModel: "Financial Model",
                                capTable: "Cap Table",
                                termSheet: "Term Sheet Template",
                                customerReferences: "Customer References",
                              }).map(([key, label]) => (
                                <Card key={key}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <Checkbox
                                          id={key}
                                          checked={
                                            campaignData.documents[
                                              key as keyof typeof campaignData.documents
                                            ]
                                          }
                                          onCheckedChange={(checked) =>
                                            setCampaignData((prev) => ({
                                              ...prev,
                                              documents: {
                                                ...prev.documents,
                                                [key]: checked === true,
                                              },
                                            }))
                                          }
                                        />
                                        <Label htmlFor={key} className="cursor-pointer font-medium">
                                          {label}
                                        </Label>
                                        {campaignData.documents[
                                          key as keyof typeof campaignData.documents
                                        ] && <Badge variant="secondary">Uploaded</Badge>}
                                      </div>
                                      <Button variant="outline" size="sm">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          <Card className="bg-muted/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-primary mt-0.5" />
                                <div className="space-y-1">
                                  <p className="font-medium text-sm">Document Guidelines</p>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• PDFs are preferred for all documents</li>
                                    <li>• Maximum file size: 10MB per document</li>
                                    <li>• Ensure all sensitive data is properly redacted</li>
                                    <li>• Documents will be encrypted and access-controlled</li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Campaign Settings */}
                    {step === "settings" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Campaign Settings
                          </h2>
                          <p className="text-muted-foreground">
                            Configure how your campaign appears to investors
                          </p>
                        </div>

                        <div className="grid gap-6">
                          <div className="space-y-3">
                            <Label>Visibility</Label>
                            <RadioGroup
                              value={campaignData.visibility}
                              onValueChange={(value) =>
                                setCampaignData((prev) => ({ ...prev, visibility: value }))
                              }
                            >
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem value="public" id="public" className="mt-1" />
                                    <div className="flex-1">
                                      <Label htmlFor="public" className="cursor-pointer font-medium flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Public Profile
                                      </Label>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Visible to all investors on the platform
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem value="invite-only" id="invite-only" className="mt-1" />
                                    <div className="flex-1">
                                      <Label htmlFor="invite-only" className="cursor-pointer font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Invite-only
                                      </Label>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Only investors you invite can view your campaign
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem value="hidden" id="hidden" className="mt-1" />
                                    <div className="flex-1">
                                      <Label htmlFor="hidden" className="cursor-pointer font-medium flex items-center gap-2">
                                        <EyeOff className="w-4 h-4" />
                                        Hidden
                                      </Label>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Campaign is private and not discoverable
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </RadioGroup>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="auto-match" className="font-medium">
                                Auto-match
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Let our AI automatically suggest matching investors
                              </p>
                            </div>
                            <Switch
                              id="auto-match"
                              checked={campaignData.autoMatch}
                              onCheckedChange={(checked) =>
                                setCampaignData((prev) => ({ ...prev, autoMatch: checked }))
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="notifications" className="font-medium">
                                Notification Preferences
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Get notified when investors view or express interest
                              </p>
                            </div>
                            <Switch
                              id="notifications"
                              checked={campaignData.notifications}
                              onCheckedChange={(checked) =>
                                setCampaignData((prev) => ({ ...prev, notifications: checked }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Summary */}
                    {step === "summary" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Review & Launch
                          </h2>
                          <p className="text-muted-foreground">
                            Review your campaign details before launching
                          </p>
                        </div>

                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                Round Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Round Type:</span>
                                <span className="font-medium">{campaignData.roundType || "Not set"}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Target Amount:</span>
                                <span className="font-medium">
                                  {campaignData.currency === "INR" ? "₹" : "$"}
                                  {campaignData.targetAmount || "0"}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Min Ticket:</span>
                                <span className="font-medium">
                                  {campaignData.currency === "INR" ? "₹" : "$"}
                                  {campaignData.minTicket || "0"}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Close Date:</span>
                                <span className="font-medium">{campaignData.closeDate || "Not set"}</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Investor Profile
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Types:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {campaignData.investorTypes.length > 0 ? (
                                    campaignData.investorTypes.map((type) => (
                                      <Badge key={type} variant="secondary">
                                        {type}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground">None selected</span>
                                  )}
                                </div>
                              </div>
                              {campaignData.valueAdd.length > 0 && (
                                <div>
                                  <span className="text-sm text-muted-foreground">Value-Add:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {campaignData.valueAdd.map((value) => (
                                      <Badge key={value} variant="outline">
                                        {value}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <FolderOpen className="w-5 h-5 text-primary" />
                                Data Room
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {Object.entries(campaignData.documents).map(([key, value]) => (
                                  <div key={key} className="flex items-center gap-2 text-sm">
                                    {value ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <div className="w-4 h-4 rounded border-2 border-muted" />
                                    )}
                                    <span className={value ? "text-foreground" : "text-muted-foreground"}>
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary" />
                                Settings
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Visibility:</span>
                                <Badge>{campaignData.visibility}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Auto-match:</span>
                                <Badge variant={campaignData.autoMatch ? "default" : "secondary"}>
                                  {campaignData.autoMatch ? "On" : "Off"}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Notifications:</span>
                                <Badge variant={campaignData.notifications ? "default" : "secondary"}>
                                  {campaignData.notifications ? "On" : "Off"}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                      {currentStepIndex > 0 ? (
                        <Button variant="outline" onClick={handleBack}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                      ) : (
                        <div />
                      )}

                      {currentStepIndex < steps.length - 1 ? (
                        <Button onClick={handleNext}>
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Button variant="outline" onClick={handleSaveDraft}>
                            Save Draft
                          </Button>
                          <Button onClick={handleLaunch}>
                            <Rocket className="w-4 h-4 mr-2" />
                            Launch Campaign
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </main>
      </div>
    </div>
  )
}
