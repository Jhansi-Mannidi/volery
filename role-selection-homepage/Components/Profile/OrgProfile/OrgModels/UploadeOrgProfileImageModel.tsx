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
import { hasRealProfileImage, initialsOf, readImageFile } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

export default function UploadOrgProfileImageModal({
  isModalOpen,
  handleModalClose,
}: {
  isModalOpen: boolean
  handleModalClose: () => void
}) {
  const { orgProfile, updateProfileImage } = useOrgProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isDelete, setIsDelete] = useState(false)
  const companyName = orgProfile.about.companyName || "Organization"
  const hasExistingLogo = hasRealProfileImage(orgProfile.profileImage)
  const hasPendingUpload = Boolean(previewImage)
  const hasPendingChange = hasPendingUpload || isDelete
  const canRemove = (hasExistingLogo || hasPendingUpload) && !isDelete
  const showInitials = !hasPendingUpload && (isDelete || !hasExistingLogo)
  const displayImage = previewImage || orgProfile.profileImage

  useEffect(() => {
    if (isModalOpen) return
    setPreviewImage(null)
    setIsDelete(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [isModalOpen])

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full flex-col overflow-hidden bg-background p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pr-14 pb-3 text-left">
          <SheetTitle className="pb-0">Organization logo</SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Upload a square logo so {companyName} is recognizable across the workspace.
          </p>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
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
                setIsDelete(false)
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Please choose an image file")
              }
            }}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-[140px] w-[140px] overflow-hidden rounded-full border-4 border-background bg-muted shadow-md">
                {showInitials ? (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-semibold text-primary">
                    {initialsOf(companyName)}
                  </div>
                ) : (
                  <img src={displayImage} alt="Organization logo" className="h-full w-full object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change logo"
                className="absolute right-1 bottom-1 flex h-9 w-9 items-center justify-center rounded-full border bg-background text-foreground shadow-sm hover:bg-muted"
              >
                <Camera className="h-4 w-4" />
              </button>
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
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            )}
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
              updateProfileImage(isDelete ? "" : displayImage)
              toast.success(isDelete ? "Logo removed" : "Logo updated")
              handleModalClose()
            }}
          >
            Save changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
