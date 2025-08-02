import { json, redirect } from "@remix-run/node"
import { mockAccount } from "~/models/portal/portal.data"
import { getUserId } from "~/utils/user.server"

export async function action({ request }: { request: Request }) {
  // Handle POST requests to this route (for development login redirects)
  // Return the same data as the loader instead of redirecting
  const userId = await getUserId(request) || "dev-user-123"
  
  return json({
    account: mockAccount,
    user: {
      id: userId,
      email: "dev@pokt.ai",
      name: "Development User",
      portalUserID: "dev-portal-user-123",
    },
  })
}

export async function loader({ request }: { request: Request }) {
  // In development, we'll use mock data
  const userId = await getUserId(request) || "dev-user-123"
  
  return json({
    account: mockAccount,
    user: {
      id: userId,
      email: "dev@pokt.ai",
      name: "Development User",
      portalUserID: "dev-portal-user-123",
    },
  })
}

export default function DevAccountRoute() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Development Account Dashboard</h1>
      <p>This is a development version using mock data.</p>
      <p>Account: {mockAccount.name}</p>
      <p>Apps: {mockAccount.portalApps.length}</p>
      <p>Members: {mockAccount.accountUsers.length}</p>
    </div>
  )
} 