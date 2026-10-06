"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Globe,
  Mail,
  User,
  Phone,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MapPin,
  Linkedin,
  Plus,
  X,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  Upload,
  GripVertical,
  Trash2,
  Star,
  Link as LinkIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  role: string
  linkedin: string
  isPrimary: boolean
  notes: string
}

interface InvestorData {
  id?: string
  name: string
  type: string
  website: string
  linkedin: string
  crunchbase: string
  city: string
  country: string
  address: string
  description: string
  yearFounded: string
  aum: string
  currentFundSize: string
  relationshipOwner: string
  relationshipStrength: string
  source: string
  tags: string[]
  checkSizeMin: number
  checkSizeMax: number
  currency: string
  investmentStages: string[]
  sectors: string[]
  geographies: string[]
  businessModels: string[]
  exclusions: string
  contacts: Contact[]
  internalNotes: string
  thesisNotes: string
  meetingNotes: string
  redFlags: string
}

interface AddEditInvestorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  investor?: InvestorData | null
  mode?: "add" | "edit"
}

// Mock existing investors for duplicate detection
const existingInvestors = [
  { id: "1", name: "Sequoia Capital" },
  { id: "2", name: "Accel Partners" },
  { id: "3", name: "Matrix Partners" },
]

const investorTypes = [
  "Venture Capital",
  "Angel Investor",
  "Family Office",
  "Corporate VC",
  "Private Equity",
  "Accelerator/Incubator",
  "Government Fund",
  "Other",
]

const investmentStages = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Growth",
  "Pre-IPO",
]

const sectors = [
  "Technology",
  "Fintech",
  "Healthcare",
  "Consumer",
  "Enterprise",
  "SaaS",
  "AI/ML",
  "EdTech",
  "CleanTech",
  "Logistics",
  "Deep Tech",
  "Real Estate Tech",
  "AgriTech",
  "E-commerce",
  "Cybersecurity",
]

const geographies = [
  "India",
  "USA",
  "Southeast Asia",
  "Europe",
  "Middle East",
  "China",
  "Japan",
  "Africa",
  "Latin America",
  "Global",
]

const businessModels = [
  "B2B",
  "B2C",
  "B2B2C",
  "Marketplace",
  "SaaS",
  "Hardware",
  "Other",
]

const relationshipStrengths = [
  { value: "new", label: "New", color: "bg-slate-100 text-slate-600" },
  { value: "warm", label: "Warm", color: "bg-blue-100 text-blue-600" },
  { value: "strong", label: "Strong", color: "bg-green-100 text-green-600" },
  { value: "champion", label: "Champion", color: "bg-amber-100 text-amber-600" },
]

const sourceOptions = [
  "Referral",
  "Conference/Event",
  "LinkedIn",
  "Cold Outreach",
  "Portfolio Company",
  "Other Investor",
  "AngelList",
  "Crunchbase",
  "Other",
]

const teamMembers = [
  { id: "1", name: "Priya Sharma", initials: "PS" },
  { id: "2", name: "Rahul Mehta", initials: "RM" },
  { id: "3", name: "Amit Patel", initials: "AP" },
]

const availableTags = [
  "High Priority",
  "Follow-up Required",
  "Active Investor",
  "Co-investor",
  "Lead Investor",
  "Strategic",
  "Sector Expert",
  "First Check",
]

const currencies = ["USD", "INR", "EUR", "GBP", "SGD"]

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Singapore",
  "UAE",
  "Germany",
  "France",
  "Japan",
  "China",
  "Other",
]

const defaultContact: Contact = {
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  linkedin: "",
  isPrimary: false,
  notes: "",
}

const defaultInvestorData: InvestorData = {
  name: "",
  type: "",
  website: "",
  linkedin: "",
  crunchbase: "",
  city: "",
  country: "",
  address: "",
  description: "",
  yearFounded: "",
  aum: "",
  currentFundSize: "",
  relationshipOwner: "",
  relationshipStrength: "new",
  source: "",
  tags: [],
  checkSizeMin: 100000,
  checkSizeMax: 5000000,
  currency: "USD",
  investmentStages: [],
  sectors: [],
  geographies: [],
  businessModels: [],
  exclusions: "",
  contacts: [],
  internalNotes: "",
  thesisNotes: "",
  meetingNotes: "",
  redFlags: "",
}

export function AddEditInvestorModal({
  open,
  onOpenChange,
  investor = null,
  mode = "add",
}: AddEditInvestorModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<{ id: string; name: string } | null>(null)
  const [formData, setFormData] = useState<InvestorData>(investor || defaultInvestorData)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Reset form when modal opens/closes or investor changes
  useEffect(() => {
    if (open) {
      setFormData(investor || defaultInvestorData)
      setActiveTab("basic")
      setShowSuccess(false)
      setDuplicateWarning(null)
    }
  }, [open, investor])

  // Check for duplicates
  useEffect(() => {
    if (formData.name.length > 2 && mode === "add") {
      const duplicate = existingInvestors.find(
        (i) => i.name.toLowerCase() === formData.name.toLowerCase()
      )
      setDuplicateWarning(duplicate || null)
    } else {
      setDuplicateWarning(null)
    }
  }, [formData.name, mode])

  const updateFormData = useCallback((field: keyof InvestorData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleArrayField = useCallback((field: keyof InvestorData, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[]
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value],
      }
    })
  }, [])

  // Auto-fetch data from URL
  const handleAutoFetch = async () => {
    if (!formData.website && !formData.linkedin && !formData.crunchbase) return
    
    setIsFetching(true)
    // Simulate API call to fetch investor data
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Mock auto-filled data
    if (formData.website && !formData.description) {
      updateFormData("description", "A leading venture capital firm focused on early-stage technology investments across multiple sectors.")
    }
    
    setIsFetching(false)
  }

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Contact management
  const addContact = () => {
    const newContact: Contact = {
      ...defaultContact,
      id: `contact-${Date.now()}`,
      isPrimary: formData.contacts.length === 0,
    }
    updateFormData("contacts", [...formData.contacts, newContact])
  }

  const updateContact = (index: number, field: keyof Contact, value: unknown) => {
    const updatedContacts = [...formData.contacts]
    updatedContacts[index] = { ...updatedContacts[index], [field]: value }
    
    // If setting as primary, unset others
    if (field === "isPrimary" && value === true) {
      updatedContacts.forEach((c, i) => {
        if (i !== index) c.isPrimary = false
      })
    }
    
    updateFormData("contacts", updatedContacts)
  }

  const removeContact = (index: number) => {
    const updatedContacts = formData.contacts.filter((_, i) => i !== index)
    // If removed contact was primary, make first one primary
    if (formData.contacts[index].isPrimary && updatedContacts.length > 0) {
      updatedContacts[0].isPrimary = true
    }
    updateFormData("contacts", updatedContacts)
  }

  const handleSubmit = async (asDraft: boolean = false) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
      onOpenChange(false)
      if (mode === "add") {
        router.push("/investors/new-investor-id")
      }
    }, 1500)
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    return `${(value / 1000).toFixed(0)}K`
  }

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {formData.name} {mode === "add" ? "added" : "updated"} successfully
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              The investor has been {mode === "add" ? "added to your database" : "updated"}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
                Close
              </Button>
              <Button onClick={() => router.push("/investors/new-investor-id")}>
                View Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {mode === "add" ? "Add New Investor" : `Edit ${investor?.name || "Investor"}`}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-1 mt-4">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="m-0 space-y-4">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div 
                    className={cn(
                      "w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors",
                      "hover:border-primary hover:bg-primary/5",
                      logoPreview ? "border-solid border-border" : "border-muted-foreground/30"
                    )}
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    {logoPreview ? (
                      <img src={logoPreview || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <div className="text-sm text-muted-foreground">
                    <p>Drag and drop or click to upload</p>
                    <p className="text-xs">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Investor Name */}
              <div className="space-y-2">
                <Label htmlFor="investor-name">
                  Investor Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="investor-name"
                  placeholder="Enter investor name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className={cn(duplicateWarning && "border-amber-500 focus-visible:ring-amber-500")}
                />
                {duplicateWarning && (
                  <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-amber-700 dark:text-amber-400">
                      An investor with this name already exists.
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-amber-700 dark:text-amber-400"
                      onClick={() => router.push(`/investors/${duplicateWarning.id}`)}
                    >
                      View existing
                    </Button>
                  </div>
                )}
              </div>

              {/* Investor Type */}
              <div className="space-y-2">
                <Label>
                  Investor Type <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(v) => updateFormData("type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {investorTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* URLs */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="website"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={(e) => updateFormData("website", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        placeholder="LinkedIn profile"
                        value={formData.linkedin}
                        onChange={(e) => updateFormData("linkedin", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crunchbase">Crunchbase URL</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="crunchbase"
                        placeholder="Crunchbase profile"
                        value={formData.crunchbase}
                        onChange={(e) => updateFormData("crunchbase", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {(formData.website || formData.linkedin || formData.crunchbase) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoFetch}
                    disabled={isFetching}
                    className="bg-transparent"
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Fetching data...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-1.5" />
                        Auto-fetch info
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Separator />

              {/* Location */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Location</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs text-muted-foreground">City</Label>
                    <Input
                      id="city"
                      placeholder="e.g., San Francisco"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-xs text-muted-foreground">Country</Label>
                    <Select value={formData.country} onValueChange={(v) => updateFormData("country", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs text-muted-foreground">Full Address (optional)</Label>
                  <Input
                    id="address"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Overview */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Overview</Label>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs text-muted-foreground">Description / Thesis</Label>
                  <Textarea
                    id="description"
                    placeholder="Investment thesis and focus areas..."
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="yearFounded" className="text-xs text-muted-foreground">Year Founded</Label>
                    <Input
                      id="yearFounded"
                      placeholder="2010"
                      value={formData.yearFounded}
                      onChange={(e) => updateFormData("yearFounded", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aum" className="text-xs text-muted-foreground">AUM</Label>
                    <Input
                      id="aum"
                      placeholder="e.g., $500M"
                      value={formData.aum}
                      onChange={(e) => updateFormData("aum", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentFundSize" className="text-xs text-muted-foreground">Current Fund Size</Label>
                    <Input
                      id="currentFundSize"
                      placeholder="e.g., $100M"
                      value={formData.currentFundSize}
                      onChange={(e) => updateFormData("currentFundSize", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Relationship */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Relationship</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Relationship Owner</Label>
                    <Select value={formData.relationshipOwner} onValueChange={(v) => updateFormData("relationshipOwner", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium">
                                {member.initials}
                              </div>
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Relationship Strength</Label>
                    <Select value={formData.relationshipStrength} onValueChange={(v) => updateFormData("relationshipStrength", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipStrengths.map((strength) => (
                          <SelectItem key={strength.value} value={strength.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={cn("text-xs", strength.color)}>
                                {strength.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Source</Label>
                  <Select value={formData.source} onValueChange={(v) => updateFormData("source", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How did you find them?" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={formData.tags.includes(tag) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          formData.tags.includes(tag) && "bg-primary"
                        )}
                        onClick={() => toggleArrayField("tags", tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Investment Criteria Tab */}
            <TabsContent value="criteria" className="m-0 space-y-4">
              {/* Check Size */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Check Size</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Minimum</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="100000"
                        value={formData.checkSizeMin}
                        onChange={(e) => updateFormData("checkSizeMin", parseInt(e.target.value) || 0)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Maximum</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="5000000"
                        value={formData.checkSizeMax}
                        onChange={(e) => updateFormData("checkSizeMax", parseInt(e.target.value) || 0)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Currency</Label>
                    <Select value={formData.currency} onValueChange={(v) => updateFormData("currency", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Range: {formData.currency} {formatCurrency(formData.checkSizeMin)} - {formatCurrency(formData.checkSizeMax)}
                </p>
              </div>

              <Separator />

              {/* Investment Stages */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Investment Stages</Label>
                <div className="grid grid-cols-2 gap-2">
                  {investmentStages.map((stage) => (
                    <div key={stage} className="flex items-center gap-2">
                      <Checkbox
                        id={`stage-${stage}`}
                        checked={formData.investmentStages.includes(stage)}
                        onCheckedChange={() => toggleArrayField("investmentStages", stage)}
                      />
                      <Label htmlFor={`stage-${stage}`} className="text-sm font-normal cursor-pointer">
                        {stage}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sectors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Sectors</Label>
                <div className="flex flex-wrap gap-2">
                  {sectors.map((sector) => (
                    <Badge
                      key={sector}
                      variant={formData.sectors.includes(sector) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        formData.sectors.includes(sector) && "bg-primary"
                      )}
                      onClick={() => toggleArrayField("sectors", sector)}
                    >
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Geographies */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Geographies</Label>
                <div className="flex flex-wrap gap-2">
                  {geographies.map((geo) => (
                    <Badge
                      key={geo}
                      variant={formData.geographies.includes(geo) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        formData.geographies.includes(geo) && "bg-primary"
                      )}
                      onClick={() => toggleArrayField("geographies", geo)}
                    >
                      {geo}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Business Models */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Business Models</Label>
                <div className="grid grid-cols-2 gap-2">
                  {businessModels.map((model) => (
                    <div key={model} className="flex items-center gap-2">
                      <Checkbox
                        id={`model-${model}`}
                        checked={formData.businessModels.includes(model)}
                        onCheckedChange={() => toggleArrayField("businessModels", model)}
                      />
                      <Label htmlFor={`model-${model}`} className="text-sm font-normal cursor-pointer">
                        {model}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Exclusions */}
              <div className="space-y-2">
                <Label htmlFor="exclusions">Exclusions</Label>
                <Textarea
                  id="exclusions"
                  placeholder="Sectors they don't invest in, specific things they avoid..."
                  value={formData.exclusions}
                  onChange={(e) => updateFormData("exclusions", e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="m-0 space-y-4">
              {formData.contacts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-1">No contacts added</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add contacts to keep track of your relationships
                  </p>
                  <Button onClick={addContact}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Contact
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.contacts.map((contact, index) => (
                    <div
                      key={contact.id}
                      className={cn(
                        "border rounded-lg p-4 space-y-3",
                        contact.isPrimary && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <span className="text-sm font-medium">
                            Contact {index + 1}
                          </span>
                          {contact.isPrimary && (
                            <Badge className="bg-primary/20 text-primary text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`primary-${index}`}
                              checked={contact.isPrimary}
                              onCheckedChange={(checked) => updateContact(index, "isPrimary", checked)}
                            />
                            <Label htmlFor={`primary-${index}`} className="text-xs text-muted-foreground">
                              Primary
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeContact(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Name <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Contact name"
                              value={contact.name}
                              onChange={(e) => updateContact(index, "name", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Role / Title</Label>
                          <Input
                            placeholder="e.g., Partner"
                            value={contact.role}
                            onChange={(e) => updateContact(index, "role", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              value={contact.email}
                              onChange={(e) => updateContact(index, "email", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="+1 234 567 8900"
                              value={contact.phone}
                              onChange={(e) => updateContact(index, "phone", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">LinkedIn URL</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="LinkedIn profile URL"
                            value={contact.linkedin}
                            onChange={(e) => updateContact(index, "linkedin", e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Notes</Label>
                        <Textarea
                          placeholder="Notes about this contact..."
                          value={contact.notes}
                          onChange={(e) => updateContact(index, "notes", e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addContact} className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Another Contact
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="m-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="internalNotes">
                  Internal Notes
                  <span className="text-xs text-muted-foreground ml-2">Notes visible only to team</span>
                </Label>
                <Textarea
                  id="internalNotes"
                  placeholder="Internal notes about this investor..."
                  value={formData.internalNotes}
                  onChange={(e) => updateFormData("internalNotes", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thesisNotes">
                  Investment Thesis Notes
                  <span className="text-xs text-muted-foreground ml-2">What we know about their thesis</span>
                </Label>
                <Textarea
                  id="thesisNotes"
                  placeholder="Details about their investment thesis, preferences, decision-making process..."
                  value={formData.thesisNotes}
                  onChange={(e) => updateFormData("thesisNotes", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingNotes">
                  Meeting Notes
                  <span className="text-xs text-muted-foreground ml-2">Past interactions summary</span>
                </Label>
                <Textarea
                  id="meetingNotes"
                  placeholder="Summary of past meetings and interactions..."
                  value={formData.meetingNotes}
                  onChange={(e) => updateFormData("meetingNotes", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redFlags" className="text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Red Flags / Concerns
                </Label>
                <Textarea
                  id="redFlags"
                  placeholder="Any concerns or red flags to be aware of..."
                  value={formData.redFlags}
                  onChange={(e) => updateFormData("redFlags", e.target.value)}
                  rows={3}
                  className="border-destructive/30 focus-visible:ring-destructive/30"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="bg-transparent"
          >
            Save as Draft
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={isSubmitting || !formData.name || !formData.type}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                {mode === "add" ? "Save Investor" : "Update Investor"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
