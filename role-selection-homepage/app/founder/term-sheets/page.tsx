"use client"

import React from "react"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Plus,
  FileText,
  Download,
  Share2,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
} from "lucide-react"
import { toast } from "sonner"

interface TermSheet {
  id: string
  investorName: string
  uploadDate: string
  terms: {
    preMoneyValuation: string
    investmentAmount: string
    postMoneyValuation: string
    dilution: string
    boardSeats: string
    liquidationPreference: string
    antiDilution: string
    votingRights: string
    dragAlong: string
    tagAlong: string
    proRata: string
    informationRights: string
  }
}

const termDefinitions = {
  preMoneyValuation: {
    definition: "Company valuation before the new investment",
    benchmark: "Industry standard varies by stage and sector",
    goodIndicator: "higher",
  },
  investmentAmount: {
    definition: "Total capital being invested",
    benchmark: "Should align with your fundraising goals",
    goodIndicator: "neutral",
  },
  dilution: {
    definition: "Percentage of ownership you're giving up",
    benchmark: "15-25% for Series A, 10-15% for Series B",
    goodIndicator: "lower",
  },
  liquidationPreference: {
    definition: "Priority of payment in exit scenarios",
    benchmark: "1x non-participating is founder-friendly",
    goodIndicator: "1x NP",
  },
  antiDilution: {
    definition: "Protection against down rounds",
    benchmark: "Weighted average is more founder-friendly than full ratchet",
    goodIndicator: "weighted",
  },
  votingRights: {
    definition: "Investor's say in major decisions",
    benchmark: "Pro-rata voting is standard",
    goodIndicator: "standard",
  },
}

const getIndicatorColor = (term: string, value: string): "green" | "yellow" | "red" => {
  // Simplified logic for demo
  if (term === "liquidationPreference") {
    if (value.includes("1x NP")) return "green"
    if (value.includes("1x P")) return "yellow"
    return "red"
  }
  if (term === "antiDilution") {
    if (value.toLowerCase().includes("weighted")) return "green"
    if (value.toLowerCase().includes("broad")) return "yellow"
    return "red"
  }
  if (term === "dilution") {
    const percentage = parseFloat(value)
    if (percentage <= 20) return "green"
    if (percentage <= 25) return "yellow"
    return "red"
  }
  return "green"
}

export default function TermSheetsPage() {
  const [termSheets, setTermSheets] = useState<TermSheet[]>([
    {
      id: "1",
      investorName: "Sequoia Capital",
      uploadDate: "Jan 20, 2026",
      terms: {
        preMoneyValuation: "₹60 Cr",
        investmentAmount: "₹15 Cr",
        postMoneyValuation: "₹75 Cr",
        dilution: "20%",
        boardSeats: "1",
        liquidationPreference: "1x Non-Participating",
        antiDilution: "Weighted Average",
        votingRights: "Pro-rata",
        dragAlong: "Yes",
        tagAlong: "Yes",
        proRata: "Yes",
        informationRights: "Standard",
      },
    },
    {
      id: "2",
      investorName: "Accel Partners",
      uploadDate: "Jan 22, 2026",
      terms: {
        preMoneyValuation: "₹55 Cr",
        investmentAmount: "₹12 Cr",
        postMoneyValuation: "₹67 Cr",
        dilution: "18%",
        boardSeats: "1",
        liquidationPreference: "1x Participating",
        antiDilution: "Full Ratchet",
        votingRights: "Pro-rata",
        dragAlong: "Yes",
        tagAlong: "Yes (90%)",
        proRata: "Yes",
        informationRights: "Enhanced",
      },
    },
    {
      id: "3",
      investorName: "Matrix Partners",
      uploadDate: "Jan 24, 2026",
      terms: {
        preMoneyValuation: "₹65 Cr",
        investmentAmount: "₹15 Cr",
        postMoneyValuation: "₹80 Cr",
        dilution: "19%",
        boardSeats: "2",
        liquidationPreference: "1x Non-Participating",
        antiDilution: "Weighted Average",
        votingRights: "Standard",
        dragAlong: "Yes (75%)",
        tagAlong: "Yes",
        proRata: "Yes",
        informationRights: "Standard",
      },
    },
  ])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [manualEntryOpen, setManualEntryOpen] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("[v0] Term sheet uploaded:", file.name)
      toast.success(`${file.name} uploaded successfully. AI is extracting terms...`)
      setTimeout(() => {
        toast.success("Terms extracted successfully!")
        setUploadOpen(false)
      }, 2000)
    }
  }

  const exportComparison = () => {
    toast.success("Generating PDF comparison report...")
    console.log("[v0] Exporting term sheet comparison")
  }

  const shareComparison = () => {
    toast.success("Share link copied to clipboard!")
    console.log("[v0] Sharing comparison with advisors")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Term Sheet Comparison</h1>
                <p className="text-muted-foreground mt-1">
                  Compare offers side-by-side and make informed decisions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={shareComparison} className="gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={exportComparison} className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Term Sheet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Term Sheet</DialogTitle>
                      <DialogDescription>
                        Upload a term sheet or enter terms manually
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upload" className="space-y-4 pt-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">
                              Upload term sheet
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              PDF or DOCX (AI will extract terms automatically)
                            </p>
                            <input
                              type="file"
                              id="term-sheet-upload"
                              accept=".pdf,.docx"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <Button variant="outline" size="sm" asChild>
                              <label htmlFor="term-sheet-upload" className="cursor-pointer">
                                Choose File
                              </label>
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="manual" className="space-y-4 pt-4">
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="investor-name">Investor Name</Label>
                            <Input id="investor-name" placeholder="e.g., Sequoia Capital" />
                          </div>
                          <div>
                            <Label htmlFor="pre-money">Pre-money Valuation</Label>
                            <Input id="pre-money" placeholder="e.g., ₹60 Cr" />
                          </div>
                          <div>
                            <Label htmlFor="investment">Investment Amount</Label>
                            <Input id="investment" placeholder="e.g., ₹15 Cr" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            More fields will be available after initial entry
                          </p>
                        </div>
                        <Button className="w-full">Save & Continue</Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Side-by-Side Comparison</CardTitle>
                <CardDescription>
                  Hover over any term to see definition and industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <TooltipProvider>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">Term</TableHead>
                          {termSheets.map((sheet) => (
                            <TableHead key={sheet.id} className="text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-semibold">{sheet.investorName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {sheet.uploadDate}
                                </span>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1.5 cursor-help">
                                Pre-money Valuation
                                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">
                                  {termDefinitions.preMoneyValuation.definition}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {termDefinitions.preMoneyValuation.benchmark}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.preMoneyValuation}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1.5 cursor-help">
                                Investment Amount
                                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">
                                  {termDefinitions.investmentAmount.definition}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {termDefinitions.investmentAmount.benchmark}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.investmentAmount}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">Post-money Valuation</TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.postMoneyValuation}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1.5 cursor-help">
                                Dilution
                                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">
                                  {termDefinitions.dilution.definition}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {termDefinitions.dilution.benchmark}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          {termSheets.map((sheet) => {
                            const color = getIndicatorColor("dilution", sheet.terms.dilution)
                            return (
                              <TableCell key={sheet.id} className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {sheet.terms.dilution}
                                  {color === "green" && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                  {color === "yellow" && (
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                  )}
                                  {color === "red" && (
                                    <XCircle className="w-4 h-4 text-destructive" />
                                  )}
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">Board Seats</TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.boardSeats}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1.5 cursor-help">
                                Liquidation Preference
                                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">
                                  {termDefinitions.liquidationPreference.definition}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {termDefinitions.liquidationPreference.benchmark}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          {termSheets.map((sheet) => {
                            const color = getIndicatorColor(
                              "liquidationPreference",
                              sheet.terms.liquidationPreference
                            )
                            return (
                              <TableCell key={sheet.id} className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {sheet.terms.liquidationPreference}
                                  {color === "green" && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                  {color === "yellow" && (
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                  )}
                                  {color === "red" && (
                                    <XCircle className="w-4 h-4 text-destructive" />
                                  )}
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1.5 cursor-help">
                                Anti-dilution
                                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">
                                  {termDefinitions.antiDilution.definition}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {termDefinitions.antiDilution.benchmark}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          {termSheets.map((sheet) => {
                            const color = getIndicatorColor(
                              "antiDilution",
                              sheet.terms.antiDilution
                            )
                            return (
                              <TableCell key={sheet.id} className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {sheet.terms.antiDilution}
                                  {color === "green" && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                  {color === "yellow" && (
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                  )}
                                  {color === "red" && (
                                    <XCircle className="w-4 h-4 text-destructive" />
                                  )}
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">Voting Rights</TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.votingRights}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">Drag-Along Rights</TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.dragAlong}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">Tag-Along Rights</TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.tagAlong}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">Pro-rata Rights</TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.proRata}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium">Information Rights</TableCell>
                          {termSheets.map((sheet) => (
                            <TableCell key={sheet.id} className="text-center">
                              {sheet.terms.informationRights}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Founder-friendly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Standard / Negotiable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span>Investor-favorable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
