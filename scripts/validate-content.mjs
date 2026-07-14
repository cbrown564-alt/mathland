import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const territorySource = read("src/world/atlas/territories.ts");
const territoryIds = [...territorySource.matchAll(/\{ id: "([a-z-]+)", title:/g)].map((match) => match[1]);
if (territoryIds.length < 3) failures.push("Atlas must expose at least the three promoted territories");
if (new Set(territoryIds).size !== territoryIds.length) failures.push("Atlas territory IDs must be unique");
for (const required of ["components", "magnitude-angle", "dot-product", "projection"]) {
  if (!territoryIds.includes(required)) failures.push(`Atlas is missing required territory ${required}`);
}

const caseSource = read("src/world/cases/cases.ts");
for (const domain of ["engineering", "ai", "finance", "climate"]) {
  if (!new RegExp(`\\n  ${domain}: \\{`).test(caseSource)) failures.push(`World cases are missing ${domain}`);
}

for (const asset of [
  "public/audio/world/vera-projection-lens.mp3",
  "public/world/vera.png",
  "public/mathland-mark.svg",
  "public/health.json",
]) {
  if (!fs.existsSync(path.join(root, asset))) failures.push(`Missing production asset ${asset}`);
}

const markdownFiles = [
  "README.md",
  "PLAN.md",
  ...fs.readdirSync(path.join(root, "docs"), { recursive: true })
    .filter((file) => file.endsWith(".md") && !file.startsWith(`archive${path.sep}`))
    .map((file) => `docs/${file}`),
];
for (const relative of markdownFiles) {
  const source = read(relative);
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0].trim();
    if (!target || /^(https?:|mailto:|#)/.test(target)) continue;
    const resolved = path.resolve(path.dirname(path.join(root, relative)), decodeURIComponent(target));
    if (!fs.existsSync(resolved)) failures.push(`${relative}: broken link ${match[1]}`);
  }
}

if (failures.length) {
  console.error(`World validation failed (${failures.length}):\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}
console.log(`Validated ${territoryIds.length} Atlas territories, four domain cases, production media, and ${markdownFiles.length} active Markdown files.`);
