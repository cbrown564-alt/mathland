import { cloudflare } from "@cloudflare/vite-plugin";
import { mergeConfig } from "vite";
import base from "./vite.config";

// Keep the existing dist/container build while preparing the Cloudflare target.
export default mergeConfig(base, { plugins: [cloudflare()] });
