import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const lessonRoot = path.join(root, "src/content/lessons");
const characterSource = fs.readFileSync(path.join(root, "src/utils/characterData.ts"), "utf8");
const characterIds = new Set([...characterSource.matchAll(/\bid:\s*["']([a-z-]+)["']/g)].map((m) => m[1]));
const registrySource = fs.readFileSync(path.join(root, "src/interactive/demos/demo_registry.ts"), "utf8");
const demoIds = [...registrySource.matchAll(/\bid:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]);
const overrides = new Map([...registrySource.matchAll(/["']([a-z0-9-]+)["']:\s*["']([a-z0-9_]+)["']/g)].map((m) => [m[1], m[2]]));
const componentKeys = new Set(demoIds.map((id) => overrides.get(id) ?? id.replaceAll("-", "_")));
const lessonIds = new Set();

for (const moduleName of fs.readdirSync(lessonRoot).filter((name) => /^module\d+$/.test(name))) {
  const moduleNumber = Number(moduleName.slice(6));
  const dir = path.join(lessonRoot, moduleName);
  const index = JSON.parse(fs.readFileSync(path.join(dir, "index.json"), "utf8"));
  if (index.moduleId !== moduleNumber) failures.push(`${moduleName}/index.json: moduleId must be ${moduleNumber}`);
  if (index.lessonCount !== index.lessons.length) failures.push(`${moduleName}/index.json: lessonCount does not match lessons`);
  if (new Set(index.lessons).size !== index.lessons.length) failures.push(`${moduleName}/index.json: duplicate lesson ID`);
  for (const id of index.lessons) {
    const file = path.join(dir, `lesson-${id}.json`);
    if (!fs.existsSync(file)) { failures.push(`${moduleName}/index.json: missing lesson-${id}.json`); continue; }
    const lesson = JSON.parse(fs.readFileSync(file, "utf8"));
    if (lesson.id !== id) failures.push(`${path.relative(root, file)}: ID ${lesson.id} does not match index ID ${id}`);
    if (!id.startsWith(`${moduleNumber}.`)) failures.push(`${path.relative(root, file)}: ID belongs to another module`);
    if (lessonIds.has(id)) failures.push(`${path.relative(root, file)}: duplicate global lesson ID ${id}`);
    lessonIds.add(id);
    if (!characterIds.has(lesson.characterId)) failures.push(`${path.relative(root, file)}: unknown characterId ${lesson.characterId}`);
    if (lesson.doType === "custom" && (!lesson.doComponent || !componentKeys.has(lesson.doComponent))) failures.push(`${path.relative(root, file)}: unknown custom interactive ${lesson.doComponent ?? "(missing)"}`);
  }
  const files = fs.readdirSync(dir).filter((name) => /^lesson-.*\.json$/.test(name));
  for (const file of files) {
    const id = file.slice(7, -5);
    if (!index.lessons.includes(id)) failures.push(`${moduleName}/${file}: absent from module index`);
  }
}

const markdownFiles = ["README.md", "PLAN.md", ...fs.readdirSync(path.join(root, "docs"), { recursive: true }).filter((f) => f.endsWith(".md")).map((f) => `docs/${f}`)];
for (const relative of markdownFiles) {
  const source = fs.readFileSync(path.join(root, relative), "utf8");
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0].trim();
    if (!target || /^(https?:|mailto:|#)/.test(target)) continue;
    const resolved = path.resolve(path.dirname(path.join(root, relative)), decodeURIComponent(target));
    if (!fs.existsSync(resolved)) failures.push(`${relative}: broken link ${match[1]}`);
  }
}

if (failures.length) {
  console.error(`Content validation failed (${failures.length}):\n${failures.map((f) => `- ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(`Validated ${lessonIds.size} lessons, ${characterIds.size} characters, ${componentKeys.size} interactives, and ${markdownFiles.length} Markdown files.`);
