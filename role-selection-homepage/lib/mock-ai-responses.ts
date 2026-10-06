export interface MockQA {
  id: string
  triggers: string[] // Multiple phrases that trigger this response
  question: string // Display question
  answer: string // AI response (supports markdown)
  category: string
  icon: string
}

export const mockResponses: MockQA[] = [
  // PIPELINE SUMMARY
  {
    id: "pipeline-summary",
    triggers: [
      "show my pipeline summary",
      "pipeline summary",
      "show pipeline",
      "my pipeline",
      "pipeline overview",
      "deal pipeline",
      "active deals",
    ],
    question: "Show my pipeline summary",
    icon: "📊",
    category: "quick-actions",
    answer: `## 📊 Your Pipeline Summary

**As of January 29, 2026**

### Overview
You have **12 active deals** worth a combined **₹847 Cr** in potential transaction value.

---

### Stage Distribution

| Stage | Deals | Value | Avg. Days |
|-------|-------|-------|-----------|
| 🔵 Screening | 3 | ₹125 Cr | 5 days |
| 🟡 Due Diligence | 4 | ₹312 Cr | 18 days |
| 🟠 Negotiation | 3 | ₹285 Cr | 12 days |
| 🟢 Closing | 2 | ₹125 Cr | 8 days |

---

### 🔥 Hot Deals (Closing This Month)

1. **TechCorp AI** - Series A, ₹75 Cr
   - Status: Term sheet signed, closing docs in review
   - Probability: 92%
   
2. **FinSecure** - Series B, ₹50 Cr
   - Status: Final investor approval pending
   - Probability: 78%

---

### ⚠️ Needs Attention

- **GreenEnergy Solutions** - No activity in 9 days
- **HealthFirst** - Missing financial documents
- **EduTech Pro** - Investor meeting overdue

---

### 📈 This Week's Activity
- **3** new deals added
- **2** deals moved forward
- **8** investor meetings scheduled
- **15** documents shared

Would you like me to dive deeper into any specific deal?`,
  },

  // FIND INVESTORS FOR TECHCORP AI
  {
    id: "find-investors-techcorp",
    triggers: [
      "find investors for techcorp ai",
      "investors for techcorp",
      "match investors techcorp",
      "who should invest in techcorp",
      "techcorp ai investors",
      "best investors for techcorp",
    ],
    question: "Find investors for TechCorp AI",
    icon: "🎯",
    category: "investor-matching",
    answer: `## 🎯 Top Investor Matches for TechCorp AI

Based on TechCorp AI's profile (AI/ML, Series A, ₹75 Cr raise, B2B SaaS), I've identified the best matching investors:

---

### 🏆 Top 5 Matches

#### 1. Nexus Venture Partners
**Match Score: 94%** ⭐⭐⭐⭐⭐

| Criteria | Details |
|----------|---------|
| Check Size | ₹50-150 Cr ✓ |
| Stage Focus | Series A-B ✓ |
| Sector | AI/ML, Enterprise SaaS ✓ |
| Recent Activity | Led 3 AI deals in 2024 |

📍 **Why they match:** Strong AI thesis, active in enterprise software. Portfolio includes similar companies (DataMind, AIops Labs).

👤 **Contact:** Sameer Brij Verma (Partner)
📧 Last interaction: Showed interest in AI deals (Dec 2024)

---

#### 2. Accel India
**Match Score: 91%** ⭐⭐⭐⭐⭐

| Criteria | Details |
|----------|---------|
| Check Size | ₹75-200 Cr ✓ |
| Stage Focus | Series A-C ✓ |
| Sector | Deep Tech, SaaS ✓ |
| Recent Activity | 2 AI investments this quarter |

📍 **Why they match:** Looking to expand AI portfolio. Partner Prayank mentioned interest in B2B AI at recent conference.

👤 **Contact:** Prayank Swaroop (Partner)

---

#### 3. Lightspeed India
**Match Score: 88%** ⭐⭐⭐⭐

| Criteria | Details |
|----------|---------|
| Check Size | ₹50-100 Cr ✓ |
| Stage Focus | Seed-Series B ✓ |
| Sector | SaaS, AI ✓ |

📍 **Why they match:** Portfolio gap in AI infrastructure. Quick decision maker.

---

#### 4. Chiratae Ventures  
**Match Score: 85%** ⭐⭐⭐⭐

📍 **Why they match:** Strong enterprise software thesis, recently closed new fund.

---

#### 5. Elevation Capital
**Match Score: 82%** ⭐⭐⭐⭐

📍 **Why they match:** Active in SaaS, looking at AI-first companies.

---

### 📋 Recommended Actions

1. **Prioritize Nexus** - Warm intro available through portfolio founder
2. **Send teaser to Accel** - Partner expressed interest recently  
3. **Schedule calls** this week with top 3

Would you like me to:
- Draft outreach emails for these investors?
- Show detailed profiles for any investor?
- Find additional matches with different criteria?`,
  },

  // MARKET TRENDS IN FINTECH
  {
    id: "market-trends-fintech",
    triggers: [
      "market trends in fintech",
      "fintech market trends",
      "fintech sector trends",
      "fintech analysis",
      "fintech market",
      "trends in fintech",
    ],
    question: "Market trends in Fintech sector",
    icon: "📈",
    category: "market-intelligence",
    answer: `## 📈 Fintech Market Trends - India & SEA

**Report Generated: January 29, 2026**

---

### 🌏 Market Overview

The India Fintech market is valued at **$584 Bn** (2025) with projected **22% CAGR** through 2030.

---

### 🔥 Hot Sub-Sectors (Q4 2025 - Q1 2026)

| Sub-Sector | Funding Activity | Avg. Valuation Multiple | Trend |
|------------|------------------|------------------------|-------|
| Embedded Finance | ₹2,840 Cr raised | 18x ARR | 🚀 Rising |
| B2B Payments | ₹1,920 Cr raised | 15x ARR | 🚀 Rising |
| Lending Infrastructure | ₹1,650 Cr raised | 12x ARR | ➡️ Stable |
| WealthTech | ₹980 Cr raised | 10x ARR | ➡️ Stable |
| InsurTech | ₹720 Cr raised | 8x ARR | ⬇️ Cooling |

---

### 💰 Recent Notable Deals (Last 90 Days)

1. **Razorpay** - $75M debt financing
2. **ClearTax** - Series D, ₹600 Cr at ₹12,000 Cr valuation
3. **Perfios** - Strategic investment from Warburg Pincus
4. **Open Financial** - Down round at 40% lower valuation ⚠️

---

### 📊 Valuation Benchmarks (Series A)

| Metric | Median | Top Quartile |
|--------|--------|--------------|
| Revenue Multiple | 12x ARR | 18x+ ARR |
| Minimum ARR | ₹3 Cr | ₹8 Cr |
| Growth Rate | 80% YoY | 150%+ YoY |
| Gross Margin | 65% | 75%+ |

---

### 🎯 Investor Sentiment

**Active Investors in Fintech (Last 6 months):**
- Tiger Global (2 deals)
- Ribbit Capital (3 deals)
- QED Investors (2 deals)
- Peak XV Partners (4 deals)

**Investor Concerns:**
- ⚠️ Regulatory uncertainty (RBI digital lending guidelines)
- ⚠️ Path to profitability scrutiny
- ⚠️ Credit quality in lending plays

**Investor Appetite:**
- ✅ Profitable or near-profitable companies
- ✅ B2B over B2C
- ✅ Infrastructure/picks-and-shovels plays

---

### 💡 Implications for Your Deals

Based on your pipeline:

| Deal | Sector Alignment | Recommendation |
|------|------------------|----------------|
| **FinSecure** | B2B Payments ✅ | Strong market, push for close |
| **PayEasy** | Consumer Lending ⚠️ | Expect valuation pushback |
| **WealthBot** | WealthTech ➡️ | Moderate interest, need differentiation |

---

Would you like me to generate a detailed competitive analysis for any specific deal?`,
  },

  // DEALS NEEDING ATTENTION
  {
    id: "deals-attention",
    triggers: [
      "deals needing attention",
      "deals at risk",
      "stalled deals",
      "deals need attention",
      "problem deals",
      "deals requiring action",
      "attention needed",
    ],
    question: "Deals needing attention",
    icon: "⚠️",
    category: "deal-intelligence",
    answer: `## ⚠️ Deals Requiring Immediate Attention

I've identified **4 deals** in your pipeline that need action:

---

### 🔴 Critical (Action Required Today)

#### 1. GreenEnergy Solutions
**Stage:** Due Diligence | **Value:** ₹45 Cr | **Days Stale:** 12

| Issue | Details |
|-------|---------|
| ❌ No activity | Last touchpoint was 12 days ago |
| ❌ Investor cooling | Peak XV hasn't responded to last 2 emails |
| ❌ Competing process | Heard they're talking to Lightspeed |

**🎯 Recommended Actions:**
1. Call founder Priya Sharma TODAY - get status update
2. Send "soft close" email to Peak XV with deadline
3. Identify backup investors immediately

---

#### 2. HealthFirst Technologies  
**Stage:** Due Diligence | **Value:** ₹60 Cr | **Days Stale:** 8

| Issue | Details |
|-------|---------|
| ❌ Missing documents | Financial model V2 requested 8 days ago |
| ❌ DD blocked | Sequoia can't proceed without updated financials |
| ⚠️ Founder unresponsive | 2 follow-ups sent, no reply |

**🎯 Recommended Actions:**
1. Escalate to co-founder (Rahul Mehta)
2. Offer to help founder prepare documents
3. Set hard deadline: EOD Friday

---

### 🟡 Warning (Action Required This Week)

#### 3. EduTech Pro
**Stage:** Negotiation | **Value:** ₹35 Cr | **Days Stale:** 5

| Issue | Details |
|-------|---------|
| ⚠️ Valuation gap | Founder wants ₹180 Cr, investors at ₹140 Cr |
| ⚠️ Stalled negotiation | No movement in 5 days |

**🎯 Recommended Actions:**
1. Propose middle-ground structure (₹150 Cr with milestones)
2. Schedule 3-way call: Founder + Lead Investor + You
3. Prepare comparable analysis to justify valuation

---

#### 4. LogiNext
**Stage:** Screening | **Value:** ₹80 Cr | **Days in Stage:** 14

| Issue | Details |
|-------|---------|
| ⚠️ Overdue decision | Should have moved to DD by now |
| ⚠️ Incomplete scoring | Missing competitive analysis |

**🎯 Recommended Actions:**
1. Complete deal scoring by tomorrow
2. Make go/no-go decision
3. If go: fast-track to DD with top 3 investors

---

### 📊 Summary

| Priority | Deals | Combined Value | Risk Level |
|----------|-------|----------------|------------|
| 🔴 Critical | 2 | ₹105 Cr | High - may lose deals |
| 🟡 Warning | 2 | ₹115 Cr | Medium - delays likely |

---

**My Recommendation:** Focus on GreenEnergy first - highest risk of losing to competitor. Block 30 minutes now to make calls.

Would you like me to draft follow-up messages for any of these?`,
  },

  // DRAFT INVESTOR TEASER
  {
    id: "draft-teaser",
    triggers: [
      "draft investor teaser",
      "write teaser",
      "create teaser",
      "investor teaser",
      "deal teaser",
      "write investor teaser",
    ],
    question: "Draft investor teaser",
    icon: "📝",
    category: "documents",
    answer: `## 📝 Investor Teaser Draft

I'll create a teaser for your highest-priority deal: **TechCorp AI**

---

# CONFIDENTIAL INVESTMENT TEASER

## TechCorp AI - Series A

**AI-Powered Enterprise Automation Platform**

---

### The Opportunity

TechCorp AI is raising **₹75 Crore Series A** to scale its enterprise AI platform that automates complex business workflows, reducing operational costs by 40-60%.

---

### Company Snapshot

| Metric | Details |
|--------|---------|
| **Founded** | 2022, Bangalore |
| **Stage** | Series A |
| **Sector** | Enterprise AI / B2B SaaS |
| **Raise** | ₹75 Cr ($9M) |
| **Valuation** | ₹300 Cr ($36M) pre-money |
| **Use of Funds** | 50% R&D, 30% GTM, 20% Hiring |

---

### Traction Highlights

📈 **Growth Metrics**
- ARR: ₹12 Cr (Growing 180% YoY)
- Customers: 45 enterprise clients
- Net Revenue Retention: 135%
- Gross Margin: 78%

🏢 **Notable Customers**
- Tata Digital
- HDFC Bank
- Reliance Retail
- Infosys

---

### Why Now?

1. **Massive Market** - India enterprise AI market: $3.1Bn by 2027
2. **Proven Product** - 45 paying customers, 135% NRR
3. **Experienced Team** - Ex-Google, Microsoft, Amazon leadership
4. **Clear Moat** - Proprietary ML models trained on Indian enterprise data

---

### Investment Highlights

✅ Capital-efficient growth (18-month runway at current burn)
✅ Path to profitability visible (break-even in 24 months)
✅ Strong competitive positioning vs. global players
✅ Multiple expansion opportunities (SEA, Middle East)

---

### The Team

**Vikram Rao** - CEO & Co-founder
- Ex-Google AI (8 years), Stanford MS CS
- Built Google's India ML team

**Sneha Iyer** - CTO & Co-founder  
- Ex-Microsoft Research (6 years), IIT Bombay
- 15 patents in ML/NLP

**Arun Kumar** - COO
- Ex-McKinsey Partner, IIM Ahmedabad
- Scaled 2 startups to $50M+ revenue

---

### Process & Timeline

| Milestone | Date |
|-----------|------|
| Teaser Distribution | Feb 1, 2026 |
| Management Meetings | Feb 10-20, 2026 |
| Term Sheet Deadline | Feb 28, 2026 |
| Close | March 30, 2026 |

---

**Exclusive Mandate:** Volery Capital Advisors

📧 Contact: rajesh@volery.com
📞 +91 98XXX XXXXX

---

*This is a draft. Would you like me to:*
- *Customize for a specific investor?*
- *Add more financial details?*
- *Generate a full Information Memorandum?*
- *Create email copy to send with this teaser?*`,
  },

  // PREDICT DEAL OUTCOMES
  {
    id: "predict-outcomes",
    triggers: [
      "predict deal outcomes",
      "deal predictions",
      "close probability",
      "deal probability",
      "which deals will close",
      "predict outcomes",
      "deal forecast",
    ],
    question: "Predict deal outcomes",
    icon: "🔮",
    category: "deal-intelligence",
    answer: `## 🔮 Deal Outcome Predictions

Based on historical patterns, current activity, and investor signals, here are my predictions:

---

### Prediction Summary

| Deal | Stage | Close Probability | Confidence | Expected Close |
|------|-------|-------------------|------------|----------------|
| TechCorp AI | Closing | **92%** 🟢 | High | Feb 15, 2026 |
| FinSecure | Negotiation | **78%** 🟢 | High | Mar 10, 2026 |
| DataMesh | Due Diligence | **65%** 🟡 | Medium | Apr 2026 |
| GreenEnergy | Due Diligence | **34%** 🔴 | Medium | At Risk |
| EduTech Pro | Negotiation | **52%** 🟡 | Low | Uncertain |

---

### 🟢 High Probability (>70%)

#### TechCorp AI - 92% Close Probability

**Positive Signals:**
- ✅ Term sheet signed (strongest indicator)
- ✅ Legal docs 80% complete
- ✅ Investor highly engaged (daily communication)
- ✅ No competing offers

**Risk Factors:**
- ⚠️ Minor: Final board approval pending (routine)

**Prediction:** Will close by **Feb 15, 2026** (±5 days)

---

#### FinSecure - 78% Close Probability

**Positive Signals:**
- ✅ Lead investor verbally committed
- ✅ Due diligence complete, no red flags
- ✅ Founder-investor chemistry strong
- ✅ Valuation agreed in principle

**Risk Factors:**
- ⚠️ Co-investor still finalizing allocation
- ⚠️ Regulatory approval needed (standard)

**Prediction:** Will close by **Mar 10, 2026** if co-investor confirms this week

---

### 🟡 Medium Probability (40-70%)

#### DataMesh - 65% Close Probability

**Positive Signals:**
- ✅ Strong investor interest (5 active conversations)
- ✅ Impressive growth metrics

**Risk Factors:**
- ⚠️ Valuation expectations may be high
- ⚠️ Long DD process (complex tech)
- ⚠️ Founder considering strategic options

**Prediction:** Likely close in **Q2 2026** if valuation aligns

---

#### EduTech Pro - 52% Close Probability

**Analysis:** This is a coin-flip deal. Success depends on bridging the ₹40 Cr valuation gap.

**Scenarios:**
- If founder accepts ₹150 Cr: 75% close probability
- If founder holds at ₹180 Cr: 25% close probability

---

### 🔴 At Risk (<40%)

#### GreenEnergy Solutions - 34% Close Probability

**Warning Signs:**
- ❌ 12 days without activity (critical)
- ❌ Investor going cold
- ❌ Competing process rumored
- ❌ Founder not responsive

**Prediction:** Without intervention in next 48 hours, probability drops to **<20%**

**Recovery Actions Required:**
1. Immediate founder call
2. Create urgency with investor
3. Identify backup investors TODAY

---

### 📊 Portfolio Forecast

**Next 90 Days Expected Outcomes:**

| Outcome | Deals | Value |
|---------|-------|-------|
| 🟢 Will Close | 2 | ₹125 Cr |
| 🟡 Likely Close | 2 | ₹95 Cr |
| 🔴 At Risk | 1 | ₹45 Cr |
| ❓ Uncertain | 1 | ₹35 Cr |

**Expected Revenue (90 days):** ₹2.2 Cr - ₹3.1 Cr in fees

---

*These predictions are updated daily based on activity patterns. Want me to explain the methodology or dive deeper into any deal?*`,
  },
]

// Helper function to find matching response
export function findMatchingResponse(query: string): MockQA | null {
  const lowerQuery = query.toLowerCase().trim()

  for (const response of mockResponses) {
    for (const trigger of response.triggers) {
      if (lowerQuery.includes(trigger.toLowerCase())) {
        return response
      }
    }
  }

  return null
}
