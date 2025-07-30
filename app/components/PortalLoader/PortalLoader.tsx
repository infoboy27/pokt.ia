import { Box, Stack, Text } from "@mantine/core"
import React from "react"
import { ClientOnly } from "remix-utils/client-only"
import poktTreeAnimation from "./pokt-tree.json"

type PortalLoaderProps = {
  message?: string
  size?: "md" | "lg"
  loaderAnimation?: Record<string, unknown>
}

const LOADER_SIZE = {
  md: 180,
  lg: 380,
}

const PortalLoader = ({
  message,
  size = "md",
      loaderAnimation = poktTreeAnimation,
}: PortalLoaderProps) => {
  return (
    <ClientOnly
      fallback={
        <Stack align="center" justify="center">
          <Box aria-labelledby="POKT.ia loading animation">Loading...</Box>
          {message && <Text> {message} </Text>}
        </Stack>
      }
    >
      {() => (
        <ClientSideLottie
          message={message}
          size={size}
          loaderAnimation={loaderAnimation}
        />
      )}
    </ClientOnly>
  )
}

// This component only renders on the client side
function ClientSideLottie({ message, size = "md", loaderAnimation }: PortalLoaderProps) {
  const [lottieModule, setLottieModule] = React.useState<any>(null)
  const [lottieView, setLottieView] = React.useState<any>(null)

  React.useEffect(() => {
    // Dynamic import for client-side only
    import("lottie-react").then((module) => {
      setLottieModule(module)
    })
  }, [])

  React.useEffect(() => {
    if (lottieModule) {
      const { useLottie } = lottieModule
      // We can't use useLottie hook here, so we'll create the animation manually
      try {
        const lottieInstance = lottieModule.default
        setLottieView(
          React.createElement(lottieInstance, {
            animationData: loaderAnimation,
            loop: true,
            autoplay: true,
            style: { height: LOADER_SIZE[size] }
          })
        )
      } catch (error) {
        console.error("Error creating Lottie animation:", error)
      }
    }
  }, [lottieModule, loaderAnimation, size])

  return (
    <Stack align="center" justify="center">
              <Box aria-labelledby="POKT.ia loading animation">
        {lottieView || "Loading..."}
      </Box>
      {message && <Text> {message} </Text>}
    </Stack>
  )
}

export default PortalLoader
