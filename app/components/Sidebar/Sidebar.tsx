import { AppShell, Box, Burger, Divider, Group, ScrollArea } from "@mantine/core"
import { Link, useParams } from "@remix-run/react"
import { Plus } from "lucide-react"
import React, { useMemo } from "react"
import AccountSelect from "~/components/AccountSelect"
import POKTLogo from "~/components/POKTLogo"
import {
  ExternalLink,
  InternalLink,
  SidebarApps,
  SidebarNavRoute,
} from "~/components/Sidebar/components"
import { Account, PayPlanType, PortalApp, RoleName } from "~/models/portal/sdk"
import { DISCORD_PATH, DOCS_PATH } from "~/utils/utils"

type SidebarProps = {
  account: Account
  accounts: Account[]
  userRole: RoleName
  toggle: () => void
}

const getStaticRoutes = (
  activeAccount: Account,
  userRole: RoleName,
): SidebarNavRoute[] => {
  const isFreeAccount = activeAccount?.planType === PayPlanType.PlanFree
  return [
    ...(isFreeAccount && userRole !== RoleName.Member
      ? [
          {
            to: `/account/${activeAccount?.id}/upgrade`,
            label: "Upgrade to Unlimited",
            end: true,
          },
        ]
      : []),
    ...[
      {
        to: `/account/${activeAccount?.id}`,
        label: "Insights",
        end: true,
      },
      {
        to: `/account/${activeAccount?.id}/logs`,
        label: "Logs",
        end: true,
      },
      {
        to: `/account/${activeAccount?.id}/sandbox`,
        label: "Sandbox",
        end: true,
      },
      ...(!isFreeAccount && userRole !== RoleName.Member
        ? [
            {
              to: `/account/${activeAccount?.id}/billing`,
              label: "Billing",
            },
          ]
        : []),
      {
        to: `/account/${activeAccount?.id}/settings`,
        label: "Settings",
      },
      {
        to: DOCS_PATH,
        label: "Documentation",
        external: true,
      },
      {
        to: DISCORD_PATH,
        label: "Support",
        external: true,
      },
    ],
  ]
}

export const Sidebar = ({ account, userRole, accounts, toggle }: SidebarProps) => {
  const { accountId } = useParams()
  const staticRoutes = useMemo(() => {
    return getStaticRoutes(account, userRole)
  }, [account, userRole])

  const canCreateApps = userRole !== RoleName.Member
  const { portalApps: apps } = account

  return (
    <AppShell.Navbar p={8} pt={18}>
      <Group>
        <Burger
          opened
          hiddenFrom="sm"
          size="sm"
          onClick={() => {
            toggle()
          }}
        />
        <AccountSelect accounts={accounts} style={{ flex: 1 }} />
      </Group>
      <ScrollArea h="100%" mt="lg">
        {staticRoutes.map((route, index) =>
          route.external ? (
            <AppShell.Section key={`${route.label}-${index}`}>
              <ExternalLink route={route} />
            </AppShell.Section>
          ) : (
            <AppShell.Section key={`${route.label}-${index}`}>
              <InternalLink route={route} />
            </AppShell.Section>
          ),
        )}
        <Divider my="lg" />
        <AppShell.Section>
          {apps && <SidebarApps apps={apps as PortalApp[]} />}
          {canCreateApps && (
            <InternalLink
              route={{
                to: `/account/${accountId}/create`,
                label: "New Application",
                icon: Plus,
                end: true,
              }}
            />
          )}
        </AppShell.Section>
      </ScrollArea>
      <Box ml={10}>
        <Link to={`/account/${accountId}`}>
          <POKTLogo />
        </Link>
      </Box>
    </AppShell.Navbar>
  )
}

export default Sidebar
