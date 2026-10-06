"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { 
  ArrowLeft,
  Globe, 
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Linkedin,
  Twitter,
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building2,
  Award,
  Star
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PublicProfilePreview() {
  const [viewMode, setViewMode] = useState<"founder" | "investor">("investor")
  const [accessRequestOpen, setAccessRequestOpen] = useState(false)
  const [requestStep, setRequestStep] = useState<"form" | "nda" | "success">("form")

  const isFounderView = viewMode === "founder"

  // Hidden content in investor view
  const hiddenMetrics = ["Burn Rate", "Runway", "Customer Churn"]
  const profileCompleteness = 85

  return (
    <div className="min-h-screen bg-background">
      {/* Header with View Toggle */}
      <div className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/founder/profile">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit Mode
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            {isFounderView && profileCompleteness < 100 && (
              <Alert className="py-2 px-3 border-amber-500/50 bg-amber-500/10">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <AlertDescription className="text-sm ml-2">
                  {profileCompleteness}% complete - Add team bios to reach 100%
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-lg">
              <Label htmlFor="view-mode" className="text-sm font-medium">
                {isFounderView ? <Eye className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              </Label>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm", isFounderView && "font-semibold")}>Founder</span>
                <Switch
                  id="view-mode"
                  checked={viewMode === "investor"}
                  onCheckedChange={(checked) => setViewMode(checked ? "investor" : "founder")}
                />
                <span className={cn("text-sm", !isFounderView && "font-semibold")}>Investor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Public Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">TC</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">TechCorp AI</h1>
                    <Badge variant="secondary">Verified</Badge>
                    {!isFounderView && (
                      <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                        Actively Raising
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground">AI-powered customer insights platform for enterprise</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href="https://techcorp.ai" className="hover:underline hover:text-primary" target="_blank" rel="noopener noreferrer">
                      techcorp.ai
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Founded January 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>SaaS • B2B</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  {!isFounderView && (
                    <Dialog open={accessRequestOpen} onOpenChange={setAccessRequestOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Request Access
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        {requestStep === "form" && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Request Access to TechCorp AI</DialogTitle>
                              <DialogDescription>
                                Fill out this form to request access to detailed financials, documents, and investor materials.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="investor-name">Full Name</Label>
                                <Input id="investor-name" placeholder="John Doe" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="investor-email">Email</Label>
                                <Input id="investor-email" type="email" placeholder="john@venture.com" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="investor-firm">Firm/Organization</Label>
                                <Input id="investor-firm" placeholder="Acme Ventures" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="investor-message">Message to Founder (Optional)</Label>
                                <Textarea 
                                  id="investor-message" 
                                  placeholder="Hi, I'm interested in learning more about your Series A round..."
                                  className="min-h-24"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setAccessRequestOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => setRequestStep("nda")}>
                                  Continue
                                </Button>
                              </div>
                            </div>
                          </>
                        )}

                        {requestStep === "nda" && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Sign NDA</DialogTitle>
                              <DialogDescription>
                                This startup requires an NDA before sharing confidential information.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                                <h4 className="font-semibold mb-2">Non-Disclosure Agreement</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  This NDA governs the disclosure of confidential information between TechCorp AI and the receiving party...
                                  [Full NDA text would appear here]
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="nda-agree" />
                                <Label htmlFor="nda-agree" className="text-sm leading-relaxed">
                                  I have read and agree to the terms of this Non-Disclosure Agreement
                                </Label>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setRequestStep("form")}>
                                  Back
                                </Button>
                                <Button onClick={() => setRequestStep("success")}>
                                  Sign & Submit
                                </Button>
                              </div>
                            </div>
                          </>
                        )}

                        {requestStep === "success" && (
                          <>
                            <DialogHeader>
                              <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                              </div>
                              <DialogTitle className="text-center">Request Submitted!</DialogTitle>
                              <DialogDescription className="text-center">
                                Your access request has been sent to TechCorp AI. You'll receive an email notification once the founder reviews your request.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center pt-4">
                              <Button onClick={() => {
                                setAccessRequestOpen(false)
                                setRequestStep("form")
                                toast.success("Access request submitted successfully")
                              }}>
                                Done
                              </Button>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                  {!isFounderView && (
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Founder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highlights Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Highlights</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    {isFounderView && (
                      <Eye className="w-4 h-4 text-emerald-500" title="Visible to investors" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$2.5M</p>
                    <p className="text-sm text-muted-foreground">ARR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    {isFounderView && (
                      <Eye className="w-4 h-4 text-emerald-500" title="Visible to investors" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">250+</p>
                    <p className="text-sm text-muted-foreground">Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cn(isFounderView && "border-amber-500/50 bg-amber-500/5")}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    {isFounderView && (
                      <EyeOff className="w-4 h-4 text-amber-500" title="Hidden from investors" />
                    )}
                  </div>
                  <div className={cn(isFounderView ? "opacity-100" : "opacity-0")}>
                    <p className="text-2xl font-bold">$120K</p>
                    <p className="text-sm text-muted-foreground">Burn Rate</p>
                  </div>
                  {!isFounderView && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Gated</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    {isFounderView && (
                      <Eye className="w-4 h-4 text-emerald-500" title="Visible to investors" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">15%</p>
                    <p className="text-sm text-muted-foreground">MoM Growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-muted-foreground leading-relaxed">
                TechCorp AI is revolutionizing how businesses understand their customers. Our AI-powered platform analyzes customer interactions across all touchpoints to provide actionable insights that drive growth and retention.
              </p>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Problem
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Companies struggle to understand customer behavior across fragmented data sources, leading to missed opportunities and poor customer experiences. Legacy systems cost millions in integration fees.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Solution
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our unified AI platform aggregates and analyzes all customer data in real-time, providing instant insights and recommendations that help businesses make data-driven decisions quickly.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Market Opportunity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                $50B TAM in customer analytics software, growing 18% annually. Targeting mid-market to enterprise companies with $100M+ revenue in financial services, manufacturing, and logistics sectors.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Logos */}
        <Card>
          <CardHeader>
            <CardTitle>Trusted By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Acme Corp", "Global Tech", "Enterprise Inc", "Future Systems"].map((company) => (
                <div key={company} className="flex items-center justify-center p-4 border rounded-lg bg-muted/30">
                  <div className="text-center">
                    <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">{company}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Press Mentions */}
        <Card>
          <CardHeader>
            <CardTitle>Press & Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { outlet: "TechCrunch", headline: "TechCorp AI Raises $3M Seed Round", date: "Dec 2025" },
                { outlet: "VentureBeat", headline: "Top 10 AI Startups to Watch in 2026", date: "Jan 2026" },
                { outlet: "Forbes", headline: "How AI is Transforming Customer Analytics", date: "Jan 2026" },
              ].map((article, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{article.headline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{article.outlet}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">{article.date}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle>Leadership Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: "Sarah Chen", role: "CEO & Co-founder", initials: "SC", featured: true, bio: "Ex-Google PM, 10+ years in AI/ML" },
                { name: "Michael Rodriguez", role: "CTO & Co-founder", initials: "MR", featured: true, bio: "Former Amazon Engineer, MIT CS" },
                { name: "Emily Watson", role: "VP of Product", initials: "EW", featured: false, bio: "Ex-Salesforce, Stanford MBA" },
              ].map((member) => (
                <div key={member.name} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{member.name}</p>
                        {member.featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                  <Button variant="ghost" size="sm" className="w-full">
                    <Linkedin className="w-4 h-4 mr-2" />
                    View LinkedIn
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fundraising Section */}
        {!isFounderView && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fundraising</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                  Series A Open
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Raising</p>
                  <p className="text-2xl font-bold">$5M - $7M</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valuation</p>
                  <p className="text-2xl font-bold">$25M - $30M</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Founder
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Request Deck
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gated Content Notice */}
        {!isFounderView && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Additional Information Available</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Detailed financials, cap table, investor materials, and customer references are available after access approval and NDA signing.
                  </p>
                  <Button size="sm" variant="outline" className="bg-transparent" onClick={() => setAccessRequestOpen(true)}>
                    Request Full Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Founder View Suggestions */}
        {isFounderView && profileCompleteness < 100 && (
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Improve Your Profile</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete these sections to reach 100% and increase investor engagement:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Add detailed team member bios (+5%)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Upload customer case studies (+5%)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Add advisor testimonials (+5%)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
