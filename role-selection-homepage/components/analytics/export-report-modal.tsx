"use client"

import React from "react"

import { useState } from "react"
import {
  X,
  FileText,
  FileSpreadsheet,
  Presentation,
  Database,
  Mail,
  Link2,
  Settings,
  Download,
  Loader2,
  Check,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { exportToCsv } from "@/lib/export-utils"

interface ExportOption {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  format?: string
}

const exportOptions: ExportOption[] = [
  {
    id: "pdf",
    icon: FileText,
    title: "PDF Report",
    description: "Full dashboard as PDF document",
    format: ".pdf",
  },
  {
    id: "excel",
    icon: FileSpreadsheet,
    title: "Excel Workbook",
    description: "All data in spreadsheet format",
    format: ".xlsx",
  },
  {
    id: "powerpoint",
    icon: Presentation,
    title: "PowerPoint Presentation",
    description: "Executive slides with charts",
    format: ".pptx",
  },
  {
    id: "powerbi",
    icon: Database,
    title: "PowerBI Dataset",
    description: "Connect to PowerBI for analysis",
    format: ".pbix",
  },
  {
    id: "email",
    icon: Mail,
    title: "Email Report",
    description: "Send to recipients now",
  },
  {
    id: "sharelink",
    icon: Link2,
    title: "Share Link",
    description: "Generate shareable URL",
  },
  {
    id: "custom",
    icon: Settings,
    title: "Custom Export",
    description: "Choose specific sections",
  },
]

/** Simple CSV data export: when provided, modal shows "Export as CSV" and uses shared export utility. */
export interface DataExportConfig {
  title: string
  headers: string[]
  rows: (string | number)[][]
  filename: string
}

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  /** Analytics report mode: tab + filters. Omit when using dataExport. */
  currentTab?: string
  filters?: {
    dateRange: string
    sectors: string[]
    stages: string[]
  }
  /** Simple CSV export mode: when set, modal shows single "Export as CSV" action using reusable export. */
  dataExport?: DataExportConfig
}

export function ExportReportModal({
  isOpen,
  onClose,
  currentTab = "",
  filters = { dateRange: "", sectors: [], stages: [] },
  dataExport,
}: ExportReportModalProps) {
  const { toast } = useToast()
  const [selectedExport, setSelectedExport] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [showShareLink, setShowShareLink] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [showCustomOptions, setShowCustomOptions] = useState(false)
  const [customSections, setCustomSections] = useState({
    funnel: true,
    metrics: true,
    velocity: true,
    quality: true,
  })

  const handleDataExportCsv = () => {
    if (!dataExport) return
    exportToCsv({
      headers: dataExport.headers,
      rows: dataExport.rows,
      filename: dataExport.filename,
    })
    toast({
      title: "Export complete",
      description: "Data has been downloaded as CSV.",
      duration: 3000,
    })
    onClose()
  }

  const handleExportClick = (optionId: string) => {
    if (optionId === "email") {
      setShowEmailForm(true)
      setSelectedExport(optionId)
    } else if (optionId === "sharelink") {
      setShowShareLink(true)
      setSelectedExport(optionId)
    } else if (optionId === "custom") {
      setShowCustomOptions(true)
      setSelectedExport(optionId)
    } else {
      handleExport(optionId)
    }
  }

  const handleExport = async (format: string) => {
    setSelectedExport(format)
    setIsExporting(true)
    setShowProgressDialog(true)
    setExportProgress(0)

    // Simulate progressive export with realistic timing
    const progressSteps = [
      { progress: 15, delay: 300, label: "Preparing data..." },
      { progress: 35, delay: 400, label: "Generating charts..." },
      { progress: 55, delay: 500, label: "Formatting document..." },
      { progress: 75, delay: 400, label: "Applying styles..." },
      { progress: 90, delay: 300, label: "Finalizing..." },
      { progress: 100, delay: 200, label: "Complete!" },
    ]

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay))
      setExportProgress(step.progress)
    }

    setIsExporting(false)
    setExportComplete(true)

    // Show success state for 1.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setExportComplete(false)
    setShowProgressDialog(false)
    setSelectedExport(null)
    setExportProgress(0)

    // Close modal and show toast
    onClose()
    
    toast({
      title: "Download Complete",
      description: `Your ${format.toUpperCase()} report has been successfully downloaded.`,
      duration: 3000,
    })
  }

  const handleEmailSend = async () => {
    if (!emailRecipients.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one email address.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsExporting(false)
    setExportComplete(true)

    toast({
      title: "Email Sent",
      description: `Report sent to ${emailRecipients}`,
      duration: 3000,
    })

    setTimeout(() => {
      setExportComplete(false)
      setShowEmailForm(false)
      setEmailRecipients("")
      setEmailSubject("")
      setSelectedExport(null)
      onClose()
    }, 2000)
  }

  const handleGenerateShareLink = () => {
    const newShareUrl = `https://volery.io/reports/share/${Math.random().toString(36).substr(2, 9)}`
    setShareUrl(newShareUrl)

    toast({
      title: "Link Generated",
      description: "Share link copied to clipboard",
      duration: 3000,
    })
  }

  const handleCustomExport = async () => {
    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExporting(false)
    setExportComplete(true)

    const sections = Object.entries(customSections)
      .filter(([, selected]) => selected)
      .map(([name]) => name)

    toast({
      title: "Custom Export Complete",
      description: `Exported: ${sections.join(", ")}`,
      duration: 3000,
    })

    setTimeout(() => {
      setExportComplete(false)
      setShowCustomOptions(false)
      setSelectedExport(null)
      onClose()
    }, 2000)
  }

  const getExportTitle = () => {
    if (!selectedExport) return ""
    const option = exportOptions.find(opt => opt.id === selectedExport)
    return option?.title || ""
  }

  return (
    <>
      {/* Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {exportComplete ? "Download Complete" : `Generating ${getExportTitle()}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!exportComplete ? (
              <>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - exportProgress / 100)}`}
                        className="text-primary transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{exportProgress}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={exportProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {exportProgress < 35 && "Preparing data..."}
                    {exportProgress >= 35 && exportProgress < 55 && "Generating charts..."}
                    {exportProgress >= 55 && exportProgress < 75 && "Formatting document..."}
                    {exportProgress >= 75 && exportProgress < 90 && "Applying styles..."}
                    {exportProgress >= 90 && exportProgress < 100 && "Finalizing..."}
                    {exportProgress === 100 && "Complete!"}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Successfully Downloaded</h3>
                  <p className="text-sm text-muted-foreground">
                    Your {getExportTitle()} has been generated and saved to your downloads folder.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Export Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dataExport ? dataExport.title : "Export Report"}</DialogTitle>
          </DialogHeader>

          {dataExport ? (
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Download the current data as a CSV file for use in spreadsheets or analysis.
              </p>
              <Button onClick={handleDataExportCsv} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
            </div>
          ) : !showEmailForm && !showShareLink && !showCustomOptions ? (
            <div className="space-y-6">
              {/* Export Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exportOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedExport === option.id
                  const isCompleting = exportComplete && selectedExport === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleExportClick(option.id)}
                      disabled={isExporting || exportComplete}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-input hover:border-primary/50"
                      } ${isExporting || exportComplete ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          {isCompleting ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : isExporting && isSelected ? (
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          ) : (
                            <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-medium text-sm ${
                              isSelected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {option.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {option.description}
                          </p>
                          {option.format && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Format: {option.format}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Info Box */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Export includes data from{" "}
                  <strong>{currentTab}</strong> tab with applied filters ({filters.dateRange})
                </p>
              </div>
            </div>
          ) : showEmailForm ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipients" className="text-sm">
                  Email Recipients
                </Label>
                <Input
                  id="recipients"
                  placeholder="email@example.com, another@example.com"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple addresses with commas
                </p>
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm">
                  Email Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Analytics Report - January 2024"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailForm(false)}
                  disabled={isExporting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleEmailSend}
                  disabled={isExporting || !emailRecipients.trim()}
                  className="flex-1"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : showShareLink ? (
            <div className="space-y-4">
              {!shareUrl ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Generate a shareable link to your report. This link will be valid for 30 days.
                  </p>
                  <Button onClick={handleGenerateShareLink} className="w-full">
                    <Link2 className="w-4 h-4 mr-2" />
                    Generate Share Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Share this link with others:</p>
                  <div className="flex gap-2">
                    <Input value={shareUrl} readOnly className="flex-1" />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        toast({
                          title: "Copied",
                          description: "Link copied to clipboard",
                          duration: 2000,
                        })
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Valid for 30 days from creation</p>
                    <p>• Shared with read-only access</p>
                    <p>• Can be revoked anytime</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowShareLink(false)
                    setShareUrl("")
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : showCustomOptions ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select which sections to include in your export:
              </p>

              <div className="space-y-3">
                {Object.entries(customSections).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setCustomSections({ ...customSections, [key]: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-input"
                    />
                    <span className="text-sm capitalize text-foreground">
                      {key === "funnel" && "Pipeline Funnel"}
                      {key === "metrics" && "Conversion Metrics"}
                      {key === "velocity" && "Pipeline Velocity"}
                      {key === "quality" && "Match Quality"}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCustomOptions(false)}
                  disabled={isExporting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCustomExport}
                  disabled={isExporting || !Object.values(customSections).some((v) => v)}
                  className="flex-1"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export Custom Report
                    </>
                  )}
                </Button>
              </div>
            </div>
        ) : null}
      </DialogContent>
    </Dialog>
    </>
  )
}
