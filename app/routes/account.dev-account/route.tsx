import { json, redirect } from "@remix-run/node"
import { Link, useSearchParams } from "@remix-run/react"
import { Button, Card, Container, Grid, Group, Stack, Text, Title, Alert } from "@mantine/core"
import { mockAccount, blockchains } from "~/models/portal/portal.data"
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
  const [searchParams] = useSearchParams()
  const created = searchParams.get("created")

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {created && (
          <Alert color="green" title="Success!">
            Your application has been created successfully! You can now view it in the applications list below.
          </Alert>
        )}
        
        <div>
          <Title order={1} mb="md">Development Portal Dashboard</Title>
          <Text color="dimmed" size="sm">
            Welcome to the POKT.ai Portal development environment. This shows the portal features with mock data.
          </Text>
        </div>

        {/* Account Overview */}
        <Card withBorder p="xl">
          <Title order={2} mb="lg">Account Overview</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="sm" color="dimmed">Account Name</Text>
              <Text fw={500}>{mockAccount.name}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="sm" color="dimmed">Plan Type</Text>
              <Text fw={500}>{mockAccount.planType}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="sm" color="dimmed">Apps</Text>
              <Text fw={500}>{mockAccount.portalApps.length} applications</Text>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Applications */}
        <Card withBorder p="xl">
          <Group justify="space-between" mb="lg">
            <Title order={2}>Applications</Title>
            <Button component={Link} to="/account/dev-account/create" variant="filled">
              New Application
            </Button>
          </Group>
          
          {mockAccount.portalApps.length === 0 ? (
            <Text color="dimmed">No applications yet. Create your first one!</Text>
          ) : (
            <Stack gap="md">
              {mockAccount.portalApps.map((app) => (
                <Card key={app.id} withBorder p="md">
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{app.name}</Text>
                      <Text size="sm" color="dimmed">ID: {app.id}</Text>
                    </div>
                    <Group>
                      <Button component={Link} to={`/account/dev-account/${app.id}`} variant="outline" size="sm">
                        View
                      </Button>
                      <Button component={Link} to={`/account/dev-account/${app.id}/keys`} variant="outline" size="sm">
                        Keys
                      </Button>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Card>

        {/* Team Members */}
        <Card withBorder p="xl">
          <Title order={2} mb="lg">Team Members</Title>
          <Stack gap="md">
            {mockAccount.accountUsers.map((user) => (
              <Group key={user.id} justify="space-between">
                <div>
                  <Text fw={500}>{user.email}</Text>
                  <Text size="sm" color="dimmed">Role: {user.roleName}</Text>
                </div>
                <Text size="sm" color={user.accepted ? "green" : "orange"}>
                  {user.accepted ? "Accepted" : "Pending"}
                </Text>
              </Group>
            ))}
          </Stack>
        </Card>

        {/* Available Blockchains */}
        <Card withBorder p="xl">
          <Title order={2} mb="lg">Available Blockchains</Title>
          <Grid>
            {blockchains.slice(0, 12).map((blockchain) => (
              <Grid.Col key={blockchain.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card withBorder p="sm">
                  <Text fw={500}>{blockchain.ticker}</Text>
                  <Text size="sm" color="dimmed">{blockchain.description}</Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Card>

        {/* Development Navigation */}
        <Card withBorder p="xl">
          <Title order={2} mb="lg">Portal Features</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Button 
                component={Link} 
                to="/account/dev-account/settings" 
                variant="outline" 
                fullWidth
                mb="sm"
              >
                Account Settings
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Button 
                component={Link} 
                to="/account/dev-account/billing" 
                variant="outline" 
                fullWidth
                mb="sm"
              >
                Billing
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Button 
                component={Link} 
                to="/account/dev-account/logs" 
                variant="outline" 
                fullWidth
                mb="sm"
              >
                Logs
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Button 
                component={Link} 
                to="/account/dev-account/sandbox" 
                variant="outline" 
                fullWidth
                mb="sm"
              >
                Sandbox
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Button 
                component={Link} 
                to="/account/dev-account/insights" 
                variant="outline" 
                fullWidth
                mb="sm"
              >
                Insights
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Button 
                component={Link} 
                to="/account/dev-account/security" 
                variant="outline" 
                fullWidth
                mb="sm"
              >
                Security
              </Button>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Development Info */}
        <Card withBorder p="xl" bg="blue.0">
          <Title order={3} mb="md">Development Environment Info</Title>
          <Stack gap="sm">
            <Text size="sm"><strong>Database:</strong> PostgreSQL with sample data</Text>
            <Text size="sm"><strong>GraphQL:</strong> Hasura console available at http://localhost:8080</Text>
            <Text size="sm"><strong>Redis:</strong> Running on localhost:6379</Text>
            <Text size="sm"><strong>Hot Reload:</strong> Code changes auto-reload</Text>
            <Text size="sm"><strong>Mock Data:</strong> Using development mock data</Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
} 