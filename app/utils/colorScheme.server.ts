import { createCookieSessionStorage } from "@remix-run/node"
import { ColorScheme } from "~/root"
import { getRequiredServerEnvVar } from "./environment"

const sessionSecret = getRequiredServerEnvVar("SESSION_SECRET")

const colorSchemeStorage = createCookieSessionStorage({
  cookie: {
    name: "pokt_color_scheme",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
})

async function getColorSchemeSession(request: Request) {
  const session = await colorSchemeStorage.getSession(request.headers.get("Cookie"))
  return {
    getColorScheme: (): ColorScheme => {
      return session.get("mantine-color-scheme")
    },
    setColorScheme: (colorScheme: ColorScheme) =>
      session.set("mantine-color-scheme", colorScheme),
    commit: () => colorSchemeStorage.commitSession(session),
  }
}

export { getColorSchemeSession }
