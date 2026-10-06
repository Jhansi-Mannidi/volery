"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CompanyLogoProps {
  className?: string
  style?: React.CSSProperties
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ className, style }) => {
  return (
    <span className={cn("inline-flex h-12 items-center gap-2", className)} style={style}>
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground text-lg font-semibold">
        V
      </span>
      <span className="text-xl font-semibold text-foreground">Volery</span>
    </span>
  )
}

export default CompanyLogo
