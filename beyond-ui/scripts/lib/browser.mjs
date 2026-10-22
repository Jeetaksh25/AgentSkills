import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

export async function loadPlaywright(projectDir) {
  const tries = [
    () => import("playwright"),
    () => createRequire(path.join(projectDir, "package.json"))("playwright"),
    () => createRequire(projectDir)("playwright"),
  ];
  for (const t of tries) { try { return await t(); } catch { /* next */ } }
  return null;
}

export async function launchChromium(projectDir, options = {}) {
  const pw = await loadPlaywright(projectDir);
  if (!pw) return null;
  try { return await pw.chromium.launch(options); }
  catch (e) {
    if (!/Executable doesn't exist|playwright install/i.test(String(e.message))) throw e;
    console.log("  playwright browser missing — running `npx playwright install chromium` once, then retrying");
    spawnSync("npx", ["-y", "playwright", "install", "chromium"], { cwd: projectDir, stdio: "inherit", shell: process.platform === "win32", timeout: 15 * 60 * 1000, env: { ...process.env, PLAYWRIGHT_SKIP_BROWSER_GC: "1" } });
    return await pw.chromium.launch(options);
  }
}
