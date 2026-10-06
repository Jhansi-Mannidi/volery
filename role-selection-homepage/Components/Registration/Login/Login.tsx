"use client"

import React from "react"
import { getRegistrationTheme } from "@/Components/Registration/commonRegistration.styles"
import LeftSideBanner from "@/ReusableComponents/LeftSideBanner/LeftSideBanner"
import CompanyLogo from "@/ReusableComponents/CompanyLogo/CompanyLogo"
import StandardLoginForm from "./StandardLoginForm"
import { useAuth } from "@/lib/auth-context"

const Login: React.FC = () => {
  const theme = getRegistrationTheme()
  const { isLoading, isAuthenticated } = useAuth()

  if (isAuthenticated && !isLoading) {
    return null
  }

  return (
    <div>
      <div className={theme.container}>
        <LeftSideBanner />
        <div className={theme.card} style={theme.cardStyle}>
          <CompanyLogo />
          <StandardLoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login
