"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Briefcase, MapPin, Pencil, Plus } from "lucide-react"
import { Button } from "@/ShadcnComponents/ui/button"
import { Badge } from "@/ShadcnComponents/ui/badge"
import {
  ProfileSectionCard,
  ProfileSectionEmpty,
  ProfileSectionHeader,
  ProfileSectionList,
  ProfileSectionRow,
  SectionActionButton,
} from "../../ProfileSection"
import { hasRealProfileImage } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"
import OrgJobModel from "../OrgModels/OrgJobsModel"
import OrgJobEditModel from "../OrgModels/OrgJobsEditModel"

export default function OrgProfileJobs() {
  const { orgProfile } = useOrgProfile()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [jobId, setJobId] = useState("")
  const jobs = orgProfile.jobs
  const companyLogo = hasRealProfileImage(orgProfile.profileImage) ? orgProfile.profileImage : undefined

  return (
    <ProfileSectionCard>
      <ProfileSectionHeader
        icon={<Briefcase className="h-4 w-4" />}
        title="Jobs"
        subtitle={jobs.length === 0 ? "No openings yet" : `${jobs.length} open role${jobs.length === 1 ? "" : "s"}`}
        action={<SectionActionButton icon={<Plus />} onClick={() => setIsAddOpen(true)} ariaLabel="Post a job" />}
      />
      {jobs.length > 0 ? (
        <ProfileSectionList>
          {jobs.map((job) => {
            const postedLabel = job.postedAt
              ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })
              : null
            return (
              <ProfileSectionRow
                key={job.id}
                logoUrl={companyLogo}
                fallbackIcon={<Briefcase className="h-5 w-5" />}
                title={job.title}
                subtitle={orgProfile.about.companyName || "Organization"}
                meta={
                  <>
                    {job.employmentType && (
                      <Badge
                        variant="outline"
                        className="border-sky-200 bg-sky-50 text-xs font-normal text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
                      >
                        {job.employmentType}
                      </Badge>
                    )}
                    {job.workplaceType && (
                      <Badge
                        variant="outline"
                        className="border-violet-200 bg-violet-50 text-xs font-normal text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300"
                      >
                        {job.workplaceType}
                      </Badge>
                    )}
                    {job.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    )}
                  </>
                }
                description={job.description}
                footer={postedLabel ? <span className="text-xs text-muted-foreground">Posted {postedLabel}</span> : undefined}
                action={
                  <SectionActionButton
                    icon={<Pencil />}
                    onClick={() => {
                      setJobId(job.id)
                      setIsEditOpen(true)
                    }}
                    ariaLabel={`Edit ${job.title}`}
                  />
                }
              />
            )
          })}
        </ProfileSectionList>
      ) : (
        <ProfileSectionEmpty
          icon={<Briefcase className="h-8 w-8" />}
          title="No job openings yet"
          hint="Post roles your organization is hiring for so people can discover them here."
          action={
            <Button type="button" size="sm" className="gap-1.5" onClick={() => setIsAddOpen(true)}>
              <Plus size={16} />
              Post a job
            </Button>
          }
        />
      )}
      <OrgJobModel isModalOpen={isAddOpen} handleModalClose={() => setIsAddOpen(false)} />
      <OrgJobEditModel isModalOpen={isEditOpen} handleModalClose={() => setIsEditOpen(false)} jobId={jobId} />
    </ProfileSectionCard>
  )
}
