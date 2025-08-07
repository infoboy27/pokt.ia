import { json, redirect } from "@remix-run/node"
import { Container, Stack, Title, Text, Card, Button, Group, TextInput, Select, Textarea, useActionData, useNavigation } from "@mantine/core"
import { Link, Form } from "@remix-run/react"
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

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const appName = formData.get("appName") as string
  const description = formData.get("description") as string
  const environment = formData.get("environment") as string
  const emoji = formData.get("emoji") as string
  
  // In development, we'll simulate creating an app
  console.log("Creating application:", { appName, description, environment, emoji })
  
  // Redirect back to dashboard with success message
  return redirect("/account/dev-account?created=true")
}

export default function DevCreateAppRoute() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">Create New Application</Title>
          <Text color="dimmed" size="sm">
            Development environment - Create a new application
          </Text>
        </div>

        <Form method="post">
          <Stack gap="xl">
            <Card withBorder p="xl">
              <Title order={2} mb="lg">Application Details</Title>
              <Stack gap="md">
                <TextInput
                  name="appName"
                  label="Application Name"
                  placeholder="Enter application name"
                  required
                />
                
                <Textarea
                  name="description"
                  label="Description"
                  placeholder="Describe your application"
                  rows={3}
                />
                
                <Select
                  name="environment"
                  label="Environment"
                  placeholder="Select environment"
                  data={[
                    { value: "production", label: "Production" },
                    { value: "staging", label: "Staging" },
                    { value: "development", label: "Development" }
                  ]}
                  defaultValue="production"
                />
                
                <Select
                  name="emoji"
                  label="App Emoji"
                  placeholder="Choose an emoji"
                  data={[
                    { value: "1f30d", label: "🌍 Earth" },
                    { value: "1f31f", label: "🌟 Star" },
                    { value: "1f4bb", label: "💻 Computer" },
                    { value: "1f680", label: "🚀 Rocket" },
                    { value: "1f6e0", label: "🛠️ Tools" }
                  ]}
                  defaultValue="1f30d"
                />
              </Stack>
            </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Blockchain Configuration</Title>
          <Text color="dimmed" size="sm" mb="md">
            Select which blockchains this application will use
          </Text>
          <Stack gap="sm">
            {mockAccount.portalApps[0]?.settings.favoritedChainIDs?.length === 0 ? (
              <Text color="dimmed">No blockchains selected</Text>
            ) : (
              <Text>Selected blockchains will appear here</Text>
            )}
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Title order={2} mb="lg">Security Settings</Title>
          <Stack gap="md">
            <TextInput
              label="Secret Key (Optional)"
              placeholder="Enter custom secret key or leave blank for auto-generation"
              type="password"
            />
            
            <Select
              label="Secret Key Required"
              data={[
                { value: "false", label: "No" },
                { value: "true", label: "Yes" }
              ]}
              defaultValue="false"
            />
          </Stack>
        </Card>

            <Group>
              <Button component={Link} to="/account/dev-account" variant="outline">
                Cancel
              </Button>
              <Button type="submit" variant="filled" color="green" loading={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Application"}
              </Button>
            </Group>
          </Stack>
        </Form>
      </Stack>
    </Container>
  )
} 