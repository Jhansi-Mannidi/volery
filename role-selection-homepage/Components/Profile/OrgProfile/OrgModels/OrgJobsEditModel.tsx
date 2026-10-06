"use client"

import React, { useEffect } from "react"
import { Briefcase, Trash2, OctagonMinus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ShadcnComponents/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ShadcnComponents/ui/form"
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

interface JobFormValues {
  title: string
  location: string
  employmentType: string
  workplaceType: string
  description: string
  postedAt: string
}

export default function OrgJobEditModel({
  isModalOpen,
  handleModalClose,
  jobId,
}: {
  isModalOpen: boolean
  handleModalClose: () => void
  jobId: string
}) {
  const { orgProfile, updateJobs } = useOrgProfile()
  const form = useForm<JobFormValues>({
    mode: "onBlur",
    defaultValues: {
      title: "",
      location: "",
      employmentType: "Full-time",
      workplaceType: "On-site",
      description: "",
      postedAt: "",
    },
  })

  useEffect(() => {
    if (!isModalOpen) return
    const job = orgProfile.jobs.find((item) => item.id === jobId)
    if (!job) return
    form.reset({
      title: job.title || "",
      location: job.location || "",
      employmentType: job.employmentType || "Full-time",
      workplaceType: job.workplaceType || "On-site",
      description: job.description || "",
      postedAt: job.postedAt || new Date().toISOString(),
    })
  }, [isModalOpen, jobId, orgProfile.jobs, form])

  const onSubmit = (values: JobFormValues) => {
    updateJobs(
      orgProfile.jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              title: values.title.trim(),
              location: values.location.trim(),
              employmentType: values.employmentType,
              workplaceType: values.workplaceType,
              description: values.description.trim(),
              postedAt: values.postedAt || job.postedAt,
            }
          : job
      )
    )
    toast.success("Job opening updated successfully")
    handleModalClose()
  }

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full flex-col overflow-hidden bg-background p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pb-3 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </span>
            Edit job
          </SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Update or remove this job opening from your organization page.
          </p>
        </SheetHeader>
        <Form {...form}>
          <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit(onSubmit, () => toast.error("Job title is required"))}>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pt-3 pb-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ validate: (value) => !!value.trim() || "Job title is required" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Job title *</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                        <OctagonMinus className="h-3.5 w-3.5" /> {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-background dark:bg-muted">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EMPLOYMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workplaceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workplace type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-background dark:bg-muted">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WORKPLACE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="pb-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[140px] bg-background text-sm dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-background px-6 py-4">
              <Button
                type="button"
                variant="destructive"
                className="gap-1.5"
                onClick={() => {
                  updateJobs(orgProfile.jobs.filter((job) => job.id !== jobId))
                  toast.success("Job opening deleted successfully")
                  handleModalClose()
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
