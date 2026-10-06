"use client"

import { SettingsPageShell } from "@/PlatformComponents/UserSettings/SettingsPageShell"
import WorkspaceUsers from "@/PlatformComponents/WorkspaceManagement/WorkspaceUsers"

export default function TeamSettingsPage() {
  return (
    <SettingsPageShell>
      <WorkspaceUsers />
    </SettingsPageShell>
  )
}
