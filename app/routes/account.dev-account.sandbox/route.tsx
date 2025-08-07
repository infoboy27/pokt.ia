import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, Textarea, Select, Grid } from "@mantine/core"
import { Link } from "@remix-run/react"
import { mockAccount } from "~/models/portal/portal.data"
import { getUserId } from "~/utils/user.server"

export async function loader({ request }: { request: Request }) {
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

export default function DevSandboxRoute() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">API Sandbox</Title>
          <Text color="dimmed" size="sm">
            Test your API calls in the development environment
          </Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="xl">
              <Title order={2} mb="lg">Request</Title>
              <Stack gap="md">
                <Select
                  label="HTTP Method"
                  data={[
                    { value: "GET", label: "GET" },
                    { value: "POST", label: "POST" },
                    { value: "PUT", label: "PUT" },
                    { value: "DELETE", label: "DELETE" }
                  ]}
                  defaultValue="POST"
                />
                
                <Select
                  label="Endpoint"
                  data={[
                    { value: "/graphql", label: "GraphQL" },
                    { value: "/v1/query/height", label: "Query Height" },
                    { value: "/v1/query/account", label: "Query Account" }
                  ]}
                  defaultValue="/graphql"
                />
                
                <Textarea
                  label="Request Body"
                  placeholder="Enter your request body (JSON)"
                  rows={8}
                  defaultValue={`{
  "query": "query { users { id email name } }"
}`}
                />
                
                <Button variant="filled" color="green">
                  Send Request
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="xl">
              <Title order={2} mb="lg">Response</Title>
              <Stack gap="md">
                <div>
                  <Text size="sm" color="dimmed">Status Code</Text>
                  <Text fw={500} color="green">200 OK</Text>
                </div>
                
                <div>
                  <Text size="sm" color="dimmed">Response Time</Text>
                  <Text fw={500}>245ms</Text>
                </div>
                
                <Textarea
                  label="Response Body"
                  placeholder="Response will appear here"
                  rows={8}
                  readOnly
                  defaultValue={`{
  "data": {
    "users": [
      {
        "id": "dev-user-123",
        "email": "dev@pokt.ai",
        "name": "Development User"
      }
    ]
  }
}`}
                />
                
                <Group>
                  <Button variant="outline" size="sm">
                    Copy Response
                  </Button>
                  <Button variant="outline" size="sm">
                    Clear
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Sample Requests</Title>
          <Stack gap="md">
            <Card withBorder p="md">
              <Text fw={500} mb="sm">GraphQL Query</Text>
              <Text size="sm" color="dimmed" mb="sm">Query user accounts</Text>
              <Text size="xs" style={{ fontFamily: "monospace" }}>
                POST /graphql<br/>
                {`{ "query": "query { users { id email name } }" }`}
              </Text>
            </Card>
            
            <Card withBorder p="md">
              <Text fw={500} mb="sm">Blockchain Query</Text>
              <Text size="sm" color="dimmed" mb="sm">Get blockchain height</Text>
              <Text size="xs" style={{ fontFamily: "monospace" }}>
                GET /v1/query/height<br/>
                Headers: {`{ "Authorization": "Bearer YOUR_SECRET_KEY" }`}
              </Text>
            </Card>
            
            <Card withBorder p="md">
              <Text fw={500} mb="sm">Account Query</Text>
              <Text size="sm" color="dimmed" mb="sm">Get account information</Text>
              <Text size="xs" style={{ fontFamily: "monospace" }}>
                GET /v1/query/account<br/>
                Headers: {`{ "Authorization": "Bearer YOUR_SECRET_KEY" }`}
              </Text>
            </Card>
          </Stack>
        </Card>

        <Group>
          <Button component={Link} to="/account/dev-account" variant="outline">
            Back to Dashboard
          </Button>
        </Group>
      </Stack>
    </Container>
  )
} 