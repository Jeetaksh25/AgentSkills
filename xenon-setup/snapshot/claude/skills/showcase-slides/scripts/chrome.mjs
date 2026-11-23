/**
 * Locates a Chromium-family browser (Chrome, Edge, Chromium, Brave) for headless QA and snapshots,
 * and runs it with a timeout. Set CHROME_PATH to force a specific binary.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const CANDIDATES = {
  win32: [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    path.join(os.homedir(), "AppData/Local/Google/Chrome/Application/chrome.exe"),
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  ],
  linux: ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge", "brave-browser"],
};

export function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const list = CANDIDATES[process.platform] || CANDIDATES.linux;
  for (const c of list) {
    if (path.isAbsolute(c)) {
      if (fs.existsSync(c)) return c;
    } else {
      const r = spawnSync("which", [c], { encoding: "utf8" });
      if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
    }
  }
  return null;
}

export function fileUrl(file, query = "", hash = "") {
  return pathToFileURL(path.resolve(file)).href + query + hash;
}

export function runChrome(args, timeoutMs = 90000) {
  const bin = findChrome();
  if (!bin) {
    throw new Error("No Chrome, Edge, Chromium or Brave found. Install one or set CHROME_PATH.");
  }
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "showcase-slides-"));
  const base = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--force-device-scale-factor=1",
    "--window-size=1920,1080",
    `--user-data-dir=${profile}`,
  ];
  const r = spawnSync(bin, [...base, ...args], { encoding: "utf8", timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024 });
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  if (r.error) throw r.error;
  return r;
}
