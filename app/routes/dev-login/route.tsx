import { Form } from "@remix-run/react"

export default function DevLoginRoute() {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      flexDirection: "column"
    }}>
      <div style={{ 
        padding: "40px", 
        border: "1px solid #ccc", 
        borderRadius: "8px",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1>Development Login</h1>
        <p>Use any email and password to login in development mode.</p>
        
        <Form method="post" action="/api/dev-login" onSubmit={() => console.log("Form submitted")}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              style={{ 
                width: "100%", 
                padding: "8px", 
                border: "1px solid #ccc", 
                borderRadius: "4px" 
              }}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              style={{ 
                width: "100%", 
                padding: "8px", 
                border: "1px solid #ccc", 
                borderRadius: "4px" 
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Login (Development Mode)
          </button>
        </Form>
      </div>
    </div>
  )
} 