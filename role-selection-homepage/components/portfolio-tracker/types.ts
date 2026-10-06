export type PortfolioStatus = "performing" | "watch" | "at-risk"

export interface PortfolioItem {
  id: string
  name: string
  tagline: string
  status: PortfolioStatus
  invested: string
  stage: string
  investmentDate: string
  currentValue: string
  multiple: number
  recentUpdate?: string
  watchReason?: string
  riskFactors?: string[]
  founderUpdate?: string
  nextStep?: string
  followOnOpportunity?: string
  followOnAmount?: string
}

export type FilterStatus = "all" | "performing" | "watch" | "at-risk"

export interface PortfolioSummaryData {
  byStage: { stage: string; count: number; amount: string }[]
  bySector: { sector: string; pct: number }[]
  byYear: { year: number; count: number }[]
  topPerformer: string
  topMultiple: string
  worstPerformer: string
  worstMultiple: string
  realizedExits: number
  realizedProfit: string
}
