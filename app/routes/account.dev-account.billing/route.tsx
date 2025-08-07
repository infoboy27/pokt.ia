import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, Grid, Badge, Progress } from "@mantine/core"
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

export default function DevBillingRoute() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">Billing & Usage</Title>
          <Text color="dimmed" size="sm">
            View your billing information and usage statistics
          </Text>
        </div>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Current Plan</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Text size="sm" color="dimmed">Plan Type</Text>
                  <Text fw={500}>{mockAccount.planType}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Monthly Limit</Text>
                  <Text fw={500}>{mockAccount.plan.monthlyRelayLimit.toLocaleString()} relays</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Daily Limit</Text>
                  <Text fw={500}>{mockAccount.plan.dailyLimit.toLocaleString()} relays</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">App Limit</Text>
                  <Text fw={500}>{mockAccount.plan.appLimit === 0 ? "Unlimited" : mockAccount.plan.appLimit}</Text>
                </div>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Text size="sm" color="dimmed">Throughput Limit</Text>
                  <Text fw={500}>{mockAccount.plan.throughputLimit} requests/second</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Account Status</Text>
                  <Badge color="green">Active</Badge>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Next Billing Date</Text>
                  <Text fw={500}>February 15, 2024</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Amount Due</Text>
                  <Text fw={500} color="green">$0.00 (Free Plan)</Text>
                </div>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Usage This Month</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <div>
                <Text size="sm" color="dimmed" mb="xs">Relay Usage</Text>
                <Text fw={500} size="xl">45,231 / 100,000</Text>
                <Progress value={45.2} color="blue" mt="xs" />
                <Text size="xs" color="dimmed" mt="xs">45.2% of monthly limit</Text>
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <div>
                <Text size="sm" color="dimmed" mb="xs">Daily Average</Text>
                <Text fw={500} size="xl">1,507 relays/day</Text>
                <Progress value={75.4} color="green" mt="xs" />
                <Text size="xs" color="dimmed" mt="xs">75.4% of daily limit</Text>
              </div>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Usage by Application</Title>
          <Stack gap="md">
            {mockAccount.portalApps.map((app) => (
              <Card key={app.id} withBorder p="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{app.name}</Text>
                    <Text size="sm" color="dimmed">ID: {app.id}</Text>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Text fw={500}>25,847 relays</Text>
                    <Text size="sm" color="dimmed">57.1% of total</Text>
                  </div>
                </Group>
                <Progress value={57.1} color="blue" mt="sm" />
              </Card>
            ))}
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Usage by Blockchain</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="md">
                <Text fw={500}>Ethereum</Text>
                <Text size="xl" fw={500}>18,432</Text>
                <Text size="sm" color="dimmed">40.7% of usage</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="md">
                <Text fw={500}>BSC</Text>
                <Text size="xl" fw={500}>12,847</Text>
                <Text size="sm" color="dimmed">28.4% of usage</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder p="md">
                <Text fw={500}>Polygon</Text>
                <Text size="xl" fw={500}>8,952</Text>
                <Text size="sm" color="dimmed">19.8% of usage</Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Billing Actions</Title>
          <Group>
            <Button variant="outline">
              View Invoice History
            </Button>
            <Button variant="outline">
              Download Usage Report
            </Button>
            <Button variant="outline">
              Update Payment Method
            </Button>
            <Button variant="outline">
              Contact Support
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