import { json, redirect } from "@remix-run/node"
import { createUserSession } from "~/utils/session.server"

export async function action({ request }: { request: Request }) {
  console.log("Dev login action called")
  
  const formData = await request.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("Email:", email, "Password:", password)

  // Simple development authentication
  if (email && password) {
    console.log("Creating user session...")
    // Create a development user session using existing database user
    const user = {
      id: "c5d518cb-aaf6-448e-8ab4-e001b215797f", // dev@pokt.ai user ID from database
      email: email,
      name: "Developer User",
      portalUserID: "dev-portal-user-456",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYtYXV0aDAtaWQiLCJlbWFpbCI6ImRldkBwb2t0LmFpIiwiZXhwIjo5OTk5OTk5OTl9.signature", // Mock JWT with far future expiration
      user: {
        id: "c5d518cb-aaf6-448e-8ab4-e001b215797f",
        email: email,
        name: "Developer User",
        portalUserID: "dev-portal-user-456",
        auth0ID: "dev-auth0-id",
        email_verified: true, // Required by requireUser
      }
    }

    return createUserSession({
      request,
      userId: user.id,
      remember: false,
      redirectTo: "/dev-success",
    })
  }

  console.log("Invalid credentials")
  return json({ error: "Invalid credentials" }, { status: 400 })
}

export async function loader() {
  return json({ message: "Development login endpoint" })
} 