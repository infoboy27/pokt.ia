import { json } from "@remix-run/node"
import { mockAccount } from "~/models/portal/portal.data"

export async function loader() {
  // Return mock account data
  return json({
    account: mockAccount,
    success: true,
  })
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const action = formData.get("action")

  switch (action) {
    case "getAccount":
      return json({
        account: mockAccount,
        success: true,
      })
    
    case "getApps":
      return json({
        apps: mockAccount.portalApps,
        success: true,
      })
    
    case "getMembers":
      return json({
        members: mockAccount.accountUsers,
        success: true,
      })
    
    default:
      return json({
        success: false,
        error: "Unknown action",
      })
  }
} 