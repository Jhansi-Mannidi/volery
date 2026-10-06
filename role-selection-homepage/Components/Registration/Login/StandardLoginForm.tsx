"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Input } from "@/ShadcnComponents/ui/input"
import { Button } from "@/ShadcnComponents/ui/button"
import { Label } from "@/ShadcnComponents/ui/label"
import { useAuth } from "@/lib/auth-context"
import {
  commonRegistrationStyles,
  formFieldStyles,
} from "@/Components/Registration/commonRegistration.styles"
import TermsAgreement from "./TermsAndPrivacy"

const StandardLoginForm: React.FC = () => {
  const classes = commonRegistrationStyles
  const router = useRouter()
  const { login } = useAuth()
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailTouched, setIsEmailTouched] = useState(false)
  const [isSignInLoading, setIsSignInLoading] = useState(false)
  const [authError, setAuthError] = useState("")

  const isValidEmail = emailId.includes("@") && emailId.includes(".")

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSignInLoading) return
    setAuthError("")
    setIsEmailTouched(true)

    if (!isValidEmail) return
    if (!password) {
      setAuthError("Please enter your password")
      return
    }

    setIsSignInLoading(true)
    const result = await login(emailId, password)
    if (result.success) {
      router.push("/role-selection")
    } else {
      setAuthError(result.error || "Invalid email or password")
      setIsSignInLoading(false)
    }
  }

  return (
    <form className={classes.inputFieldContainer} onSubmit={handleFormSubmit}>
      <Label htmlFor="loginEmail" className="mb-1 text-sm font-normal text-foreground">
        Email
      </Label>
      <Input
        id="loginEmail"
        placeholder=""
        value={emailId}
        onChange={(e) => {
          setEmailId(e.target.value.replace(/\s/g, ""))
          setAuthError("")
        }}
        onBlur={() => setIsEmailTouched(true)}
        className={formFieldStyles.input}
      />
      {isEmailTouched && emailId && !isValidEmail ? (
        <p className="mt-1 text-sm text-destructive">Please enter a valid email address.</p>
      ) : null}

      <div className="mt-4">
        <Label htmlFor="loginPassword" className="mb-1 text-sm font-normal text-foreground">
          Password
        </Label>
      </div>
      <div className="relative">
        <Input
          id="loginPassword"
          type={showPassword ? "text" : "password"}
          placeholder=""
          value={password}
          onChange={(e) => {
            setPassword(e.target.value.replace(/\s/g, ""))
            setAuthError("")
          }}
          className={formFieldStyles.passwordInput}
          style={{ paddingLeft: "0.75rem", paddingRight: "2.25rem" }}
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-accent"
        >
          {showPassword ? (
            <EyeOff className={formFieldStyles.eyeButton} />
          ) : (
            <Eye className={formFieldStyles.eyeButton} />
          )}
        </Button>
      </div>

      {authError ? <p className="mt-2 text-sm text-destructive">{authError}</p> : null}

      <div className={classes.flexContainer}>
        <span
          onClick={() => router.push("/forgot-password")}
          className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Forgot Password?
        </span>
      </div>

      <Button
        type="submit"
        className="mt-5 h-[40px] w-full cursor-pointer rounded border-none bg-primary px-[14px] py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        disabled={isSignInLoading}
      >
        {isSignInLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <TermsAgreement />

      <p className={classes.textBottom}>
        Don&apos;t have an account?{" "}
        <a className={classes.text} onClick={() => router.push("/register")}>
          Sign Up
        </a>
      </p>
    </form>
  )
}

export default StandardLoginForm
