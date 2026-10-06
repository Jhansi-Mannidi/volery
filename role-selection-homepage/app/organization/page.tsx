"use client"

import { Toaster } from "sonner"
import { OrgProfileProvider } from "@/Components/Profile/OrgProfile/org-profile-context"
import OrgProfilePage from "@/Components/Profile/OrgProfile/OrgProfilePage"

export default function OrganizationPage() {
  return (
    <OrgProfileProvider>
      <OrgProfilePage />
      <Toaster position="top-right" richColors />
    </OrgProfileProvider>
  )
}
