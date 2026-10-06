"use client"

import React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  FileBarChart,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const reportTypes = [
  { id: "market-analysis", label: "Market Analysis", icon: TrendingUp },
  { id: "due-diligence", label: "Due Diligence", icon: FileBarChart },
  { id: "financial", label: "Financial Report", icon: DollarSign },
  { id: "investment", label: "Investment Summary", icon: Building2 },
  { id: "portfolio", label: "Portfolio Report", icon: Users },
]

const mockStartups = [
  { id: "1", name: "TechCorp AI" },
  { id: "2", name: "GreenLeaf Energy" },
  { id: "3", name: "HealthBridge" },
  { id: "4", name: "EduSpark" },
  { id: "5", name: "LogiFlow" },
]

const mockInvestors = [
  { id: "1", name: "Sequoia Capital" },
  { id: "2", name: "Accel Partners" },
  { id: "3", name: "Matrix Partners India" },
]

export function CreateReportModal({ open, onOpenChange }: CreateReportModalProps) {
  const [reportType, setReportType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [relatedToType, setRelatedToType] = useState<"startup" | "investor" | "none">("none")
  const [relatedTo, setRelatedTo] = useState("")
  const [sections, setSections] = useState({
    executive: true,
    market: false,
    financial: false,
    risks: false,
    recommendations: false,
  })
  const [includeCharts, setIncludeCharts] = useState(true)
  const [dateRange, setDateRange] = useState("last-quarter")

  const handleSubmit = () => {
    // Here you would submit the report creation request
    console.log({
      reportType,
      title,
      description,
      relatedToType,
      relatedTo,
      sections,
      includeCharts,
      dateRange,
    })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setReportType("")
    setTitle("")
    setDescription("")
    setRelatedToType("none")
    setRelatedTo("")
    setSections({
      executive: true,
      market: false,
      financial: false,
      risks: false,
      recommendations: false,
    })
    setIncludeCharts(true)
    setDateRange("last-quarter")
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  const isFormValid = reportType && title && (relatedToType === "none" || relatedTo)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-primary" />
            Create New Report
          </DialogTitle>
          <DialogDescription>
            Generate a comprehensive report with customized sections and data
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Report Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Report Type *</Label>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                      reportType === type.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">
              Report Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Q4 2024 Market Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add any specific details or focus areas for this report..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Related To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Related To</Label>
              <Select
                value={relatedToType}
                onValueChange={(value) => {
                  setRelatedToType(value as "startup" | "investor" | "none")
                  setRelatedTo("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="startup">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Startup
                    </div>
                  </SelectItem>
                  <SelectItem value="investor">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Investor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entity Selector */}
            {relatedToType !== "none" && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Select {relatedToType === "startup" ? "Startup" : "Investor"}
                </Label>
                <Select value={relatedTo} onValueChange={setRelatedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${relatedToType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(relatedToType === "startup" ? mockStartups : mockInvestors).map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Data Period</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="year-to-date">Year to Date</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report Sections */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Include Sections</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="executive"
                  checked={sections.executive}
                  onCheckedChange={(checked) =>
                    setSections({ ...sections, executive: checked as boolean })
                  }
                />
                <Label htmlFor="executive" className="text-sm font-normal cursor-pointer">
                  Executive Summary
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="market"
                  checked={sections.market}
                  onCheckedChange={(checked) =>
                    setSections({ ...sections, market: checked as boolean })
                  }
                />
                <Label htmlFor="market" className="text-sm font-normal cursor-pointer">
                  Market Analysis
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financial"
                  checked={sections.financial}
                  onCheckedChange={(checked) =>
                    setSections({ ...sections, financial: checked as boolean })
                  }
                />
                <Label htmlFor="financial" className="text-sm font-normal cursor-pointer">
                  Financial Data
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="risks"
                  checked={sections.risks}
                  onCheckedChange={(checked) =>
                    setSections({ ...sections, risks: checked as boolean })
                  }
                />
                <Label htmlFor="risks" className="text-sm font-normal cursor-pointer">
                  Risk Assessment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommendations"
                  checked={sections.recommendations}
                  onCheckedChange={(checked) =>
                    setSections({ ...sections, recommendations: checked as boolean })
                  }
                />
                <Label htmlFor="recommendations" className="text-sm font-normal cursor-pointer">
                  Recommendations
                </Label>
              </div>
            </div>
          </div>

          {/* Include Charts */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="charts"
              checked={includeCharts}
              onCheckedChange={setIncludeCharts}
            />
            <Label htmlFor="charts" className="text-sm font-normal cursor-pointer">
              Include charts and visualizations
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Create Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
