export const OrgSections = [
  { id: "1", name: "Home" },
  { id: "2", name: "About" },
  { id: "3", name: "Posts" },
  { id: "4", name: "Products" },
  { id: "5", name: "Jobs" },
  { id: "6", name: "People" },
]

export const SECTION_HOME = "1"
export const SECTION_ABOUT = "2"
export const SECTION_POSTS = "3"
export const SECTION_PRODUCTS = "4"
export const SECTION_JOBS = "5"
export const SECTION_PEOPLE = "6"

export const INDUSTRY_OPTIONS = [
  "Venture Capital",
  "Private Equity",
  "Investment Banking",
  "Asset Management",
  "Financial Services",
  "Technology",
  "Healthcare",
  "Professional Services",
]

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"]
export const WORKPLACE_TYPES = ["On-site", "Hybrid", "Remote"]

export type OrgAbout = {
  companyName: string
  headLine: string
  industry: string
  headquarters: string
  followers: string
  companySize: string
  associatedMembers: number
  overview: string
  profileUrl: string
  founded: string
  countryRegion: string
  city: string
  specialties: string[]
}

export type OrgProduct = {
  id: string
  productName: string
  category: string
  description: string
  productLogo: string
}

export type OrgJob = {
  id: string
  title: string
  location: string
  employmentType: string
  workplaceType: string
  description: string
  postedAt: string
}

export type OrgPost = {
  id: string
  title: string
  body: string
  postedAt: string
}

export type OrgPerson = {
  id: string
  name: string
  role: string
  isFollowing: boolean
}

export type OrgProfileData = {
  accountId: string
  coverImage: string
  profileImage: string
  about: OrgAbout
  products: OrgProduct[]
  jobs: OrgJob[]
  posts: OrgPost[]
  people: OrgPerson[]
}

export const DEFAULT_PRODUCT_LOGO =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?w=740"

const AVATAR_PALETTE = [
  "bg-rose-600 text-white",
  "bg-orange-600 text-white",
  "bg-emerald-600 text-white",
  "bg-teal-600 text-white",
  "bg-sky-600 text-white",
  "bg-indigo-600 text-white",
  "bg-violet-600 text-white",
  "bg-fuchsia-600 text-white",
]

export function initialsOf(name?: string | null) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
  return initials || "?"
}

export function hasRealProfileImage(url?: string | null) {
  return Boolean(url?.trim())
}

export function avatarPaletteClassFor(key?: string | null) {
  const value = key ?? ""
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (Math.imul(hash, 31) + value.charCodeAt(index)) | 0
  }
  return AVATAR_PALETTE[(hash >>> 0) % AVATAR_PALETTE.length]!
}

export function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file"))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export const initialOrgProfile: OrgProfileData = {
  accountId: "anthill-ventures",
  coverImage: "",
  profileImage: "",
  about: {
    companyName: "Anthill Ventures",
    headLine: "Syndication management for deal flow, investors, and startups",
    industry: "Venture Capital",
    headquarters: "Hyderabad, Telangana, India",
    followers: "2.4",
    companySize: "11-50 employees",
    associatedMembers: 8,
    overview:
      "Anthill Ventures builds early-stage syndicates and helps founders meet the right investors. Volery is the workspace the team uses to run deal flow, documents, and investor relationships.",
    profileUrl: "https://volery.anthillventures.com/org/anthill",
    founded: "2015",
    countryRegion: "India",
    city: "Hyderabad",
    specialties: ["Early-stage", "Syndication", "Deal flow", "Investor matching", "Portfolio tracking"],
  },
  products: [
    {
      id: "prod-1",
      productName: "Volery Deal Flow",
      category: "Pipeline",
      description: "Track startups from screening through IC review and close, with stage owners and diligence notes in one workspace.",
      productLogo: "",
    },
    {
      id: "prod-2",
      productName: "Investor Matching",
      category: "Syndication",
      description: "Match founders to the right angels, funds, and corporate partners based on thesis, ticket size, and sector.",
      productLogo: "",
    },
    {
      id: "prod-3",
      productName: "Data Room",
      category: "Documents",
      description: "Share memos, financials, and legal packs with controlled access for syndicate members and IC reviewers.",
      productLogo: "",
    },
  ],
  jobs: [
    {
      id: "job-1",
      title: "Investment Associate",
      location: "Hyderabad, Telangana",
      employmentType: "Full-time",
      workplaceType: "Hybrid",
      description: "Source and screen early-stage startups, prepare IC memos, and support syndicate execution across the Anthill pipeline.",
      postedAt: "2026-09-12T09:00:00.000Z",
    },
    {
      id: "job-2",
      title: "Platform Analyst",
      location: "Bengaluru, Karnataka",
      employmentType: "Full-time",
      workplaceType: "On-site",
      description: "Own portfolio reporting, founder updates, and matching workflows inside Volery for the Anthill investment team.",
      postedAt: "2026-09-28T09:00:00.000Z",
    },
  ],
  posts: [
    {
      id: "post-1",
      title: "Q3 syndicate close",
      body: "We closed our latest early-stage syndicate with 14 participating investors. Thank you to the founders and LPs who moved quickly this quarter.",
      postedAt: "2026-09-20T10:00:00.000Z",
    },
    {
      id: "post-2",
      title: "Now live on Volery",
      body: "Anthill’s deal flow, matching, and data rooms now run on Volery so partners and associates can work from one workspace.",
      postedAt: "2026-08-04T10:00:00.000Z",
    },
  ],
  people: [
    { id: "1", name: "Priya Sharma", role: "Managing Partner", isFollowing: true },
    { id: "2", name: "Rahul Mehta", role: "Partner", isFollowing: false },
    { id: "3", name: "Sasi Kumar", role: "Admin", isFollowing: true },
    { id: "4", name: "Ananya Iyer", role: "Investment Associate", isFollowing: false },
    { id: "5", name: "Vikram Patel", role: "Analyst", isFollowing: false },
    { id: "6", name: "Neha Kapoor", role: "Platform Lead", isFollowing: false },
  ],
}
