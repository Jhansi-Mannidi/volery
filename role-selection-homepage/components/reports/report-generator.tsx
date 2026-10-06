"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Download,
  Share2,
  Eye,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  ImageIcon,
  Link,
  BarChart3,
  Send,
  Zap,
} from "lucide-react"

interface ReportTemplate {
  id: string
  title: string
  description: string
  sectionCount: number
  estimatedTime: string
  icon: string
}

const templates: ReportTemplate[] = [
  {
    id: "investment-memo",
    title: "Investment Memo",
    description: "Comprehensive deal analysis for IC",
    sectionCount: 12,
    estimatedTime: "4-6 hrs",
    icon: "📊",
  },
  {
    id: "market-analysis",
    title: "Market Analysis",
    description: "Sector deep-dive with trends",
    sectionCount: 8,
    estimatedTime: "3-4 hrs",
    icon: "📈",
  },
  {
    id: "dd-summary",
    title: "DD Summary",
    description: "Due diligence findings summary",
    sectionCount: 10,
    estimatedTime: "2-3 hrs",
    icon: "🔍",
  },
  {
    id: "quick-brief",
    title: "Quick Brief",
    description: "One-pager for quick review",
    sectionCount: 4,
    estimatedTime: "30 min",
    icon: "⚡",
  },
  {
    id: "competitive-anal",
    title: "Competitive Analysis",
    description: "Detailed competitor comparison",
    sectionCount: 6,
    estimatedTime: "2-3 hrs",
    icon: "🆚",
  },
  {
    id: "custom",
    title: "Custom Template",
    description: "Build your own template",
    sectionCount: 0,
    estimatedTime: "Varies",
    icon: "📄",
  },
]

interface Section {
  id: string
  name: string
  completed: boolean
}

const defaultSections: Section[] = [
  { id: "executive-summary", name: "Executive Summary", completed: true },
  { id: "company-overview", name: "Company Overview", completed: true },
  { id: "market-analysis", name: "Market Analysis", completed: true },
  { id: "competitive-position", name: "Competitive Position", completed: false },
  { id: "financial-analysis", name: "Financial Analysis", completed: false },
  { id: "team-assessment", name: "Team Assessment", completed: false },
  { id: "risk-analysis", name: "Risk Analysis", completed: false },
  { id: "investment-thesis", name: "Investment Thesis", completed: false },
  { id: "valuation", name: "Valuation", completed: false },
  { id: "deal-terms", name: "Deal Terms", completed: false },
  { id: "recommendation", name: "Recommendation", completed: false },
  { id: "appendix", name: "Appendix", completed: false },
]

export function ReportGenerator() {
  const [showTemplates, setShowTemplates] = useState(true)
  const [reportName, setReportName] = useState("TechCorp AI - Investment Memo")
  const [status, setStatus] = useState("draft")
  const [sections, setSections] = useState<Section[]>(defaultSections)
  const [currentSection, setCurrentSection] = useState("competitive-position")
  const [editorContent, setEditorContent] = useState(
    `## Competitive Position\n\n### Market Positioning\n\nTechCorp AI occupies a unique position in the fintech document automation space, differentiating through its proprietary AI models trained specifically on Indian financial documents.\n\n✨ Add competitive positioning matrix here\n\n### Key Competitors\n\n| Competitor | Strengths | Weaknesses | Market Share |\n|------------|-----------|------------|----------------|\n| Comp A | Scale | Legacy tech | 35% |\n| Comp B | Tech | GTM | 20% |\n| TechCorp | AI/ML | Scale | 5% |\n\n### Competitive Advantages\n\n1. **Proprietary AI Models**: 40% more accurate than generic solutions\n2. **India-specific Training**: Only solution trained on Indian documents\n3. **Integration APIs**: Best-in-class developer experience`
  )

  const completedCount = sections.filter((s) => s.completed).length
  const progressPercent = (completedCount / sections.length) * 100

  const toggleSection = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    )
  }

  const handleTemplateSelect = (templateId: string) => {
    setShowTemplates(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">📝 Report Generator</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button className="gap-2 bg-preset-primary hover:bg-preset-primary-hover">
              Save Draft
            </Button>
          </div>
        </div>

        {/* Report Title and Status */}
        <div className="flex items-center gap-4">
          <Input
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="text-lg font-semibold flex-1"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">[Draft]</SelectItem>
              <SelectItem value="review">[In Review]</SelectItem>
              <SelectItem value="final">[Final]</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Selector */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Select Report Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="hover:border-preset-primary/50 cursor-pointer transition-colors"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="pt-6 space-y-3">
                    <div className="text-3xl">{template.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {template.sectionCount > 0 && (
                        <p>Sections: {template.sectionCount}</p>
                      )}
                      <p>Est. time: {template.estimatedTime}</p>
                    </div>
                    <Button className="w-full gap-2 bg-preset-primary hover:bg-preset-primary-hover">
                      {template.id === "custom" ? "Create New" : "Use Template"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!showTemplates && (
        <>
          {/* Main Editor Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Section Navigator */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-base">📑 Report Sections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          currentSection === section.id
                            ? "bg-preset-primary/10"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setCurrentSection(section.id)}
                      >
                        <Checkbox
                          checked={section.completed}
                          onChange={() => toggleSection(section.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span
                          className={`flex-1 text-sm ${
                            section.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {section.name}
                        </span>
                        {section.completed && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>
                          {completedCount}/{sections.length}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      <Plus className="w-4 h-4" />
                      Add Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Center - Rich Text Editor */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Editor</CardTitle>
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      ✓ Auto-saved
                    </span>
                  </div>
                </CardHeader>

                {/* Toolbar */}
                <div className="border-b px-4 py-3 flex items-center gap-1 flex-wrap bg-muted/30">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Underline className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 gap-1 text-preset-primary">
                    <Sparkles className="w-4 h-4" />
                    AI
                  </Button>
                </div>

                {/* Editor Content */}
                <CardContent className="flex-1 p-6 overflow-y-auto">
                  <Textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="resize-none min-h-full border-0 p-0 focus-visible:ring-0"
                    placeholder="Start typing your report content..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - AI Writing Assistant */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 h-fit">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-preset-primary" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Quick Actions</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-2 text-xs bg-transparent">
                        📝 Improve Writing
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-2 text-xs bg-transparent">
                        📊 Add Data Point
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-2 text-xs bg-transparent">
                        🔍 Fact Check
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-2 text-xs bg-transparent">
                        📈 Insert Chart
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-2 text-xs bg-transparent">
                        ✨ Generate Section
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">From Your Research</p>
                    <Card className="border-preset-primary/30 bg-preset-primary/5">
                      <CardContent className="pt-3 text-xs space-y-2">
                        <p>💡 You have competitive data from your research workspace.</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Insert
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            View First
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Chat</p>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Help me write the competitive moat section"
                        className="resize-none h-16 text-xs"
                      />
                      <Button className="w-full gap-2 bg-preset-primary hover:bg-preset-primary-hover text-xs">
                        <Send className="w-3 h-3" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
