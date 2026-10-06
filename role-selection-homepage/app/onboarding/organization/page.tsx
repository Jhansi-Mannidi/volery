"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Hexagon,
  Building2,
  Users,
  User,
  ArrowRight,
  ArrowLeft,
  Ticket,
  Plus,
  Check,
  Loader2,
} from "lucide-react"

type OrganizationOption = "create" | "join" | "individual" | null

export default function OrganizationOnboardingPage() {
  const [selectedOption, setSelectedOption] = useState<OrganizationOption>(null)
  const [orgName, setOrgName] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { user, setOrganization, completeOnboarding, isLoading, skipOnboarding } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex items-center gap-2">
          <Hexagon className="w-6 h-6 text-primary" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleBack = () => {
    router.push("/onboarding")
  }

  const handleSkip = () => {
    skipOnboarding()
    router.push("/")
  }

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) {
      setError("Please enter an organization name")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOrganization({
      id: `org_${Date.now()}`,
      name: orgName.trim(),
      role: "admin",
    })
    completeOnboarding()
    router.push("/")
  }

  const handleJoinOrganization = async () => {
    if (!inviteCode.trim()) {
      setError("Please enter an invite code")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate finding the organization
    if (inviteCode.toLowerCase() === "demo123") {
      setOrganization({
        id: "org_demo",
        name: "Anthill Ventures",
        role: "member",
      })
      completeOnboarding()
      router.push("/")
    } else {
      setError("Invalid invite code. Please check and try again.")
      setIsSubmitting(false)
    }
  }

  const handleContinueAsIndividual = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setOrganization(null)
    completeOnboarding()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-foreground">Volery</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
            Skip for now
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-primary/30" />
            <div className="w-16 h-1 rounded-full bg-primary" />
            <div className="w-3 h-3 rounded-full bg-primary/30" />
            <div className="w-16 h-1 rounded-full bg-primary" />
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl font-semibold text-foreground">Set Up Your Workspace</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Choose how you want to use Volery. You can always change this later.
            </p>
          </div>

          {selectedOption === null && (
            <div className="space-y-8">
              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Create Organization */}
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                  onClick={() => setSelectedOption("create")}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Plus className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Create Organization</h3>
                    <p className="text-sm text-muted-foreground">
                      Start a new team and invite colleagues
                    </p>
                  </CardContent>
                </Card>

                {/* Join Organization */}
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                  onClick={() => setSelectedOption("join")}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Join Organization</h3>
                    <p className="text-sm text-muted-foreground">
                      Join an existing team with an invite code
                    </p>
                  </CardContent>
                </Card>

                {/* Continue as Individual */}
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                  onClick={() => setSelectedOption("individual")}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <User className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Continue Individually</h3>
                    <p className="text-sm text-muted-foreground">
                      Use Volery on your own for now
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Back Button */}
              <div className="flex justify-center">
                <Button variant="outline" size="lg" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Role Selection
                </Button>
              </div>
            </div>
          )}

          {/* Create Organization Form */}
          {selectedOption === "create" && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Create Your Organization</CardTitle>
                <CardDescription>
                  Set up your team workspace. You&apos;ll be the admin and can invite members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    placeholder="e.g., Acme Ventures"
                    value={orgName}
                    onChange={(e) => {
                      setOrgName(e.target.value)
                      setError("")
                    }}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setSelectedOption(null)
                      setError("")
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateOrganization}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Join Organization Form */}
          {selectedOption === "join" && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Join an Organization</CardTitle>
                <CardDescription>
                  Enter the invite code you received from your team admin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <Input
                    id="invite-code"
                    placeholder="e.g., DEMO123"
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value.toUpperCase())
                      setError("")
                    }}
                    className="uppercase"
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <p className="text-xs text-muted-foreground">
                    Try &quot;DEMO123&quot; to join Anthill Ventures as a demo
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setSelectedOption(null)
                      setError("")
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleJoinOrganization}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue as Individual Confirmation */}
          {selectedOption === "individual" && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle>Continue Individually</CardTitle>
                <CardDescription>
                  You can use Volery on your own. You can create or join an organization later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">What you can do:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      Track your own deal flow
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      Manage investor relationships
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      Share documents securely
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      Create or join a team anytime
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedOption(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleContinueAsIndividual}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
