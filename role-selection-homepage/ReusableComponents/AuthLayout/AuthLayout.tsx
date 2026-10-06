"use client"

import React from "react"
import { getRegistrationTheme } from "@/Components/Registration/commonRegistration.styles"
import LeftSideBanner from "@/ReusableComponents/LeftSideBanner/LeftSideBanner"
import CompanyLogo from "@/ReusableComponents/CompanyLogo/CompanyLogo"

interface AuthLayoutProps {
  children: React.ReactNode
  showLogo?: boolean
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, showLogo = true }) => {
  const theme = getRegistrationTheme()

  return (
    <div className={theme.container}>
      <LeftSideBanner />
      <div className={theme.card} style={theme.cardStyle}>
        {showLogo ? <CompanyLogo /> : null}
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
