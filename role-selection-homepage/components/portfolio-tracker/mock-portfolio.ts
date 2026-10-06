import type { PortfolioItem, PortfolioSummaryData } from "./types"

export const MOCK_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "1",
    name: "FinSecure",
    tagline: "B2B payments infrastructure",
    status: "performing",
    invested: "₹15 Lakhs (Seed, Mar 2023)",
    stage: "Seed",
    investmentDate: "Mar 2023",
    currentValue: "₹48 Lakhs",
    multiple: 3.2,
    recentUpdate: "Hit ₹10 Cr ARR milestone!",
    nextStep: "Series B prep starting Q2",
  },
  {
    id: "2",
    name: "DataMesh",
    tagline: "Enterprise data platform",
    status: "watch",
    invested: "₹20 Lakhs (Series A, Jun 2024)",
    stage: "Series A",
    investmentDate: "Jun 2024",
    currentValue: "₹24 Lakhs",
    multiple: 1.2,
    watchReason: "Growth slowed to 5% MoM (was 15%)",
    followOnOpportunity: "Series B round opening - ₹25L pro-rata",
    followOnAmount: "₹25L",
  },
  {
    id: "3",
    name: "HealthBridge",
    tagline: "Telemedicine platform",
    status: "at-risk",
    invested: "₹10 Lakhs (Seed, Sep 2023)",
    stage: "Seed",
    investmentDate: "Sep 2023",
    currentValue: "₹6 Lakhs (est.)",
    multiple: 0.6,
    riskFactors: [
      "Runway: 4 months remaining",
      "Key hire departure",
      "Pivot in progress",
    ],
    founderUpdate: "Exploring bridge round options...",
  },
]

export const MOCK_PORTFOLIO_SUMMARY: PortfolioSummaryData = {
  byStage: [
    { stage: "Pre-Seed", count: 5, amount: "₹25L" },
    { stage: "Seed", count: 10, amount: "₹1.2Cr" },
    { stage: "Series A", count: 5, amount: "₹95L" },
  ],
  bySector: [
    { sector: "Fintech", pct: 35 },
    { sector: "SaaS", pct: 30 },
    { sector: "Health", pct: 20 },
    { sector: "Other", pct: 15 },
  ],
  byYear: [
    { year: 2024, count: 6 },
    { year: 2023, count: 8 },
    { year: 2022, count: 4 },
    { year: 2021, count: 2 },
  ],
  topPerformer: "FinSecure",
  topMultiple: "3.2x",
  worstPerformer: "HealthBridge",
  worstMultiple: "0.6x",
  realizedExits: 2,
  realizedProfit: "₹45L",
}
