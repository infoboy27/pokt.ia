import { Title, Stack, Button } from "@mantine/core"
import { Link, useParams } from "@remix-run/react"
import React, { useMemo } from "react"
import ChainSandbox from "app/components/ChainSandbox"
import { ChainSandboxProvider } from "~/components/ChainSandbox/state"
import { DEFAULT_EVM_METHOD } from "~/components/ChainSandbox/state/stateReducer"
import { EmptyState } from "~/components/EmptyState"
import { Blockchain, PortalApp, RoleName } from "~/models/portal/sdk"
import { isEvmChain } from "~/utils/chainUtils"

type SandboxViewProps = {
  portalApps: PortalApp[]
  blockchains: Blockchain[]
  userRole: RoleName
}

const SandboxView = ({ portalApps, blockchains, userRole }: SandboxViewProps) => {
  const { accountId } = useParams()

  const apps = useMemo(() => {
    return portalApps.sort((a, b) => (a.name > b.name ? 1 : -1))
  }, [portalApps])

  return apps.length === 0 ? (
    <EmptyState
      alt="Empty sandbox view placeholder"
      callToAction={
        userRole !== RoleName.Member ? (
          <Button
            component={Link}
            mt="xs"
            prefetch="intent"
            to={`/account/${accountId}/create`}
          >
            New Application
          </Button>
        ) : null
      }
      imgHeight={131}
      imgSrc="/sandbox-empty-state.svg"
      imgWidth={186}
      subtitle="Use the sandbox to test RPC calls and responses. Create an application to get started."
              title="POKT.ai Sandbox"
    />
  ) : (
    <Stack gap="xl">
      <Title order={2}>Sandbox</Title>
      <ChainSandboxProvider
        initialStateValue={{
          selectedApp: apps[0],
          selectedChain: blockchains[0],
          selectedMethod: isEvmChain(blockchains[0]) ? DEFAULT_EVM_METHOD : "",
        }}
      >
        <ChainSandbox apps={apps} chains={blockchains} />
      </ChainSandboxProvider>
    </Stack>
  )
}

export default SandboxView
