"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Edit2,
  ExternalLink,
  Linkedin,
  Mail,
  MapPin,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"

// Types for advisors (extend mock shape)
type AdvisorItem = {
  id: number
  name: string
  role: string
  company: string
  expertise: string[]
  linkedin: string
  image: string | null
}

// Mock team data
const teamData = {
  founders: [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "CEO & Co-founder",
      image: null,
      previousCompanies: ["Goldman Sachs (VP)", "IIT Delhi"],
      experience: "12 years experience in fintech",
      linkedin: "https://linkedin.com/in/rajesh-kumar",
      email: "rajesh@techcorp.ai",
      bio: "Led product strategy at Goldman Sachs for 6 years. Built and scaled fintech products serving 10M+ users.",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "CTO & Co-founder",
      image: null,
      previousCompanies: ["Google (Senior Engineer)", "MIT"],
      experience: "AI/ML specialist, 10 patents",
      linkedin: "https://linkedin.com/in/priya-patel",
      email: "priya@techcorp.ai",
      bio: "Former Google AI researcher with expertise in NLP and computer vision. Published 20+ papers in top ML conferences.",
    },
  ],
  overview: {
    totalSize: 15,
    departments: [
      { name: "Engineering", count: 8, color: "bg-blue-500" },
      { name: "Sales & Marketing", count: 4, color: "bg-green-500" },
      { name: "Operations", count: 3, color: "bg-amber-500" },
    ],
    growth: {
      lastSixMonths: 5,
      trend: "positive",
    },
    keyHires: [
      { name: "Sarah Chen", role: "Head of Sales", date: "Dec 2025" },
      { name: "Michael Ross", role: "Senior ML Engineer", date: "Nov 2025" },
    ],
  },
  advisors: [
    {
      id: 1,
      name: "Dr. Amit Sharma",
      role: "Strategic Advisor",
      company: "Former CEO, PayTech India",
      expertise: ["Fintech", "Strategy", "Fundraising"],
      linkedin: "https://linkedin.com/in/amit-sharma",
      image: null,
    },
    {
      id: 2,
      name: "Jennifer Wu",
      role: "Technical Advisor",
      company: "AI Research Lead, Stanford",
      expertise: ["AI/ML", "Product Development"],
      linkedin: "https://linkedin.com/in/jennifer-wu",
      image: null,
    },
    {
      id: 3,
      name: "Robert Johnson",
      role: "GTM Advisor",
      company: "Former CRO, Salesforce APAC",
      expertise: ["Enterprise Sales", "GTM Strategy"],
      linkedin: "https://linkedin.com/in/robert-johnson",
      image: null,
    },
  ],
  openPositions: [
    {
      id: 1,
      title: "Senior Backend Engineer",
      department: "Engineering",
      location: "Mumbai / Remote",
      type: "Full-time",
      url: "#",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Mumbai",
      type: "Full-time",
      url: "#",
    },
    {
      id: 3,
      title: "Enterprise Account Executive",
      department: "Sales",
      location: "Mumbai / Bangalore",
      type: "Full-time",
      url: "#",
    },
  ],
}

export function TeamTab() {
  const { toast } = useToast()
  const [showOrgChart, setShowOrgChart] = useState(false)
  const [editFoundersOpen, setEditFoundersOpen] = useState(false)
  const [addAdvisorOpen, setAddAdvisorOpen] = useState(false)
  const [advisorsList, setAdvisorsList] = useState<AdvisorItem[]>(teamData.advisors as AdvisorItem[])
  const openPositionsRef = useRef<HTMLDivElement>(null)

  const handleViewAllPositions = () => {
    openPositionsRef.current?.scrollIntoView({ behavior: "smooth" })
    toast({ title: "Open positions", description: "Showing all open positions for this startup." })
  }

  const handleAddAdvisor = (advisor: Omit<AdvisorItem, "id">) => {
    const nextId = Math.max(...advisorsList.map((a) => a.id), 0) + 1
    setAdvisorsList((prev) => [...prev, { ...advisor, id: nextId }])
    setAddAdvisorOpen(false)
    toast({ title: "Advisor added", description: `${advisor.name} has been added to the team.` })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Founders Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Founders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamData.founders.map((founder) => (
              <div
                key={founder.id}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex gap-4">
                  <Avatar className="w-16 h-16">
                    {founder.image ? (
                      <AvatarImage src={founder.image || "/placeholder.svg"} alt={founder.name} />
                    ) : (
                      <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {founder.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{founder.name}</h4>
                        <p className="text-sm text-primary">{founder.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={`mailto:${founder.email}`}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Previously: {founder.previousCompanies.join(", ")}
                    </p>
                    <p className="text-sm mt-2">{founder.bio}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {founder.experience}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Advisors Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Advisors</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddAdvisorOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Advisor
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisorsList.map((advisor) => (
                <div
                  key={advisor.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex gap-3">
                    <Avatar className="w-12 h-12">
                      {advisor.image ? (
                        <AvatarImage src={advisor.image || "/placeholder.svg"} alt={advisor.name} />
                      ) : (
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {advisor.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{advisor.name}</h4>
                          <p className="text-xs text-muted-foreground">{advisor.role}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          asChild
                        >
                          <a href={advisor.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{advisor.company}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {advisor.expertise.map((exp, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Org Chart (Expandable) */}
        <Card>
          <CardHeader className="pb-3">
            <button
              onClick={() => setShowOrgChart(!showOrgChart)}
              className="flex items-center justify-between w-full text-left"
            >
              <CardTitle className="text-base font-semibold">Organization Chart</CardTitle>
              <ChevronDown className={cn(
                "w-5 h-5 text-muted-foreground transition-transform",
                showOrgChart && "rotate-180"
              )} />
            </button>
          </CardHeader>
          {showOrgChart && (
            <CardContent>
              <div className="flex flex-col items-center py-4">
                {/* CEO */}
                <div className="flex flex-col items-center">
                  <div className="p-3 border rounded-lg bg-primary/5 border-primary/30 text-center">
                    <p className="font-medium text-sm">Rajesh Kumar</p>
                    <p className="text-xs text-muted-foreground">CEO</p>
                  </div>
                  <div className="w-0.5 h-6 bg-border" />
                </div>
                
                {/* Second Level */}
                <div className="flex items-start gap-8">
                  {/* CTO */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-0.5 bg-border" />
                    <div className="w-0.5 h-4 bg-border" />
                    <div className="p-3 border rounded-lg text-center">
                      <p className="font-medium text-sm">Priya Patel</p>
                      <p className="text-xs text-muted-foreground">CTO</p>
                    </div>
                    <div className="w-0.5 h-4 bg-border" />
                    <div className="flex gap-4">
                      <div className="p-2 border rounded bg-muted/50 text-center">
                        <p className="text-xs font-medium">Engineering</p>
                        <p className="text-[10px] text-muted-foreground">8 people</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* COO */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-0.5 bg-border" />
                    <div className="w-0.5 h-4 bg-border" />
                    <div className="p-3 border rounded-lg text-center">
                      <p className="font-medium text-sm">Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">Head of Sales</p>
                    </div>
                    <div className="w-0.5 h-4 bg-border" />
                    <div className="flex gap-4">
                      <div className="p-2 border rounded bg-muted/50 text-center">
                        <p className="text-xs font-medium">Sales & Mkt</p>
                        <p className="text-[10px] text-muted-foreground">4 people</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Operations */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-0.5 bg-border" />
                    <div className="w-0.5 h-4 bg-border" />
                    <div className="p-3 border rounded-lg text-center">
                      <p className="font-medium text-sm">Operations</p>
                      <p className="text-xs text-muted-foreground">Lead</p>
                    </div>
                    <div className="w-0.5 h-4 bg-border" />
                    <div className="flex gap-4">
                      <div className="p-2 border rounded bg-muted/50 text-center">
                        <p className="text-xs font-medium">Operations</p>
                        <p className="text-[10px] text-muted-foreground">3 people</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Team Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Team Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teamData.overview.totalSize}</p>
                  <p className="text-xs text-muted-foreground">Total employees</p>
                </div>
              </div>
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{teamData.overview.growth.lastSixMonths} in 6 mo
              </Badge>
            </div>

            {/* Department Breakdown */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">By Department</p>
              <div className="space-y-2">
                {teamData.overview.departments.map((dept, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", dept.color)} />
                    <span className="text-sm flex-1">{dept.name}</span>
                    <span className="text-sm font-medium">{dept.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Bar */}
            <div className="flex h-3 rounded-full overflow-hidden">
              {teamData.overview.departments.map((dept, i) => (
                <div
                  key={i}
                  className={cn(dept.color)}
                  style={{ width: `${(dept.count / teamData.overview.totalSize) * 100}%` }}
                />
              ))}
            </div>

            {/* Key Hires */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Recent Key Hires</p>
              <div className="space-y-2">
                {teamData.overview.keyHires.map((hire, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{hire.name}</p>
                      <p className="text-xs text-muted-foreground">{hire.role}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{hire.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <div ref={openPositionsRef} id="open-positions">
          <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Open Positions</CardTitle>
            <Badge variant="secondary">{teamData.openPositions.length} roles</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamData.openPositions.map((position) => (
              <a
                key={position.id}
                href={position.url}
                className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {position.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {position.department}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    <MapPin className="w-2.5 h-2.5 mr-0.5" />
                    {position.location}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    <Briefcase className="w-2.5 h-2.5 mr-0.5" />
                    {position.type}
                  </Badge>
                </div>
              </a>
            ))}
            
            <Button
              variant="link"
              className="w-full justify-center text-primary p-0 h-auto"
              onClick={handleViewAllPositions}
            >
              View All Positions
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Edit Founders Modal */}
      <Dialog open={editFoundersOpen} onOpenChange={setEditFoundersOpen}>
        <DialogContent className="max-w-lg" onCloseAutoFocus={(e) => e?.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Founders</DialogTitle>
            <DialogDescription>
              Update founder information for this startup. Changes will be visible on the profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {teamData.founders.map((founder, i) => (
              <div key={founder.id} className="space-y-2 rounded-lg border p-3">
                <Label>Founder {i + 1}</Label>
                <div className="grid gap-2 text-sm">
                  <Input defaultValue={founder.name} placeholder="Full name" />
                  <Input defaultValue={founder.role} placeholder="Role" />
                  <Input defaultValue={founder.email} type="email" placeholder="Email" />
                  <Input defaultValue={founder.linkedin} placeholder="LinkedIn URL" />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFoundersOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setEditFoundersOpen(false)
                toast({ title: "Founders updated", description: "Founder information has been saved." })
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Advisor Modal */}
      <AddAdvisorModal
        open={addAdvisorOpen}
        onOpenChange={setAddAdvisorOpen}
        onAdd={handleAddAdvisor}
      />

      <Toaster />
    </div>
  )
}

function AddAdvisorModal({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (advisor: Omit<AdvisorItem, "id">) => void
}) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [expertiseText, setExpertiseText] = useState("")

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      role: role.trim() || "Advisor",
      company: company.trim(),
      linkedin: linkedin.trim() || "https://linkedin.com/in/",
      expertise: expertiseText.split(",").map((s) => s.trim()).filter(Boolean),
      image: null,
    })
    setName("")
    setRole("")
    setCompany("")
    setLinkedin("")
    setExpertiseText("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onCloseAutoFocus={(e) => e?.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Advisor</DialogTitle>
          <DialogDescription>
            Add a new advisor to the startup team. Include their role and expertise.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="advisor-name">Name</Label>
            <Input
              id="advisor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Jane Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advisor-role">Role</Label>
            <Input
              id="advisor-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Strategic Advisor"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advisor-company">Company / Background</Label>
            <Input
              id="advisor-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Former CEO, Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advisor-linkedin">LinkedIn URL</Label>
            <Input
              id="advisor-linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advisor-expertise">Expertise (comma-separated)</Label>
            <Input
              id="advisor-expertise"
              value={expertiseText}
              onChange={(e) => setExpertiseText(e.target.value)}
              placeholder="e.g. Fintech, Strategy, Fundraising"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Add Advisor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
