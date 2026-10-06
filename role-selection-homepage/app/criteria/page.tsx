"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Target, 
  TrendingUp, 
  Globe, 
  DollarSign, 
  FileText,
  Users,
  Save,
  AlertCircle,
  Check,
  X,
  Plus,
  Trash2,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

// Sector options
const sectors = [
  "B2B SaaS",
  "Fintech",
  "Healthcare",
  "EdTech",
  "E-commerce",
  "Deep Tech",
  "Climate Tech",
  "Consumer",
  "Enterprise Software",
  "AI/ML",
  "Cybersecurity",
  "DevTools",
]

const excludedSectors = [
  "Gaming",
  "Gambling",
  "Tobacco",
  "Weapons",
  "Adult Content",
  "Cryptocurrency (core business)",
]

const stages = [
  { value: "pre-seed", label: "Pre-Seed", checkSize: "₹50L - ₹2Cr" },
  { value: "seed", label: "Seed", checkSize: "₹2Cr - ₹10Cr" },
  { value: "series-a", label: "Series A", checkSize: "₹10Cr - ₹50Cr" },
  { value: "series-b", label: "Series B", checkSize: "₹50Cr - ₹150Cr" },
  { value: "series-c", label: "Series C+", checkSize: "₹150Cr+" },
]

const markets = [
  "India",
  "Southeast Asia",
  "United States",
  "Europe",
  "Middle East",
  "Latin America",
  "Africa",
]

export default function InvestmentCriteriaPage() {
  const { user } = useAuth()
  const isInstitutionalInvestor = user?.activeRole === "institutional-investor"

  // Sector Preferences
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["B2B SaaS", "Fintech", "Healthcare"])
  const [sectorWeights, setSectorWeights] = useState<Record<string, number>>({
    "B2B SaaS": 40,
    "Fintech": 35,
    "Healthcare": 25,
  })
  const [selectedExcludedSectors, setSelectedExcludedSectors] = useState<string[]>(["Gaming", "Gambling"])
  const [customSectors, setCustomSectors] = useState<string[]>([])

  // Stage Preferences
  const [selectedStages, setSelectedStages] = useState<string[]>(["seed", "series-a"])
  const [stageWeights, setStageWeights] = useState<Record<string, number>>({
    seed: 60,
    "series-a": 40,
  })

  // Geography
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(["India", "Southeast Asia"])
  const [excludedMarkets, setExcludedMarkets] = useState<string[]>([])
  const [remoteOk, setRemoteOk] = useState(true)

  // Financial Criteria
  const [minARR, setMinARR] = useState("")
  const [minMRR, setMinMRR] = useState("")
  const [minRevenueGrowth, setMinRevenueGrowth] = useState("100")
  const [minGrossMargin, setMinGrossMargin] = useState("70")
  const [maxBurnMultiple, setMaxBurnMultiple] = useState("2")

  // Deal Structure
  const [minCheckSize, setMinCheckSize] = useState("2")
  const [maxCheckSize, setMaxCheckSize] = useState("10")
  const [minOwnership, setMinOwnership] = useState("10")
  const [maxOwnership, setMaxOwnership] = useState("20")
  const [requireBoardSeat, setRequireBoardSeat] = useState(false)
  const [requireProRata, setRequireProRata] = useState(true)

  // Qualitative Criteria
  const [techDepthRequired, setTechDepthRequired] = useState(true)
  const [minMarketSize, setMinMarketSize] = useState("1000")
  const [founderExperience, setFounderExperience] = useState("preferred")

  // Criteria Weighting
  const [criteriaImportance, setCriteriaImportance] = useState({
    sector: 85,
    stage: 80,
    geography: 60,
    financial: 90,
    dealStructure: 75,
    qualitative: 70,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSectorToggle = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter((s) => s !== sector))
      const newWeights = { ...sectorWeights }
      delete newWeights[sector]
      setSectorWeights(newWeights)
    } else {
      setSelectedSectors([...selectedSectors, sector])
      setSectorWeights({ ...sectorWeights, [sector]: 0 })
    }
  }

  const handleStageToggle = (stage: string) => {
    if (selectedStages.includes(stage)) {
      setSelectedStages(selectedStages.filter((s) => s !== stage))
      const newWeights = { ...stageWeights }
      delete newWeights[stage]
      setStageWeights(newWeights)
    } else {
      setSelectedStages([...selectedStages, stage])
      setStageWeights({ ...stageWeights, [stage]: 0 })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success("Investment criteria saved successfully")
  }

  // Redirect if not institutional investor
  if (!isInstitutionalInvestor) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="Investment Criteria" />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
                <p className="text-sm text-muted-foreground">
                  This page is only available for institutional investors.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="Investment Criteria" breadcrumbs={[{ label: "Investment Criteria" }]} />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto p-6 pb-20">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Investment Criteria</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your investment preferences to improve deal matching and filtering
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save & Apply"}
                </Button>
              </div>
            </div>

            {/* Sector Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle>Sector Preferences</CardTitle>
                </div>
                <CardDescription>
                  Select your target sectors and assign priority weights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Sectors */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Primary Sectors</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sectors.map((sector) => (
                      <div
                        key={sector}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer transition-all",
                          selectedSectors.includes(sector)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleSectorToggle(sector)}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedSectors.includes(sector)}
                            onCheckedChange={() => handleSectorToggle(sector)}
                          />
                          <span className="text-sm font-medium">{sector}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sector Weights */}
                {selectedSectors.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Sector Weighting (%)</Label>
                    {selectedSectors.map((sector) => (
                      <div key={sector} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{sector}</span>
                          <span className="text-sm font-medium">{sectorWeights[sector] || 0}%</span>
                        </div>
                        <Slider
                          value={[sectorWeights[sector] || 0]}
                          onValueChange={(value) => setSectorWeights({ ...sectorWeights, [sector]: value[0] })}
                          max={100}
                          step={5}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Excluded Sectors */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Excluded Sectors</Label>
                  <div className="flex flex-wrap gap-2">
                    {excludedSectors.map((sector) => (
                      <Badge
                        key={sector}
                        variant={selectedExcludedSectors.includes(sector) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedExcludedSectors((prev) =>
                            prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
                          )
                        }
                      >
                        {selectedExcludedSectors.includes(sector) && <Check className="w-3 h-3 mr-1" />}
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <CardTitle>Stage Preferences</CardTitle>
                </div>
                <CardDescription>Select target investment stages and typical check sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stages.map((stage) => (
                  <div
                    key={stage.value}
                    className={cn(
                      "border rounded-lg p-4 transition-all",
                      selectedStages.includes(stage.value) ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedStages.includes(stage.value)}
                          onCheckedChange={() => handleStageToggle(stage.value)}
                        />
                        <div>
                          <p className="font-medium text-sm">{stage.label}</p>
                          <p className="text-xs text-muted-foreground">Typical: {stage.checkSize}</p>
                        </div>
                      </div>
                      {selectedStages.includes(stage.value) && (
                        <Badge variant="secondary">{stageWeights[stage.value] || 0}%</Badge>
                      )}
                    </div>
                    {selectedStages.includes(stage.value) && (
                      <Slider
                        value={[stageWeights[stage.value] || 0]}
                        onValueChange={(value) =>
                          setStageWeights({ ...stageWeights, [stage.value]: value[0] })
                        }
                        max={100}
                        step={5}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Geography */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <CardTitle>Geography</CardTitle>
                </div>
                <CardDescription>Define your geographic investment focus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Primary Markets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {markets.map((market) => (
                      <div
                        key={market}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer transition-all",
                          selectedMarkets.includes(market)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() =>
                          setSelectedMarkets((prev) =>
                            prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market]
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox checked={selectedMarkets.includes(market)} />
                          <span className="text-sm font-medium">{market}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Remote-First Companies</p>
                    <p className="text-xs text-muted-foreground">Accept companies without physical HQ</p>
                  </div>
                  <Switch checked={remoteOk} onCheckedChange={setRemoteOk} />
                </div>
              </CardContent>
            </Card>

            {/* Financial Criteria */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <CardTitle>Financial Criteria</CardTitle>
                </div>
                <CardDescription>Set minimum financial thresholds for deal filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minARR">Minimum ARR (₹ Crores)</Label>
                    <Input
                      id="minARR"
                      type="number"
                      placeholder="e.g., 5"
                      value={minARR}
                      onChange={(e) => setMinARR(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minMRR">Minimum MRR (₹ Lakhs)</Label>
                    <Input
                      id="minMRR"
                      type="number"
                      placeholder="e.g., 50"
                      value={minMRR}
                      onChange={(e) => setMinMRR(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Minimum Revenue Growth (YoY %)</Label>
                      <span className="text-sm font-medium">{minRevenueGrowth}%</span>
                    </div>
                    <Slider
                      value={[Number(minRevenueGrowth)]}
                      onValueChange={(value) => setMinRevenueGrowth(String(value[0]))}
                      max={300}
                      step={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Minimum Gross Margin (%)</Label>
                      <span className="text-sm font-medium">{minGrossMargin}%</span>
                    </div>
                    <Slider
                      value={[Number(minGrossMargin)]}
                      onValueChange={(value) => setMinGrossMargin(String(value[0]))}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Maximum Burn Multiple</Label>
                      <span className="text-sm font-medium">{maxBurnMultiple}x</span>
                    </div>
                    <Slider
                      value={[Number(maxBurnMultiple)]}
                      onValueChange={(value) => setMaxBurnMultiple(String(value[0]))}
                      max={5}
                      step={0.5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Structure */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle>Deal Structure</CardTitle>
                </div>
                <CardDescription>Define your preferred deal terms and structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minCheck">Minimum Check Size (₹ Crores)</Label>
                    <Input
                      id="minCheck"
                      type="number"
                      value={minCheckSize}
                      onChange={(e) => setMinCheckSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCheck">Maximum Check Size (₹ Crores)</Label>
                    <Input
                      id="maxCheck"
                      type="number"
                      value={maxCheckSize}
                      onChange={(e) => setMaxCheckSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minOwnership">Minimum Ownership (%)</Label>
                    <Input
                      id="minOwnership"
                      type="number"
                      value={minOwnership}
                      onChange={(e) => setMinOwnership(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxOwnership">Target Ownership (%)</Label>
                    <Input
                      id="maxOwnership"
                      type="number"
                      value={maxOwnership}
                      onChange={(e) => setMaxOwnership(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Board Seat Required</p>
                      <p className="text-xs text-muted-foreground">Must include board representation</p>
                    </div>
                    <Switch checked={requireBoardSeat} onCheckedChange={setRequireBoardSeat} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Pro-Rata Rights Required</p>
                      <p className="text-xs text-muted-foreground">Must include pro-rata participation rights</p>
                    </div>
                    <Switch checked={requireProRata} onCheckedChange={setRequireProRata} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Qualitative Criteria */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>Qualitative Criteria</CardTitle>
                </div>
                <CardDescription>Team, market, and other qualitative requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="marketSize">Minimum TAM (₹ Crores)</Label>
                  <Input
                    id="marketSize"
                    type="number"
                    value={minMarketSize}
                    onChange={(e) => setMinMarketSize(e.target.value)}
                    placeholder="e.g., 1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founderExp">Founder Experience Requirement</Label>
                  <Select value={founderExperience} onValueChange={setFounderExperience}>
                    <SelectTrigger id="founderExp">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Required (Previous startup or domain experience)</SelectItem>
                      <SelectItem value="preferred">Preferred but not required</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Technical Depth Required</p>
                    <p className="text-xs text-muted-foreground">Strong technical co-founder or CTO</p>
                  </div>
                  <Switch checked={techDepthRequired} onCheckedChange={setTechDepthRequired} />
                </div>
              </CardContent>
            </Card>

            {/* Criteria Weighting */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  <CardTitle>Criteria Importance</CardTitle>
                </div>
                <CardDescription>
                  Adjust the importance of each category for AI matching and scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(criteriaImportance).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize text-sm">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <Badge variant="secondary">{value}%</Badge>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) =>
                        setCriteriaImportance({ ...criteriaImportance, [key]: newValue[0] })
                      }
                      max={100}
                      step={5}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Actions */}
            <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Apply Changes</p>
                  <p className="text-xs text-muted-foreground">
                    Saving will update your deal flow filtering and AI match scores
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save & Apply"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
