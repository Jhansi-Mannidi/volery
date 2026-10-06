"use client"

import React from "react"
import { getRegistrationTheme } from "@/Components/Registration/commonRegistration.styles"

const LeftSideBanner: React.FC = () => {
  const theme = getRegistrationTheme()

  return (
    <div
      className={`${theme.banner} bg-no-repeat`}
      role="img"
      aria-label="Login banner"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary/70" />
      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15">
            <span className="text-lg font-semibold">V</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">Volery</span>
        </div>
        <div className="max-w-md">
          <p className="text-3xl font-semibold leading-tight">
            Syndication management, in one workspace
          </p>
          <p className="mt-3 text-sm text-white/80">
            Deal flow, investor matching, and portfolio intelligence for every role on the platform.
          </p>
        </div>
        <p className="text-xs text-white/60">Anthill Ventures</p>
      </div>
    </div>
  )
}

export default LeftSideBanner
