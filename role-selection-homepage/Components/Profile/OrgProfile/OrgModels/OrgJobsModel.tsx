"use client"

import React, { useEffect, useState } from "react"
import { Briefcase, OctagonMinus } from "lucide-react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ShadcnComponents/ui/sheet"
import { Label } from "@/ShadcnComponents/ui/label"
import { Input } from "@/ShadcnComponents/ui/input"
import { Button } from "@/ShadcnComponents/ui/button"
import { Textarea } from "@/ShadcnComponents/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ShadcnComponents/ui/select"
import { EMPLOYMENT_TYPES, WORKPLACE_TYPES } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

export default function OrgJobModel({
  isModalOpen,
  handleModalClose,
}: {
  isModalOpen: boolean
  handleModalClose: () => void
}) {
  const { orgProfile, updateJobs } = useOrgProfile()
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState("Full-time")
  const [workplaceType, setWorkplaceType] = useState("On-site")
  const [description, setDescription] = useState("")
  const [titleError, setTitleError] = useState(false)

  useEffect(() => {
    if (!isModalOpen) return
    setTitle("")
    setLocation("")
    setEmploymentType("Full-time")
    setWorkplaceType("On-site")
    setDescription("")
    setTitleError(false)
  }, [isModalOpen])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim()) {
      setTitleError(true)
      return
    }
    updateJobs([
      ...orgProfile.jobs,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        location: location.trim(),
        employmentType,
        workplaceType,
        description: description.trim(),
        postedAt: new Date().toISOString(),
      },
    ])
    toast.success("Job opening posted successfully")
    handleModalClose()
  }

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full flex-col overflow-hidden bg-background p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pr-14 pb-3 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </span>
            Post a job
          </SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Share an opening so candidates can find roles at your organization.
          </p>
        </SheetHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pt-3 pb-4">
            <div className="flex flex-col">
              <Label htmlFor="jobTitle" className="mb-1 text-xs">
                Job title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="jobTitle"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  if (event.target.value.trim()) setTitleError(false)
                }}
                placeholder="Ex: Senior Frontend Engineer"
                className="border border-muted-foreground bg-background dark:bg-muted"
              />
              {titleError && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <OctagonMinus className="h-3.5 w-3.5" /> Job title is required
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="jobLocation" className="mb-1 text-xs">
                Location
              </Label>
              <Input
                id="jobLocation"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Ex: Hyderabad, Telangana"
                className="border border-muted-foreground bg-background dark:bg-muted"
              />
            </div>
            <div className="flex flex-col">
              <Label className="mb-1 text-xs">Employment type</Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger className="border border-muted-foreground bg-background dark:bg-muted">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label className="mb-1 text-xs">Workplace type</Label>
              <Select value={workplaceType} onValueChange={setWorkplaceType}>
                <SelectTrigger className="border border-muted-foreground bg-background dark:bg-muted">
                  <SelectValue placeholder="Select workplace" />
                </SelectTrigger>
                <SelectContent>
                  {WORKPLACE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col pb-2">
              <Label htmlFor="jobDescription" className="mb-1 text-xs">
                Description
              </Label>
              <Textarea
                id="jobDescription"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the role, responsibilities, and requirements…"
                className="min-h-[140px] border border-muted-foreground bg-background text-sm dark:bg-muted"
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit">Post job</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
