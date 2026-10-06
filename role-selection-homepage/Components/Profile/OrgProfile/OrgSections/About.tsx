"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Card } from "@/ShadcnComponents/ui/card"
import { Button } from "@/ShadcnComponents/ui/button"
import { Badge } from "@/ShadcnComponents/ui/badge"
import { cn } from "@/lib/utils"
import { PROFILE_CONTENT_MAX_WIDTH } from "../../profileLayout"
import { specialtyBadgeColors } from "../OrgProfile.styles"
import { useOrgProfile } from "../org-profile-context"
import EditOrgSpecialtiesModal from "../OrgModels/EditOrgSpecialtiesModel"

export default function OrgProfileAbout({
  setEditProfileDetailsModal,
}: {
  setEditProfileDetailsModal: (open: boolean) => void
}) {
  const { orgProfile } = useOrgProfile()
  const [isModelOpen, setIsModelOpen] = useState(false)
  const specialties = orgProfile.about.specialties

  return (
    <Card
      className={cn(
        "m-0 w-full shrink-0 gap-0 rounded-md border-border/75 bg-background py-0 shadow-md dark:bg-muted",
        PROFILE_CONTENT_MAX_WIDTH
      )}
    >
      <div className="flex flex-col items-start justify-start gap-4 bg-background p-6 dark:bg-muted">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-semibold">Overview</h1>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 shrink-0 rounded-full border border-primary bg-transparent p-0 text-primary shadow-none hover:border-primary hover:bg-primary hover:text-primary-foreground [&_svg]:size-3"
            onClick={() => setEditProfileDetailsModal(true)}
          >
            <Pencil size={14} className="text-current" />
          </Button>
        </div>
        <p className="text-sm opacity-75">{orgProfile.about.overview}</p>
        <div className="mt-2">
          <p className="text-sm font-semibold">Profile URL</p>
          <a
            href={orgProfile.about.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer text-sm font-semibold text-[#004182] dark:text-blue-400"
          >
            {orgProfile.about.profileUrl}
          </a>
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold">Industry</p>
          <p className="text-sm text-foreground opacity-75">{orgProfile.about.industry}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold">Company size</p>
          <p className="text-sm text-foreground opacity-75">{orgProfile.about.companySize}</p>
          <p className="text-sm text-foreground opacity-75">{orgProfile.about.associatedMembers} associated members</p>
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold">Headquarters</p>
          <p className="text-sm text-foreground opacity-75">{orgProfile.about.headquarters}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold">Founded</p>
          <p className="text-sm text-foreground opacity-75">{orgProfile.about.founded}</p>
        </div>
        <div className="mt-2 w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-semibold">Specialties</p>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 shrink-0 rounded-full border border-primary bg-transparent p-0 text-primary shadow-none hover:border-primary hover:bg-primary hover:text-primary-foreground [&_svg]:size-3"
              onClick={() => setIsModelOpen(true)}
            >
              <Pencil size={14} className="text-current" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {specialties.length > 0 ? (
              specialties.map((item, index) => (
                <Badge
                  key={`${item}-${index}`}
                  variant="outline"
                  className={cn("px-2.5 py-1 text-sm font-medium", specialtyBadgeColors[index % specialtyBadgeColors.length])}
                >
                  {item}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No specialties added yet</p>
            )}
          </div>
        </div>
      </div>
      <EditOrgSpecialtiesModal isModalOpen={isModelOpen} handleModalClose={() => setIsModelOpen(false)} />
    </Card>
  )
}
