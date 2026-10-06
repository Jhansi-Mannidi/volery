"use client"

import { useState } from "react"
import { Linkedin, Mail, Plus, Trash2, Edit2, Star } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Mock team data
const initialTeamMembers = [
  {
    id: 1,
    name: "Ananya Singh",
    role: "Co-founder & CEO",
    email: "ananya@talentflow.com",
    linkedin: "https://linkedin.com/in/ananya-singh",
    bio: "Previously PM at Flipkart building B2B products. Led team of 12 PMs and launched 5+ products generating $50M+ revenue.",
    image: null,
    featured: true,
  },
  {
    id: 2,
    name: "Rahul Kapoor",
    role: "Co-founder & CTO",
    email: "rahul@talentflow.com",
    linkedin: "https://linkedin.com/in/rahul-kapoor",
    bio: "Former Tech Lead at Google. 8 years building scalable systems. IIT Delhi alumnus with expertise in distributed systems.",
    image: null,
    featured: true,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Head of Product",
    email: "priya@talentflow.com",
    linkedin: "https://linkedin.com/in/priya-sharma",
    bio: "Product leader with 10+ years experience. Previously at Amazon and Microsoft building enterprise SaaS products.",
    image: null,
    featured: false,
  },
  {
    id: 4,
    name: "Vikram Patel",
    role: "Head of Engineering",
    email: "vikram@talentflow.com",
    linkedin: "https://linkedin.com/in/vikram-patel",
    bio: "Engineering manager with 12 years experience. Built and scaled engineering teams at successful startups.",
    image: null,
    featured: false,
  },
]

const initialAdvisors = [
  {
    id: 1,
    name: "Dr. Amit Verma",
    role: "Strategic Advisor",
    company: "Former VP, Accel Partners",
    email: "amit@example.com",
    linkedin: "https://linkedin.com/in/amit-verma",
    bio: "Venture capital veteran with 20+ years experience. Backed 50+ successful startups. Expert in B2B SaaS and HR tech.",
    image: null,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "GTM Advisor",
    company: "Former CRO, Workday APAC",
    email: "sarah@example.com",
    linkedin: "https://linkedin.com/in/sarah-johnson",
    bio: "Enterprise sales leader. Built and scaled sales teams from 0 to $100M+ ARR. Expert in go-to-market strategy.",
    image: null,
  },
]

type TeamMember = {
  id: number
  name: string
  role: string
  email: string
  linkedin: string
  bio: string
  image: string | null
  featured?: boolean
}

type Advisor = {
  id: number
  name: string
  role: string
  company: string
  email: string
  linkedin: string
  bio: string
  image: string | null
}

export function TeamTab() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [advisors, setAdvisors] = useState<Advisor[]>(initialAdvisors)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddAdvisorOpen, setIsAddAdvisorOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null)

  // Form state
  const [memberForm, setMemberForm] = useState({
    name: "",
    role: "",
    email: "",
    linkedin: "",
    bio: "",
    featured: false,
  })

  const [advisorForm, setAdvisorForm] = useState({
    name: "",
    role: "",
    company: "",
    email: "",
    linkedin: "",
    bio: "",
  })

  const handleAddMember = () => {
    if (editingMember) {
      setTeamMembers(
        teamMembers.map((m) =>
          m.id === editingMember.id ? { ...editingMember, ...memberForm } : m
        )
      )
    } else {
      const newMember: TeamMember = {
        id: Date.now(),
        ...memberForm,
        image: null,
      }
      setTeamMembers([...teamMembers, newMember])
    }
    resetMemberForm()
  }

  const handleAddAdvisor = () => {
    if (editingAdvisor) {
      setAdvisors(
        advisors.map((a) =>
          a.id === editingAdvisor.id ? { ...editingAdvisor, ...advisorForm } : a
        )
      )
    } else {
      const newAdvisor: Advisor = {
        id: Date.now(),
        ...advisorForm,
        image: null,
      }
      setAdvisors([...advisors, newAdvisor])
    }
    resetAdvisorForm()
  }

  const resetMemberForm = () => {
    setMemberForm({
      name: "",
      role: "",
      email: "",
      linkedin: "",
      bio: "",
      featured: false,
    })
    setEditingMember(null)
    setIsAddMemberOpen(false)
  }

  const resetAdvisorForm = () => {
    setAdvisorForm({
      name: "",
      role: "",
      company: "",
      email: "",
      linkedin: "",
      bio: "",
    })
    setEditingAdvisor(null)
    setIsAddAdvisorOpen(false)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setMemberForm({
      name: member.name,
      role: member.role,
      email: member.email,
      linkedin: member.linkedin,
      bio: member.bio,
      featured: member.featured || false,
    })
    setIsAddMemberOpen(true)
  }

  const handleEditAdvisor = (advisor: Advisor) => {
    setEditingAdvisor(advisor)
    setAdvisorForm({
      name: advisor.name,
      role: advisor.role,
      company: advisor.company,
      email: advisor.email,
      linkedin: advisor.linkedin,
      bio: advisor.bio,
    })
    setIsAddAdvisorOpen(true)
  }

  const handleRemoveMember = (id: number) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }

  const handleRemoveAdvisor = (id: number) => {
    setAdvisors(advisors.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Team Members Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your startup team and highlight key members
            </p>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetMemberForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </DialogTitle>
                <DialogDescription>
                  Add team member details. Investors will see featured members on your profile.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Full Name *</Label>
                  <Input
                    id="member-name"
                    placeholder="e.g. Ananya Singh"
                    value={memberForm.name}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-role">Role / Title *</Label>
                  <Input
                    id="member-role"
                    placeholder="e.g. Co-founder & CEO"
                    value={memberForm.role}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, role: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-email">Email *</Label>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="email@company.com"
                    value={memberForm.email}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-linkedin">LinkedIn Profile</Label>
                  <Input
                    id="member-linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={memberForm.linkedin}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, linkedin: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-bio">Bio (280 characters max)</Label>
                  <Textarea
                    id="member-bio"
                    placeholder="Brief background and experience..."
                    maxLength={280}
                    rows={3}
                    value={memberForm.bio}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, bio: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {memberForm.bio.length}/280
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured" className="text-sm font-medium">
                      Featured Member
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight this member prominently on your profile
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={memberForm.featured}
                    onCheckedChange={(checked) =>
                      setMemberForm({ ...memberForm, featured: checked })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetMemberForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={!memberForm.name || !memberForm.role || !memberForm.email}
                >
                  {editingMember ? "Save Changes" : "Add Member"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="relative">
                <CardContent className="p-4">
                  {member.featured && (
                    <Badge
                      className="absolute top-2 right-2 bg-amber-500/10 text-amber-600 border-amber-500/20"
                      variant="outline"
                    >
                      <Star className="w-3 h-3 mr-1 fill-amber-600" />
                      Featured
                    </Badge>
                  )}
                  
                  <div className="flex gap-3">
                    <Avatar className="w-16 h-16">
                      {member.image ? (
                        <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                      ) : (
                        <AvatarFallback className="text-lg bg-primary/10 text-primary">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground">
                        {member.name}
                      </h4>
                      <p className="text-sm text-primary">{member.role}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </a>
                      </div>
                      
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          <Linkedin className="w-3 h-3" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {member.bio && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit2 className="w-3 h-3 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advisors Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Advisors</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Showcase your advisory board and mentors
            </p>
          </div>
          <Dialog open={isAddAdvisorOpen} onOpenChange={setIsAddAdvisorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => resetAdvisorForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Advisor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAdvisor ? "Edit Advisor" : "Add Advisor"}
                </DialogTitle>
                <DialogDescription>
                  Add advisor details to showcase your support network.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="advisor-name">Full Name *</Label>
                  <Input
                    id="advisor-name"
                    placeholder="e.g. Dr. Amit Verma"
                    value={advisorForm.name}
                    onChange={(e) =>
                      setAdvisorForm({ ...advisorForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advisor-role">Advisory Role *</Label>
                  <Input
                    id="advisor-role"
                    placeholder="e.g. Strategic Advisor"
                    value={advisorForm.role}
                    onChange={(e) =>
                      setAdvisorForm({ ...advisorForm, role: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advisor-company">Company / Title *</Label>
                  <Input
                    id="advisor-company"
                    placeholder="e.g. Former VP, Accel Partners"
                    value={advisorForm.company}
                    onChange={(e) =>
                      setAdvisorForm({ ...advisorForm, company: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advisor-email">Email</Label>
                  <Input
                    id="advisor-email"
                    type="email"
                    placeholder="email@company.com"
                    value={advisorForm.email}
                    onChange={(e) =>
                      setAdvisorForm({ ...advisorForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advisor-linkedin">LinkedIn Profile</Label>
                  <Input
                    id="advisor-linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={advisorForm.linkedin}
                    onChange={(e) =>
                      setAdvisorForm({ ...advisorForm, linkedin: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advisor-bio">Bio (280 characters max)</Label>
                  <Textarea
                    id="advisor-bio"
                    placeholder="Brief background and expertise..."
                    maxLength={280}
                    rows={3}
                    value={advisorForm.bio}
                    onChange={(e) =>
                      setAdvisorForm({ ...advisorForm, bio: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {advisorForm.bio.length}/280
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetAdvisorForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAdvisor}
                  disabled={
                    !advisorForm.name || !advisorForm.role || !advisorForm.company
                  }
                >
                  {editingAdvisor ? "Save Changes" : "Add Advisor"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisors.map((advisor) => (
              <Card key={advisor.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="w-12 h-12">
                      {advisor.image ? (
                        <AvatarImage src={advisor.image || "/placeholder.svg"} alt={advisor.name} />
                      ) : (
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {advisor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm">
                        {advisor.name}
                      </h4>
                      <p className="text-xs text-primary">{advisor.role}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {advisor.company}
                      </p>
                    </div>
                  </div>
                  
                  {advisor.bio && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                      {advisor.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-3">
                    {advisor.linkedin && (
                      <a
                        href={advisor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Linkedin className="w-3 h-3" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAdvisor(advisor)}
                    >
                      <Edit2 className="w-3 h-3 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAdvisor(advisor.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
