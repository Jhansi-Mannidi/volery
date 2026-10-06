"use client"

import React, { useEffect, useRef, useState } from "react"
import { Camera, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ShadcnComponents/ui/sheet"
import { Button } from "@/ShadcnComponents/ui/button"
import { CoverImagePlaceholder } from "../../CoverImagePlaceholder"
import ProfileFullViewModal from "../../ProfileFullViewModal"
import { hasRealProfileImage, readImageFile } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

export default function UploadOrgCoverImageModal({
  isModalOpen,
  handleModalClose,
}: {
  isModalOpen: boolean
  handleModalClose: () => void
}) {
  const { orgProfile, updateCoverImage } = useOrgProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [isDelete, setIsDelete] = useState(false)
  const [isFullViewOpen, setIsFullViewOpen] = useState(false)
  const companyName = orgProfile.about.companyName || "Organization"
  const hasExistingCover = hasRealProfileImage(orgProfile.coverImage)
  const hasPendingUpload = Boolean(previewImage)
  const hasPendingChange = hasPendingUpload || isDelete
  const canRemove = (hasExistingCover || hasPendingUpload) && !isDelete
  const showPlaceholder = !hasPendingUpload && (isDelete || !hasExistingCover)
  const displayImage = previewImage || orgProfile.coverImage

  useEffect(() => {
    if (isModalOpen) return
    setPreviewImage(null)
    setSelectedFileName(null)
    setIsDelete(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [isModalOpen])

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full w-full flex-col overflow-hidden bg-background p-0 sm:max-w-lg">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pr-14 pb-3 text-left">
          <SheetTitle className="pb-0">Add a cover image</SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Choose a banner that represents {companyName} professionally.
          </p>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 pt-3 pb-6">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              try {
                setPreviewImage(await readImageFile(file))
                setSelectedFileName(file.name)
                setIsDelete(false)
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Please choose an image file")
              }
            }}
          />
          <div className="w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-sm">
            <div className="relative h-[180px] w-full overflow-hidden sm:h-[220px]">
              {showPlaceholder ? (
                <CoverImagePlaceholder />
              ) : (
                <button type="button" onClick={() => setIsFullViewOpen(true)} className="h-full w-full" aria-label="Preview cover image full size">
                  <img src={displayImage} alt="Cover preview" className="h-full w-full object-cover" />
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change cover photo"
                className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border bg-background/95 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3.5 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{companyName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {isDelete
                    ? "Cover will be removed when you save"
                    : hasPendingUpload
                      ? selectedFileName || "New image selected"
                      : "Current cover image"}
                </p>
              </div>
              {canRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    setPreviewImage(null)
                    setIsDelete(true)
                    setSelectedFileName(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!hasPendingChange}
            onClick={() => {
              updateCoverImage(isDelete ? "" : displayImage)
              toast.success(isDelete ? "Cover image removed" : "Cover image updated")
              handleModalClose()
            }}
          >
            Save changes
          </Button>
        </div>
        <ProfileFullViewModal
          isModalOpen={isFullViewOpen}
          handleModalClose={() => setIsFullViewOpen(false)}
          imageUrl={displayImage ?? ""}
          title="Cover photo"
        />
      </SheetContent>
    </Sheet>
  )
}
