"use client"

import React, { useEffect } from "react"
import { OctagonMinus } from "lucide-react"
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
import { Textarea } from "@/ShadcnComponents/ui/textarea"
import { Button } from "@/ShadcnComponents/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ShadcnComponents/ui/select"
import { INDUSTRY_OPTIONS } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

interface ModalProps {
  isModalOpen: boolean
  handleModalClose: () => void
}

interface OrgAboutFormValues {
  companyName: string
  headLine: string
  profileUrl: string
  headquarters: string
  industry: string
  companySize: string
  associatedMembers: string
  overview: string
  countryRegion: string
  city: string
  founded: string
}

export default function OrgProfileDetailsEditModal({ isModalOpen, handleModalClose }: ModalProps) {
  const { orgProfile, updateAbout } = useOrgProfile()
  const form = useForm<OrgAboutFormValues>({
    mode: "onBlur",
    defaultValues: {
      companyName: orgProfile.about.companyName,
      headLine: orgProfile.about.headLine,
      profileUrl: orgProfile.about.profileUrl,
      headquarters: orgProfile.about.headquarters,
      industry: orgProfile.about.industry,
      companySize: orgProfile.about.companySize,
      associatedMembers: String(orgProfile.about.associatedMembers ?? ""),
      overview: orgProfile.about.overview,
      countryRegion: orgProfile.about.countryRegion,
      city: orgProfile.about.city,
      founded: orgProfile.about.founded,
    },
  })

  useEffect(() => {
    if (!isModalOpen) return
    form.reset({
      companyName: orgProfile.about.companyName,
      headLine: orgProfile.about.headLine,
      profileUrl: orgProfile.about.profileUrl,
      headquarters: orgProfile.about.headquarters,
      industry: orgProfile.about.industry,
      companySize: orgProfile.about.companySize,
      associatedMembers: String(orgProfile.about.associatedMembers ?? ""),
      overview: orgProfile.about.overview,
      countryRegion: orgProfile.about.countryRegion,
      city: orgProfile.about.city,
      founded: orgProfile.about.founded,
    })
  }, [isModalOpen, orgProfile.about, form])

  const onSubmit = (values: OrgAboutFormValues) => {
    updateAbout({
      companyName: values.companyName,
      headLine: values.headLine,
      industry: values.industry,
      headquarters: values.headquarters,
      companySize: values.companySize,
      associatedMembers: Number(values.associatedMembers) || 0,
      overview: values.overview,
      profileUrl: values.profileUrl,
      founded: values.founded,
      countryRegion: values.countryRegion,
      city: values.city,
    })
    toast.success("Profile details updated successfully")
    handleModalClose()
  }

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full flex-col overflow-hidden bg-background p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pr-14 pb-3 text-left">
          <SheetTitle className="pb-0">Edit About</SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Update your organization details and how it appears on the company page.
          </p>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Form {...form}>
            <form className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto px-6 pt-3 pb-4">
              <FormField
                control={form.control}
                name="companyName"
                rules={{ validate: (value) => !!value?.trim() || "Organization name is a required field" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Organization Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-background dark:bg-muted" />
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
                name="headLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headquarters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                rules={{ validate: (value) => !!value?.trim() || "Industry is a required field" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Industry <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-background dark:bg-muted">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="associatedMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Members</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="overview"
                rules={{ validate: (value) => !!value?.trim() || "Overview is a required field" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Overview <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-[100px] bg-background dark:bg-muted" />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                        <OctagonMinus className="h-3.5 w-3.5" /> {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <h2 className="pt-1 text-sm font-semibold">Location</h2>
              <FormField
                control={form.control}
                name="countryRegion"
                rules={{ validate: (value) => !!value?.trim() || "Country is a required field" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Country/Region <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: India" {...field} className="bg-background dark:bg-muted" />
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: Hyderabad" {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem className="pb-2">
                    <FormLabel>Founded</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-background dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" className="border border-border" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit, () => toast.error("Please fill all required fields"))}>
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
