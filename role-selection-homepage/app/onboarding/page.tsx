"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth, AVAILABLE_ROLES, type UserRole } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Building2,
  Briefcase,
  User,
  Rocket,
  BarChart3,
  Factory,
  Hexagon,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Briefcase,
  User,
  Rocket,
  BarChart3,
  Factory,
}

type Step = "role-selection" | "role-confirmation"

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("role-selection")
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const { user, setUserRoles, isLoading, skipOnboarding } = useAuth()
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

  const toggleRole = (roleId: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    )
  }

  const handleContinue = () => {
    if (selectedRoles.length > 0) {
      setStep("role-confirmation")
    }
  }

  const handleConfirm = () => {
    setUserRoles(selectedRoles)
    router.push("/onboarding/organization")
  }

  const handleBack = () => {
    setStep("role-selection")
  }

  const handleSkip = () => {
    skipOnboarding()
    router.push("/")
  }

  const primaryRole = selectedRoles[0]
  const primaryRoleInfo = AVAILABLE_ROLES.find((r) => r.id === primaryRole)

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
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${step === "role-selection" ? "bg-primary" : "bg-primary/30"}`} />
            <div className={`w-16 h-1 rounded-full ${step === "role-confirmation" ? "bg-primary" : "bg-muted"}`} />
            <div className={`w-3 h-3 rounded-full ${step === "role-confirmation" ? "bg-primary" : "bg-muted"}`} />
            <div className="w-16 h-1 rounded-full bg-muted" />
            <div className="w-3 h-3 rounded-full bg-muted" />
          </div>

          {step === "role-selection" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-semibold text-foreground">Welcome to Volery, {user.name}!</h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Tell us about yourself. Select the role that best describes you.
                </p>
              </div>

              {/* Role Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_ROLES.map((role) => {
                  const IconComponent = iconMap[role.icon]
                  const isSelected = selectedRoles.includes(role.id)

                  return (
                    <Card
                      key={role.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleRole(role.id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{role.label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Multi-role hint */}
              {selectedRoles.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>
                    {selectedRoles.length === 1
                      ? "You can select multiple roles if they apply to you"
                      : `${selectedRoles.length} roles selected`}
                  </span>
                </div>
              )}

              {/* Selected Roles Display */}
              {selectedRoles.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {selectedRoles.map((roleId) => {
                    const roleInfo = AVAILABLE_ROLES.find((r) => r.id === roleId)
                    return (
                      <Badge key={roleId} variant="secondary" className="py-1.5 px-3">
                        {roleInfo?.label}
                      </Badge>
                    )
                  })}
                </div>
              )}

              {/* Continue Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="min-w-[200px]"
                  onClick={handleContinue}
                  disabled={selectedRoles.length === 0}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === "role-confirmation" && primaryRoleInfo && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-semibold text-foreground">Confirm Your Role</h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  This determines your dashboard layout and available features.
                </p>
              </div>

              {/* Primary Role Card */}
              <Card className="max-w-lg mx-auto border-primary">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                      {(() => {
                        const IconComponent = iconMap[primaryRoleInfo.icon]
                        return <IconComponent className="w-8 h-8 text-primary-foreground" />
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{primaryRoleInfo.label}</h2>
                      {selectedRoles.length > 1 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          + {selectedRoles.length - 1} additional role{selectedRoles.length > 2 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <p className="text-muted-foreground">{primaryRoleInfo.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Roles */}
              {selectedRoles.length > 1 && (
                <div className="max-w-lg mx-auto">
                  <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
                    Your additional roles:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedRoles.slice(1).map((roleId) => {
                      const roleInfo = AVAILABLE_ROLES.find((r) => r.id === roleId)
                      const IconComponent = roleInfo ? iconMap[roleInfo.icon] : null
                      return (
                        <Badge key={roleId} variant="outline" className="py-2 px-4 gap-2">
                          {IconComponent && <IconComponent className="w-4 h-4" />}
                          {roleInfo?.label}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Features Preview */}
              <div className="max-w-lg mx-auto">
                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <h3 className="font-medium text-foreground">What you&apos;ll get access to:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      Personalized dashboard with relevant metrics
                    </li>
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      AI-powered matching recommendations
                    </li>
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      Document sharing and tracking
                    </li>
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      Deal flow management tools
                    </li>
                  </ul>
                </div>
              </div>

              {/* Note */}
              <p className="text-center text-sm text-muted-foreground">
                You can change your role anytime in Settings
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="lg" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button size="lg" className="min-w-[200px]" onClick={handleConfirm}>
                  Confirm & Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
