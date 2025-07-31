import { json, redirect } from "@remix-run/node"
import { createUserSession } from "~/utils/session.server"

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Simple development authentication
  if (email && password) {
    // Create a mock user session
    const user = {
      id: "dev-user-123",
      email: email,
      name: "Development User",
      portalUserID: "dev-portal-user-123",
    }

    return createUserSession({
      request,
      userId: user.id,
      remember: false,
      redirectTo: "/account/dev-account",
    })
  }

  return json({ error: "Invalid credentials" }, { status: 400 })
}

export async function loader() {
  return json({ message: "Development login endpoint" })
} 