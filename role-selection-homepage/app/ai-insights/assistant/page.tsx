"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Sparkles,
  ChevronRight,
  Send,
  Plus,
  Clock,
  Target,
  TrendingUp,
  FileText,
  Users,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Building2,
  BarChart3,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  data?: any
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm your AI assistant. I can help you with deal analysis, investor matching, market research, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase()

    // Check for specific query patterns
    if (lowerQuery.includes("investor") && lowerQuery.includes("techcorp")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content: "investors-list",
        timestamp: new Date(),
        data: {
          investors: [
            { name: "Sequoia Capital", match: 94, highlights: ["Active in Fintech", "Recent AI investments", "Sweet spot: ₹15-50 Cr"], warnings: [] },
            { name: "Accel Partners", match: 89, highlights: ["Strong B2B SaaS portfolio"], warnings: ["Currently selective (fund 80% deployed)"] },
            { name: "Matrix Partners", match: 85, highlights: ["Series A specialists", "Warm intro available via Rahul"], warnings: [] },
          ],
        },
      }
    } else if (lowerQuery.includes("valuation") && lowerQuery.includes("fintech")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content: "valuation-analysis",
        timestamp: new Date(),
        data: {
          median: "₹72 Cr",
          average: "₹85 Cr",
          range: "₹40 Cr - ₹150 Cr",
          dealCount: 47,
          percentile: "35th",
        },
      }
    } else if (lowerQuery.includes("memo") || lowerQuery.includes("generate")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content: "memo-generation",
        timestamp: new Date(),
        data: {
          progress: 100,
          status: "complete",
        },
      }
    } else {
      return {
        id: Date.now().toString(),
        type: "ai",
        content: `I can help you with that. Based on your query about "${query}", here are some relevant insights. Would you like me to provide more specific information about deals, investors, or market trends?`,
        timestamp: new Date(),
      }
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    inputRef.current?.focus()
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        <DashboardHeader title="AI Assistant" />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <main className="flex-1 overflow-hidden flex">
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="border-b bg-card px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-foreground">AI Assistant</h1>
                      <p className="text-sm text-muted-foreground">Ask me anything about deals, investors, and market</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Clock className="w-4 h-4 mr-2" />
                      History
                    </Button>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
                <div className="max-w-4xl mx-auto py-6 space-y-6">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === "user" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[80%]">
                            <div className="flex items-start gap-3 justify-end">
                              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3">
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-muted text-foreground">JD</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-start">
                          <div className="max-w-[85%]">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  <Sparkles className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                {message.content === "investors-list" ? (
                                  <Card className="border-primary/20">
                                    <CardContent className="pt-6">
                                      <p className="text-sm text-foreground mb-4">
                                        Based on TechCorp AI's profile (Fintech, Series A, ₹15 Cr raise), here are the top matches:
                                      </p>
                                      <div className="space-y-4">
                                        {message.data.investors.map((investor: any, idx: number) => (
                                          <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border">
                                            <div className="flex items-center justify-between mb-2">
                                              <h4 className="font-semibold text-foreground">{investor.name}</h4>
                                              <Badge className="bg-primary/10 text-primary">{investor.match}% match</Badge>
                                            </div>
                                            {investor.highlights.map((highlight: string, hidx: number) => (
                                              <div key={hidx} className="flex items-start gap-2 text-sm text-muted-foreground mt-1">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>{highlight}</span>
                                              </div>
                                            ))}
                                            {investor.warnings.map((warning: string, widx: number) => (
                                              <div key={widx} className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500 mt-1">
                                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>{warning}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ))}
                                      </div>
                                      <div className="flex gap-2 mt-4">
                                        <Button size="sm" variant="outline" className="bg-transparent">
                                          Send intro to all 3
                                        </Button>
                                        <Button size="sm" variant="outline" className="bg-transparent">
                                          View full list
                                        </Button>
                                        <Button size="sm" variant="outline" className="bg-transparent">
                                          Compare
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ) : message.content === "valuation-analysis" ? (
                                  <Card className="border-primary/20">
                                    <CardContent className="pt-6">
                                      <p className="text-sm text-foreground mb-4">
                                        Based on {message.data.dealCount} Fintech Series A deals in the last 12 months (India):
                                      </p>
                                      <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="text-center p-3 rounded-lg bg-muted/50">
                                          <p className="text-xs text-muted-foreground mb-1">Median Valuation</p>
                                          <p className="text-lg font-semibold text-foreground">{message.data.median}</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-muted/50">
                                          <p className="text-xs text-muted-foreground mb-1">Average Valuation</p>
                                          <p className="text-lg font-semibold text-foreground">{message.data.average}</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-muted/50">
                                          <p className="text-xs text-muted-foreground mb-1">Range</p>
                                          <p className="text-lg font-semibold text-foreground">{message.data.range}</p>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        TechCorp AI's ₹60 Cr pre-money is at the {message.data.percentile} percentile - slightly below median but reasonable given current market conditions.
                                      </p>
                                      <div className="flex gap-2 mt-4">
                                        <Button size="sm" variant="outline" className="bg-transparent">
                                          View comparable deals
                                        </Button>
                                        <Button size="sm" variant="outline" className="bg-transparent">
                                          Valuation trends
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ) : message.content === "memo-generation" ? (
                                  <Card className="border-primary/20">
                                    <CardContent className="pt-6">
                                      <p className="text-sm text-foreground mb-4">
                                        I'll generate an investment memo based on the available data. This includes:
                                      </p>
                                      <div className="space-y-2 mb-4">
                                        {["Pitch deck analysis", "Financial model review", "Market benchmarks", "Competitive analysis"].map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            <span>{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {message.data.status === "complete" ? (
                                        <>
                                          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                                              <CheckCircle2 className="w-4 h-4" />
                                              <span>Memo generated successfully!</span>
                                            </div>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button size="sm">
                                              <Download className="w-4 h-4 mr-2" />
                                              Download Memo
                                            </Button>
                                            <Button size="sm" variant="outline" className="bg-transparent">
                                              <ExternalLink className="w-4 h-4 mr-2" />
                                              View in Editor
                                            </Button>
                                          </div>
                                        </>
                                      ) : (
                                        <div>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                                            <span>Generating memo... (est. 2 minutes)</span>
                                          </div>
                                          <Progress value={message.data.progress} className="h-2" />
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                                    <p className="text-sm text-foreground">{message.content}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Sparkles className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-100" />
                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="px-6 py-3 border-t">
                  <div className="max-w-4xl mx-auto">
                    <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => handleQuickAction("Analyze TechCorp AI deal")}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Analyze a deal
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => handleQuickAction("Who are the best investors for TechCorp AI?")}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Find investors
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => handleQuickAction("What's the average Series A valuation in Fintech?")}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Market trends
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => handleQuickAction("Generate an investment memo for TechCorp AI")}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Write memo
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t bg-card px-6 py-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Ask anything about your deals, investors, or market..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Suggested Questions */}
            <div className="w-80 border-l bg-card overflow-y-auto">
              <div className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Suggested Questions</h3>
                <div className="space-y-3">
                  {[
                    { icon: Building2, text: "Summarize TechCorp AI's strengths and weaknesses" },
                    { icon: BarChart3, text: "Compare our pipeline to last quarter" },
                    { icon: Target, text: "Which deals need attention this week?" },
                    { icon: FileText, text: "What are the red flags in the HealthX pitch deck?" },
                    { icon: Users, text: "Find investors who have backed similar companies" },
                    { icon: TrendingUp, text: "What's trending in the climate tech sector?" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(item.text)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground group-hover:text-foreground">{item.text}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-foreground mb-3">AI Capabilities</h3>
                  <div className="space-y-2">
                    {[
                      "Natural language deal queries",
                      "Investment memo generation",
                      "Investor recommendations",
                      "Market trend analysis",
                      "Competitive intelligence",
                      "Document Q&A",
                      "Pipeline insights",
                    ].map((capability, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
