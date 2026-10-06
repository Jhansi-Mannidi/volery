"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Plus, Mic, Send, ChevronDown, Paperclip, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { PreChatSuggestions } from "./pre-chat-suggestions"
import { findMatchingResponse } from "@/lib/mock-ai-responses"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  lastUpdated: Date
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: "1", title: "Create Leads Sales Dashboard", lastUpdated: new Date("2026-01-13T10:17:00") },
    { id: "2", title: "Avatar Chat Session", lastUpdated: new Date("2026-01-13T10:14:00") },
    { id: "3", title: "Enquiry Count", lastUpdated: new Date("2026-01-12T12:16:00") },
    { id: "4", title: "Avatar Chat Session", lastUpdated: new Date("2026-01-07T01:24:00") },
    { id: "5", title: "Current Business Status", lastUpdated: new Date("2025-12-09T08:06:00") },
    { id: "6", title: "Greeting", lastUpdated: new Date("2025-11-27T01:02:00") },
  ])
  const [selectedModel, setSelectedModel] = useState("Gemini 2.0 Flash")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Portfolio data - in a real app, this would come from an API
  const portfolioCompanies = [
    { name: "TechCo AI", sector: "AI/ML", stage: "Series B", invested: "₹5 Cr", value: "₹12 Cr", date: "Jun 2023" },
    { name: "FinApp Solutions", sector: "FinTech", stage: "Series A", invested: "₹8 Cr", value: "₹15 Cr", date: "Feb 2024" },
    { name: "HealthFirst", sector: "HealthTech", stage: "Series B", invested: "₹10 Cr", value: "₹22 Cr", date: "Sep 2023" },
    { name: "EduLearn Platform", sector: "EdTech", stage: "Series A", invested: "₹6 Cr", value: "₹8.5 Cr", date: "Mar 2024" },
    { name: "GreenEnergy Co", sector: "CleanTech", stage: "Seed", invested: "₹2 Cr", value: "₹3 Cr", date: "Nov 2025" },
  ]

  const generateRelevantResponse = (userMessage: string, previousMessages: Message[]): string => {
    // First, try to find a matching mock response
    const mockResponse = findMatchingResponse(userMessage)
    if (mockResponse) {
      return mockResponse.answer
    }

    // Fallback to original logic if no match found
    const lowerMessage = userMessage.toLowerCase()
    
    // Check for portfolio/investment queries
    if (lowerMessage.includes("invested") || lowerMessage.includes("portfolio") || 
        lowerMessage.includes("funded") || lowerMessage.includes("investments") ||
        (lowerMessage.includes("startup") && (lowerMessage.includes("latest") || lowerMessage.includes("recent") || lowerMessage.includes("we have")))) {
      
      const recent = portfolioCompanies.slice(0, 3)
      let response = "Here are our most recent investments:\n\n"
      
      recent.forEach((company, idx) => {
        response += `${idx + 1}. ${company.name} (${company.sector})\n`
        response += `   • Stage: ${company.stage}\n`
        response += `   • Investment: ${company.invested} → Current Value: ${company.value}\n`
        response += `   • Invested: ${company.date}\n\n`
      })
      
      response += "Would you like detailed analysis on any of these companies?"
      return response
    }
    
    // Check for IC memo generation
    if ((lowerMessage.includes("generate") || lowerMessage.includes("draft") || lowerMessage.includes("create") || lowerMessage.includes("write")) && 
        (lowerMessage.includes("ic memo") || lowerMessage.includes("memo") || lowerMessage.includes("investment memo"))) {
      
      return `# Investment Committee Memo - Draft

## Investment Opportunity: [Company Name]

**Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
**Prepared by:** Investment Team

### Executive Summary
Strong investment opportunity in the [sector] space with significant growth potential and defensible market position.

### Company Overview
• **Founded:** [Year]
• **Stage:** [Funding Stage]
• **Ask:** ₹[X] Cr at ₹[Y] Cr valuation
• **Sector:** [Industry/Sector]

### Market Opportunity
The addressable market shows strong fundamentals with projected CAGR of [X]% over the next 5 years.

### Financial Performance
• **ARR:** ₹[X] Cr (Growing at [Y]% YoY)
• **Burn Rate:** ₹[X] Cr/month
• **Runway:** [X] months

### Team Assessment
Strong founding team with relevant domain expertise and proven execution capabilities.

### Investment Thesis
1. Large and growing market opportunity
2. Proven product-market fit with strong unit economics
3. Experienced team with clear execution roadmap

### Risk Factors
• Competition from established players
• Customer acquisition costs
• Regulatory considerations

### Recommendation
Recommend investment of ₹[X] Cr for [Y]% equity stake.

---
*This is an AI-generated draft. Please review and customize with specific company details.*`
    }
    
    // Check for startup/deal analysis
    if ((lowerMessage.includes("analyze") || lowerMessage.includes("analysis") || lowerMessage.includes("tell me about") || lowerMessage.includes("info")) && 
        (lowerMessage.includes("startup") || lowerMessage.includes("company") || lowerMessage.includes("deal"))) {
      
      return `I can provide detailed analysis on our portfolio companies and potential deals. Here's what I can analyze:

📊 Financial Metrics: ARR, burn rate, runway, unit economics
👥 Team Assessment: Founder backgrounds, key hires, advisors
🎯 Market Position: TAM/SAM/SOM, competitive landscape, differentiation
📈 Growth Trajectory: User/revenue growth, retention metrics
🔍 Due Diligence: Cap table, legal, technical, market validation

Which company would you like me to analyze? You can ask about any of our portfolio companies like TechCo AI, FinApp Solutions, or HealthFirst.`
    }
    
    // Check for meeting/pitch deck requests
    if (lowerMessage.includes("meeting") || lowerMessage.includes("pitch") || lowerMessage.includes("presentation")) {
      return `I can help you prepare for meetings and review pitch materials. Here's what I can do:

🎯 Pre-Meeting Prep: Company research, key questions, deal terms analysis
📊 Pitch Deck Review: Structure, content, financial projections assessment
💼 Meeting Notes: Generate summaries and action items
📝 Follow-up Materials: Draft investment memos, term sheets, or outreach emails

What specific meeting support do you need?`
    }
    
    // Check for document generation
    if ((lowerMessage.includes("generate") || lowerMessage.includes("create") || lowerMessage.includes("draft") || lowerMessage.includes("write")) && 
        !lowerMessage.includes("memo")) {
      return `I can generate various investment documents for you:

📄 Investment Memos: Detailed IC memos with thesis and analysis
📊 Portfolio Reports: Performance summaries and dashboards
📧 Email Templates: Intro requests, follow-ups, decline letters
📋 Due Diligence Checklists: Customized DD frameworks
📈 Financial Models: Valuation templates and projections

What document would you like me to create?`
    }
    
    // Check for pipeline/deal flow questions
    if (lowerMessage.includes("pipeline") || lowerMessage.includes("deal flow") || lowerMessage.includes("deals")) {
      return `Your current pipeline overview:

🎯 Active Deals: 18
📊 By Stage:
   • Screening: 8 companies
   • Due Diligence: 6 companies
   • IC Review: 4 companies

📈 This Month: 12 new inbound deals
💡 Top Priority: 3 deals requiring IC decision this week

Would you like detailed insights on any stage or specific deals?`
    }
    
    // Help/capabilities query
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you") || lowerMessage.includes("how can you")) {
      return `I'm your AI investment assistant. I can help you with:

✅ Portfolio Insights: View investments, track performance, analyze companies
✅ Document Generation: Create IC memos, reports, emails, and presentations
✅ Deal Analysis: Research companies, market analysis, financial modeling
✅ Meeting Support: Prep materials, notes, follow-ups
✅ Pipeline Management: Track deal flow, stage progression, priorities
✅ Data & Reports: Custom dashboards, portfolio analytics, trend analysis

Try asking:
• "Tell me about our recent investments"
• "Generate a draft IC memo"
• "Analyze TechCo AI's performance"
• "What deals need attention this week?"`
    }
    
    // Context-aware default response
    if (previousMessages.length > 0) {
      const lastAssistantMessage = previousMessages.filter(m => m.role === 'assistant').pop()
      if (lastAssistantMessage && lastAssistantMessage.content.includes('portfolio companies')) {
        return `I can provide a detailed analysis of any of these companies. Which one would you like to explore? I can share:

• Financial performance and metrics
• Market position and competitive analysis
• Team and operational insights
• Recent updates and milestones
• Investment thesis and risk factors

Just let me know which company interests you!`
      }
    }
    
    // Intelligent default
    return `I can help you with that! I specialize in:

🔍 Portfolio & Investment Data - View companies, track performance
📝 Document Creation - Memos, reports, emails
📊 Analysis & Insights - Deal evaluation, market research
💼 Meeting & Due Diligence Support

Could you provide a bit more detail about what you'd like to accomplish? For example:
• "Show me our portfolio companies"
• "Create an IC memo for [company]"
• "Analyze our fintech investments"`
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    const currentMessages = [...messages, newMessage]
    setMessages(currentMessages)
    const userQuery = message
    setMessage("")

    // Generate contextual AI response with conversation history
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateRelevantResponse(userQuery, currentMessages),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 800)
  }

  const handleNewChat = () => {
    setMessages([])
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 60) return `updated: ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
    if (hours < 24) return `updated: ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
    return `updated: ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 z-40 flex bg-background">
      {/* Left Sidebar - Chat History */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
        {/* New Chat Button */}
        <div className="p-4 border-b border-border">
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="w-full justify-start gap-2 bg-background"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Chat History
            </p>
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(session.lastUpdated)}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Right Actions */}
        <div className="h-14 flex items-center justify-end px-6 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-primary"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Guide</span>
          </Button>
        </div>

        {/* Chat Messages or Empty State */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              {/* Pre-Chat Suggestions */}
              <PreChatSuggestions
                userName="Rajesh"
                onSuggestionClick={(query) => {
                  setMessage(query)
                  // Auto-send after brief delay
                  setTimeout(() => {
                    handleSendMessage()
                  }, 300)
                }}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-4",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%]",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center gap-3 p-4 border border-border rounded-2xl bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
              {/* Attachment Button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {/* Assistant Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-1.5 h-8 text-muted-foreground hover:text-foreground"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">Assistant</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>General Assistant</DropdownMenuItem>
                  <DropdownMenuItem>Deal Analysis</DropdownMenuItem>
                  <DropdownMenuItem>Market Research</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Input Field */}
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Ask AI whatever you want..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 text-sm"
              />

              {/* Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Voice Input */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Mic className="w-4 h-4" />
                </Button>

                {/* User Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <User className="w-4 h-4" />
                </Button>

                {/* Model Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs">{selectedModel}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedModel("Gemini 2.0 Flash")}>
                      Gemini 2.0 Flash
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedModel("GPT-4")}>
                      GPT-4
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedModel("Claude 3")}>
                      Claude 3
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-8 w-8 rounded-full shrink-0"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
