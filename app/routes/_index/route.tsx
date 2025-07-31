import { LoaderFunction, redirect } from "@remix-run/node"
import React from "react"
import ErrorBoundaryView from "~/components/ErrorBoundaryView/ErrorBoundaryView"
import { redirectToUserAccount, requireUser } from "~/utils/user.server"

export const loader: LoaderFunction = async ({ request }) => {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development"
  
  try {
    const user = await requireUser(request)
    return redirectToUserAccount(user)
  } catch (error) {
    // If user is not authenticated and we're in development, redirect to dev login
    if (isDevelopment) {
      return redirect("/dev-login")
    }
    
    // In production, this would redirect to Auth0 login
    throw error
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryView />
}
