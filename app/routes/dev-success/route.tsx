import { json } from "@remix-run/node"
import { getUserId } from "~/utils/user.server"

export async function loader({ request }: { request: Request }) {
  const userId = await getUserId(request)
  
  return json({
    userId,
    message: "Development login successful!"
  })
}

export async function action({ request }: { request: Request }) {
  // Handle POST requests to this route
  return json({ success: true })
}

export default function DevSuccessRoute() {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      flexDirection: "column",
      padding: "20px"
    }}>
      <div style={{ 
        padding: "40px", 
        border: "1px solid #ccc", 
        borderRadius: "8px",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center"
      }}>
        <h1 style={{ color: "#46BD6B" }}>✅ Development Login Successful!</h1>
        <p>You have successfully logged in to the development environment.</p>
        <p><strong>User:</strong> dev@pokt.ai</p>
        <p><strong>Environment:</strong> Development</p>
        
        <div style={{ marginTop: "30px" }}>
          <h3>Next Steps:</h3>
          <ul style={{ textAlign: "left", display: "inline-block" }}>
            <li>You can now access the portal features</li>
            <li>Try navigating to different sections</li>
            <li>Test the application functionality</li>
          </ul>
        </div>
        
        <div style={{ marginTop: "30px" }}>
          <a 
            href="/account" 
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#46BD6B",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              marginRight: "10px"
            }}
          >
            Go to Account
          </a>
          <a 
            href="/" 
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px"
            }}
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  )
} 