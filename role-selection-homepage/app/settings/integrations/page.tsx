"use client"

import { SettingsPageShell } from "@/PlatformComponents/UserSettings/SettingsPageShell"
import IntegrationCenter from "@/TenantsComponents/Volery/integrationCenter/Integrations"

export default function IntegrationsPage() {
  return (
    <SettingsPageShell className="bg-gray-50 dark:bg-gray-900">
      <IntegrationCenter />
    </SettingsPageShell>
  )
}
