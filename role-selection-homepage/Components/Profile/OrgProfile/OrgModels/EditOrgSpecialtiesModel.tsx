"use client"

import React, { useEffect, useState, type KeyboardEvent } from "react"
import { Sparkles, X } from "lucide-react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ShadcnComponents/ui/sheet"
import { Button } from "@/ShadcnComponents/ui/button"
import { Label } from "@/ShadcnComponents/ui/label"
import { Input } from "@/ShadcnComponents/ui/input"
import { Badge } from "@/ShadcnComponents/ui/badge"
import { cn } from "@/lib/utils"
import { specialtyBadgeColors } from "../OrgProfile.styles"
import { useOrgProfile } from "../org-profile-context"

export default function EditOrgSpecialtiesModal({
  isModalOpen,
  handleModalClose,
}: {
  isModalOpen: boolean
  handleModalClose: () => void
}) {
  const { orgProfile, updateAbout } = useOrgProfile()
  const [specialtiesList, setSpecialtiesList] = useState<string[]>([])
  const [specialtyInput, setSpecialtyInput] = useState("")

  useEffect(() => {
    if (!isModalOpen) return
    setSpecialtiesList([...orgProfile.about.specialties])
    setSpecialtyInput("")
  }, [isModalOpen, orgProfile.about.specialties])

  const handleAddSpecialty = () => {
    const trimmed = specialtyInput.trim()
    if (!trimmed) {
      toast.error("Please enter a specialty")
      return
    }
    if (specialtiesList.some((item) => item.trim().toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Specialty already added")
      return
    }
    setSpecialtiesList((prev) => [...prev, trimmed])
    setSpecialtyInput("")
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleAddSpecialty()
    }
  }

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full flex-col overflow-hidden bg-background p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pb-3 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            Specialties
          </SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Highlight the areas your organization specializes in.
          </p>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pt-3 pb-4">
            <div>
              <Label className="mb-2 block text-sm">Specialty *</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={specialtyInput}
                  onChange={(event) => setSpecialtyInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ex: No Code Development Platform"
                  className="border-muted-foreground text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSpecialty}
                  disabled={!specialtyInput.trim()}
                  className="shrink-0"
                >
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">
                Added specialties
                {specialtiesList.length > 0 && (
                  <span className="ml-1.5 font-normal text-muted-foreground">({specialtiesList.length})</span>
                )}
              </Label>
              {specialtiesList.length > 0 ? (
                <div className="flex max-h-[320px] flex-wrap gap-2 overflow-y-auto rounded-lg border border-border/60 bg-muted/10 p-3">
                  {specialtiesList.map((item, index) => (
                    <Badge
                      key={`${item}-${index}`}
                      variant="outline"
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium",
                        specialtyBadgeColors[index % specialtyBadgeColors.length]
                      )}
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => setSpecialtiesList((prev) => prev.filter((_, current) => current !== index))}
                        className="rounded-full p-0.5 opacity-70 transition-opacity hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
                        aria-label={`Remove ${item}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 bg-muted/20 py-8 text-center text-muted-foreground">
                  <Sparkles className="h-6 w-6 opacity-40" />
                  <p className="text-sm">No specialties added yet</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                updateAbout({ specialties: specialtiesList })
                toast.success("Specialties updated successfully")
                handleModalClose()
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
