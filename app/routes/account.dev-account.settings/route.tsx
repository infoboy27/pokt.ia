import { json } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group } from "@mantine/core"
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

export default function DevSettingsRoute() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">Account Settings</Title>
          <Text color="dimmed" size="sm">
            Development environment settings page
          </Text>
        </div>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Account Information</Title>
          <Stack gap="md">
            <div>
              <Text size="sm" color="dimmed">Account Name</Text>
              <Text fw={500}>{mockAccount.name}</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">Plan Type</Text>
              <Text fw={500}>{mockAccount.planType}</Text>
            </div>
            <div>
              <Text size="sm" color="dimmed">Created</Text>
              <Text fw={500}>{mockAccount.createdAt}</Text>
            </div>
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Development Features</Title>
          <Stack gap="md">
            <Group>
              <Button component={Link} to="/account/dev-account/settings/members" variant="outline">
                Manage Members
              </Button>
              <Button component={Link} to="/account/dev-account/settings/notifications" variant="outline">
                Notifications
              </Button>
              <Button component={Link} to="/account/dev-account/settings/plan" variant="outline">
                Plan Settings
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