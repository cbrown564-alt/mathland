import fs from "node:fs";
import path from "node:path";

const assets = path.resolve(".cloudflare/output/v0/workers/default/assets");
for (const file of ["index.html", "health.json", "runtime-config.js", "audio/world/vera-projection-lens.mp3", "world/vera.png"]) {
  if (!fs.existsSync(path.join(assets, file))) throw new Error(`Cloudflare build is missing ${file}`);
}
fs.copyFileSync("deploy/cloudflare-preview.headers", path.join(assets, "_headers"));
console.log("Cloudflare preview assets and headers prepared; analytics configuration unchanged.");
