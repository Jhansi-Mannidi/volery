"use client"

import React from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/ShadcnComponents/ui/dialog"

interface ModalProps {
  isModalOpen: boolean
  handleModalClose: () => void
  imageUrl: string
  title?: string
}

const ProfileFullViewModal: React.FC<ModalProps> = ({
  isModalOpen,
  handleModalClose,
  imageUrl,
  title = "Profile photo",
}) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex h-screen max-h-none w-screen max-w-none items-center justify-center overflow-hidden border-0 bg-black/90 p-0 shadow-none dark:bg-black/90"
        onClick={handleModalClose}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <button
          type="button"
          onClick={handleModalClose}
          aria-label="Close photo"
          className="absolute top-5 right-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={imageUrl}
          alt={title}
          className="h-auto max-h-[88vh] w-auto max-w-[92vw] rounded-md object-contain shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ProfileFullViewModal
