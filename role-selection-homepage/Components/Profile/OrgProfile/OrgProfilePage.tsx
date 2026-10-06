"use client"

import React, { useEffect, useRef, useState } from "react"
import { Camera, Pencil } from "lucide-react"
import { Button } from "@/ShadcnComponents/ui/button"
import { Card } from "@/ShadcnComponents/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/ShadcnComponents/ui/tabs"
import { cn } from "@/lib/utils"
import { PROFILE_CONTENT_MAX_WIDTH } from "../profileLayout"
import { CoverImagePlaceholder } from "../CoverImagePlaceholder"
import ProfileFullViewModal from "../ProfileFullViewModal"
import { orgProfileSyles } from "./OrgProfile.styles"
import {
  OrgSections,
  avatarPaletteClassFor,
  hasRealProfileImage,
  initialsOf,
} from "./OrgProfile.util"
import { useOrgProfile } from "./org-profile-context"
import OrgProfileHome from "./OrgSections/Home"
import OrgProfileAbout from "./OrgSections/About"
import OrgProfilePosts from "./OrgSections/Posts"
import OrgProfileProducts from "./OrgSections/Products"
import OrgProfileJobs from "./OrgSections/Jobs"
import OrgProfilePeople from "./OrgSections/People"
import UploadOrgCoverImageModal from "./OrgModels/UploadeOrgCoverImageModel"
import UploadOrgProfileImageModal from "./OrgModels/UploadeOrgProfileImageModel"
import OrgProfileDetailsEditModal from "./OrgModels/OrgProfileDetailsModel"

export default function OrgProfilePage() {
  const { orgProfile } = useOrgProfile()
  const [sectionId, setSectionId] = useState("1")
  const [isEditCoverPageModalOpen, setEditCoverPageModalOpen] = useState(false)
  const [isEditProfileImageModal, setEditProfileImageModal] = useState(false)
  const [isEditProfileDetailsModal, setEditProfileDetailsModal] = useState(false)
  const [isLogoFullViewOpen, setIsLogoFullViewOpen] = useState(false)
  const [isCoverFullViewOpen, setIsCoverFullViewOpen] = useState(false)
  const [isHeaderOut, setIsHeaderOut] = useState(false)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const headerCardRef = useRef<HTMLDivElement | null>(null)

  const hasOrgLogo = hasRealProfileImage(orgProfile.profileImage)
  const hasOrgCover = hasRealProfileImage(orgProfile.coverImage)
  const companyName = orgProfile.about.companyName.trim()

  const orgMeta = [
    orgProfile.about.industry,
    [orgProfile.about.countryRegion, orgProfile.about.city].filter(Boolean).join(", "),
    orgProfile.about.followers ? `${orgProfile.about.followers}k` : "",
    orgProfile.about.companySize,
  ]
    .map((part) => (typeof part === "string" ? part.trim() : part))
    .filter(Boolean)
    .join(` ${String.fromCharCode(183)} `)

  useEffect(() => {
    const root = scrollerRef.current
    const target = headerCardRef.current
    if (!root || !target || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(([entry]) => setIsHeaderOut(!entry.isIntersecting), {
      root,
      threshold: 0,
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [orgProfile.accountId])

  const sectionView = () => {
    const section = OrgSections.find((item) => item.id === sectionId)
    switch (section?.name) {
      case "Home":
        return <OrgProfileHome setSectionId={setSectionId} />
      case "About":
        return <OrgProfileAbout setEditProfileDetailsModal={setEditProfileDetailsModal} />
      case "Posts":
        return <OrgProfilePosts />
      case "Products":
        return <OrgProfileProducts />
      case "Jobs":
        return <OrgProfileJobs />
      case "People":
        return <OrgProfilePeople />
      default:
        return <OrgProfileHome setSectionId={setSectionId} />
    }
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <Card className="relative m-0 flex h-full w-full flex-col items-center justify-start gap-0 overflow-hidden rounded-none border-none bg-background p-0 py-0 shadow-none">
        <div
          ref={scrollerRef}
          className="flex h-full w-full flex-col items-center justify-start gap-2.5 overflow-y-auto px-2 pt-0 pb-6"
        >
          <Card
            ref={headerCardRef}
            className={cn(
              "mt-2 mb-0 w-full shrink-0 gap-0 overflow-hidden rounded-xl rounded-b-none border border-b-0 border-border/60 bg-background p-0 py-0 shadow-sm dark:bg-muted",
              PROFILE_CONTENT_MAX_WIDTH
            )}
          >
            <div className="relative shadow-none">
              <div className="relative h-[140px] overflow-hidden shadow-none md:h-[200px]">
                {hasOrgCover ? (
                  <button
                    type="button"
                    onClick={() => setIsCoverFullViewOpen(true)}
                    aria-label="View cover photo"
                    className="block h-full w-full cursor-pointer border-none bg-transparent p-0"
                  >
                    <img src={orgProfile.coverImage} alt="Cover" className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <CoverImagePlaceholder />
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={() => setEditCoverPageModalOpen(true)}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/90 hover:bg-background"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-[-43px] left-5">
                <div className="relative">
                  <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full border-4 border-background shadow-md md:h-[110px] md:w-[110px]">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => hasOrgLogo && setIsLogoFullViewOpen(true)}
                      className="h-full w-full rounded-full p-0 hover:bg-transparent"
                    >
                      {hasOrgLogo ? (
                        <img
                          src={orgProfile.profileImage}
                          className="h-full w-full rounded-full border-none object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
                          {initialsOf(companyName)}
                        </div>
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => setEditProfileImageModal(true)}
                    className="absolute right-1 bottom-1 h-6 w-6 rounded-full bg-background/90 hover:bg-background"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div
                className="flex items-center justify-end p-2"
                style={{ height: "30px", padding: "20px 20px 0px 0px" }}
              >
                <Button
                  onClick={() => setEditProfileDetailsModal(true)}
                  type="button"
                  variant="outline"
                  className={orgProfileSyles.detailsEditButton}
                >
                  <Pencil size={14} className="text-current" />
                </Button>
              </div>

              <div className="flex w-full flex-col gap-1 px-6 py-4">
                <h1 className={orgProfileSyles.nameHeading}>{companyName || "Untitled organization"}</h1>
                {orgProfile.about.headLine && (
                  <p className={orgProfileSyles.profileDescription}>{orgProfile.about.headLine}</p>
                )}
                {orgMeta && <p className={orgProfileSyles.profileDescription}>{orgMeta}</p>}
              </div>
            </div>

            <UploadOrgCoverImageModal
              isModalOpen={isEditCoverPageModalOpen}
              handleModalClose={() => setEditCoverPageModalOpen(false)}
            />
            <UploadOrgProfileImageModal
              isModalOpen={isEditProfileImageModal}
              handleModalClose={() => setEditProfileImageModal(false)}
            />
            <OrgProfileDetailsEditModal
              isModalOpen={isEditProfileDetailsModal}
              handleModalClose={() => setEditProfileDetailsModal(false)}
            />

            {hasOrgCover && (
              <ProfileFullViewModal
                isModalOpen={isCoverFullViewOpen}
                handleModalClose={() => setIsCoverFullViewOpen(false)}
                imageUrl={orgProfile.coverImage}
                title="Cover photo"
              />
            )}
            {hasOrgLogo && (
              <ProfileFullViewModal
                isModalOpen={isLogoFullViewOpen}
                handleModalClose={() => setIsLogoFullViewOpen(false)}
                imageUrl={orgProfile.profileImage}
                title={orgProfile.about.companyName || "Organization logo"}
              />
            )}
          </Card>

          <div
            className={cn(
              "sticky top-0 z-20 -mt-2.5 w-full shrink-0 overflow-x-auto overflow-y-hidden rounded-xl rounded-t-none border border-border/60 bg-background shadow-sm dark:bg-muted",
              PROFILE_CONTENT_MAX_WIDTH
            )}
          >
            <div className="flex items-center gap-1 px-1.5">
              <div
                className={cn(
                  "flex min-w-0 shrink items-center gap-2 overflow-hidden transition-all duration-200 ease-out",
                  isHeaderOut ? "max-w-[220px] pr-2 pl-1 opacity-100" : "max-w-0 opacity-0"
                )}
                aria-hidden={!isHeaderOut}
              >
                {hasOrgLogo ? (
                  <img
                    src={orgProfile.profileImage}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-full border border-border/60 object-cover"
                  />
                ) : (
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                      avatarPaletteClassFor(orgProfile.accountId)
                    )}
                  >
                    {initialsOf(orgProfile.about.companyName)}
                  </span>
                )}
                <span className="truncate text-sm font-semibold">{orgProfile.about.companyName}</span>
              </div>

              <Tabs value={sectionId} onValueChange={setSectionId} className="gap-0">
                <TabsList className={orgProfileSyles.underlineTabsList}>
                  {OrgSections.map((item) => (
                    <TabsTrigger key={item.id} value={item.id} className={orgProfileSyles.underlineTabsTrigger}>
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {sectionView()}
        </div>
      </Card>
    </div>
  )
}
