"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit2,
  Camera,
  Linkedin,
  CheckCircle2,
  X,
  Save,
  ChevronRight,
  Building2,
  Users,
  FileText,
  Sparkles,
  Clock,
  ExternalLink,
  Plus,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  Target,
  DollarSign,
  Award,
  Globe,
  Eye,
  EyeOff,
  Lock,
  Rocket,
  BarChart3,
  Factory,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole, type FieldVisibility } from "@/lib/auth-context"

// Mock profile data based on role
const getMockProfileData = (role: UserRole | null) => {
  const common = {
    id: "user-1",
    avatar: null,
    firstName: "John",
    lastName: "Doe",
    email: "sasi@voltuswave.com",
    phone: "+91 98765 43210",
    linkedinUrl: "linkedin.com/in/sasikumar",
    bio: "",
    location: "Bangalore, India",
    timezone: "Asia/Kolkata",
    memberSince: "January 2024",
    lastActive: "Just now",
    privacySettings: {
      phone: "team" as FieldVisibility,
      email: "public" as FieldVisibility,
      location: "public" as FieldVisibility,
      linkedinUrl: "public" as FieldVisibility,
      bio: "public" as FieldVisibility,
    },
  }

  switch (role) {
    case "startup-founder":
      return {
        ...common,
        bio: "Serial entrepreneur building the future of enterprise SaaS. Previously founded two startups with successful exits. Passionate about AI/ML and its applications in business automation.",
        founderProfile: {
          currentCompany: "TechCorp AI",
          roleAtCompany: "CEO & Co-founder",
          previousCompanies: [
            { name: "DataFlow Inc", role: "Founder & CEO", years: "2018-2022" },
            { name: "CloudSync", role: "Co-founder & CTO", years: "2015-2018" },
          ],
          education: [
            { institution: "IIT Delhi", degree: "B.Tech Computer Science", year: "2014" },
            { institution: "Stanford GSB", degree: "MBA", year: "2017" },
          ],
          skills: ["Product Strategy", "AI/ML", "Fundraising", "Team Building", "B2B SaaS", "Go-to-Market"],
        },
      }
    case "institutional-investor":
    case "angel-investor":
      return {
        ...common,
        bio: "Experienced venture capital professional with 10+ years in early-stage investments. Focus on B2B SaaS, Fintech, and Healthcare startups in India and Southeast Asia.",
        investorProfile: {
          organization: "Anthill Ventures",
          title: "Partner",
          investmentFocus: ["B2B SaaS", "Fintech", "Healthcare", "AI/ML"],
          checkSizeRange: { min: 500000, max: 5000000, currency: "USD" },
          notableInvestments: [
            { name: "DataFlow Inc", year: "2019", stage: "Series A" },
            { name: "FinSecure", year: "2021", stage: "Seed" },
            { name: "HealthBridge", year: "2022", stage: "Series B" },
          ],
          preferredStages: ["Seed", "Series A", "Series B"],
          geographicFocus: ["India", "Southeast Asia", "Middle East"],
        },
      }
    case "research-analyst":
      return {
        ...common,
        bio: "Research analyst specializing in technology sector analysis and market research. Strong background in financial modeling and competitive analysis.",
        analystProfile: {
          organization: "Anthill Ventures",
          specialization: ["Technology", "SaaS", "Fintech"],
          researchFocusAreas: ["Market Sizing", "Competitive Analysis", "Financial Modeling", "Due Diligence"],
          certifications: ["CFA Level II", "FMVA"],
        },
      }
    case "investment-banker":
    case "corporate-development":
      return {
        ...common,
        bio: "Investment banking professional with expertise in technology M&A and capital raising. Track record of successful transactions across multiple sectors.",
        bankerProfile: {
          organization: "Anthill Ventures",
          title: "Vice President",
          dealExperience: ["Series A-C Fundraising", "M&A Advisory", "Strategic Partnerships"],
          sectorFocus: ["Technology", "Healthcare", "Consumer"],
          transactionTypes: ["Private Placement", "M&A", "IPO Advisory"],
        },
      }
    default:
      return {
        ...common,
        bio: "Professional with expertise in technology and investments.",
      }
  }
}

// Activity stats
const activityStats = {
  dealsReviewed: { value: 23, change: 12, up: true },
  investorsContacted: { value: 15, change: 8, up: true },
  documentsShared: { value: 8, change: -5, up: false },
  matchesMade: { value: 45, change: 22, up: true },
}

// Recent activity
const recentActivity = [
  { id: 1, action: "Moved TechCorp AI to Due Diligence", time: "2 hours ago" },
  { id: 2, action: "Contacted Sequoia Capital", time: "Yesterday" },
  { id: 3, action: "Shared GreenEnergy deck", time: "2 days ago" },
  { id: 4, action: "Added HealthX to pipeline", time: "3 days ago" },
]

// Connected accounts
const connectedAccounts = [
  { id: "google", name: "Google", icon: "G", connected: true, email: "sasi@voltuswave.com", description: "Calendar & Email synced", color: "bg-red-500" },
  { id: "linkedin", name: "LinkedIn", icon: "in", connected: true, email: "linkedin.com/in/sasikumar", description: "Profile synced", color: "bg-blue-600" },
  { id: "twitter", name: "Twitter", icon: "X", connected: false, email: "", description: "Not connected", color: "bg-foreground" },
  { id: "calendly", name: "Calendly", icon: "C", connected: false, email: "", description: "Not connected", color: "bg-blue-500" },
]

// Role icon mapping
const roleIcons: Record<UserRole, typeof User> = {
  "investment-banker": Building2,
  "institutional-investor": Briefcase,
  "angel-investor": User,
  "startup-founder": Rocket,
  "research-analyst": BarChart3,
  "corporate-development": Factory,
}

export default function ProfilePage() {
  const { user } = useAuth()
  const currentRole = user?.activeRole || "investment-banker"
  const profileData = getMockProfileData(currentRole)
  
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [editData, setEditData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
    timezone: profileData.timezone,
    linkedinUrl: profileData.linkedinUrl,
    bio: profileData.bio,
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // Save the edited data
    setEditModalOpen(false)
    setIsEditing(false)
  }

  const openEditModal = () => {
    // Reset edit data to current profile data when opening
    setEditData({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      timezone: profileData.timezone,
      linkedinUrl: profileData.linkedinUrl,
      bio: profileData.bio,
    })
    setEditModalOpen(true)
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") {
      if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
      if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
      return `$${amount}`
    }
    return `${currency} ${amount.toLocaleString()}`
  }

  const RoleIcon = roleIcons[currentRole] || User

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader title="My Profile" breadcrumbs={[{ label: "Profile" }]} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-4">
          {/* Two Column Layout - Full Width */}
          <div className="flex gap-0 h-full -mx-4">
            {/* Left Column - Profile Card */}
            <div className="w-[280px] shrink-0 space-y-4 px-4 border-r border-border">
                {/* Main Profile Card */}
                <Card>
                  <CardContent className="p-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-2">
                        <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
                          <AvatarImage src={profileData.avatar || ""} />
                          <AvatarFallback className="text-3xl font-semibold bg-primary text-primary-foreground">
                            {profileData.firstName[0]}{profileData.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <h2 className="text-xl font-semibold text-foreground mt-2">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      
                      {/* Role-specific title */}
                      {currentRole === "startup-founder" && profileData.founderProfile && (
                        <>
                          <p className="text-sm font-medium text-foreground">{profileData.founderProfile.roleAtCompany}</p>
                          <p className="text-sm text-muted-foreground">{profileData.founderProfile.currentCompany}</p>
                        </>
                      )}
                      {(currentRole === "institutional-investor" || currentRole === "angel-investor") && profileData.investorProfile && (
                        <>
                          <p className="text-sm font-medium text-foreground">{profileData.investorProfile.title}</p>
                          <p className="text-sm text-muted-foreground">{profileData.investorProfile.organization}</p>
                        </>
                      )}
                      {currentRole === "research-analyst" && profileData.analystProfile && (
                        <>
                          <p className="text-sm font-medium text-foreground">Research Analyst</p>
                          <p className="text-sm text-muted-foreground">{profileData.analystProfile.organization}</p>
                        </>
                      )}
                      {(currentRole === "investment-banker" || currentRole === "corporate-development") && profileData.bankerProfile && (
                        <>
                          <p className="text-sm font-medium text-foreground">{profileData.bankerProfile.title}</p>
                          <p className="text-sm text-muted-foreground">{profileData.bankerProfile.organization}</p>
                        </>
                      )}
                      
                      <Badge variant="secondary" className="mt-2">
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {currentRole === "startup-founder" && "Founder"}
                        {currentRole === "institutional-investor" && "Institutional Investor"}
                        {currentRole === "angel-investor" && "Angel Investor"}
                        {currentRole === "research-analyst" && "Analyst"}
                        {currentRole === "investment-banker" && "Investment Banker"}
                        {currentRole === "corporate-development" && "Corporate Development"}
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground truncate">{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{profileData.timezone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Linkedin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <a
                          href={`https://${profileData.linkedinUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {profileData.linkedinUrl}
                        </a>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Member Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {profileData.memberSince}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Active {profileData.lastActive}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connected Accounts - Compact */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {connectedAccounts.slice(0, 3).map((account) => (
                      <div key={account.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${account.color} flex items-center justify-center text-white text-xs font-bold`}>
                            {account.icon}
                          </div>
                          <span className="text-sm text-foreground">{account.name}</span>
                          {account.connected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          {account.connected ? "Manage" : "Connect"}
                        </Button>
                      </div>
                    ))}
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                      <Link href="/profile/settings">
                        Manage all connections
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Tabbed Content */}
              <div className="flex-1 min-w-0 overflow-auto">
                <div className="px-6 max-w-none">
                  <Tabs defaultValue="about" className="w-full">
                  <TabsList className="w-full justify-start rounded-lg bg-muted/80 p-1.5 border border-border/50 shadow-sm overflow-x-auto h-auto">
                    <TabsTrigger 
                      value="about" 
                      className="rounded-md px-4 py-2 text-sm font-medium transition-all text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      About
                    </TabsTrigger>
                    {currentRole === "startup-founder" && (
                      <TabsTrigger 
                        value="background" 
                        className="rounded-md px-4 py-2 text-sm font-medium transition-all text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Background
                      </TabsTrigger>
                    )}
                    {(currentRole === "institutional-investor" || currentRole === "angel-investor") && (
                      <TabsTrigger 
                        value="investments" 
                        className="rounded-md px-4 py-2 text-sm font-medium transition-all text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Investment Profile
                      </TabsTrigger>
                    )}
                    {currentRole === "research-analyst" && (
                      <TabsTrigger 
                        value="expertise" 
                        className="rounded-md px-4 py-2 text-sm font-medium transition-all text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Expertise
                      </TabsTrigger>
                    )}
                    {(currentRole === "investment-banker" || currentRole === "corporate-development") && (
                      <TabsTrigger 
                        value="experience" 
                        className="rounded-md px-4 py-2 text-sm font-medium transition-all text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Experience
                      </TabsTrigger>
                    )}
                    <TabsTrigger 
                      value="activity" 
                      className="rounded-md px-4 py-2 text-sm font-medium transition-all text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      Activity
                    </TabsTrigger>
                    <TabsTrigger 
                      value="privacy" 
                      className="rounded-md px-4 py-2 text-sm font-medium transition-all text-muted-foreground bg-transparent hover:text-foreground data-[state=inactive]:hover:bg-muted data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      Privacy
                    </TabsTrigger>
                  </TabsList>

                  {/* About Tab */}
                  <TabsContent value="about" className="mt-6 space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Bio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground leading-relaxed">
                          {profileData.bio || "No bio added yet."}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Role-specific highlights on About tab */}
                    {currentRole === "startup-founder" && profileData.founderProfile && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">Skills & Expertise</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {profileData.founderProfile.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {(currentRole === "institutional-investor" || currentRole === "angel-investor") && profileData.investorProfile && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">Investment Focus</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Sectors</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.investorProfile.investmentFocus.map((focus) => (
                                <Badge key={focus} variant="secondary">{focus}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Check Size</p>
                              <p className="text-sm font-medium text-foreground">
                                {formatCurrency(profileData.investorProfile.checkSizeRange.min, profileData.investorProfile.checkSizeRange.currency)} - {formatCurrency(profileData.investorProfile.checkSizeRange.max, profileData.investorProfile.checkSizeRange.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Stages</p>
                              <p className="text-sm font-medium text-foreground">
                                {profileData.investorProfile.preferredStages.join(", ")}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Founder Background Tab */}
                  {currentRole === "startup-founder" && profileData.founderProfile && (
                    <TabsContent value="background" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Work Experience
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Current Company */}
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">{profileData.founderProfile.roleAtCompany}</p>
                                <Badge variant="default" className="text-xs">Current</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{profileData.founderProfile.currentCompany}</p>
                            </div>
                          </div>
                          
                          {/* Previous Companies */}
                          {profileData.founderProfile.previousCompanies.map((company, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Building2 className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{company.role}</p>
                                <p className="text-sm text-muted-foreground">{company.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{company.years}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Education
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {profileData.founderProfile.education.map((edu, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                <p className="text-xs text-muted-foreground mt-1">{edu.year}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  {/* Investor Investment Profile Tab */}
                  {(currentRole === "institutional-investor" || currentRole === "angel-investor") && profileData.investorProfile && (
                    <TabsContent value="investments" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Investment Criteria
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                <p className="text-sm font-medium text-foreground">Check Size</p>
                              </div>
                              <p className="text-lg font-semibold text-foreground">
                                {formatCurrency(profileData.investorProfile.checkSizeRange.min, profileData.investorProfile.checkSizeRange.currency)} - {formatCurrency(profileData.investorProfile.checkSizeRange.max, profileData.investorProfile.checkSizeRange.currency)}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <p className="text-sm font-medium text-foreground">Preferred Stages</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {profileData.investorProfile.preferredStages.map((stage) => (
                                  <Badge key={stage} variant="outline" className="text-xs">{stage}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">Sector Focus</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.investorProfile.investmentFocus.map((focus) => (
                                <Badge key={focus} variant="secondary">{focus}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">Geographic Focus</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.investorProfile.geographicFocus.map((geo) => (
                                <Badge key={geo} variant="outline">{geo}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Notable Investments
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {profileData.investorProfile.notableInvestments.map((inv, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Rocket className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{inv.name}</p>
                                  <p className="text-xs text-muted-foreground">{inv.stage} - {inv.year}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  {/* Analyst Expertise Tab */}
                  {currentRole === "research-analyst" && profileData.analystProfile && (
                    <TabsContent value="expertise" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">Specialization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Sectors</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.analystProfile.specialization.map((spec) => (
                                <Badge key={spec} variant="secondary">{spec}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Research Focus Areas</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.analystProfile.researchFocusAreas.map((area) => (
                                <Badge key={area} variant="outline">{area}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.analystProfile.certifications.map((cert) => (
                                <Badge key={cert} className="bg-amber-500/10 text-amber-600 border-amber-500/20">{cert}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  {/* Banker Experience Tab */}
                  {(currentRole === "investment-banker" || currentRole === "corporate-development") && profileData.bankerProfile && (
                    <TabsContent value="experience" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">Deal Experience</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Transaction Types</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.bankerProfile.transactionTypes.map((type) => (
                                <Badge key={type} variant="secondary">{type}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Sector Focus</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.bankerProfile.sectorFocus.map((sector) => (
                                <Badge key={sector} variant="outline">{sector}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Experience Areas</p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.bankerProfile.dealExperience.map((exp) => (
                                <Badge key={exp} className="bg-blue-500/10 text-blue-600 border-blue-500/20">{exp}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="mt-6 space-y-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold">This Month</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/activity">
                            View All
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <Building2 className="w-5 h-5 mx-auto text-primary mb-1" />
                            <p className="text-xs text-muted-foreground">Deals Reviewed</p>
                            <p className="text-xl font-bold text-foreground">{activityStats.dealsReviewed.value}</p>
                            <div className={`flex items-center justify-center text-xs ${activityStats.dealsReviewed.up ? "text-emerald-600" : "text-red-600"}`}>
                              {activityStats.dealsReviewed.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              {activityStats.dealsReviewed.change}%
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <Users className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                            <p className="text-xs text-muted-foreground">Investors Contacted</p>
                            <p className="text-xl font-bold text-foreground">{activityStats.investorsContacted.value}</p>
                            <div className={`flex items-center justify-center text-xs ${activityStats.investorsContacted.up ? "text-emerald-600" : "text-red-600"}`}>
                              {activityStats.investorsContacted.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              {activityStats.investorsContacted.change}%
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <FileText className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                            <p className="text-xs text-muted-foreground">Documents Shared</p>
                            <p className="text-xl font-bold text-foreground">{activityStats.documentsShared.value}</p>
                            <div className={`flex items-center justify-center text-xs ${activityStats.documentsShared.up ? "text-emerald-600" : "text-red-600"}`}>
                              {activityStats.documentsShared.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              {Math.abs(activityStats.documentsShared.change)}%
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <Sparkles className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                            <p className="text-xs text-muted-foreground">Matches Made</p>
                            <p className="text-xl font-bold text-foreground">{activityStats.matchesMade.value}</p>
                            <div className={`flex items-center justify-center text-xs ${activityStats.matchesMade.up ? "text-emerald-600" : "text-red-600"}`}>
                              {activityStats.matchesMade.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              {activityStats.matchesMade.change}%
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium text-foreground mb-3">Recent Activity</p>
                          <div className="space-y-2">
                            {recentActivity.map((activity) => (
                              <div key={activity.id} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span className="text-foreground">{activity.action}</span>
                                <span className="text-muted-foreground">- {activity.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Privacy Tab */}
                  <TabsContent value="privacy" className="mt-6 space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Field Visibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Control who can see your profile information.</p>
                        
                        {[
                          { field: "Email", value: profileData.privacySettings.email, icon: Mail },
                          { field: "Phone", value: profileData.privacySettings.phone, icon: Phone },
                          { field: "Location", value: profileData.privacySettings.location, icon: MapPin },
                          { field: "LinkedIn", value: profileData.privacySettings.linkedinUrl, icon: Linkedin },
                          { field: "Bio", value: profileData.privacySettings.bio, icon: FileText },
                        ].map((item) => (
                          <div key={item.field} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">{item.field}</span>
                            </div>
                            <Select defaultValue={item.value}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-3 h-3" />
                                    Public
                                  </div>
                                </SelectItem>
                                <SelectItem value="team">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-3 h-3" />
                                    Team Only
                                  </div>
                                </SelectItem>
                                <SelectItem value="private">
                                  <div className="flex items-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    Private
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Public Profile</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Your public profile is visible to anyone with the link.
                        </p>
                        <div className="flex items-center gap-2">
                          <Input value={`volery.app/profile/sasikumar`} readOnly className="flex-1 bg-muted" />
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                </div>
              </div>
            </div>
        </main>
      </div>
      {/* Avatar Upload Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>Upload a new profile photo or remove the current one.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button>
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <Button variant="outline">Remove</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowAvatarDialog(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Changes will be visible to others based on your privacy settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profileData.avatar || ""} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {editData.firstName[0]}{editData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={() => {
                setEditModalOpen(false)
                setShowAvatarDialog(true)
              }}>
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editData.firstName}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={editData.timezone}
                onValueChange={(value) => setEditData({ ...editData, timezone: value })}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={editData.linkedinUrl}
                onChange={(e) => setEditData({ ...editData, linkedinUrl: e.target.value })}
                placeholder="linkedin.com/in/username"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell others about yourself..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Brief description for your profile. Max 500 characters.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
