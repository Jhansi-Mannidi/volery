"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Video,
  FileText,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Users,
  Building2,
  FileSearch,
  Zap,
  Settings,
  BarChart3,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
  ArrowLeft,
  Send,
  X,
  Minus,
  ThumbsUp,
  ThumbsDown,
  Link2,
  GraduationCap,
  Bug,
  Plug,
  Calendar,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Help categories with detailed articles
const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "New to Volery? Start here with our guides.",
    icon: Lightbulb,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    articles: [
      "Quick start guide",
      "Platform overview",
      "First steps",
    ],
    articleCount: 8,
  },
  {
    id: "pipeline-management",
    title: "Pipeline Management",
    description: "Learn to manage your deal pipeline.",
    icon: Building2,
    color: "text-primary",
    bgColor: "bg-primary/10",
    articles: [
      "Adding startups",
      "Moving deals",
      "Stage management",
    ],
    articleCount: 12,
  },
  {
    id: "investor-database",
    title: "Investor Database",
    description: "Build and manage your investor network.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    articles: [
      "Adding investors",
      "Filtering & search",
      "Relationship tracking",
    ],
    articleCount: 10,
  },
  {
    id: "ai-matching",
    title: "AI Matching",
    description: "Understand our AI-powered matching.",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    articles: [
      "How matching works",
      "Improving scores",
      "Match criteria",
    ],
    articleCount: 6,
  },
  {
    id: "documents-sharing",
    title: "Documents & Sharing",
    description: "Share documents and track engagement.",
    icon: FileSearch,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    articles: [
      "Creating share links",
      "Document analytics",
      "Access controls",
    ],
    articleCount: 9,
  },
  {
    id: "analytics-reports",
    title: "Analytics & Reports",
    description: "Track performance and generate insights.",
    icon: BarChart3,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    articles: [
      "Dashboard overview",
      "Custom reports",
      "Exporting data",
    ],
    articleCount: 7,
  },
  {
    id: "account-settings",
    title: "Account Settings",
    description: "Manage your account and preferences.",
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    articles: [
      "Profile settings",
      "Password & security",
      "Notifications",
    ],
    articleCount: 11,
  },
  {
    id: "team-management",
    title: "Team Management",
    description: "Set up and manage your team.",
    icon: Users,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    articles: [
      "Inviting members",
      "Roles & permissions",
      "Billing",
    ],
    articleCount: 8,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect your favorite tools.",
    icon: Plug,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    articles: [
      "Gmail & Calendar",
      "Slack integration",
      "CRM sync",
    ],
    articleCount: 14,
  },
]

// FAQs
const faqs = [
  {
    question: "How do I add a new startup to my pipeline?",
    answer: `There are several ways to add a startup:

1. Click the "+ Add Startup" button in the top navigation
2. Go to Pipeline > All Startups and click "Add Startup"
3. Use the keyboard shortcut Cmd+N (Mac) or Ctrl+N (Windows)

Required fields: Company name, sector, and stage.
All other fields are optional and can be added later.`,
    hasVideo: true,
    hasGuide: true,
  },
  {
    question: "How does the AI matching algorithm work?",
    answer: "Our AI matching algorithm analyzes startup profiles against investor preferences including sector focus, stage preference, check size, and geographic focus. It then generates match scores and recommendations based on historical success patterns and current portfolio alignment.",
    hasVideo: true,
    hasGuide: true,
  },
  {
    question: "How do I share documents with investors securely?",
    answer: "You can share documents securely by creating a share link with customizable access controls. Options include password protection, email verification, expiration dates, and download restrictions. Track engagement in real-time including views, time spent, and page-by-page analytics.",
    hasVideo: false,
    hasGuide: true,
  },
  {
    question: "Can I import my existing investor database?",
    answer: "Yes! You can import investors via CSV file. Go to Investors > Import and upload your file. We support mapping of custom fields and will detect duplicates automatically. Contact support for bulk imports over 1000 records.",
    hasVideo: false,
    hasGuide: true,
  },
  {
    question: "How do I set up two-factor authentication?",
    answer: "Go to Profile > Settings > Security tab. Click 'Enable 2FA' and follow the setup wizard. You can use an authenticator app (recommended) or SMS verification. We also provide backup codes for recovery.",
    hasVideo: false,
    hasGuide: true,
  },
  {
    question: "What's included in my subscription plan?",
    answer: "Your plan details are available in Settings > Team Settings > Billing. This shows your current plan features, usage limits, and billing history. Contact support or visit our pricing page for plan comparisons and upgrades.",
    hasVideo: false,
    hasGuide: false,
  },
]

// Sample article content
const sampleArticle = {
  title: "How to Add a New Startup to Your Pipeline",
  category: "Pipeline Management",
  readTime: "5 min read",
  updated: "Jan 20, 2026",
  content: `Adding startups to your pipeline is the first step in managing your deal flow. This guide covers all the ways you can add and configure startups.

## Quick Add
The fastest way to add a startup is using the quick add button in the top navigation. Click the "+" button or use the keyboard shortcut Cmd+N (Mac) or Ctrl+N (Windows).

## Required Fields
- Company Name
- Sector
- Current Stage

## Optional Fields
You can always add more details later including:
- Founding date
- Team size
- Funding history
- Contact information
- Documents and notes`,
  relatedArticles: [
    "Moving deals between stages",
    "Setting up your pipeline views",
    "Importing startups from CSV",
  ],
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [chatMinimized, setChatMinimized] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [viewingArticle, setViewingArticle] = useState(false)
  const [articleFeedback, setArticleFeedback] = useState<"yes" | "no" | null>(null)

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader
        title="Help & Support"
        breadcrumbs={[{ label: "Help" }]}
      />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-auto pb-24 md:pb-6">
          {viewingArticle ? (
            /* Article View */
            <div className="max-w-3xl mx-auto">
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setViewingArticle(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help
              </Button>

              <article className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-foreground mb-3">
                    {sampleArticle.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="secondary">{sampleArticle.category}</Badge>
                    <span>{sampleArticle.readTime}</span>
                    <span>Updated {sampleArticle.updated}</span>
                  </div>
                </header>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Adding startups to your pipeline is the first step in managing your deal flow. 
                    This guide covers all the ways you can add and configure startups.
                  </p>

                  <div className="my-6 aspect-video bg-muted rounded-lg flex items-center justify-center border">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Play className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Video: Adding your first startup</p>
                    </div>
                  </div>

                  <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">Quick Add</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The fastest way to add a startup is using the quick add button in the top navigation. 
                    Click the "+" button or use the keyboard shortcut Cmd+N (Mac) or Ctrl+N (Windows).
                  </p>

                  <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">Required Fields</h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Company Name</li>
                    <li>Sector</li>
                    <li>Current Stage</li>
                  </ul>

                  <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">Optional Fields</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You can always add more details later including founding date, team size, 
                    funding history, contact information, and documents.
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Related Articles</h3>
                  <div className="space-y-2">
                    {sampleArticle.relatedArticles.map((article, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        {article}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-foreground mb-3">Was this article helpful?</p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={articleFeedback === "yes" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setArticleFeedback("yes")}
                      className={articleFeedback === "yes" ? "" : "bg-transparent"}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes, it helped
                    </Button>
                    <Button
                      variant={articleFeedback === "no" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setArticleFeedback("no")}
                      className={articleFeedback === "no" ? "" : "bg-transparent"}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      No, I need more help
                    </Button>
                  </div>
                  {articleFeedback && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {articleFeedback === "yes" 
                        ? "Thanks for your feedback!" 
                        : "Sorry to hear that. "}
                      {articleFeedback === "no" && (
                        <button className="text-primary hover:underline" onClick={() => setShowChat(true)}>
                          Contact Support
                        </button>
                      )}
                    </p>
                  )}
                </div>
              </article>
            </div>
          ) : (
            /* Main Help View */
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Prominent Search Section */}
              <Card className="bg-gradient-to-b from-primary/5 to-transparent border-primary/20">
                <CardContent className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Search className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">How can we help you today?</h1>
                  </div>
                  <div className="relative max-w-2xl mx-auto mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search for help articles, guides, and FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-base bg-background"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Popular:</span>
                    <button className="text-primary hover:underline">Getting started</button>
                    <span>•</span>
                    <button className="text-primary hover:underline">Investor matching</button>
                    <span>•</span>
                    <button className="text-primary hover:underline">Sharing docs</button>
                  </div>
                </CardContent>
              </Card>

              {/* Help Categories Grid */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {helpCategories.map((category) => (
                    <Card 
                      key={category.id} 
                      className="cursor-pointer hover:border-primary/50 transition-colors group"
                      onClick={() => setViewingArticle(true)}
                    >
                      <CardContent className="p-5">
                        <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center mb-4`}>
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                        <ul className="space-y-1.5 mb-4">
                          {category.articles.map((article, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                              {article}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center text-sm text-primary group-hover:underline">
                          View {category.articleCount} Articles
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQs Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="text-sm font-medium text-foreground">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{faq.answer}</p>
                            {(faq.hasVideo || faq.hasGuide) && (
                              <div className="flex items-center gap-3">
                                {faq.hasVideo && (
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    <Play className="w-4 h-4 mr-2" />
                                    Watch Video Tutorial
                                  </Button>
                                )}
                                {faq.hasGuide && (
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Read Full Guide
                                  </Button>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 pt-2">
                              <span className="text-xs text-muted-foreground">Was this helpful?</span>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                                Yes
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <ThumbsDown className="w-3.5 h-3.5 mr-1" />
                                No
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All FAQs (24)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support Section */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Contact Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="text-center">
                    <CardContent className="pt-6 pb-6">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chat with our support team in real-time.
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Response time: Usually &lt; 5 minutes
                      </p>
                      <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        Online now
                      </Badge>
                      <Button className="w-full" onClick={() => setShowChat(true)}>
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="pt-6 pb-6">
                      <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-7 h-7 text-blue-500" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Send us a detailed message.
                      </p>
                      <p className="text-xs text-muted-foreground mb-7">
                        Response time: Within 24 hours
                      </p>
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <a href="mailto:support@volery.io">Send Email</a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="pt-6 pb-6">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-7 h-7 text-emerald-500" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Phone Support</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Talk to our team directly.
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        Available: Mon-Fri 9AM-6PM IST
                      </p>
                      <p className="text-sm font-medium text-foreground mb-4">
                        +91 80 1234 5678
                      </p>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Call
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Additional Resources */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Additional Resources</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Video className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Video Tutorials</p>
                        <p className="text-sm text-muted-foreground">Watch step-by-step guides on YouTube</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Watch Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">API Documentation</p>
                        <p className="text-sm text-muted-foreground">For developers integrating with Volery</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Docs
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Volery Academy</p>
                        <p className="text-sm text-muted-foreground">Free courses to master the platform</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Start Learning
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Feature Requests</p>
                        <p className="text-sm text-muted-foreground">Suggest new features and vote on ideas</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Submit Idea
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Bug className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Report a Bug</p>
                        <p className="text-sm text-muted-foreground">Found something broken? Let us know</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Report Bug
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status Widget */}
              <Card className="bg-emerald-500/5 border-emerald-500/20">
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
                    </span>
                    <span className="text-sm text-muted-foreground">Last checked: 2 minutes ago</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Status
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Live Chat Widget */}
      {showChat && (
        <div className={`fixed bottom-4 right-4 z-50 ${chatMinimized ? "w-72" : "w-80"}`}>
          <Card className="shadow-xl border-primary/20">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Chat with Support</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={() => setChatMinimized(!chatMinimized)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={() => setShowChat(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!chatMinimized && (
              <>
                {/* Chat Body */}
                <CardContent className="p-4 space-y-4">
                  <div className="text-center py-4">
                    <p className="text-lg font-medium text-foreground mb-1">Hi John!</p>
                    <p className="text-sm text-muted-foreground">How can we help you today?</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm font-medium text-foreground">Support Agent</p>
                    <p className="text-xs text-muted-foreground">Usually responds in &lt; 5 min</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Quick Options:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
                        Technical Issue
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
                        Billing Question
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
                        Feature Help
                      </Badge>
                    </div>
                  </div>
                </CardContent>

                {/* Chat Input */}
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
