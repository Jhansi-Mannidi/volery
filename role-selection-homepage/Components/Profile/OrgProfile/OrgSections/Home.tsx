"use client"

import { Building2, Package } from "lucide-react"
import {
  ProfileSectionBody,
  ProfileSectionCard,
  ProfileSectionEmpty,
  ProfileSectionFooterLink,
  ProfileSectionHeader,
  ProfileSectionList,
  ProfileSectionRow,
} from "../../ProfileSection"
import { SECTION_ABOUT, SECTION_PRODUCTS } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

const PREVIEW_COUNT = 2

const truncateWords = (text: string | undefined | null, wordLimit: number) => {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  return words.length > wordLimit ? `${words.slice(0, wordLimit).join(" ")}…` : words.join(" ")
}

export default function OrgProfileHome({
  setSectionId,
}: {
  setSectionId: React.Dispatch<React.SetStateAction<string>>
}) {
  const { orgProfile } = useOrgProfile()
  const overview = truncateWords(orgProfile.about.overview, 40)
  const products = orgProfile.products

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-4">
      <ProfileSectionCard>
        <ProfileSectionHeader icon={<Building2 className="h-4 w-4" />} title="Overview" />
        {overview ? (
          <>
            <ProfileSectionBody>
              <p className="text-sm leading-relaxed text-muted-foreground">{overview}</p>
            </ProfileSectionBody>
            <ProfileSectionFooterLink label="Show all details" onClick={() => setSectionId(SECTION_ABOUT)} />
          </>
        ) : (
          <ProfileSectionEmpty
            icon={<Building2 className="h-8 w-8" />}
            title="No overview yet"
            hint="Describe what your organization does so visitors know who you are."
          />
        )}
      </ProfileSectionCard>

      <ProfileSectionCard>
        <ProfileSectionHeader
          icon={<Package className="h-4 w-4" />}
          title="Products"
          subtitle={
            products.length === 0
              ? "No products yet"
              : `${products.length} product${products.length === 1 ? "" : "s"}`
          }
        />
        {products.length > 0 ? (
          <>
            <ProfileSectionList>
              {products.slice(0, PREVIEW_COUNT).map((card) => (
                <ProfileSectionRow
                  key={card.id}
                  logoUrl={card.productLogo}
                  fallbackIcon={<Package className="h-5 w-5" />}
                  title={card.productName}
                  subtitle={card.category}
                  description={card.description}
                />
              ))}
            </ProfileSectionList>
            <ProfileSectionFooterLink label="Show all products" onClick={() => setSectionId(SECTION_PRODUCTS)} />
          </>
        ) : (
          <ProfileSectionEmpty
            icon={<Package className="h-8 w-8" />}
            title="No products yet"
            hint="Add what your organization builds so people can discover it here."
          />
        )}
      </ProfileSectionCard>
    </div>
  )
}
