import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  BarChart3,
  Sparkles,
  Building2,
  Target,
  FileText,
  Briefcase,
  Kanban,
  Layers,
  Clock,
  Users,
  FolderOpen,
  Heart,
  Send,
  Link2,
  Settings,
  Plug,
  Inbox,
  Calendar,
  FileSearch,
  Bell,
  Search,
  Handshake,
  Rocket,
  MessageSquare,
  UserCircle,
  TrendingUp,
  Eye,
  Bot,
  BookOpen,
  Mail,
  GitMerge,
} from "lucide-react"
import type { UserRole } from "@/lib/auth-context"

export const VOLERY_APP_ID = "volery"

export const roleHomeRoutes: Record<UserRole, string> = {
  "investment-banker": "/",
  "institutional-investor": "/",
  "angel-investor": "/",
  "startup-founder": "/founder/dashboard",
  "research-analyst": "/analyst/dashboard",
  "corporate-development": "/",
}

/** Screen / submenu under a menu (VF `screens`). */
export interface AppSubMenu {
  id: string
  name: string
  href: string
}

/** Menu under a module (VF `menu_function`). May own submenus. */
export interface AppMenu {
  id: string
  name: string
  href: string
  icon: LucideIcon
  badge?: string
  subMenus?: AppSubMenu[]
}

/** Module under the Volery app (VF `modules`). */
export interface AppModule {
  id: string
  name: string
  icon?: LucideIcon
  menus: AppMenu[]
}

/** Icon + compact tile label for the VF-style module rail. */
export const moduleRailMeta: Record<string, { label: string; icon: LucideIcon }> = {
  home: { label: "Home", icon: LayoutDashboard },
  "ai-insights": { label: "AI Insights", icon: Sparkles },
  pipeline: { label: "Pipeline", icon: Kanban },
  investors: { label: "Investors", icon: Users },
  matching: { label: "Matching", icon: Target },
  documents: { label: "Documents", icon: FileText },
  settings: { label: "Settings", icon: Settings },
  "deal-flow": { label: "Deal Flow", icon: Inbox },
  tools: { label: "Tools", icon: FileSearch },
  investment: { label: "Investment", icon: Briefcase },
  deals: { label: "Deals", icon: Building2 },
  portfolio: { label: "Portfolio", icon: Briefcase },
  syndicates: { label: "Syndicates", icon: Handshake },
  community: { label: "Community", icon: MessageSquare },
  "my-startup": { label: "My Startup", icon: Rocket },
  fundraising: { label: "Fundraising", icon: TrendingUp },
  "data-room": { label: "Data Room", icon: FolderOpen },
  research: { label: "Research", icon: FileSearch },
  reports: { label: "Reports", icon: FileText },
  collaboration: { label: "Collaboration", icon: Users },
  "target-pipeline": { label: "Pipeline", icon: Target },
  "deal-rooms": { label: "Deal Rooms", icon: FolderOpen },
  integration: { label: "Integration", icon: GitMerge },
}

export function getModuleRailMeta(module: AppModule) {
  return (
    moduleRailMeta[module.id] || {
      label: module.name,
      icon: module.icon || LayoutDashboard,
    }
  )
}

export interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: string
  expandable?: boolean
  subItems?: { label: string; href: string }[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

const orgSettingsMenus: AppMenu[] = [
  { id: "organization", name: "Organization", href: "/organization", icon: Users },
  { id: "team-settings", name: "Team Settings", href: "/settings", icon: Settings },
  { id: "integrations", name: "Integrations", href: "/settings/integrations", icon: Plug },
]

const pipelineByStage: AppSubMenu[] = [
  { id: "screening", name: "Screening", href: "/startups/stages/screening" },
  { id: "due-diligence", name: "Due Diligence", href: "/startups/stages/due-diligence" },
  { id: "ic-review", name: "IC Review", href: "/startups/stages/ic-review" },
  { id: "closed", name: "Closed", href: "/startups/stages/closed" },
]

/**
 * Volery app navigation: app → module → menu → submenu.
 * Same shape as voltusfreight (apps / modules / menu_function / screens).
 */
export const roleModules: Record<UserRole, AppModule[]> = {
  "investment-banker": [
    {
      id: "home",
      name: "HOME",
      menus: [
        { id: "dashboard", name: "Dashboard", href: "/", icon: LayoutDashboard },
        { id: "my-tasks", name: "My Tasks", href: "/tasks", icon: CheckSquare, badge: "5" },
        { id: "activity-feed", name: "Activity Feed", href: "/activity", icon: Activity },
        { id: "analytics", name: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      id: "ai-insights",
      name: "AI INSIGHTS",
      menus: [
        { id: "ai-dashboard", name: "AI Dashboard", href: "/ai-insights", icon: Sparkles },
        {
          id: "by-insight",
          name: "By Insight",
          href: "/ai-insights",
          icon: Layers,
          subMenus: [
            { id: "deal-intelligence", name: "Deal Intelligence", href: "/ai-insights/deal-intelligence" },
            { id: "investor-matching", name: "Investor Matching", href: "/ai-insights/investor-matching" },
            { id: "document-analysis", name: "Document Analysis", href: "/ai-insights/document-analysis" },
            { id: "market-intelligence", name: "Market Intelligence", href: "/ai-insights/market-intelligence" },
            { id: "predictive-analytics", name: "Predictive Analytics", href: "/ai-insights/predictive-analytics" },
            { id: "portfolio-insights", name: "Portfolio Insights", href: "/ai-insights/portfolio-insights" },
          ],
        },
      ],
    },
    {
      id: "pipeline",
      name: "PIPELINE",
      menus: [
        { id: "pipeline-board", name: "Pipeline Board", href: "/pipeline", icon: Kanban },
        { id: "all-startups", name: "All Startups", href: "/startups", icon: Building2, badge: "142" },
        {
          id: "by-stage",
          name: "By Stage",
          href: "/startups/stages",
          icon: Layers,
          subMenus: pipelineByStage,
        },
        { id: "recently-viewed", name: "Recently Viewed", href: "/startups/recent", icon: Clock },
      ],
    },
    {
      id: "investors",
      name: "INVESTORS",
      menus: [
        { id: "all-investors", name: "All Investors", href: "/investors", icon: Users, badge: "87" },
        {
          id: "by-type",
          name: "By Type",
          href: "/investors/types",
          icon: FolderOpen,
          subMenus: [
            { id: "angel", name: "Angel Investors", href: "/investors/types/angel" },
            { id: "family-offices", name: "Family Offices", href: "/investors/types/family-offices" },
            { id: "vcs", name: "VCs", href: "/investors/types/vcs" },
            { id: "corporate", name: "Corporate", href: "/investors/types/corporate" },
          ],
        },
        { id: "my-relationships", name: "My Relationships", href: "/investors/relationships", icon: Heart },
      ],
    },
    {
      id: "matching",
      name: "MATCHING",
      menus: [
        { id: "match-results", name: "Match Results", href: "/matching", icon: Sparkles, badge: "New" },
        { id: "outreach-tracker", name: "Outreach Tracker", href: "/outreach", icon: Send },
      ],
    },
    {
      id: "documents",
      name: "DOCUMENTS",
      menus: [
        { id: "all-documents", name: "All Documents", href: "/documents", icon: FileText },
        {
          id: "sharing",
          name: "Sharing",
          href: "/documents/shared",
          icon: Link2,
          subMenus: [
            { id: "shared-links", name: "Shared Links", href: "/documents/shared" },
            { id: "doc-analytics", name: "Analytics", href: "/documents/analytics" },
          ],
        },
      ],
    },
    {
      id: "settings",
      name: "SETTINGS",
      menus: orgSettingsMenus,
    },
  ],

  "institutional-investor": [
    {
      id: "home",
      name: "HOME",
      menus: [
        { id: "dashboard", name: "Dashboard", href: "/", icon: LayoutDashboard },
      ],
    },
    {
      id: "deal-flow",
      name: "DEAL FLOW",
      menus: [
        { id: "incoming-deals", name: "Incoming Deals", href: "/deals/incoming", icon: Inbox, badge: "24" },
        { id: "my-pipeline", name: "My Pipeline", href: "/pipeline", icon: Kanban },
        {
          id: "by-stage",
          name: "By Stage",
          href: "/startups/stages",
          icon: Layers,
          subMenus: pipelineByStage,
        },
      ],
    },
    {
      id: "tools",
      name: "TOOLS",
      menus: [
        { id: "ic-memo", name: "IC Memo Generator", href: "/ic-memo", icon: FileText },
        { id: "meetings", name: "Meetings", href: "/investor/meetings", icon: Calendar },
        { id: "syndicate", name: "Syndicate & Co-invest", href: "/syndicate", icon: Users },
        { id: "document-review", name: "Document Review", href: "/documents/review", icon: FileSearch },
        { id: "analytics-reports", name: "Analytics & Reports", href: "/investor/analytics", icon: BarChart3 },
      ],
    },
    {
      id: "investment",
      name: "INVESTMENT",
      menus: [
        { id: "criteria", name: "Investment Criteria", href: "/criteria", icon: Target },
        { id: "investor-network", name: "Investor Network", href: "/investors", icon: Users },
      ],
    },
    {
      id: "settings",
      name: "SETTINGS",
      menus: [
        { id: "organization", name: "Organization", href: "/organization", icon: Users },
        { id: "team-settings", name: "Team Settings", href: "/investor/settings", icon: Settings },
        { id: "integrations", name: "Integrations", href: "/settings/integrations", icon: Plug },
      ],
    },
  ],

  "angel-investor": [
    {
      id: "home",
      name: "HOME",
      menus: [
        { id: "dashboard", name: "Dashboard", href: "/", icon: LayoutDashboard },
        { id: "notifications", name: "Notifications", href: "/notifications", icon: Bell, badge: "12" },
        { id: "activity", name: "Activity", href: "/activity", icon: Activity },
      ],
    },
    {
      id: "deals",
      name: "DEALS",
      menus: [
        { id: "deals-for-me", name: "Deals For Me", href: "/matching", icon: Sparkles },
        { id: "all-deals", name: "All Deals", href: "/startups", icon: Building2 },
        {
          id: "by-status",
          name: "By Status",
          href: "/deals/saved",
          icon: Layers,
          subMenus: [
            { id: "saved", name: "Saved Deals", href: "/deals/saved" },
            { id: "passed", name: "Passed Deals", href: "/deals/passed" },
            { id: "quick-review", name: "Quick Review", href: "/deals/quick-review" },
          ],
        },
      ],
    },
    {
      id: "portfolio",
      name: "MY PORTFOLIO",
      menus: [
        { id: "investments", name: "Investments", href: "/portfolio", icon: Briefcase, badge: "20" },
        {
          id: "by-view",
          name: "By View",
          href: "/portfolio/performance",
          icon: Layers,
          subMenus: [
            { id: "performance", name: "Performance", href: "/portfolio/performance" },
            { id: "follow-ons", name: "Follow-ons", href: "/portfolio/follow-ons" },
            { id: "exits", name: "Exits", href: "/portfolio/exits" },
          ],
        },
      ],
    },
    {
      id: "syndicates",
      name: "SYNDICATES",
      menus: [
        { id: "discover", name: "Discover Syndicates", href: "/syndicate", icon: Search },
        { id: "my-syndicates", name: "My Syndicates", href: "/syndicate/my", icon: Users, badge: "3" },
        {
          id: "opportunities",
          name: "Opportunities",
          href: "/syndicate/co-invest",
          icon: Handshake,
          subMenus: [
            { id: "co-invest", name: "Co-invest Opportunities", href: "/syndicate/co-invest" },
            { id: "create", name: "Create Syndicate", href: "/syndicate/create" },
          ],
        },
      ],
    },
    {
      id: "community",
      name: "COMMUNITY",
      menus: [
        { id: "discussions", name: "Discussions", href: "/community/discussions", icon: MessageSquare },
        {
          id: "network",
          name: "Network",
          href: "/community/angel-network",
          icon: Users,
          subMenus: [
            { id: "angel-network", name: "Angel Network", href: "/community/angel-network" },
            { id: "events", name: "Events", href: "/community/events" },
            { id: "amas", name: "Expert AMAs", href: "/community/amas" },
          ],
        },
      ],
    },
    {
      id: "ai-insights",
      name: "AI INSIGHTS",
      menus: [
        { id: "ai-dd", name: "AI DD Assistant", href: "/ai-insights/document-analysis", icon: FileSearch },
        {
          id: "by-insight",
          name: "By Insight",
          href: "/ai-insights/portfolio-insights",
          icon: Layers,
          subMenus: [
            { id: "portfolio-health", name: "Portfolio Health", href: "/ai-insights/portfolio-insights" },
            { id: "deal-scoring", name: "Deal Scoring", href: "/ai-insights/deal-intelligence" },
          ],
        },
      ],
    },
    {
      id: "settings",
      name: "SETTINGS",
      menus: [
        { id: "preferences", name: "Investment Preferences", href: "/settings/preferences", icon: Target },
        { id: "notifications", name: "Notifications", href: "/settings/notifications", icon: Bell },
        { id: "account", name: "Account", href: "/profile", icon: UserCircle },
      ],
    },
  ],

  "startup-founder": [
    {
      id: "home",
      name: "HOME",
      menus: [{ id: "dashboard", name: "Dashboard", href: "/founder/dashboard", icon: LayoutDashboard }],
    },
    {
      id: "my-startup",
      name: "MY STARTUP",
      menus: [{ id: "startups", name: "My Startup(s)", href: "/founder/profile", icon: Rocket }],
    },
    {
      id: "fundraising",
      name: "FUNDRAISING",
      menus: [
        { id: "campaigns", name: "Active Campaigns", href: "/founder/campaign/manage", icon: TrendingUp, badge: "1" },
        {
          id: "investor-pipeline",
          name: "Investor Pipeline",
          href: "/founder/matches",
          icon: Layers,
          subMenus: [
            { id: "matches", name: "Investor Matches", href: "/founder/matches" },
            { id: "target-lists", name: "Target Lists", href: "/founder/lists" },
            { id: "outreach", name: "Outreach", href: "/founder/outreach" },
            { id: "meetings", name: "Meetings", href: "/founder/meetings" },
          ],
        },
        { id: "term-sheets", name: "Term Sheets", href: "/founder/term-sheets", icon: FileText, badge: "3" },
      ],
    },
    {
      id: "data-room",
      name: "DATA ROOM",
      menus: [
        { id: "documents", name: "Documents", href: "/founder/profile?tab=documents", icon: FolderOpen },
        { id: "interest", name: "Investor Interest", href: "/founder/interest", icon: Eye, badge: "3" },
      ],
    },
    {
      id: "settings",
      name: "SETTINGS",
      menus: [
        { id: "organization", name: "Organization", href: "/organization", icon: Users },
        { id: "team-settings", name: "Team Settings", href: "/founder/settings", icon: Settings },
        { id: "integrations", name: "Integrations", href: "/settings/integrations", icon: Plug },
      ],
    },
  ],

  "research-analyst": [
    {
      id: "home",
      name: "HOME",
      menus: [
        { id: "dashboard", name: "Dashboard", href: "/analyst/dashboard", icon: LayoutDashboard },
        { id: "my-tasks", name: "My Tasks", href: "/analyst/tasks", icon: CheckSquare, badge: "8" },
        { id: "activity-feed", name: "Activity Feed", href: "/analyst/activity", icon: Activity },
        { id: "analytics", name: "Analytics", href: "/analyst/analytics", icon: BarChart3 },
      ],
    },
    {
      id: "ai-insights",
      name: "AI INSIGHTS",
      menus: [
        { id: "ai-dashboard", name: "AI Dashboard", href: "/analyst/ai-insights", icon: Bot },
        {
          id: "by-tool",
          name: "By Tool",
          href: "/analyst/research-assistant",
          icon: Layers,
          subMenus: [
            { id: "research-assistant", name: "Research Assistant", href: "/analyst/research-assistant" },
            { id: "data-extraction", name: "Data Extraction", href: "/analyst/data-extraction" },
            { id: "market-intelligence", name: "Market Intelligence", href: "/analyst/market-intelligence" },
            { id: "market-research", name: "Market Research", href: "/analyst/market-research" },
            { id: "competitive", name: "Competitive Analysis", href: "/analyst/competitive-landscape" },
            { id: "report-generator", name: "Report Generator", href: "/analyst/report-generator" },
            { id: "source-aggregator", name: "Source Aggregator", href: "/analyst/source-aggregator" },
          ],
        },
      ],
    },
    {
      id: "research",
      name: "RESEARCH",
      menus: [
        { id: "queue", name: "Research Queue", href: "/analyst/research-queue", icon: Clock, badge: "12" },
        { id: "all-companies", name: "All Companies", href: "/analyst/companies", icon: Building2, badge: "156" },
        {
          id: "by-status",
          name: "By Status",
          href: "/analyst/companies/status",
          icon: Layers,
          subMenus: [
            { id: "in-research", name: "In Research", href: "/analyst/companies/status/in-research" },
            { id: "pending-review", name: "Pending Review", href: "/analyst/companies/status/pending-review" },
            { id: "completed", name: "Completed", href: "/analyst/companies/status/completed" },
            { id: "archived", name: "Archived", href: "/analyst/companies/status/archived" },
          ],
        },
        { id: "due-diligence", name: "Due Diligence", href: "/analyst/due-diligence", icon: FileSearch },
        { id: "market-maps", name: "Market Maps", href: "/analyst/market-maps", icon: Kanban },
      ],
    },
    {
      id: "reports",
      name: "REPORTS",
      menus: [
        { id: "my-reports", name: "My Reports", href: "/analyst/reports", icon: FileText },
        {
          id: "library",
          name: "Library",
          href: "/analyst/templates",
          icon: BookOpen,
          subMenus: [
            { id: "templates", name: "Templates", href: "/analyst/templates" },
            { id: "shared-reports", name: "Shared Reports", href: "/analyst/reports/shared" },
          ],
        },
      ],
    },
    {
      id: "collaboration",
      name: "COLLABORATION",
      menus: [
        { id: "team", name: "Team Workspace", href: "/analyst/team", icon: Users },
        { id: "requests", name: "Partner Requests", href: "/analyst/requests", icon: Mail, badge: "3" },
        { id: "notes", name: "Comments & Notes", href: "/analyst/notes", icon: MessageSquare },
      ],
    },
    {
      id: "settings",
      name: "SETTINGS",
      menus: orgSettingsMenus,
    },
  ],

  "corporate-development": [
    {
      id: "home",
      name: "HOME",
      menus: [
        { id: "dashboard", name: "M&A Dashboard", href: "/", icon: LayoutDashboard },
        { id: "my-tasks", name: "My Tasks", href: "/tasks", icon: CheckSquare, badge: "6" },
        { id: "activity-feed", name: "Activity Feed", href: "/activity", icon: Activity },
        { id: "analytics", name: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      id: "target-pipeline",
      name: "TARGET PIPELINE",
      menus: [
        { id: "pipeline-board", name: "Pipeline Board", href: "/pipeline", icon: Target },
        { id: "all-targets", name: "All Targets", href: "/startups", icon: Building2, badge: "38" },
        {
          id: "by-stage",
          name: "By Stage",
          href: "/startups/stages",
          icon: Layers,
          subMenus: [
            { id: "screening", name: "Screening", href: "/startups/stages/screening" },
            { id: "due-diligence", name: "Due Diligence", href: "/startups/stages/due-diligence" },
            { id: "negotiation", name: "Negotiation", href: "/startups/stages/ic-review" },
            { id: "closed", name: "Closed", href: "/startups/stages/closed" },
          ],
        },
      ],
    },
    {
      id: "deal-rooms",
      name: "DEAL ROOMS",
      menus: [
        { id: "active-deals", name: "Active Deals", href: "/deals", icon: FolderOpen, badge: "3" },
        {
          id: "documents",
          name: "Documents",
          href: "/documents",
          icon: FileText,
          subMenus: [
            { id: "all-documents", name: "All Documents", href: "/documents" },
            { id: "shared-links", name: "Shared Links", href: "/documents/shared" },
          ],
        },
      ],
    },
    {
      id: "integration",
      name: "INTEGRATION",
      menus: [
        { id: "plans", name: "Integration Plans", href: "/integration", icon: GitMerge },
        { id: "analytics", name: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      id: "settings",
      name: "SETTINGS",
      menus: orgSettingsMenus,
    },
  ],
}

export function getRoleModules(role: UserRole): AppModule[] {
  return roleModules[role] || roleModules["investment-banker"]
}

export function toNavSections(modules: AppModule[]): NavSection[] {
  return modules.map((module) => ({
    title: module.name,
    items: module.menus.map((menu) => ({
      icon: menu.icon,
      label: menu.name,
      href: menu.href,
      badge: menu.badge,
      expandable: Boolean(menu.subMenus?.length),
      subItems: menu.subMenus?.map((sub) => ({ label: sub.name, href: sub.href })),
    })),
  }))
}

export function getRoleNavigation(role: UserRole): NavSection[] {
  return toNavSections(getRoleModules(role))
}
