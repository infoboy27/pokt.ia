import { Outlet, useActionData, useRouteLoaderData } from "@remix-run/react"
import React from "react"
import ErrorBoundaryView from "~/components/ErrorBoundaryView/ErrorBoundaryView"
import useActionNotification from "~/hooks/useActionNotification"
import { AccountIdLoaderData } from "~/routes/account.$accountId/route"
import AccountSettingsLayoutView from "~/routes/account.$accountId.settings/view"
import { ActionDataStruct } from "~/types/global"

export default function AccountSettings() {
  const { account, accounts, user, userRole } = useRouteLoaderData(
    "routes/account.$accountId",
  ) as AccountIdLoaderData
  const actionData = useActionData() as ActionDataStruct<{ success: boolean }>

  // handle all notifications at the layout level
  useActionNotification(actionData)

  return (
    <AccountSettingsLayoutView account={account}>
      <Outlet context={{ account, accounts, user, userRole }} />
    </AccountSettingsLayoutView>
  )
}
export function ErrorBoundary() {
  return <ErrorBoundaryView />
}
