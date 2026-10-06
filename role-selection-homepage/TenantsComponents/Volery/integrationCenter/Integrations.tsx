"use client"

import { useMemo, useState } from "react"
import { Cable, Search } from "lucide-react"
import { Input } from "@/ShadcnComponents/ui/input"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ShadcnComponents/ui/alert-dialog"
import IntegrationCard from "./IntegrationCard"
import { IntegrationCenterSidePanel } from "./IntegrationCenterSidePanel"
import { VOLERY_INTEGRATIONS, type VoleryIntegration } from "./integrations.data"

export default function IntegrationCenter() {
  const [integrations, setIntegrations] = useState(VOLERY_INTEGRATIONS)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selected, setSelected] = useState<VoleryIntegration | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [disconnectTarget, setDisconnectTarget] = useState<VoleryIntegration | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(integrations.map((item) => item.typeName))),
    [integrations]
  )

  const matchesFilters = (integration: VoleryIntegration) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      integration.name.toLowerCase().includes(term) ||
      integration.description.toLowerCase().includes(term)
    const matchesCategory = selectedCategory === "all" || integration.typeName === selectedCategory
    return matchesSearch && matchesCategory
  }

  const connected = integrations.filter((item) => item.connected && matchesFilters(item))
  const available = integrations.filter((item) => !item.connected && matchesFilters(item))
  const filteredTotal = connected.length + available.length

  const openPanel = (integration: VoleryIntegration) => {
    setSelected(integration)
    setPanelOpen(true)
  }

  const connect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, connected: true, connectedOn: "Today" } : item
      )
    )
    setPanelOpen(false)
  }

  const toggle = (id: string, connectedState: boolean) => {
    if (!connectedState) {
      const target = integrations.find((item) => item.id === id)
      if (target) setDisconnectTarget(target)
      return
    }
    connect(id)
  }

  const disconnect = () => {
    if (!disconnectTarget) return
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === disconnectTarget.id ? { ...item, connected: false } : item
      )
    )
    setDisconnectTarget(null)
    setPanelOpen(false)
  }

  return (
    <div className="h-full overflow-y-auto bg-transparent">
      <div className="border-b border-border bg-background px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Cable className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-[18px] font-semibold tracking-tight text-foreground">Integration Center</h1>
              <p className="mt-0.5 max-w-xl text-[13px] text-muted-foreground">
                Connect messaging channels, data providers and documents to sync deal flow
                automatically.
              </p>
            </div>
          </div>
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search integrations..."
              className="bg-background pl-8"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "h-7 rounded-full px-3 text-[13px] font-medium transition-colors",
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              All connectors
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "h-7 rounded-full px-3 text-[13px] font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {category}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-muted-foreground">
            {filteredTotal} connector{filteredTotal === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="p-6">
        {filteredTotal === 0 ? (
          <div className="mb-6 rounded-md border border-dashed border-border bg-muted/40 p-6 text-center text-[13px] text-muted-foreground italic">
            No connectors match your search.
          </div>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="mb-4 text-[15px] font-semibold text-foreground">
                Connected Applications
              </h2>
              {connected.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {connected.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onOpen={openPanel}
                      onDisconnect={setDisconnectTarget}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-border bg-muted/40 p-6 text-center text-[13px] text-muted-foreground italic">
                  Select applications from below
                </div>
              )}
            </section>
            {available.length > 0 && (
              <section>
                <h2 className="mb-4 text-[15px] font-semibold text-foreground">
                  Available Applications
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {available.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onOpen={openPanel}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <IntegrationCenterSidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        integration={selected ? integrations.find((item) => item.id === selected.id) || selected : null}
        onConnect={connect}
        onToggle={toggle}
      />

      <AlertDialog open={disconnectTarget !== null} onOpenChange={(open) => !open && setDisconnectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {disconnectTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This turns off the connected instance for the whole account. Saved credentials are kept,
              so you can reconnect later without re-entering them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={disconnect}>Disconnect</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
