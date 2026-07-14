import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const failures = [];

for (const required of ["index.html", "health.json", "audio/world/vera-projection-lens.mp3", "world/vera.png"]) {
  if (!fs.existsSync(path.join(dist, required))) failures.push(`dist/${required} is missing`);
}

if (fs.existsSync(path.join(dist, "index.html"))) {
  const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  if (/lovable\.dev|fonts\.googleapis\.com/.test(html)) failures.push("Production HTML contains a retired third-party runtime dependency");
}

const publicFiles = fs.readdirSync(path.join(root, "public"), { recursive: true });
const publicBytes = publicFiles.reduce((total, relative) => {
  const absolute = path.join(root, "public", relative);
  return total + (fs.statSync(absolute).isFile() ? fs.statSync(absolute).size : 0);
}, 0);
if (publicBytes > 5 * 1024 * 1024) failures.push(`Production public assets exceed 5 MiB (${Math.round(publicBytes / 1024 / 1024)} MiB)`);

for (const required of ["Dockerfile", "deploy/nginx.conf", "docs/operations/PRODUCTION_RUNBOOK.md", "docs/archive/legacy-product/RETIREMENT_RECORD.md"]) {
  if (!fs.existsSync(path.join(root, required))) failures.push(`${required} is missing`);
}

if (failures.length) {
  console.error(`Production readiness failed (${failures.length}):\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}
console.log(`Production readiness passed; public runtime assets are ${(publicBytes / 1024 / 1024).toFixed(2)} MiB.`);
