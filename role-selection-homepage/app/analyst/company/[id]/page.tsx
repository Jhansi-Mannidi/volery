"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Link2, MoreHorizontal, Plus, Save, Search, Send, Share2, Check, Clock, BookOpen, MessageSquare, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Sparkles, Copy, ListMinus as Dismiss, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ScrollArea } from "@/components/ui/scroll-area"

const researchSections = [
  { id: "overview", label: "Company Overview", completed: true },
  { id: "market", label: "Market Analysis", completed: true },
  { id: "competitive", label: "Competitive Landscape", completed: true },
  { id: "financial", label: "Financial Analysis", completed: false, active: true },
  { id: "team", label: "Team Assessment", completed: false },
  { id: "risk", label: "Risk Analysis", completed: false },
  { id: "thesis", label: "Investment Thesis", completed: false },
  { id: "recommendation", label: "Recommendation", completed: false },
]

const attachedSources = [
  { id: 1, name: "Pitch Deck v3.pdf", type: "file", status: "analyzed", icon: "📄" },
  { id: 2, name: "Financial Model.xlsx", type: "file", status: "analyzed", icon: "📊" },
  { id: 3, name: "Cap Table.pdf", type: "file", status: "partial", progress: 60, icon: "📄" },
  { id: 4, name: "Crunchbase Profile", type: "link", status: "linked", icon: "🔗" },
  { id: 5, name: "LinkedIn (Founders)", type: "link", status: "linked", icon: "🔗" },
]

const researchNotes = [
  "Market size verification",
  "Competitor pricing analysis",
  "Customer interview summary",
  "Revenue projection assumptions",
  "Team track record research",
  "Regulatory compliance check",
  "Customer reference calls",
  "Technology stack assessment",
]

const aiSuggestions = [
  {
    id: 1,
    text: 'The customer concentration (60%) is above typical Series A threshold of 40%. Consider requesting customer diversification plans.',
    type: "warning",
    icon: "⚠️",
  },
  {
    id: 2,
    text: "Found 3 recent competitor funding rounds. Would you like me to add them to your competitive analysis?",
    type: "info",
    icon: "💡",
  },
]

export default function CompanyResearchWorkspace() {
  const [activeSection, setActiveSection] = useState("financial")
  const [isSaved, setIsSaved] = useState(true)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set())
  const [leftPanelWidth, setLeftPanelWidth] = useState(280)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const textEditorRef = useRef<HTMLDivElement>(null)

  // Auto-save simulation
  useEffect(() => {
    const handleChange = () => {
      setIsSaved(false)
      setShowSaveIndicator(true)
    }

    const timer = setTimeout(() => {
      setIsSaved(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleQuickAction = (action: string) => {
    const messages: Record<string, string> = {
      analyze: "Please analyze the financial metrics from the uploaded documents.",
      competitors: "Can you identify similar companies and create a competitive comparison?",
      benchmark: "Show me how TechCorp AI's metrics compare to industry benchmarks.",
      draft: "Draft a summary of the financial analysis for the investment memo.",
      flags: "What are the main red flags you identify in this financial data?",
    }
    setChatMessages([...chatMessages, { role: "user", text: messages[action] || action }])
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    setChatMessages([...chatMessages, { role: "user", text: chatInput }])
    setChatInput("")
  }

  const toggleSuggestion = (id: number) => {
    const newSelected = new Set(selectedSuggestions)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSuggestions(newSelected)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userRole="research-analyst" />
      <div className="flex-1 overflow-hidden flex flex-col">
        <DashboardHeader userRole="research-analyst" />

        {/* Breadcrumb */}
        <div className="border-b px-6 py-3 bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/role-selection" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/analyst/research-queue" className="hover:text-foreground">
              Research
            </Link>
            <span>/</span>
            <Link href="/analyst/research-queue" className="hover:text-foreground">
              Research Queue
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">TechCorp AI</span>
          </div>
        </div>

        {/* Company Header */}
        <div className="border-b px-6 py-4 bg-background">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                TC
              </div>
              <div>
                <h1 className="text-2xl font-semibold">TechCorp AI</h1>
                <p className="text-sm text-muted-foreground">AI-powered financial document analysis</p>
              </div>
              <Badge className="ml-4 bg-teal-100 text-teal-700 border-teal-200">
                In Progress
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-teal-500 rounded-full" />
                </div>
                <span className="text-sm font-semibold text-foreground">80%</span>
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaved(false)}
                className={cn(isSaved && "text-green-600 border-green-200")}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaved ? "Saved" : "Save"}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => setShowCompleteModal(true)}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Duplicate Research</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Download Source Files</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Navigation & Sources */}
          <div
            className="border-r bg-muted/30 flex flex-col overflow-hidden"
            style={{ width: `${leftPanelWidth}px` }}
          >
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Research Sections */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Research Sections
                  </h3>
                  <div className="space-y-2">
                    {researchSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                          activeSection === section.id
                            ? "bg-teal-100 text-teal-900 font-medium"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="text-base">
                          {section.completed ? "☑️" : "☐"}
                        </span>
                        <span className="flex-1">{section.label}</span>
                        {section.active && <span className="text-xs font-semibold">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4" />

                {/* Attached Sources */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Sources ({attachedSources.length})
                    </h3>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {attachedSources.map((source) => (
                      <div
                        key={source.id}
                        className="p-2.5 bg-background rounded-lg border hover:border-teal-300 cursor-pointer transition-colors text-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{source.icon}</span>
                          <span className="font-medium truncate text-xs">{source.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {source.status === "analyzed" && "✓ Analyzed"}
                          {source.status === "linked" && "✓ Linked"}
                          {source.status === "partial" && `⏳ ${source.progress}%`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4" />

                {/* Research Notes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Notes ({researchNotes.length})
                    </h3>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {researchNotes.map((note, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1">
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Center Panel - Main Workspace */}
          <div className="flex-1 overflow-auto flex flex-col">
            <ScrollArea className="flex-1">
              <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Section Title */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Financial Analysis</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isSaved ? "All changes saved" : "Saving changes..."}
                    </p>
                  </div>
                  {showSaveIndicator && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Auto-saved
                    </Badge>
                  )}
                </div>

                {/* AI-Extracted Data */}
                <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-teal-600" />
                      AI-Extracted Data (from Financial Model.xlsx)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Revenue Metrics */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm">Revenue Metrics</h4>
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                          Confidence: 94%
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">Current ARR:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">₹12 Cr</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">MRR:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">₹1 Cr</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">YoY Growth:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">180%</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">MoM Growth:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">15%</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unit Economics */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm">Unit Economics</h4>
                        <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700">
                          Confidence: 87%
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">CAC:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">₹45,000</span>
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">LTV:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">₹3,60,000</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">LTV/CAC:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">8x</span>
                            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 text-xs">
                              Strong
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">Payback Period:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">4 months</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                        Accept All
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Edit Values
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Request Clarification
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Analysis Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Your Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      ref={textEditorRef}
                      className="min-h-96 p-4 bg-background border rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none prose prose-sm max-w-none"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={() => setIsSaved(false)}
                    >
                      <h3>Financial Health Assessment</h3>
                      <p>
                        TechCorp AI demonstrates strong financial fundamentals:
                      </p>
                      <h4>Strengths:</h4>
                      <ul>
                        <li>Exceptional revenue growth (180% YoY)</li>
                        <li>Strong unit economics with 8x LTV/CAC ratio</li>
                        <li>Efficient customer acquisition with 4-month payback</li>
                      </ul>
                      <h4>Concerns:</h4>
                      <ul>
                        <li>Customer concentration: Top 3 customers = 60% revenue</li>
                        <li>Rising CAC trend (up 15% from last quarter)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparable Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Comparable Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-semibold">Company</th>
                            <th className="text-left py-2 font-semibold">ARR</th>
                            <th className="text-left py-2 font-semibold">Growth</th>
                            <th className="text-left py-2 font-semibold">LTV/CAC</th>
                            <th className="text-left py-2 font-semibold">Valuation</th>
                            <th className="text-left py-2 font-semibold">Multiple</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr className="bg-teal-50">
                            <td className="py-3 font-semibold">TechCorp AI</td>
                            <td>₹12 Cr</td>
                            <td>180%</td>
                            <td>8x</td>
                            <td>₹300 Cr</td>
                            <td className="font-semibold">25x</td>
                          </tr>
                          <tr>
                            <td className="py-3">Competitor A</td>
                            <td>₹25 Cr</td>
                            <td>120%</td>
                            <td>6x</td>
                            <td>₹500 Cr</td>
                            <td>20x</td>
                          </tr>
                          <tr>
                            <td className="py-3">Competitor B</td>
                            <td>₹8 Cr</td>
                            <td>200%</td>
                            <td>10x</td>
                            <td>₹280 Cr</td>
                            <td>35x</td>
                          </tr>
                          <tr>
                            <td className="py-3">Industry Avg</td>
                            <td>-</td>
                            <td>85%</td>
                            <td>5x</td>
                            <td>-</td>
                            <td>15x</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        + Add Comparable
                      </Button>
                      <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                        <Sparkles className="w-3 h-3 mr-2" />
                        Find Similar Companies
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous: Competitive
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700">Save & Continue</Button>
                  <Button variant="outline">
                    Next: Team Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - AI Assistant */}
          <div
            className="border-l bg-muted/40 flex flex-col overflow-hidden"
            style={{ width: `${rightPanelWidth}px` }}
          >
            <div className="border-b p-4 bg-background">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                AI Research Assistant
              </h3>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Quick Actions</p>
                  <div className="space-y-2">
                    {[
                      { id: "analyze", label: "📊 Analyze financials", action: "analyze" },
                      { id: "competitors", label: "🔍 Find competitors", action: "competitors" },
                      { id: "benchmark", label: "📈 Benchmark metrics", action: "benchmark" },
                      { id: "draft", label: "📝 Draft section summary", action: "draft" },
                      { id: "flags", label: "⚠️ Identify red flags", action: "flags" },
                    ].map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-2 bg-transparent"
                        onClick={() => handleQuickAction(action.action)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4" />

                {/* Recent Suggestions */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Recent Suggestions</p>
                  {aiSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="p-3 cursor-pointer hover:bg-teal-50 transition-colors">
                      <p className="text-xs text-muted-foreground mb-2">
                        <span className="mr-2">{suggestion.icon}</span>
                        {suggestion.text}
                      </p>
                      <div className="flex gap-1">
                        {suggestion.type === "warning" && (
                          <>
                            <Button size="sm" variant="outline" className="flex-1 text-xs h-7 bg-transparent">
                              Apply to Report
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 text-xs h-7"
                              onClick={() => toggleSuggestion(suggestion.id)}
                            >
                              Dismiss
                            </Button>
                          </>
                        )}
                        {suggestion.type === "info" && (
                          <>
                            <Button size="sm" variant="outline" className="flex-1 text-xs h-7 bg-transparent">
                              Yes, Add
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs h-7 bg-transparent">
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 text-xs h-7"
                              onClick={() => toggleSuggestion(suggestion.id)}
                            >
                              Skip
                            </Button>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4" />

                {/* Chat */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Chat</p>
                  <div className="space-y-2 min-h-32 max-h-48 overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={cn("text-xs", msg.role === "user" ? "text-right" : "text-left")}>
                        <div
                          className={cn(
                            "inline-block max-w-xs p-2 rounded-lg",
                            msg.role === "user"
                              ? "bg-teal-600 text-white"
                              : "bg-muted text-foreground border"
                          )}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask AI..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="text-xs h-8"
                    />
                    <Button size="sm" onClick={handleSendMessage} className="bg-teal-600 hover:bg-teal-700 h-8 px-2">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Research</DialogTitle>
            <DialogDescription>
              Share this research with your team or download as PDF
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              📧 Share with Partner
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              📄 Export as PDF
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              🔗 Generate Share Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Modal */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Complete?</DialogTitle>
            <DialogDescription>
              This will move TechCorp AI to Partner Review stage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4 text-sm">
            <p className="text-muted-foreground">Current Progress: 80%</p>
            <p className="text-muted-foreground">
              Remaining sections: Team Assessment, Risk Analysis, Investment Thesis, Recommendation
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteModal(false)}>
              Continue Editing
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">Mark Complete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
