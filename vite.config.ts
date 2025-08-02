import { vitePlugin as remix } from "@remix-run/dev"
import { installGlobals } from "@remix-run/node"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

installGlobals()

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    remix(),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: ["@uiw/codemirror-theme-xcode", "@uiw/codemirror-themes", "dayjs"],
  },
  optimizeDeps: {
    include: ["@uiw/codemirror-theme-xcode", "@uiw/codemirror-themes", "dayjs"],
  },
})
