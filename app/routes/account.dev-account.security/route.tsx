import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, Grid, Badge, Switch } from "@mantine/core"
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

export default function DevSecurityRoute() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">Security Settings</Title>
          <Text color="dimmed" size="sm">
            Manage security settings and access controls for your applications
          </Text>
        </div>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">API Security</Title>
          <Stack gap="md">
            <div>
              <Text size="sm" color="dimmed">Secret Key Required</Text>
              <Switch defaultChecked={false} />
              <Text size="xs" color="dimmed">Require secret key for all API requests</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">Rate Limiting</Text>
              <Switch defaultChecked={true} />
              <Text size="xs" color="dimmed">Enable rate limiting on API endpoints</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">IP Whitelisting</Text>
              <Switch defaultChecked={false} />
              <Text size="xs" color="dimmed">Restrict access to specific IP addresses</Text>
            </div>
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Whitelist Configuration</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Text size="sm" color="dimmed">Origin Whitelist</Text>
                  <Text fw={500}>No origins whitelisted</Text>
                  <Text size="xs" color="dimmed">Allow requests from specific origins</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">User Agent Whitelist</Text>
                  <Text fw={500}>No user agents whitelisted</Text>
                  <Text size="xs" color="dimmed">Allow requests from specific user agents</Text>
                </div>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Text size="sm" color="dimmed">Contract Whitelist</Text>
                  <Text fw={500}>No contracts whitelisted</Text>
                  <Text size="xs" color="dimmed">Allow requests to specific contracts</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Method Whitelist</Text>
                  <Text fw={500}>No methods whitelisted</Text>
                  <Text size="xs" color="dimmed">Allow specific RPC methods</Text>
                </div>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Access Control</Title>
          <Stack gap="md">
            {mockAccount.portalApps.map((app) => (
              <Card key={app.id} withBorder p="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{app.name}</Text>
                    <Text size="sm" color="dimmed">ID: {app.id}</Text>
                  </div>
                  <Group>
                    <Badge color="green">Active</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </Group>
                </Group>
                <Stack gap="sm" mt="md">
                  <div>
                    <Text size="sm" color="dimmed">Secret Key</Text>
                    <Text size="xs" style={{ fontFamily: "monospace" }}>{app.settings.secretKey}</Text>
                  </div>
                  <div>
                    <Text size="sm" color="dimmed">Environment</Text>
                    <Badge size="sm">{app.settings.environment}</Badge>
                  </div>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Security Events</Title>
          <Stack gap="md">
            <Card withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Failed Authentication</Text>
                  <Text size="sm" color="dimmed">Invalid secret key used</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text size="sm" color="dimmed">2 hours ago</Text>
                  <Badge color="red" size="sm">High</Badge>
                </div>
              </Group>
            </Card>
            <Card withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Rate Limit Exceeded</Text>
                  <Text size="sm" color="dimmed">Too many requests from IP</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text size="sm" color="dimmed">5 hours ago</Text>
                  <Badge color="yellow" size="sm">Medium</Badge>
                </div>
              </Group>
            </Card>
            <Card withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>New Application Created</Text>
                  <Text size="sm" color="dimmed">Application 'Staging' was created</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text size="sm" color="dimmed">1 day ago</Text>
                  <Badge color="blue" size="sm">Info</Badge>
                </div>
              </Group>
            </Card>
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Security Actions</Title>
          <Group>
            <Button variant="outline">
              Regenerate All Keys
            </Button>
            <Button variant="outline">
              Export Security Log
            </Button>
            <Button variant="outline">
              Set Up Alerts
            </Button>
            <Button variant="outline">
              Security Audit
            </Button>
          </Group>
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