import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, Grid, Badge } from "@mantine/core"
import { Link, useParams } from "@remix-run/react"
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

export default function DevAppRoute() {
  const { appId } = useParams()
  const app = mockAccount.portalApps.find(a => a.id === appId)

  if (!app) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <Title order={1}>Application Not Found</Title>
          <Text>Application with ID {appId} not found.</Text>
          <Button component={Link} to="/account/dev-account" variant="outline">
            Back to Dashboard
          </Button>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">{app.name}</Title>
          <Text color="dimmed" size="sm">
            Application ID: {app.id}
          </Text>
        </div>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Application Details</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" color="dimmed">Name</Text>
              <Text fw={500}>{app.name}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" color="dimmed">Environment</Text>
              <Badge>{app.settings.environment}</Badge>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" color="dimmed">Secret Key</Text>
              <Text fw={500} style={{ fontFamily: "monospace" }}>{app.settings.secretKey}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" color="dimmed">Created</Text>
              <Text fw={500}>{app.createdAt}</Text>
            </Grid.Col>
          </Grid>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Application Actions</Title>
          <Group>
            <Button component={Link} to={`/account/dev-account/${app.id}/keys`} variant="outline">
              View Keys
            </Button>
            <Button component={Link} to={`/account/dev-account/${app.id}/logs`} variant="outline">
              View Logs
            </Button>
            <Button component={Link} to={`/account/dev-account/${app.id}/insights`} variant="outline">
              Insights
            </Button>
            <Button component={Link} to={`/account/dev-account/${app.id}/security`} variant="outline">
              Security
            </Button>
          </Group>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">AAT (Application Authentication Token)</Title>
          {app.aats.map((aat) => (
            <Card key={aat.protocolAppID} withBorder p="md" mb="md">
              <Stack gap="sm">
                <div>
                  <Text size="sm" color="dimmed">Protocol App ID</Text>
                  <Text fw={500} style={{ fontFamily: "monospace" }}>{aat.protocolAppID}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Public Key</Text>
                  <Text size="xs" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{aat.aat.publicKey}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Address</Text>
                  <Text size="xs" style={{ fontFamily: "monospace" }}>{aat.aat.address}</Text>
                </div>
              </Stack>
            </Card>
          ))}
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