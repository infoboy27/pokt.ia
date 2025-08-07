import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, Grid, Badge } from "@mantine/core"
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

export default function DevInsightsRoute() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">Insights & Analytics</Title>
          <Text color="dimmed" size="sm">
            View detailed analytics and insights for your applications
          </Text>
        </div>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Performance Overview</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Total Requests</Text>
                <Text fw={500} size="xl">1,247,892</Text>
                <Text size="sm" color="green">+12.5% from last month</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Success Rate</Text>
                <Text fw={500} size="xl">98.7%</Text>
                <Text size="sm" color="green">+0.3% from last month</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Avg Response Time</Text>
                <Text fw={500} size="xl">245ms</Text>
                <Text size="sm" color="red">+15ms from last month</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Active Applications</Text>
                <Text fw={500} size="xl">{mockAccount.portalApps.length}</Text>
                <Text size="sm" color="green">+1 from last month</Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Top Performing Applications</Title>
          <Stack gap="md">
            {mockAccount.portalApps.map((app, index) => (
              <Card key={app.id} withBorder p="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{app.name}</Text>
                    <Text size="sm" color="dimmed">ID: {app.id}</Text>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Text fw={500}>{index === 0 ? "892,456" : "355,436"} requests</Text>
                    <Text size="sm" color="dimmed">{index === 0 ? "99.2%" : "98.1%"} success rate</Text>
                  </div>
                </Group>
                <Group mt="sm">
                  <Badge color="blue">Ethereum</Badge>
                  <Badge color="green">BSC</Badge>
                  <Badge color="purple">Polygon</Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Blockchain Usage</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="md">
                <Text fw={500} mb="xs">Ethereum</Text>
                <Text size="xl" fw={500}>892,456</Text>
                <Text size="sm" color="dimmed">71.5% of total requests</Text>
                <Text size="sm" color="green">+8.2% from last month</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="md">
                <Text fw={500} mb="xs">BSC</Text>
                <Text size="xl" fw={500}>245,123</Text>
                <Text size="sm" color="dimmed">19.7% of total requests</Text>
                <Text size="sm" color="green">+12.1% from last month</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="md">
                <Text fw={500} mb="xs">Polygon</Text>
                <Text size="xl" fw={500}>110,313</Text>
                <Text size="sm" color="dimmed">8.8% of total requests</Text>
                <Text size="sm" color="red">-2.3% from last month</Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Error Analysis</Title>
          <Stack gap="md">
            <Card withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Timeout Errors</Text>
                  <Text size="sm" color="dimmed">Blockchain node timeouts</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text fw={500} color="red">1,247</Text>
                  <Text size="sm" color="dimmed">0.1% of total requests</Text>
                </div>
              </Group>
            </Card>
            <Card withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Rate Limit Errors</Text>
                  <Text size="sm" color="dimmed">Rate limit exceeded</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text fw={500} color="orange">892</Text>
                  <Text size="sm" color="dimmed">0.07% of total requests</Text>
                </div>
              </Group>
            </Card>
            <Card withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Invalid Requests</Text>
                  <Text size="sm" color="dimmed">Malformed requests</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text fw={500} color="yellow">456</Text>
                  <Text size="sm" color="dimmed">0.04% of total requests</Text>
                </div>
              </Group>
            </Card>
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Insights Actions</Title>
          <Group>
            <Button variant="outline">
              Export Analytics
            </Button>
            <Button variant="outline">
              Set Up Alerts
            </Button>
            <Button variant="outline">
              Custom Reports
            </Button>
            <Button variant="outline">
              Performance Optimization
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