"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Download,
  Eye,
  MoreVertical,
  Save,
  Upload,
  Plus,
  Sparkles,
  Send,
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  Quote,
  Code,
  Link2,
  ImageIcon,
  BarChart3,
  Table,
  CheckCircle,
  AlertTriangle,
  Minimize2,
  Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { cn } from "@/lib/utils"

// Mock research data
const mockResearchData = {
  id: "1",
  company: "TechCorp AI",
  description: "AI-powered financial document analysis",
  sector: "Fintech",
  stage: "Series A",
  raising: "₹25 Cr",
  progress: 45,
  assignee: "Vikram Mehta",
  dueDate: "28 Jan 2026",
  status: "in-progress",
}

export default function ResearchWorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hi! I'm your AI research assistant. How can I help you analyze this company?" },
  ])
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        { role: "user", content: messageInput },
        { role: "assistant", content: "I'm analyzing this information. Let me compile the relevant insights..." },
      ])
      setMessageInput("")
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title={`Research: ${mockResearchData.company}`} />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Top Toolbar */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h2 className="font-semibold">{mockResearchData.company}</h2>
                    <p className="text-xs text-muted-foreground">{mockResearchData.sector} • {mockResearchData.stage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Outline */}
              <div className="w-64 border-r bg-muted/30 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    <Card className="bg-background/50">
                      <CardContent className="pt-4">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className="ml-2 bg-teal-100 text-teal-700">In Progress</Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Progress:</span>
                            <div className="w-full bg-muted rounded h-2 mt-1">
                              <div className="bg-teal-500 h-2 rounded" style={{ width: `${mockResearchData.progress}%` }} />
                            </div>
                          </div>
                          <div className="text-xs">{mockResearchData.progress}% complete</div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Research Outline</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 p-2 hover:bg-background rounded cursor-pointer">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Executive Summary</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-background rounded cursor-pointer bg-background">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>Market Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-background rounded cursor-pointer text-muted-foreground">
                          <div className="w-4 h-4 border-2 border-dashed border-muted-foreground rounded" />
                          <span>Financials</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-background rounded cursor-pointer text-muted-foreground">
                          <div className="w-4 h-4 border-2 border-dashed border-muted-foreground rounded" />
                          <span>Team & Management</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Documents</h4>
                      <div className="space-y-1 text-xs">
                        <div className="p-2 bg-background rounded hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>Company Deck.pdf</span>
                            <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-2 bg-background rounded hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>Financial Model</span>
                            <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="border-t p-3 space-y-2">
                  <Button size="sm" className="w-full bg-transparent" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Section
                  </Button>
                  <Button size="sm" className="w-full bg-transparent" variant="outline">
                    <Upload className="w-3 h-3 mr-1" />
                    Upload Doc
                  </Button>
                </div>
              </div>

              {/* Center - Content Editor */}
              <div className="flex-1 flex flex-col overflow-hidden bg-background">
                {/* Toolbar */}
                <div className="border-b px-6 py-2 flex items-center gap-1 overflow-x-auto">
                  <Button size="sm" variant="ghost" title="Bold">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Italic">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Underline">
                    <Underline className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-4 mx-1" />
                  <Button size="sm" variant="ghost" title="Heading 2">
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="List">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Quote">
                    <Quote className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Code">
                    <Code className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-4 mx-1" />
                  <Button size="sm" variant="ghost" title="Link">
                    <Link2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Image">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Chart">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Table">
                    <Table className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-4 mx-1" />
                  <Button size="sm" className="ml-auto">
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Writer
                  </Button>
                </div>

                {/* Content Area */}
                <ScrollArea className="flex-1">
                  <div className="p-8 max-w-3xl mx-auto prose prose-sm">
                    <h1 className="text-3xl font-bold mb-6">TechCorp AI - Research Report</h1>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Executive Summary</h2>
                    <p className="text-foreground/80 mb-4">
                      TechCorp AI is an AI-powered financial document analysis platform operating in the fintech sector at Series A stage, raising ₹25 Cr. The company demonstrates strong market potential with innovative solutions for automated financial document processing.
                    </p>

                    <Card className="my-6 bg-blue-50/50 border-blue-200">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-1 text-amber-600" />
                            <div>
                              <p className="font-medium text-sm">Key Finding</p>
                              <p className="text-xs text-foreground/70">Customer concentration risk - top 3 customers represent 60% of revenue</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Market Analysis</h2>
                    <p className="text-foreground/80 mb-4">
                      The fintech automation market is experiencing rapid growth, with enterprise document processing representing a significant opportunity. TechCorp AI's AI-powered approach addresses key pain points in manual document review and data extraction.
                    </p>

                    <div className="grid grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-teal-600">45%</p>
                            <p className="text-xs text-muted-foreground">YoY Growth</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-teal-600">12</p>
                            <p className="text-xs text-muted-foreground">Active Clients</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ScrollArea>

                <div className="border-t px-6 py-3 flex items-center gap-2 justify-end">
                  <Button variant="outline">Discard</Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Right Sidebar - AI Assistant */}
              {rightPanelOpen && (
                <div className="w-80 border-l bg-muted/30 flex flex-col overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm">AI Research Assistant</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRightPanelOpen(false)}
                      >
                        <Minimize2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Card className="bg-background/50 text-xs p-3">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Section: Market Analysis</div>
                        <div className="text-muted-foreground">Documents: 2 loaded</div>
                      </div>
                    </Card>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "")}>
                          <div
                            className={cn(
                              "max-w-xs rounded-lg px-3 py-2 text-sm",
                              msg.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-background border border-border text-foreground"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="border-t p-4 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask AI..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="text-xs"
                      />
                      <Button size="sm" className="h-9 w-9 p-0" onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                        Summarize
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                        Find Data
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                        Check Facts
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-8 bg-transparent">
                        Risks
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
