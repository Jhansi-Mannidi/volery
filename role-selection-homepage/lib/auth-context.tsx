"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

export type UserRole = 
  | "investment-banker"
  | "institutional-investor"
  | "angel-investor"
  | "startup-founder"
  | "research-analyst"
  | "corporate-development"

export interface UserRoleInfo {
  id: UserRole
  label: string
  shortLabel: string
  icon: string
  description: string
}

// Unified Profile System Types
export interface CommonProfileFields {
  avatar: string | null
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedinUrl: string
  bio: string
  location: string
  timezone: string
}

export interface FounderProfileFields {
  currentCompany: string | null // Linked to Startup profile
  roleAtCompany: string
  previousCompanies: { name: string; role: string; years: string }[]
  education: { institution: string; degree: string; year: string }[]
  skills: string[]
}

export interface InvestorProfileFields {
  organization: string
  title: string
  investmentFocus: string[]
  checkSizeRange: { min: number; max: number; currency: string }
  notableInvestments: { name: string; year: string; stage: string }[]
  preferredStages: string[]
  geographicFocus: string[]
}

export interface AnalystProfileFields {
  organization: string
  specialization: string[]
  researchFocusAreas: string[]
  certifications: string[]
}

export interface BankerProfileFields {
  organization: string
  title: string
  dealExperience: string[]
  sectorFocus: string[]
  transactionTypes: string[]
}

// Privacy settings per field
export type FieldVisibility = "public" | "team" | "private"

export interface ProfilePrivacySettings {
  phone: FieldVisibility
  email: FieldVisibility
  location: FieldVisibility
  linkedinUrl: FieldVisibility
  bio: FieldVisibility
}

export interface UserProfile extends CommonProfileFields {
  id: string
  memberSince: string
  lastActive: string
  privacySettings: ProfilePrivacySettings
  // Role-specific fields (only populated based on user role)
  founderProfile?: FounderProfileFields
  investorProfile?: InvestorProfileFields
  analystProfile?: AnalystProfileFields
  bankerProfile?: BankerProfileFields
}

export const AVAILABLE_ROLES: UserRoleInfo[] = [
  {
    id: "investment-banker",
    label: "Investment Banker/Advisor",
    shortLabel: "Investment Banker",
    icon: "Building2",
    description: "Manage deal flow, connect startups with investors, and track syndication opportunities."
  },
  {
    id: "institutional-investor",
    label: "Institutional Investor (VC/Family Office)",
    shortLabel: "Institutional Investor",
    icon: "Briefcase",
    description: "Discover investment opportunities, manage portfolio companies, and track deal pipelines."
  },
  {
    id: "angel-investor",
    label: "Angel Investor",
    shortLabel: "Angel Investor",
    icon: "User",
    description: "Find promising startups, co-invest with syndicates, and manage your angel portfolio."
  },
  {
    id: "startup-founder",
    label: "Startup Founder/CFO",
    shortLabel: "Startup Founder",
    icon: "Rocket",
    description: "Connect with investors, manage fundraising rounds, and share documents securely."
  },
  {
    id: "research-analyst",
    label: "Research Analyst",
    shortLabel: "Research Analyst",
    icon: "BarChart3",
    description: "Analyze market trends, generate reports, and support investment decisions."
  },
  {
    id: "corporate-development",
    label: "Corporate Development / M&A",
    shortLabel: "Corporate Development",
    icon: "Factory",
    description: "Scout acquisition targets, manage strategic investments, and track M&A pipelines."
  }
]

interface Organization {
  id: string
  name: string
  role: "admin" | "member"
}

interface User {
  email: string
  name: string
  roles: UserRole[]
  activeRole: UserRole | null
  organization: Organization | null
  onboardingComplete: boolean
  profile?: UserProfile
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setUserRoles: (roles: UserRole[]) => void
  setActiveRole: (role: UserRole) => void
  setOrganization: (org: Organization | null) => void
  completeOnboarding: () => void
  skipOnboarding: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Valid credentials
const VALID_EMAIL = "sasi@voltuswave.com"
const VALID_PASSWORD = "Apple#123"

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/privacy-policy"]

const ROLE_SELECTION_ROUTES = ["/role-selection", "/home"]

// Onboarding routes
const ONBOARDING_ROUTES = ["/onboarding", "/onboarding/organization"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("volery_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        localStorage.removeItem("volery_user")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Handle route protection and role selection flow
  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isRoleSelectionRoute = ROLE_SELECTION_ROUTES.includes(pathname)
    const isOnboardingRoute = ONBOARDING_ROUTES.some(route => pathname.startsWith(route))

    if (!user && !isPublicRoute) {
      router.push("/login")
    } else if (user && isPublicRoute) {
      router.push("/role-selection")
    } else if (user && !user.activeRole && !isRoleSelectionRoute && !isPublicRoute && !isOnboardingRoute) {
      router.push("/role-selection")
    }
  }, [user, isLoading, pathname, router])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Validate credentials
    if (email !== VALID_EMAIL) {
      return { success: false, error: "Invalid email or password" }
    }
    
    if (password !== VALID_PASSWORD) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check if user data already exists (returning user)
    const existingUser = localStorage.getItem("volery_user")
    if (existingUser) {
      const parsedUser = JSON.parse(existingUser)
      setUser(parsedUser)
      return { success: true }
    }

    // New user - needs to select role
    const userData: User = {
      email: VALID_EMAIL,
      name: "Sasi",
      roles: [],
      activeRole: null,
      organization: null,
      onboardingComplete: true // Skip onboarding, go straight to role selection
    }
    
    setUser(userData)
    localStorage.setItem("volery_user", JSON.stringify(userData))
    
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("volery_user")
    router.push("/login")
  }, [router])

  const setUserRoles = useCallback((roles: UserRole[]) => {
    if (!user) return
    const updatedUser = { ...user, roles, activeRole: roles[0] || null }
    setUser(updatedUser)
    localStorage.setItem("volery_user", JSON.stringify(updatedUser))
  }, [user])

  const setActiveRole = useCallback((role: UserRole) => {
    if (!user) return
    const updatedUser = { ...user, activeRole: role }
    setUser(updatedUser)
    localStorage.setItem("volery_user", JSON.stringify(updatedUser))
  }, [user])

  const setOrganization = useCallback((org: Organization | null) => {
    if (!user) return
    const updatedUser = { ...user, organization: org }
    setUser(updatedUser)
    localStorage.setItem("volery_user", JSON.stringify(updatedUser))
  }, [user])

  const completeOnboarding = useCallback(() => {
    if (!user) return
    const updatedUser = { ...user, onboardingComplete: true }
    setUser(updatedUser)
    localStorage.setItem("volery_user", JSON.stringify(updatedUser))
  }, [user])

  const skipOnboarding = useCallback(() => {
    if (!user) return
    const updatedUser = { 
      ...user, 
      onboardingComplete: true,
      roles: user.roles.length > 0 ? user.roles : ["investment-banker" as UserRole],
      activeRole: user.activeRole || "investment-banker" as UserRole
    }
    setUser(updatedUser)
    localStorage.setItem("volery_user", JSON.stringify(updatedUser))
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        setUserRoles,
        setActiveRole,
        setOrganization,
        completeOnboarding,
        skipOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
