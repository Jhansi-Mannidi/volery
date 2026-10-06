import type { AppMenu, AppModule, AppSubMenu } from "@/TenantsComponents/Volery/appModules"

export const exactMatchPaths = [
  "/startups",
  "/investors",
  "/settings",
  "/ai-insights",
  "/documents",
  "/founder/profile",
  "/portfolio",
  "/syndicate",
  "/community",
  "/deals",
  "/analyst/ai-insights",
  "/analyst/companies",
  "/analyst/reports",
]

export function pathOnly(href: string) {
  return href.split("?")[0]
}

export function isPathActive(pathname: string, href: string, exact = false) {
  const clean = pathOnly(href)
  if (clean === "/") return pathname === "/"
  if (exact || exactMatchPaths.includes(clean)) return pathname === clean
  return pathname === clean || pathname.startsWith(clean + "/")
}

export function hrefsForMenu(menu: AppMenu) {
  return [menu.href, ...(menu.subMenus?.map((sub) => sub.href) ?? [])]
}

export function moduleMatchScore(module: AppModule, pathname: string) {
  let best = 0
  for (const menu of module.menus) {
    for (const href of hrefsForMenu(menu)) {
      const clean = pathOnly(href)
      if (clean === "/") {
        if (pathname === "/") best = Math.max(best, 1)
        continue
      }
      if (pathname === clean || pathname.startsWith(clean + "/")) {
        best = Math.max(best, clean.length)
      }
    }
  }
  return best
}

export function findModuleForPath(modules: AppModule[], pathname: string) {
  let best: AppModule | null = null
  let bestScore = 0
  for (const module of modules) {
    const score = moduleMatchScore(module, pathname)
    if (score > bestScore) {
      best = module
      bestScore = score
    }
  }
  return best
}

export function firstHref(module: AppModule) {
  const menu = module.menus[0]
  return menu?.subMenus?.[0]?.href || menu?.href || "/"
}

export function expandedMenusForPath(modules: AppModule[], pathname: string) {
  const menusToOpen: string[] = []
  for (const module of modules) {
    for (const menu of module.menus) {
      if (menu.subMenus?.some((sub: AppSubMenu) => isPathActive(pathname, sub.href))) {
        menusToOpen.push(menu.id)
      }
    }
  }
  return menusToOpen
}
