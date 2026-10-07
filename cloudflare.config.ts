import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "e1909c4d4aec0a75a0a34fc15ee35482",
  worker: {
    name: "mathland-migration-preview",
    compatibilityDate: "2026-10-07",
    workersDev: true,
    observability: {
      enabled: true,
      traces: { enabled: true, headSamplingRate: 0.01 },
    },
    assets: { notFoundHandling: "single-page-application" },
  },
});
