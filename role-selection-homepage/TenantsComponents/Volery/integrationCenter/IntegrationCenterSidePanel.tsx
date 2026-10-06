"use client"

import { useState } from "react"
import { History, Plus } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ShadcnComponents/ui/sheet"
import { Button } from "@/ShadcnComponents/ui/button"
import { Input } from "@/ShadcnComponents/ui/input"
import { Label } from "@/ShadcnComponents/ui/label"
import { Switch } from "@/ShadcnComponents/ui/switch"
import type { VoleryIntegration } from "./integrations.data"

export function IntegrationCenterSidePanel({
  isOpen,
  onClose,
  integration,
  onConnect,
  onToggle,
}: {
  isOpen: boolean
  onClose: () => void
  integration: VoleryIntegration | null
  onConnect: (id: string) => void
  onToggle: (id: string, connected: boolean) => void
}) {
  const [instanceName, setInstanceName] = useState("Production")
  const [apiKey, setApiKey] = useState("")
  const Icon = integration?.icon

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-[750px]">
        <SheetHeader className="shrink-0 border-b p-6 pb-4">
          <div className="flex items-center gap-3">
            {Icon ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                <Icon className="h-5 w-5" />
              </div>
            ) : null}
            <div>
              <SheetTitle>{integration?.name}</SheetTitle>
              <SheetDescription>{integration?.description}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-background p-6">
          {integration?.connected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Production instance</p>
                  <p className="text-xs text-muted-foreground">
                    Connected {integration.connectedOn}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <History className="mr-1 h-3.5 w-3.5" />
                    Logs
                  </Button>
                  <Switch
                    checked={integration.connected}
                    onCheckedChange={(checked) => onToggle(integration.id, checked)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (integration) onConnect(integration.id)
              }}
            >
              <div>
                <Label htmlFor="instance-name">Instance name</Label>
                <Input
                  id="instance-name"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="api-key">API key / credential</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter credential"
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create instance
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
