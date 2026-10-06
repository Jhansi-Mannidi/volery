"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  Building2,
  Factory,
  Rocket,
  SearchIcon,
  User,
} from "lucide-react"
import Header from "@/ReusableComponents/Header/Header"
import Search from "@/ReusableComponents/SearchBar/SearchBar"
import { appsPageStyles } from "./AppsPage.style"
import { AVAILABLE_ROLES, useAuth, type UserRole } from "@/lib/auth-context"
import { roleHomeRoutes } from "@/TenantsComponents/Volery/appModules"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Briefcase,
  User,
  Rocket,
  BarChart3,
  Factory,
}

const AppsPage: React.FC = () => {
  const router = useRouter()
  const { setActiveRole, setUserRoles } = useAuth()
  const [searchItem, setSearchItem] = useState("")
  const classes = appsPageStyles

  const filteredApps = useMemo(() => {
    const query = searchItem.trim().toLowerCase()
    if (!query) return AVAILABLE_ROLES
    return AVAILABLE_ROLES.filter(
      (role) =>
        role.label.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
    )
  }, [searchItem])

  const enterRole = (roleId: UserRole) => {
    setUserRoles([roleId])
    setActiveRole(roleId)
    router.push(roleHomeRoutes[roleId])
  }

  const handleClickApp = (roleId: UserRole) => {
    enterRole(roleId)
  }

  return (
    <div style={{ padding: "15px" }} className={classes.appPageMainContainer}>
      <Header />
      <div className={classes.appsDisplayContainer}>
        <div className={classes.searchAndHeadingContainerFlex}>
          <div>
            <h1 className={classes.appsMainHeading}>Apps</h1>
            <p className={classes.headingDescription}>
              Explore and manage all your applications seamlessly in one place with intuitive
              navigation and quick access.
            </p>
          </div>
          <div className="flex items-center">
            <Search
              searchTerm={searchItem}
              setSearchTerm={setSearchItem}
              placeholder="Search App"
            />
          </div>
        </div>

        {!filteredApps.length ? (
          <div className="flex h-[60vh] w-full flex-col items-center justify-center opacity-50">
            <SearchIcon height={160} width={160} />
            <h1>No Apps Found!</h1>
          </div>
        ) : (
          <div className={classes.appResultsContainer}>
            {filteredApps.map((role, index) => {
              const Icon = iconMap[role.icon] || Building2
              return (
                <button
                  key={role.id}
                  type="button"
                  className={classes.appCard}
                  style={{ animationDelay: `${index * 80}ms` }}
                  onClick={() => handleClickApp(role.id)}
                >
                  <div className={classes.logoOrIconStyles}>
                    <Icon className={classes.phosphorIcons} />
                  </div>
                  <p className={classes.eachAppName} title={role.label}>
                    {role.shortLabel}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppsPage
