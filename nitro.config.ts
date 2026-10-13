import { defineConfig } from "nitro";

export default defineConfig({
  // Bundle the Netlify server dependencies to avoid filesystem tracing on Windows.
  // Lovable keeps its existing Cloudflare build configuration.
  ...(process.env.NITRO_PRESET === "netlify" ? { noExternals: true } : {}),
});
