import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node"
import { Outlet, useActionData, useLoaderData, useOutletContext } from "@remix-run/react"
import React from "react"
import invariant from "tiny-invariant"
import { AccountIdLoaderData } from "../account.$accountId/route"
import AppIdLayoutView from "./view"
import ErrorBoundaryView from "app/components/ErrorBoundaryView"
import useActionNotification from "~/hooks/useActionNotification"
import { initPortalClient } from "~/models/portal/portal.server"
import { Blockchain, PortalApp, RoleName, SortOrder } from "~/models/portal/sdk"
import { ActionDataStruct } from "~/types/global"
import { getErrorMessage } from "~/utils/catchError"
import { triggerAppActionNotification } from "~/utils/notifications.server"
import { seo_title_append } from "~/utils/seo"
import { requireUser } from "~/utils/user.server"

export const meta: MetaFunction = () => {
  return [
    {
      title: `Application Overview ${seo_title_append}`,
    },
  ]
}

export type AppIdLoaderData = {
  app: PortalApp
  blockchains: Blockchain[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request)
  const portal = initPortalClient({ token: user.accessToken })

  const { accountId, appId } = params
  invariant(accountId, "account id not found")
  invariant(appId, "app id not found")

  try {
    const getUserPortalAppResponse = await portal.getUserPortalApp({
      portalAppID: appId,
      accountID: accountId,
    })

    const getBlockchainsResponse = await portal.blockchains({ sortOrder: SortOrder.Asc })

    return json<AppIdLoaderData>({
      app: getUserPortalAppResponse.getUserPortalApp as PortalApp,
      blockchains: getBlockchainsResponse.blockchains as Blockchain[],
    })
  } catch (error) {
    /**
     * Handle when an invalid app is manually entered & the case when the
     * application is deleted
     */
    if (getErrorMessage(error).includes("portal app not found")) {
      return redirect(`/account/${accountId}`)
    } else {
      throw new Response(getErrorMessage(error), {
        status: 500,
      })
    }
  }
}

export type AppIdActionData = {
  success: boolean
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request)
  const portal = initPortalClient({ token: user.accessToken })
  const formData = await request.formData()
  const { accountId, appId } = params
  invariant(typeof accountId === "string", "accountId must be set")
  invariant(typeof appId === "string", "appId must be set")

  try {
    const deleteApplication = formData.get("delete_application")
    const appName = formData.get("app_name")
    const appEmoji = formData.get("app_emoji")

    invariant(typeof appName === "string", "appName must be set")
    invariant(typeof appEmoji === "string", "appEmoji must be set")

    if (deleteApplication === "true") {
      // delete application via api
      const deleteAppResponse = await portal.deleteUserPortalApp({
        portalAppID: appId,
        accountID: accountId,
      })

      if (!deleteAppResponse.deleteUserPortalApp) {
        throw new Error(`Error deleting application: ${appId}`)
      }
    }

    await triggerAppActionNotification({
      actor: user.user,
      type: "delete",
      appId: appId,
      appName: appName,
      appEmoji: appEmoji,
      accountId: accountId,
    })

    // app no longer exists, so redirect back to account
    return redirect(`/account/${accountId}`)
  } catch (error) {
    return json<ActionDataStruct<AppIdActionData>>({
      data: null,
      error: true,
      message: getErrorMessage(error),
    })
  }
}

export type AppIdOutletContext = AppIdLoaderData & {
  userRole: RoleName
}

export default function AppIdLayout() {
  const { app, blockchains } = useLoaderData<AppIdLoaderData>()
  const { userRole } = useOutletContext<AccountIdLoaderData>()
  const actionData = useActionData() as ActionDataStruct<AppIdActionData>

  // handle all notifications at the layout level
  useActionNotification(actionData)

  return (
    <AppIdLayoutView app={app} userRole={userRole}>
      <Outlet
        context={{
          app,
          blockchains,
          userRole,
        }}
      />
    </AppIdLayoutView>
  )
}

export function ErrorBoundary() {
  return <ErrorBoundaryView />
}
