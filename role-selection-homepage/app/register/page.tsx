"use client"

import React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  User,
  Linkedin,
  Phone,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/ReusableComponents/AuthLayout/AuthLayout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Simulated invite data
const inviteData = {
  email: "sarah.chen@example.com",
  teamName: "Anthill Ventures",
  teamAvatar: "AV",
  suggestedRole: "analyst",
}

const roles = [
  { value: "partner", label: "Partner" },
  { value: "investment_associate", label: "Investment Associate" },
  { value: "analyst", label: "Analyst" },
  { value: "admin", label: "Administrator" },
]

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={cn(met ? "text-emerald-500" : "text-muted-foreground")}>
        {text}
      </span>
    </div>
  )
}

function PasswordStrengthBar({ strength }: { strength: number }) {
  const getColor = () => {
    if (strength <= 1) return "bg-red-500"
    if (strength <= 2) return "bg-orange-500"
    if (strength <= 3) return "bg-yellow-500"
    if (strength <= 4) return "bg-emerald-500"
    return "bg-emerald-500"
  }

  const getLabel = () => {
    if (strength === 0) return ""
    if (strength <= 1) return "Weak"
    if (strength <= 2) return "Fair"
    if (strength <= 3) return "Good"
    if (strength <= 4) return "Strong"
    return "Very Strong"
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              level <= strength ? getColor() : "bg-secondary"
            )}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className={cn("text-xs", getColor().replace("bg-", "text-"))}>
          {getLabel()}
        </p>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Step 1 fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Step 2 fields
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [role, setRole] = useState(inviteData.suggestedRole)
  const [phone, setPhone] = useState("")
  const [linkedIn, setLinkedIn] = useState("")

  // Password validation
  const passwordRequirements = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password])

  const passwordStrength = useMemo(() => {
    return Object.values(passwordRequirements).filter(Boolean).length
  }, [passwordRequirements])

  const allRequirementsMet = passwordStrength === 5
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const canProceedStep1 =
    firstName.trim() &&
    lastName.trim() &&
    allRequirementsMet &&
    passwordsMatch

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCompleteSetup = () => {
    setIsComplete(true)
  }

  // Success State
  if (isComplete) {
    return (
      <AuthLayout>
        <div className="w-full max-w-[392px] py-8 text-center">
          {/* Success Animation */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-500 animate-in zoom-in duration-500 delay-200" />
              </div>
            </div>
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border border-emerald-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome to Volery!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your account is ready. Start managing your syndication pipeline.
          </p>

          <Button asChild className="w-full" size="lg">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[392px] py-8">

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span className={cn("text-sm", step === 1 ? "text-foreground" : "text-muted-foreground")}>
              Account
            </span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              2
            </div>
            <span className={cn("text-sm", step === 2 ? "text-foreground" : "text-muted-foreground")}>
              Profile
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {step === 1 ? (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Join Volery
              </h1>

              {/* Team invite banner */}
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {inviteData.teamAvatar}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You've been invited to join{" "}
                  <span className="text-foreground font-medium">
                    {inviteData.teamName}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                {/* Email (disabled) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteData.email}
                    disabled
                    className="bg-secondary/50"
                  />
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Sarah"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Chen"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {password && <PasswordStrengthBar strength={passwordStrength} />}
                </div>

                {/* Password requirements */}
                {password && (
                  <div className="p-3 bg-secondary/30 rounded-lg space-y-2">
                    <PasswordRequirement
                      met={passwordRequirements.length}
                      text="At least 8 characters"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.uppercase}
                      text="One uppercase letter"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.lowercase}
                      text="One lowercase letter"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.number}
                      text="One number"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.special}
                      text="One special character"
                    />
                  </div>
                )}

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        "pr-10",
                        confirmPassword && !passwordsMatch && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Complete your profile
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Add some details to help your team recognize you.
              </p>

              <div className="space-y-4">
                {/* Profile photo upload */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <label
                      htmlFor="profileUpload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-primary-foreground" />
                    </label>
                    <input
                      id="profileUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a photo (optional)
                  </p>
                </div>

                {/* Role dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* LinkedIn URL */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin">
                    LinkedIn Profile{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="linkedin.com/in/username"
                      value={linkedIn}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleCompleteSetup}>
                  Complete Setup
                </Button>

                <button
                  type="button"
                  onClick={handleCompleteSetup}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
