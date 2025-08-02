import { redirect } from "@remix-run/node"
import jwt_decode from "jwt-decode"
import { authenticator, AuthUser } from "./auth.server"
import { getSession } from "./session.server"
import { initPortalClient } from "~/models/portal/portal.server"
import { User, Account, RoleName } from "~/models/portal/sdk"

export enum Permissions {
  PayPlanTypes = "write:pay_plan_types",
  AppsUnlimited = "create:apps_unlimited",
}

export const requireUser = async (request: Request, defaultRedirect = "/") => {
  const isDevelopment = process.env.NODE_ENV === "development"
  
  let user = await authenticator.isAuthenticated(request)

  // In development mode, check if we have a session with userId
  if (!user && isDevelopment) {
    const session = await getSession(request.headers.get("Cookie"))
    const userId = session.get("userId")
    
    if (userId) {
      // Create a development user object
      user = {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYtYXV0aDAtaWQiLCJlbWFpbCI6ImRldkBwb2t0LmFpIiwiZXhwIjo5OTk5OTk5OTl9.signature",
        refreshToken: undefined,
        user: {
          id: userId,
          email: "dev@pokt.ai",
          name: "Developer User",
          portalUserID: "dev-portal-user-456",
          auth0ID: "dev-auth0-id",
          email_verified: true,
        }
      }
    }
  }

  if (!user) {
    if (isDevelopment) {
      throw redirect("/dev-login")
    }
    throw redirect("/api/auth/auth0")
  }

  if (!user.user) {
    const isDevelopment = process.env.NODE_ENV === "development"
    if (isDevelopment) {
      throw await authenticator.logout(request, { redirectTo: "/dev-login" })
    }
    throw await authenticator.logout(request, { redirectTo: "/api/auth/auth0" })
  }

  if (!user.user.email_verified) {
    throw await authenticator.logout(request, { redirectTo: "/email-verification" })
  }

  if (!user.user.portalUserID) {
    // In development mode, we don't have Auth0 strategy
    const isDevelopment = process.env.NODE_ENV === "development"
    if (isDevelopment) {
      throw redirect("/dev-login")
    }
    user = await authenticator.authenticate("auth0", request)
  }

  // Skip JWT validation in development mode
  if (!isDevelopment) {
    const decode = jwt_decode<{
      exp: number
    }>(user.accessToken)

    if (Date.now() >= decode.exp * 1000) {
      throw await authenticator.logout(request, { redirectTo: "/api/auth/auth0" })
    }
  }

  return user
}

export const requireUserProfile = async (
  request: Request,
  defaultRedirect = "/",
): Promise<User> => {
  const user = await requireUser(request, defaultRedirect)
  return user.user
}

export const requireAdmin = async (
  request: Request,
  defaultRedirect = "/",
): Promise<User> => {
  const user = await authenticator.isAuthenticated(request)

  if (!user) {
    throw redirect(defaultRedirect)
  }

  const permissions = getUserPermissions(user.accessToken)

  if (!isAdmin(permissions)) {
    throw redirect(defaultRedirect)
  }
  return user.user
}

export const isAdmin = (permissions: string[]) => {
  let isAdmin = false
  const adminPermissions = [Permissions.PayPlanTypes]

  adminPermissions.forEach((adminPermission) => {
    isAdmin = permissions.includes(adminPermission)
  })

  return isAdmin
}

export const getUserPermissions = (accessToken: string) => {
  const decode = jwt_decode<{
    exp: number
    permissions: string[]
  }>(accessToken)

  return decode.permissions
}

export const getUserId = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request)
  if (!user || !user.user.auth0ID) return undefined
  return getPoktId(user.user.auth0ID)
}

export const getPoktId = (id: string) => {
  return id.split("|")[1]
}

export const getUserProfile = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request)
  return user?.user
}

export const redirectToUserAccount = async (user: AuthUser) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  
  if (isDevelopment) {
    // In development mode, redirect to a simple account page
    return redirect("/account/dev-account")
  }
  
  const portal = initPortalClient({ token: user.accessToken })
  const accounts = await portal.getUserAccounts({ accepted: true })
  let account = accounts.getUserAccounts[0] as Partial<Account>

  const owner = accounts.getUserAccounts.find(
    (account) =>
      account?.users.find((u) => u.id === user.user.portalUserID)?.roleName ===
      RoleName.Owner,
  )

  if (owner) {
    account = owner as Account
  }

  return redirect(`/account/${account.id}`)
}
