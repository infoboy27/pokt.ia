import { LoaderFunction, redirect } from "@remix-run/node"

export const loader: LoaderFunction = async () => {
  return redirect("/docs/introduction/what-is-the-portal")
}
