import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, Grid, Badge, Code, TextInput, Select } from "@mantine/core"
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

export default function DevLogsRoute() {
  const mockLogs = [
    {
      id: "1",
      timestamp: "2024-01-15T10:30:45Z",
      level: "INFO",
      application: "Prod",
      message: "Relay request processed successfully",
      details: {
        blockchain: "ETH",
        method: "eth_getBalance",
        responseTime: "245ms"
      }
    },
    {
      id: "2",
      timestamp: "2024-01-15T10:29:32Z",
      level: "WARN",
      application: "Staging",
      message: "Rate limit approaching",
      details: {
        blockchain: "BSC",
        method: "eth_call",
        responseTime: "189ms"
      }
    },
    {
      id: "3",
      timestamp: "2024-01-15T10:28:15Z",
      level: "ERROR",
      application: "Prod",
      message: "Blockchain node timeout",
      details: {
        blockchain: "POLY",
        method: "eth_getBlockByNumber",
        responseTime: "5000ms"
      }
    },
    {
      id: "4",
      timestamp: "2024-01-15T10:27:08Z",
      level: "INFO",
      application: "Staging",
      message: "New application created",
      details: {
        appId: "7329bb69",
        appName: "Staging",
        environment: "production"
      }
    },
    {
      id: "5",
      timestamp: "2024-01-15T10:26:42Z",
      level: "INFO",
      application: "Prod",
      message: "AAT token generated",
      details: {
        protocolAppId: "39fa1bea",
        publicKey: "639b63fadbf4f77d796e74f4e599548c310f056abc7dee80f4624e60c8c4bbf9"
      }
    }
  ]

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">Application Logs</Title>
          <Text color="dimmed" size="sm">
            View and filter application logs in the development environment
          </Text>
        </div>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Filters</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Application"
                placeholder="Select application"
                data={[
                  { value: "all", label: "All Applications" },
                  { value: "4118f1ae", label: "Prod" },
                  { value: "7329bb69", label: "Staging" }
                ]}
                defaultValue="all"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Log Level"
                placeholder="Select log level"
                data={[
                  { value: "all", label: "All Levels" },
                  { value: "INFO", label: "INFO" },
                  { value: "WARN", label: "WARN" },
                  { value: "ERROR", label: "ERROR" }
                ]}
                defaultValue="all"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Search"
                placeholder="Search logs..."
              />
            </Grid.Col>
          </Grid>
          <Group mt="md">
            <Button variant="filled" color="blue">
              Apply Filters
            </Button>
            <Button variant="outline">
              Clear Filters
            </Button>
            <Button variant="outline">
              Export Logs
            </Button>
          </Group>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Recent Logs</Title>
          <Stack gap="md">
            {mockLogs.map((log) => (
              <Card key={log.id} withBorder p="md">
                <Group justify="space-between" mb="sm">
                  <Group>
                    <Badge 
                      color={
                        log.level === "ERROR" ? "red" : 
                        log.level === "WARN" ? "yellow" : "green"
                      }
                    >
                      {log.level}
                    </Badge>
                    <Text size="sm" color="dimmed">{log.application}</Text>
                    <Text size="sm" color="dimmed">{log.timestamp}</Text>
                  </Group>
                  <Button variant="outline" size="xs">
                    View Details
                  </Button>
                </Group>
                <Text mb="sm">{log.message}</Text>
                <Code block size="xs">
                  {JSON.stringify(log.details, null, 2)}
                </Code>
              </Card>
            ))}
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Log Statistics</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Total Logs</Text>
                <Text fw={500} size="xl">1,247</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Errors</Text>
                <Text fw={500} size="xl" color="red">23</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Warnings</Text>
                <Text fw={500} size="xl" color="yellow">156</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder p="md">
                <Text size="sm" color="dimmed">Success Rate</Text>
                <Text fw={500} size="xl" color="green">98.2%</Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Log Configuration</Title>
          <Stack gap="md">
            <div>
              <Text size="sm" color="dimmed">Log Retention</Text>
              <Text fw={500}>30 days</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">Log Level</Text>
              <Text fw={500}>INFO</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">Export Format</Text>
              <Text fw={500}>JSON</Text>
            </div>
            <Group>
              <Button variant="outline" size="sm">
                Configure Logging
              </Button>
              <Button variant="outline" size="sm">
                Set Alerts
              </Button>
            </Group>
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