import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: ["@uiw/codemirror-theme-xcode", "@uiw/codemirror-themes"],
  },
  optimizeDeps: {
    include: ["@uiw/codemirror-theme-xcode", "@uiw/codemirror-themes"],
  },
})
