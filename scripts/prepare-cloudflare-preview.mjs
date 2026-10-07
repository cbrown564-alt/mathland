import fs from "node:fs";
import path from "node:path";

const assets = path.resolve(".cloudflare/output/v0/workers/default/assets");
for (const file of ["index.html", "health.json", "runtime-config.js", "audio/world/vera-projection-lens.mp3", "world/vera.png"]) {
  if (!fs.existsSync(path.join(assets, file))) throw new Error(`Cloudflare build is missing ${file}`);
}
const { buildContext: { mode } } = JSON.parse(fs.readFileSync(".cloudflare/output/v0/config.json", "utf8"));
if (!["production", "migration-preview"].includes(mode)) throw new Error(`Unexpected deployment mode: ${mode}`);
const headers = fs.readFileSync("deploy/cloudflare-preview.headers", "utf8");
fs.writeFileSync(path.join(assets, "_headers"), mode === "production" ? headers.replace(/^  X-Robots-Tag:.*\n/gm, "") : headers);
console.log(`Cloudflare ${mode} assets and headers prepared; analytics configuration unchanged.`);
