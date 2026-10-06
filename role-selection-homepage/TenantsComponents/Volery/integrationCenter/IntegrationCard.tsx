"use client"

import { Card, CardContent } from "@/ShadcnComponents/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VoleryIntegration } from "./integrations.data"

const CARD_DECORATIONS = [
  { rgbLight: "59,130,246", rgbDark: "96,165,250" },
  { rgbLight: "16,185,129", rgbDark: "52,211,153" },
  { rgbLight: "236,72,153", rgbDark: "244,114,182" },
  { rgbLight: "139,92,246", rgbDark: "167,139,250" },
  { rgbLight: "20,184,166", rgbDark: "45,212,191" },
  { rgbLight: "244,63,94", rgbDark: "251,113,133" },
]

function decorationFor(key: string) {
  const sum = key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return CARD_DECORATIONS[sum % CARD_DECORATIONS.length]
}

export default function IntegrationCard({
  integration,
  onOpen,
  onDisconnect,
}: {
  integration: VoleryIntegration
  onOpen: (integration: VoleryIntegration) => void
  onDisconnect?: (integration: VoleryIntegration) => void
}) {
  const decoration = decorationFor(integration.id)
  const cornerFadeMask = "radial-gradient(circle at top left, black, transparent 55%)"
  const Icon = integration.icon

  return (
    <Card
      onClick={() => onOpen(integration)}
      className="relative cursor-pointer overflow-hidden rounded-lg border border-border bg-background shadow-none transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(51,119,255,0.35)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 block dark:hidden"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(100,116,139,0.35) 1px, transparent 1px), radial-gradient(circle at top left, rgba(${decoration.rgbLight},0.15), transparent 55%)`,
          backgroundSize: "14px 14px, 100% 100%",
          WebkitMaskImage: cornerFadeMask,
          maskImage: cornerFadeMask,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(148,163,184,0.25) 1px, transparent 1px), radial-gradient(circle at top left, rgba(${decoration.rgbDark},0.12), transparent 55%)`,
          backgroundSize: "14px 14px, 100% 100%",
          WebkitMaskImage: cornerFadeMask,
          maskImage: cornerFadeMask,
        }}
      />
      <CardContent className="relative p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
            <Icon className={cn("h-5 w-5", integration.iconClass)} />
          </div>
          {integration.connected ? (
            <span
              onClick={(event) => {
                event.stopPropagation()
                onDisconnect?.(integration)
              }}
              title="Disconnect"
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              Connected
            </span>
          ) : (
            <span className="shrink-0 cursor-pointer rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted">
              Connect
            </span>
          )}
        </div>
        <div className="mt-3">
          <h3 className="text-[13px] font-semibold text-foreground">{integration.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            {integration.typeName}
          </p>
        </div>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
          {integration.description}
        </p>
      </CardContent>
    </Card>
  )
}
