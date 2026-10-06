"use client"

import React, { useId } from "react"
import { cn } from "@/lib/utils"

export const CoverImagePlaceholder: React.FC<{ className?: string }> = ({ className }) => {
  const patternId = `cover-image-dots-${useId()}`

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-muted/30", className)}>
      <svg width="100%" height="100%" className="absolute inset-0 text-zinc-200 dark:text-zinc-700">
        <defs>
          <pattern id={patternId} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}

export default CoverImagePlaceholder
