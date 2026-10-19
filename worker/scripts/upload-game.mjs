// Uploads a game build folder to R2 under "full/".
// Usage: node scripts/upload-game.mjs <buildDir> --remote   (production)
//        node scripts/upload-game.mjs <buildDir> --local    (wrangler dev)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [dir, mode] = process.argv.slice(2);
if (!dir || !["--remote", "--local"].includes(mode)) {
  console.error("Usage: node scripts/upload-game.mjs <buildDir> --remote|--local");
  process.exit(1);
}

const files = fs.readdirSync(dir, { recursive: true }).filter((f) => fs.statSync(path.join(dir, f)).isFile());
for (const rel of files) {
  const key = "full/" + rel.split(path.sep).join("/");
  console.log("↑", key);
  execFileSync("npx", ["wrangler", "r2", "object", "put", `callout-game/${key}`, "--file", path.join(dir, rel), mode], {
    stdio: ["ignore", "ignore", "inherit"],
    shell: process.platform === "win32",
  });
}
console.log(`Done: ${files.length} file(s).`);
