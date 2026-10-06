export type DealCardVariant = "excellent" | "syndicate" | "lower"

export interface DealForMe {
  id: string
  name: string
  tagline: string
  matchPct: number
  variant: DealCardVariant
  sector: string
  stage: string
  location: string
  age: string
  metrics: {
    label: string
    value: string
  }[]
  raising: string
  valuation: string
  minTicket: string
  closing?: string
  aiSays?: string
  aiConcerns?: string[]
  alsoInterested?: string
  syndicateLabel?: string
}

export type QuickFilterId = "all" | "90plus" | "seed" | "series-a" | "fintech" | "saas" | "health"
export type SortOption = "best-match" | "newest" | "closing-soon" | "most-popular"

export interface DealsFilters {
  matchMin: number
  stages: string[]
  sectors: string[]
  checkMin: number
  checkMax: number
  locations: string[]
  syndicateOnly: boolean
  warmIntrosOnly: boolean
  closingThisMonth: boolean
}
