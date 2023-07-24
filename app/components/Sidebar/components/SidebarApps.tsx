import { Navbar } from "@pokt-foundation/pocket-blocks"
import React, { useMemo } from "react"
import { AppLink, SidebarNavRoute } from "~/components/Sidebar/components"
import { EndpointsQuery } from "~/models/portal/sdk"

type SidebarAppsProps = { apps: EndpointsQuery; iconOnly?: boolean }

function getRandomAppmoji(): string {
  const emojis: string[] = [
    "💡",
    "🕹️",
    "⛰️",
    "🚀",
    "🔥",
    "🐛",
    "⚙️",
    "📱",
    "💻",
    "🛠️",
    "🎮 ",
  ]

  const randomIndex: number = Math.floor(Math.random() * emojis.length)
  return emojis[randomIndex]
}

export const SidebarApps = ({ apps, iconOnly }: SidebarAppsProps) => {
  const appsRoutes = useMemo(() => {
    return Object.entries(apps).flatMap(([parent, apps]) => {
      return typeof apps === "object"
        ? apps.map((app) => ({
            to: `apps/${app?.id}`,
            label: app?.name,
            badge: parent,
            icon: getRandomAppmoji(),
          }))
        : []
    }) as SidebarNavRoute[]
  }, [apps])

  return (
    <Navbar.Section>
      {appsRoutes.map((SidebarNavRoute) => (
        <AppLink key={SidebarNavRoute.to} iconOnly={iconOnly} route={SidebarNavRoute} />
      ))}
    </Navbar.Section>
  )
}

export default SidebarApps
