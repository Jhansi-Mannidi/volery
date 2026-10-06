"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Flame, Briefcase, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/matching", label: "Deals", icon: Flame },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/syndicate", label: "Syndicates", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AngelBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-2 z-50 safe-area-pb"
      role="navigation"
      aria-label="Angel dashboard navigation"
    >
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-2 rounded-lg touch-manipulation transition-colors",
              isActive
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
