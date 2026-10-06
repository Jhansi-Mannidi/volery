"use client"

import { formatDistanceToNow } from "date-fns"
import { Sparkles } from "lucide-react"
import {
  ProfileSectionBody,
  ProfileSectionCard,
  ProfileSectionEmpty,
  ProfileSectionHeader,
} from "../../ProfileSection"
import { useOrgProfile } from "../org-profile-context"

export default function OrgProfilePosts() {
  const { orgProfile } = useOrgProfile()
  const posts = orgProfile.posts

  return (
    <ProfileSectionCard>
      <ProfileSectionHeader
        icon={<Sparkles className="h-4 w-4" />}
        title="Posts"
        subtitle={posts.length === 0 ? undefined : `${posts.length} post${posts.length === 1 ? "" : "s"}`}
      />
      {posts.length === 0 ? (
        <ProfileSectionEmpty
          icon={<Sparkles className="h-8 w-8" />}
          title="No posts yet"
          hint="Posts shared by this organization will appear here."
        />
      ) : (
        <ProfileSectionBody className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border border-border/60 bg-muted/10 p-4">
              <div className="mb-1 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{post.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{post.body}</p>
            </article>
          ))}
        </ProfileSectionBody>
      )}
    </ProfileSectionCard>
  )
}
