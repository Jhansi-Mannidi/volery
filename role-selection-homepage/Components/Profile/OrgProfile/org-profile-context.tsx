"use client"

import React, { createContext, useContext, useMemo, useState } from "react"
import type {
  OrgAbout,
  OrgJob,
  OrgProduct,
  OrgProfileData,
} from "./OrgProfile.util"
import { initialOrgProfile } from "./OrgProfile.util"

type OrgProfileContextValue = {
  orgProfile: OrgProfileData
  updateAbout: (about: Partial<OrgAbout>) => void
  updateCoverImage: (url: string) => void
  updateProfileImage: (url: string) => void
  updateProducts: (products: OrgProduct[]) => void
  updateJobs: (jobs: OrgJob[]) => void
  toggleFollow: (personId: string) => void
}

const OrgProfileContext = createContext<OrgProfileContextValue | null>(null)

export function OrgProfileProvider({ children }: { children: React.ReactNode }) {
  const [orgProfile, setOrgProfile] = useState<OrgProfileData>(initialOrgProfile)

  const value = useMemo<OrgProfileContextValue>(
    () => ({
      orgProfile,
      updateAbout: (about) =>
        setOrgProfile((current) => ({ ...current, about: { ...current.about, ...about } })),
      updateCoverImage: (coverImage) => setOrgProfile((current) => ({ ...current, coverImage })),
      updateProfileImage: (profileImage) => setOrgProfile((current) => ({ ...current, profileImage })),
      updateProducts: (products) => setOrgProfile((current) => ({ ...current, products })),
      updateJobs: (jobs) => setOrgProfile((current) => ({ ...current, jobs })),
      toggleFollow: (personId) =>
        setOrgProfile((current) => ({
          ...current,
          people: current.people.map((person) =>
            person.id === personId ? { ...person, isFollowing: !person.isFollowing } : person
          ),
        })),
    }),
    [orgProfile]
  )

  return <OrgProfileContext.Provider value={value}>{children}</OrgProfileContext.Provider>
}

export function useOrgProfile() {
  const context = useContext(OrgProfileContext)
  if (!context) {
    throw new Error("useOrgProfile must be used inside OrgProfileProvider")
  }
  return context
}
