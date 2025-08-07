import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, Grid, Badge, Code } from "@mantine/core"
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

export default function DevAppKeysRoute() {
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
          <Title order={1} mb="md">Application Keys - {app.name}</Title>
          <Text color="dimmed" size="sm">
            Manage your application keys and authentication tokens
          </Text>
        </div>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Secret Key</Title>
          <Stack gap="md">
            <div>
              <Text size="sm" color="dimmed">Application Secret Key</Text>
              <Code block>{app.settings.secretKey}</Code>
            </div>
            <Group>
              <Button variant="outline" size="sm">
                Copy Secret Key
              </Button>
              <Button variant="outline" size="sm" color="orange">
                Regenerate Secret Key
              </Button>
            </Group>
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">AAT (Application Authentication Token)</Title>
          {app.aats.map((aat) => (
            <Card key={aat.protocolAppID} withBorder p="md" mb="md">
              <Stack gap="md">
                <div>
                  <Text size="sm" color="dimmed">Protocol App ID</Text>
                  <Code block>{aat.protocolAppID}</Code>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Public Key</Text>
                  <Code block style={{ wordBreak: "break-all" }}>{aat.aat.publicKey}</Code>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Address</Text>
                  <Code block>{aat.aat.address}</Code>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Client Public Key</Text>
                  <Code block style={{ wordBreak: "break-all" }}>{aat.aat.clientPublicKey}</Code>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Signature</Text>
                  <Code block style={{ wordBreak: "break-all" }}>{aat.aat.signature}</Code>
                </div>
                <div>
                  <Text size="sm" color="dimmed">Version</Text>
                  <Badge>{aat.aat.version}</Badge>
                </div>
                <Group>
                  <Button variant="outline" size="sm">
                    Copy AAT
                  </Button>
                  <Button variant="outline" size="sm" color="orange">
                    Regenerate AAT
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">API Endpoints</Title>
          <Stack gap="md">
            <div>
              <Text size="sm" color="dimmed">GraphQL Endpoint</Text>
              <Code block>https://backend.staging.portal.pokt.network/graphql</Code>
            </div>
            <div>
              <Text size="sm" color="dimmed">REST Endpoint</Text>
              <Code block>https://backend.staging.portal.pokt.network</Code>
            </div>
            <Group>
              <Button variant="outline" size="sm">
                Copy Endpoints
              </Button>
              <Button component={Link} to="/account/dev-account/sandbox" variant="outline" size="sm">
                Test in Sandbox
              </Button>
            </Group>
          </Stack>
        </Card>

        <Group>
          <Button component={Link} to={`/account/dev-account/${appId}`} variant="outline">
            Back to Application
          </Button>
          <Button component={Link} to="/account/dev-account" variant="outline">
            Back to Dashboard
          </Button>
        </Group>
      </Stack>
    </Container>
  )
} 