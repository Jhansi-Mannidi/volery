"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Building2,
  Globe,
  Linkedin,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Bookmark,
  Send,
  FileText,
  ArrowUpRight,
  Star,
  Plus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

// Mock investor data
const investorData = {
  id: "sequoia",
  name: "Sequoia Capital India",
  logo: "/placeholder.jpg",
  type: "Venture Capital",
  tagline: "Helping daring founders build legendary companies",
  checkSize: "₹5-15 Cr",
  website: "sequoiacap.com/india",
  linkedin: "/company/sequoia-capital-india",
  location: "Bangalore, India",
  founded: "2006",
  aum: "$9B+",
  criteria: {
    sectors: [
      { name: "Fintech", matches: true },
      { name: "SaaS", matches: true },
      { name: "Enterprise", matches: false },
      { name: "Healthcare", matches: false },
      { name: "Consumer Tech", matches: false },
    ],
    stages: [
      { name: "Seed", active: false },
      { name: "Series A", active: true },
      { name: "Series B", active: true },
      { name: "Series C", active: false },
    ],
    geography: [
      { name: "India", active: true },
      { name: "SEA", active: true },
      { name: "US", active: false },
    ],
    checkRange: "₹5-15 Cr",
  },
  portfolio: [
    { name: "Zomato", logo: "Z", sector: "Consumer Tech", similarity: 85 },
    { name: "Byju's", logo: "B", sector: "Edtech", similarity: 72 },
    { name: "Pine Labs", logo: "P", sector: "Fintech", similarity: 94 },
    { name: "Ola", logo: "O", sector: "Mobility", similarity: 68 },
    { name: "Freshworks", logo: "F", sector: "SaaS", similarity: 91 },
    { name: "Druva", logo: "D", sector: "Enterprise", similarity: 78 },
  ],
  team: [
    { name: "Shailendra Singh", role: "Managing Director", specialization: "Consumer, Fintech", contact: true },
    { name: "Abheek Anand", role: "Principal", specialization: "SaaS, Enterprise", contact: true },
    { name: "Mohit Bhatnagar", role: "Managing Director", specialization: "Healthcare, Fintech", contact: false },
  ],
  recentActivity: [
    { type: "investment", title: "Invested ₹50 Cr in FinanceAI", date: "2 weeks ago" },
    { type: "news", title: "Announced new ₹850 Cr India fund", date: "1 month ago" },
    { type: "event", title: "Speaking at SaaSBoomi Annual 2026", date: "3 weeks ago" },
  ],
  mutualConnections: [
    { name: "Rajesh Kumar", relation: "Portfolio Founder at Zomato", strength: "Strong", canIntro: true },
    { name: "Priya Sharma", relation: "Ex-Partner at Accel", strength: "Medium", canIntro: true },
  ],
}

export default function FounderInvestorProfilePage() {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [inList, setInList] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-6xl py-8">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-6 -ml-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Investor Header */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                    <AvatarImage src={investorData.logo || "/placeholder.svg"} alt={investorData.name} />
                    <AvatarFallback className="text-2xl">{investorData.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{investorData.name}</h1>
                        <p className="text-muted-foreground mb-3">{investorData.tagline}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{investorData.type}</Badge>
                          <Badge variant="outline" className="gap-1">
                            <DollarSign className="w-3 h-3" />
                            {investorData.checkSize}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="w-3 h-3" />
                            {investorData.location}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={inList ? "secondary" : "outline"}
                          onClick={() => {
                            setInList(!inList)
                            toast.success(inList ? "Removed from list" : "Added to target list")
                          }}
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          {inList ? "In List" : "Add to List"}
                        </Button>
                        <Button>
                          <Send className="w-4 h-4 mr-2" />
                          Request Intro
                        </Button>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap gap-3">
                      <Button variant="ghost" size="sm" className="h-8" asChild>
                        <a href={`https://${investorData.website}`} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-1.5" />
                          Website
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8" asChild>
                        <a
                          href={`https://linkedin.com${investorData.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4 mr-1.5" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                      <div className="flex items-center text-sm text-muted-foreground gap-4 ml-2">
                        <span>Founded {investorData.founded}</span>
                        <span>AUM {investorData.aum}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Investment Criteria */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Investment Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sectors */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Sectors</Label>
                      <div className="flex flex-wrap gap-2">
                        {investorData.criteria.sectors.map((sector) => (
                          <Badge
                            key={sector.name}
                            variant={sector.matches ? "default" : "outline"}
                            className={sector.matches ? "bg-green-500/10 text-green-700 border-green-500/20" : ""}
                          >
                            {sector.matches && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {sector.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stages */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Stages</Label>
                      <div className="flex flex-wrap gap-2">
                        {investorData.criteria.stages.map((stage) => (
                          <Badge key={stage.name} variant={stage.active ? "default" : "outline"}>
                            {stage.active && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {stage.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Geography */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Geography</Label>
                      <div className="flex flex-wrap gap-2">
                        {investorData.criteria.geography.map((geo) => (
                          <Badge key={geo.name} variant={geo.active ? "default" : "outline"}>
                            {geo.active && <MapPin className="w-3 h-3 mr-1" />}
                            {geo.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Check Size */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Typical Check</Label>
                      <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <DollarSign className="w-6 h-6" />
                        {investorData.criteria.checkRange}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Companies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Portfolio Companies
                      </span>
                      <Badge variant="secondary">3 similar to yours</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {investorData.portfolio.map((company) => (
                        <div key={company.name} className="border rounded-lg p-3 hover:border-primary transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{company.logo}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{company.name}</p>
                              <p className="text-xs text-muted-foreground">{company.sector}</p>
                            </div>
                          </div>
                          {company.similarity >= 80 && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Star className="w-3 h-3 fill-green-600" />
                              {company.similarity}% match
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Investment Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {investorData.team.map((member) => (
                      <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <p className="text-xs text-muted-foreground mt-1">{member.specialization}</p>
                          </div>
                        </div>
                        {member.contact && (
                          <Badge variant="secondary" className="gap-1">
                            <Mail className="w-3 h-3" />
                            Contact
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Activity & News */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Recent Activity & News
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {investorData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex gap-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {activity.type === "investment" && <DollarSign className="w-4 h-4 text-primary" />}
                          {activity.type === "news" && <FileText className="w-4 h-4 text-primary" />}
                          {activity.type === "event" && <Calendar className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Mutual Connections */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="w-4 h-4" />
                      Mutual Connections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {investorData.mutualConnections.map((connection) => (
                      <div key={connection.name} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {connection.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{connection.name}</p>
                            <p className="text-xs text-muted-foreground">{connection.relation}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {connection.strength} connection
                            </Badge>
                          </div>
                        </div>
                        {connection.canIntro && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            onClick={() => toast.success(`Introduction request sent via ${connection.name}`)}
                          >
                            <Send className="w-3 h-3 mr-1.5" />
                            Request Introduction
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Private Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="w-4 h-4" />
                      Your Private Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add notes about this investor..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-32 mb-3"
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => toast.success("Notes saved")}
                    >
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
