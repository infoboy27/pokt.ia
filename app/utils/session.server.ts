import {
  Cookie,
  CookieParseOptions,
  CookieSerializeOptions,
  CookieSignatureOptions,
  createCookieSessionStorage,
} from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { getRequiredServerEnvVar } from "./environment"

const cookie:
  | Cookie
  | (CookieParseOptions & CookieSerializeOptions & CookieSignatureOptions) = {
  name: "_session", // use any name you want here
  httpOnly: true, // for security reasons, make this cookie http only
  path: "/", // remember to add this so the cookie will work in all routes
  sameSite: "lax", // this helps with CSRF
  secure: process.env.NODE_ENV === "production", // enable this in prod only
  secrets: [getRequiredServerEnvVar("SESSION_SECRET")], // replace this with an actual secret
}

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie,
})

export const { getSession, commitSession, destroySession } = sessionStorage

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request
  userId: string
  remember: boolean
  redirectTo: string
}) {
  const session = await getSession(request.headers.get("Cookie"))
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  })
}
