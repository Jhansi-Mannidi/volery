import {
  Calendar,
  Cloud,
  Database,
  FileText,
  Linkedin,
  Mail,
  MessageSquare,
  Video,
  type LucideIcon,
} from "lucide-react"

export interface VoleryIntegration {
  id: string
  name: string
  description: string
  typeName: string
  connected: boolean
  icon: LucideIcon
  iconClass: string
  connectedOn?: string
}

export const VOLERY_INTEGRATIONS: VoleryIntegration[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Track email opens and sync deal conversations.",
    typeName: "Communication",
    connected: true,
    icon: Mail,
    iconClass: "text-red-500",
    connectedOn: "Jan 10, 2026",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync meetings and scheduling with investor conversations.",
    typeName: "Calendar",
    connected: true,
    icon: Calendar,
    iconClass: "text-blue-500",
    connectedOn: "Jan 10, 2026",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Enrich founder and investor profiles from LinkedIn.",
    typeName: "Data",
    connected: true,
    icon: Linkedin,
    iconClass: "text-blue-700",
    connectedOn: "Jan 15, 2026",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send deal alerts and notifications to team channels.",
    typeName: "Communication",
    connected: true,
    icon: MessageSquare,
    iconClass: "text-purple-500",
    connectedOn: "Jan 12, 2026",
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Track email and calendar from Microsoft 365.",
    typeName: "Communication",
    connected: false,
    icon: Mail,
    iconClass: "text-blue-600",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Get deal alerts in Teams channels.",
    typeName: "Communication",
    connected: false,
    icon: Video,
    iconClass: "text-indigo-600",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Schedule and join investor meetings from deal profiles.",
    typeName: "Calendar",
    connected: false,
    icon: Video,
    iconClass: "text-blue-500",
  },
  {
    id: "crunchbase",
    name: "Crunchbase",
    description: "Auto-enrich startup profiles with funding history.",
    typeName: "Data",
    connected: false,
    icon: Database,
    iconClass: "text-blue-700",
  },
  {
    id: "docusign",
    name: "DocuSign",
    description: "Send and track term sheets and NDAs.",
    typeName: "Documents",
    connected: false,
    icon: FileText,
    iconClass: "text-yellow-600",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Sync data-room files with your Dropbox workspace.",
    typeName: "Documents",
    connected: false,
    icon: Cloud,
    iconClass: "text-blue-500",
  },
]
