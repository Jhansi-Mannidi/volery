"use client"

import { useState, useEffect } from "react"
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
  ChevronDown,
  Plus,
  X,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
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

interface QuickAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPipeline?: string
  defaultStage?: string
}

// Mock existing startups for duplicate detection
const existingStartups = [
  { id: "1", name: "TechCorp AI" },
  { id: "2", name: "HealthFlow" },
  { id: "3", name: "FinanceHub" },
]

const sectors = [
  "Fintech",
  "SaaS",
  "Healthcare",
  "E-commerce",
  "EdTech",
  "CleanTech",
  "AI/ML",
  "Cybersecurity",
  "Logistics",
  "AgriTech",
  "Other",
]

const businessModels = ["B2B", "B2C", "B2B2C", "Marketplace", "SaaS", "Hardware", "Other"]

const fundingStages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+", "Growth", "Other"]

const pipelines = [
  { id: "main", name: "Main Pipeline" },
  { id: "fintech", name: "Fintech Focus" },
  { id: "healthcare", name: "Healthcare Track" },
]

const stages = [
  { id: "intake", name: "Intake" },
  { id: "screening", name: "Screening" },
  { id: "due-diligence", name: "Due Diligence" },
  { id: "decision", name: "Decision" },
]

const sourceOptions = [
  "Referral",
  "Inbound Application",
  "Event/Conference",
  "Cold Outreach",
  "AngelList",
  "LinkedIn",
  "Other",
]

const availableTags = [
  "Hot Deal",
  "Follow-up Required",
  "Partner Intro",
  "Quick Decision",
  "Deep Tech",
  "First-time Founder",
  "Serial Entrepreneur",
  "Impact",
]

export function QuickAddModal({
  open,
  onOpenChange,
  defaultPipeline = "main",
  defaultStage = "intake",
}: QuickAddModalProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<{ id: string; name: string } | null>(null)

  // Form state - Basic
  const [companyName, setCompanyName] = useState("")
  const [website, setWebsite] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [pipeline, setPipeline] = useState(defaultPipeline)
  const [stage, setStage] = useState(defaultStage)

  // Form state - Extended Basic
  const [sector, setSector] = useState("")
  const [businessModel, setBusinessModel] = useState("")
  const [fundingStage, setFundingStage] = useState("")
  const [location, setLocation] = useState("")
  const [foundedYear, setFoundedYear] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Form state - Contact
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactRole, setContactRole] = useState("")
  const [contactLinkedin, setContactLinkedin] = useState("")

  // Form state - Funding
  const [totalRaised, setTotalRaised] = useState("")
  const [lastRoundAmount, setLastRoundAmount] = useState("")
  const [lastRoundType, setLastRoundType] = useState("")
  const [lastRoundDate, setLastRoundDate] = useState("")
  const [valuation, setValuation] = useState("")
  const [isRaising, setIsRaising] = useState(false)
  const [targetRaise, setTargetRaise] = useState("")

  // Form state - Notes
  const [notes, setNotes] = useState("")
  const [source, setSource] = useState("")
  const [referralName, setReferralName] = useState("")

  // Check for duplicates
  useEffect(() => {
    if (companyName.length > 2) {
      const duplicate = existingStartups.find(
        (s) => s.name.toLowerCase() === companyName.toLowerCase()
      )
      setDuplicateWarning(duplicate || null)
    } else {
      setDuplicateWarning(null)
    }
  }, [companyName])

  const resetForm = () => {
    setCompanyName("")
    setWebsite("")
    setContactEmail("")
    setPipeline(defaultPipeline)
    setStage(defaultStage)
    setSector("")
    setBusinessModel("")
    setFundingStage("")
    setLocation("")
    setFoundedYear("")
    setTeamSize("")
    setSelectedTags([])
    setContactName("")
    setContactPhone("")
    setContactRole("")
    setContactLinkedin("")
    setTotalRaised("")
    setLastRoundAmount("")
    setLastRoundType("")
    setLastRoundDate("")
    setValuation("")
    setIsRaising(false)
    setTargetRaise("")
    setNotes("")
    setSource("")
    setReferralName("")
    setDuplicateWarning(null)
    setIsExpanded(false)
  }

  const handleSubmit = async (openProfile: boolean = false) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Reset after showing success
    setTimeout(() => {
      setShowSuccess(false)
      if (openProfile) {
        onOpenChange(false)
        router.push("/startups/new-startup-id")
      }
    }, 1500)
  }

  const handleAddAnother = () => {
    setShowSuccess(false)
    resetForm()
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
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
              {companyName} added to pipeline
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              The startup has been added to {pipelines.find((p) => p.id === pipeline)?.name}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/startups/new-startup-id")}>
                View Profile
              </Button>
              <Button onClick={handleAddAnother}>Add Another</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Add New Startup
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
          {!isExpanded ? (
            /* Minimal Mode */
            <div className="space-y-4 py-2">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company-name">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={cn(duplicateWarning && "border-amber-500 focus-visible:ring-amber-500")}
                />
                {duplicateWarning && (
                  <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-amber-700 dark:text-amber-400">
                      A startup with this name already exists.
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-amber-700 dark:text-amber-400"
                      onClick={() => router.push(`/startups/${duplicateWarning.id}`)}
                    >
                      View existing
                    </Button>
                  </div>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contact-email">Primary Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Pipeline & Stage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pipeline</Label>
                  <Select value={pipeline} onValueChange={setPipeline}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelines.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Stage</Label>
                  <Select value={stage} onValueChange={setStage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expand Link */}
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add More Details
              </button>
            </div>
          ) : (
            /* Expanded Mode with Tabs */
            <Tabs defaultValue="basic" className="py-2">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="funding">Funding</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              {/* Basic Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company-name-expanded">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company-name-expanded"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website-expanded">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website-expanded"
                      placeholder="https://example.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Sector & Business Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Business Model</Label>
                    <Select value={businessModel} onValueChange={setBusinessModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessModels.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Funding Stage & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Funding Stage</Label>
                    <Select value={fundingStage} onValueChange={setFundingStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingStages.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="City, Country"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Founded Year & Team Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Founded Year</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="2023"
                        value={foundedYear}
                        onChange={(e) => setFoundedYear(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Team Size</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="10"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Pipeline & Stage */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pipeline</Label>
                    <Select value={pipeline} onValueChange={setPipeline}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pipelines.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedTags.includes(tag) && "bg-primary"
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Primary Contact Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="John Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={contactRole} onValueChange={setContactRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO</SelectItem>
                      <SelectItem value="cto">CTO</SelectItem>
                      <SelectItem value="cfo">CFO</SelectItem>
                      <SelectItem value="coo">COO</SelectItem>
                      <SelectItem value="founder">Founder</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://linkedin.com/in/johndoe"
                      value={contactLinkedin}
                      onChange={(e) => setContactLinkedin(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Funding Tab */}
              <TabsContent value="funding" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Total Raised to Date</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="1,000,000"
                      value={totalRaised}
                      onChange={(e) => setTotalRaised(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Last Round Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="500,000"
                        value={lastRoundAmount}
                        onChange={(e) => setLastRoundAmount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Round Type</Label>
                    <Select value={lastRoundType} onValueChange={setLastRoundType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingStages.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Last Round Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={lastRoundDate}
                        onChange={(e) => setLastRoundDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Valuation</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="10,000,000"
                        value={valuation}
                        onChange={(e) => setValuation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Currently Raising?</p>
                    <p className="text-xs text-muted-foreground">Is this startup actively fundraising?</p>
                  </div>
                  <Switch checked={isRaising} onCheckedChange={setIsRaising} />
                </div>

                {isRaising && (
                  <div className="space-y-2">
                    <Label>Target Raise Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="2,000,000"
                        value={targetRaise}
                        onChange={(e) => setTargetRaise(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Initial Notes</Label>
                  <Textarea
                    placeholder="Add any notes about this startup..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label>How did you find this startup?</Label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {source === "Referral" && (
                  <div className="space-y-2">
                    <Label>Referral Source Name</Label>
                    <Input
                      placeholder="Who referred this startup?"
                      value={referralName}
                      onChange={(e) => setReferralName(e.target.value)}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <Button
            variant="ghost"
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            {!isExpanded ? (
              <Button
                onClick={() => handleSubmit(false)}
                disabled={!companyName.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Quick Add"
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(false)}
                  disabled={!companyName.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Startup"
                  )}
                </Button>
                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={!companyName.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      Add & Open Profile
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
