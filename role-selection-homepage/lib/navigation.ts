import type { UserRole } from "@/lib/auth-context"
import {
  getRoleNavigation as getTenantRoleNavigation,
  type NavItem,
  type NavSection,
} from "@/TenantsComponents/Volery/appModules"

export type { NavItem, NavSection }

export function getRoleNavigation(role: UserRole): NavSection[] {
  return getTenantRoleNavigation(role)
}
