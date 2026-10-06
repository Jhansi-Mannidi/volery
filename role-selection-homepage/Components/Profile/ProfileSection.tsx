"use client"

import React from "react"
import { Card } from "@/ShadcnComponents/ui/card"
import { Button } from "@/ShadcnComponents/ui/button"
import { cn } from "@/lib/utils"
import { PROFILE_CONTENT_MAX_WIDTH } from "./profileLayout"

export const SectionActionButton: React.FC<{
  icon: React.ReactNode
  onClick: () => void
  ariaLabel: string
}> = ({ icon, onClick, ariaLabel }) => (
  <Button
    type="button"
    variant="outline"
    onClick={onClick}
    aria-label={ariaLabel}
    className="h-8 w-8 shrink-0 rounded-full border border-primary bg-transparent p-0 text-primary shadow-none hover:border-primary hover:bg-primary hover:text-primary-foreground [&_svg]:size-3.5"
  >
    {icon}
  </Button>
)

export const ProfileSectionCard: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <Card
    className={cn(
      "m-0 w-full shrink-0 gap-0 overflow-hidden rounded-xl border border-border/60 bg-background p-0 py-0 shadow-sm dark:bg-muted",
      PROFILE_CONTENT_MAX_WIDTH,
      className
    )}
  >
    {children}
  </Card>
)

export const ProfileSectionHeader: React.FC<{
  icon: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}> = ({ icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between gap-3 border-b border-border/50 bg-muted/20 px-4 py-3.5">
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
)

export const ProfileSectionList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="m-0 flex list-none flex-col divide-y divide-border/50 p-0">{children}</ul>
)

export const ProfileSectionRow: React.FC<{
  logoUrl?: string | null
  fallbackIcon: React.ReactNode
  title: string
  subtitle?: string
  meta?: React.ReactNode
  description?: string
  footer?: React.ReactNode
  action?: React.ReactNode
}> = ({ logoUrl, fallbackIcon, title, subtitle, meta, description, footer, action }) => (
  <li className="flex items-start gap-3.5 px-4 py-4 transition-colors hover:bg-muted/20">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40">
      {logoUrl ? (
        <img src={logoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-muted-foreground">{fallbackIcon}</span>
      )}
    </div>
    <div className="min-w-0 flex-1 space-y-1">
      <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
      {meta && <div className="flex flex-wrap items-center gap-1.5 pt-0.5">{meta}</div>}
      {description && (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {footer && <div className="pt-1">{footer}</div>}
    </div>
    {action}
  </li>
)

export const ProfileSectionBody: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => <div className={cn("px-4 py-4", className)}>{children}</div>

export const ProfileSectionFooterLink: React.FC<{
  label: string
  onClick: () => void
}> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-center gap-1.5 border-t border-border/50 px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/30 hover:text-primary"
  >
    {label}
    <span aria-hidden>&rarr;</span>
  </button>
)

export const ProfileSectionEmpty: React.FC<{
  icon: React.ReactNode
  title: string
  hint?: string
  action?: React.ReactNode
}> = ({ icon, title, hint, action }) => (
  <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center text-muted-foreground">
    <span className="opacity-40">{icon}</span>
    <p className="text-sm font-medium">{title}</p>
    {hint && <p className="max-w-md text-xs text-muted-foreground/80">{hint}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)
