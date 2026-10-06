"use client"

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface BreadcrumbSegment {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  segments: BreadcrumbSegment[]
  className?: string
  /** Override Home link (e.g. "/" for dashboard). Default: "/role-selection" */
  homeHref?: string
}

export function PageBreadcrumb({ segments, className, homeHref = "/role-selection" }: PageBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={homeHref}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {/* Add all provided segments */}
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          
          return (
            <div key={index} className="flex items-center gap-1.5 sm:gap-2.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast || !segment.href ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={segment.href}>{segment.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
