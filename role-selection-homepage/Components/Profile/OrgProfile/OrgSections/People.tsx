"use client"

import { Check, Plus } from "lucide-react"
import { Card } from "@/ShadcnComponents/ui/card"
import { Button } from "@/ShadcnComponents/ui/button"
import { cn } from "@/lib/utils"
import { PROFILE_CONTENT_MAX_WIDTH } from "../../profileLayout"
import { avatarPaletteClassFor, initialsOf } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

export default function OrgProfilePeople() {
  const { orgProfile, toggleFollow } = useOrgProfile()

  return (
    <Card className={cn("m-0 w-full shrink-0 gap-0 bg-background p-6 py-6 dark:bg-muted", PROFILE_CONTENT_MAX_WIDTH)}>
      <h1 className="text-xl font-medium">People you may know</h1>
      <div className="mt-6 grid w-full grid-cols-1 gap-4 bg-transparent shadow-none sm:grid-cols-2 lg:grid-cols-3">
        {orgProfile.people.map((person) => (
          <div
            key={person.id}
            className="relative flex h-fit flex-col rounded-md bg-background shadow-md dark:bg-muted-foreground"
          >
            <div className="h-[150px] rounded-t-md bg-background shadow-none dark:bg-slate-700">
              <div className="h-[75px] w-full rounded-t-md bg-gradient-to-r from-[#74776a] to-[#929797] dark:from-[#665d68] dark:to-[#637979]" />
            </div>
            <div className="absolute top-3 left-0 flex h-[132px] w-full items-center justify-center bg-transparent shadow-none">
              <div
                role="img"
                aria-label={person.name}
                className={cn(
                  "flex h-[112px] w-[112px] items-center justify-center rounded-full border-4 border-background text-3xl font-semibold tracking-wide dark:border-slate-700",
                  avatarPaletteClassFor(person.id)
                )}
              >
                {initialsOf(person.name)}
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5 rounded-b-md px-4 pt-1 dark:bg-slate-700">
              <h3 className="m-0 w-full truncate p-0 text-center text-sm font-semibold">{person.name}</h3>
              <p className="m-0 w-full truncate p-0 text-center text-sm font-medium opacity-55">{person.role}</p>
              <Button className="mt-4 mb-5 h-8 gap-1 rounded-sm px-2 text-xs" onClick={() => toggleFollow(person.id)}>
                {person.isFollowing ? (
                  <>
                    <Check /> Following
                  </>
                ) : (
                  <>
                    <Plus /> Follow
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {orgProfile.people.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">No people to show yet.</p>
      )}
    </Card>
  )
}
