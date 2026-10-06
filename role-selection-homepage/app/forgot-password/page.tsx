"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Check, X, Eye, EyeOff, Lock, KeyRound, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/ReusableComponents/AuthLayout/AuthLayout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FlowStep = "request" | "email-sent" | "reset-form" | "success" | "token-expired"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<FlowStep>("request")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Reset form state
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Password requirements
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const metCount = requirements.filter((r) => r.met).length
  const allRequirementsMet = metCount === requirements.length
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const getStrengthLabel = () => {
    if (metCount <= 1) return { label: "Weak", color: "bg-red-500" }
    if (metCount === 2) return { label: "Fair", color: "bg-orange-500" }
    if (metCount === 3) return { label: "Good", color: "bg-yellow-500" }
    if (metCount === 4) return { label: "Strong", color: "bg-emerald-500" }
    return { label: "Very Strong", color: "bg-emerald-500" }
  }

  const strength = getStrengthLabel()

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required")
      return false
    }
    if (!value.includes("@") || !value.includes(".")) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleRequestReset = async () => {
    if (!validateEmail(email)) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setStep("email-sent")
  }

  const handleResendEmail = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
  }

  const handleResetPassword = async () => {
    if (!allRequirementsMet) {
      setPasswordError("Password doesn't meet all requirements")
      return
    }
    if (!passwordsMatch) {
      setPasswordError("Passwords don't match")
      return
    }
    
    setPasswordError("")
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setStep("success")
  }

  // For demo: simulate token expired state
  const simulateTokenExpired = () => {
    setStep("token-expired")
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[392px] py-8">

        {/* Step 1: Request Reset */}
        {step === "request" && (
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <KeyRound className="w-10 h-10 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
              Reset your password
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Enter your email and we&apos;ll send you a reset link
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) validateEmail(e.target.value)
                    }}
                    onBlur={() => validateEmail(email)}
                    className={cn("pl-10", emailError && "border-destructive focus-visible:ring-destructive")}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {emailError}
                  </p>
                )}
              </div>

              <Button
                onClick={handleRequestReset}
                disabled={isSubmitting || !email}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Email Sent */}
        {step === "email-sent" && (
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-7 h-7 text-emerald-500" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Check your email
            </h1>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent a password reset link to{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={handleResendEmail}
                  disabled={isSubmitting}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {isSubmitting ? "Resending..." : "Resend"}
                </button>
              </p>
            </div>

            {/* Demo buttons to navigate to other states */}
            <div className="space-y-3">
              <Button
                onClick={() => setStep("reset-form")}
                className="w-full"
              >
                Continue to Reset Form (Demo)
              </Button>
              <Button
                variant="outline"
                onClick={simulateTokenExpired}
                className="w-full bg-transparent"
              >
                Simulate Expired Token (Demo)
              </Button>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        )}

        {/* Step 3: Reset Form */}
        {step === "reset-form" && (
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
              Create new password
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Your new password must be different from previous passwords
            </p>

            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((segment) => (
                        <div
                          key={segment}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors",
                            segment <= metCount ? strength.color : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <p className={cn(
                      "text-xs font-medium",
                      metCount <= 1 && "text-red-500",
                      metCount === 2 && "text-orange-500",
                      metCount === 3 && "text-yellow-500",
                      metCount >= 4 && "text-emerald-500"
                    )}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "pl-10 pr-10",
                      confirmPassword && !passwordsMatch && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Passwords don&apos;t match
                  </p>
                )}
              </div>

              {/* Requirements Checklist */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground mb-2">Password requirements:</p>
                {requirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              {passwordError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {passwordError}
                </p>
              )}

              <Button
                onClick={handleResetPassword}
                disabled={isSubmitting || !allRequirementsMet || !passwordsMatch}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg text-center">
            {/* Animated Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-emerald-500/30 animate-ping" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Password reset successful
            </h1>
            <p className="text-muted-foreground mb-8">
              You can now sign in with your new password
            </p>

            <Link href="/login">
              <Button className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        )}

        {/* Token Expired State */}
        {step === "token-expired" && (
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg text-center">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Link expired
            </h1>
            <p className="text-muted-foreground mb-6">
              This password reset link has expired or is invalid. Please request a new one.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setStep("request")
                  setEmail("")
                }}
                className="w-full"
              >
                Request New Link
              </Button>
              <Link href="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
