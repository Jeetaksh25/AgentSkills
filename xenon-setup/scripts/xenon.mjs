#!/usr/bin/env node
// Xenon Setup — snapshot one Claude Code setup and reproduce it on any machine.
//
//   node xenon.mjs export   [--out <dir>]            capture ~/.claude into the snapshot (secrets redacted)
//   node xenon.mjs install  [--from <dir>] [--dry-run] [--skip-tools] [--skip-plugins] [--secrets <file>]
//   node xenon.mjs verify   [--from <dir>]            report what differs between this machine and the snapshot
//
// Zero dependencies: Node 18+ built-ins only. Works on Windows, macOS and Linux.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SNAPSHOT = path.resolve(HERE, '..', 'snapshot');
const HOME = os.homedir();
const CLAUDE_DIR = path.join(HOME, '.claude');
const CLAUDE_JSON = path.join(HOME, '.claude.json');
const HOME_TOKEN = '{{HOME}}';
const IS_WIN = process.platform === 'win32';

// Folders under ~/.claude that make up the setup (everything else is runtime state: history, caches, sessions...)
const TREE_DIRS = ['skills', 'agents', 'commands', 'hooks', 'rules', 'output-styles'];
const TOP_FILES = ['CLAUDE.md', 'RTK.md', 'nexus.json', 'keybindings.json', 'statusline.sh', 'statusline.ps1'];
const SKIP_NAMES = new Set(['node_modules', '.git', '__pycache__', '.venv', 'venv', '.DS_Store', 'Thumbs.db', '.tokensave']);

// External CLIs the setup leans on. `hints` are tried in order when the tool is missing.
const TOOLS = [
  { name: 'node', check: 'node --version', hints: [], required: true },
  { name: 'git', check: 'git --version', hints: [], required: true },
  { name: 'python', check: 'python --version', hints: [] },
  { name: 'uv', check: 'uv --version', hints: ['pip install uv'] },
  { name: 'rtk', check: 'rtk --version', hints: IS_WIN ? ['winget install --id rtk-ai.rtk -e', 'cargo install --git https://github.com/rtk-ai/rtk'] : ['brew install rtk', 'cargo install --git https://github.com/rtk-ai/rtk'] },
  { name: 'tokensave', check: 'tokensave --version', hints: ['cargo install tokensave'] },
  { name: 'headroom', check: 'headroom --version', pip: 'headroom-ai', hints: ['pip install headroom-ai'] },
  { name: 'scrapling-mcp', check: 'scrapling --version', pip: 'scrapling', hints: ['pip install scrapling[ai]'], after: ['scrapling install'] },
];

// ---------- secrets ----------
const SECRET_KEY = /(api[-_]?key|token|secret|password|passwd|authorization|auth|bearer|cookie|credential)/i;
const SECRET_VALUE = [
  /sk-(?:or-v1-|ant-|proj-)?[A-Za-z0-9_\-]{20,}/g,
  /gh[pousr]_[A-Za-z0-9]{30,}/g,
  /github_pat_[A-Za-z0-9_]{30,}/g,
  /AIza[0-9A-Za-z_\-]{30,}/g,
  /xox[abposr]-[A-Za-z0-9-]{10,}/g,
  /\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/g, // z.ai style keys
  /ctx7sk-[A-Za-z0-9\-]{20,}/g,         // context7 keys
  /Bearer\s+[A-Za-z0-9._\-]{16,}/g,
];
const envName = (...parts) => 'XENON_' + parts.join('_').replace(/[^A-Za-z0-9]+/g, '_').toUpperCase();
const isPlaceholder = (v) => /^(Bearer\s+)?\$\{.+\}$/.test(v);

function redactString(s) {
  let hits = 0;
  for (const re of SECRET_VALUE) s = s.replace(re, () => { hits++; return '<REDACTED_BY_XENON>'; });
  return { s, hits };
}

// Replace secret-looking values in a JSON object by ${XENON_...} placeholders; collect what's needed.
function redactObject(obj, trail, needed) {
  if (Array.isArray(obj)) return obj.map((v, i) => redactObject(v, [...trail, String(i)], needed));
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      // key-name match needs a credential-length value, so enums like "ecc:token-card": "off" survive
      if (typeof v === 'string' && v.length >= 16 && !/\s/.test(v.replace(/^Bearer\s+/i, '')) && SECRET_KEY.test(k) && !isPlaceholder(v)) {
        const name = envName(...trail, k);
        const prefix = /^Bearer\s/i.test(v) ? 'Bearer ' : '';
        needed[name] = { where: [...trail, k].join('.'), prefix };
        out[k] = prefix + '${' + name + '}';
      } else out[k] = redactObject(v, [...trail, k], needed);
    }
    return out;
  }
  if (typeof obj === 'string') return redactString(obj).s;
  return obj;
}

// ---------- path templating ----------
function homeVariants() {
  const set = new Set();
  for (const h of [HOME, HOME.replace(/^([A-Z]):/, (m, d) => d.toLowerCase() + ':')]) {
    const fwd = h.replace(/\\/g, '/');
    set.add(h); set.add(fwd); set.add(h.replace(/\\/g, '\\\\'));
    if (/^[A-Za-z]:/.test(fwd)) set.add('/' + fwd[0].toLowerCase() + fwd.slice(2)); // /c/Users/x (git-bash)
  }
  return [...set].sort((a, b) => b.length - a.length);
}
function templatize(text) {
  for (const h of homeVariants()) text = text.split(h).join(HOME_TOKEN);
  return text;
}
// Forward slashes are valid on every OS and need no JSON escaping.
const detemplatize = (text) => text.split(HOME_TOKEN).join(HOME.replace(/\\/g, '/'));

// ---------- fs helpers ----------
const readJson = (p, d = {}) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };
const writeJson = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); };
const isText = (buf) => !buf.subarray(0, 8000).includes(0);
const log = (...a) => console.log(...a);
const warn = (...a) => console.log('  ! ' + a.join(' '));

function copyTree(src, dst, onFile) {
  let real;
  try { real = fs.realpathSync(src); } catch { return; }
  const st = fs.statSync(real);
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const name of fs.readdirSync(real)) {
      if (SKIP_NAMES.has(name)) continue;
      copyTree(path.join(real, name), path.join(dst, name), onFile);
    }
  } else {
    const buf = fs.readFileSync(real);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, onFile ? onFile(buf, dst) : buf);
  }
}

function sh(cmd) {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim() || null; }
  catch { return null; }
}
function run(cmd, dry) {
  log('  $ ' + cmd);
  if (dry) return true;
  return spawnSync(cmd, { shell: true, stdio: 'inherit' }).status === 0;
}
function backup(p) {
  if (!fs.existsSync(p)) return;
  const b = `${p}.xenon-backup-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.cpSync(p, b, { recursive: true, dereference: false });
  log(`  backed up ${path.basename(p)} -> ${path.basename(b)}`);
}
const pipVersion = (pkg) => sh(`pip show ${pkg}`)?.match(/Version:\s*(\S+)/)?.[1] ?? null;
const toolPresent = (t) => !!(sh(t.check) || (t.pip && pipVersion(t.pip)));

// ======================= EXPORT =======================
function doExport(out) {
  log(`Xenon export: ${CLAUDE_DIR} -> ${out}`);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const needed = {};
  const fileHits = [];

  // settings.json (secrets -> placeholders, home -> {{HOME}})
  const settings = readJson(path.join(CLAUDE_DIR, 'settings.json'));
  fs.writeFileSync(path.join(out, 'settings.json'), templatize(JSON.stringify(redactObject(settings, ['settings'], needed), null, 2)) + '\n');

  // MCP servers (user scope lives in ~/.claude.json)
  const cj = readJson(CLAUDE_JSON);
  const mcp = {};
  for (const [name, cfg] of Object.entries(cj.mcpServers || {})) {
    const c = structuredClone(cfg);
    for (const bag of ['headers', 'env']) {
      for (const [k, v] of Object.entries(c[bag] || {})) {
        if (typeof v !== 'string' || isPlaceholder(v)) continue;
        if (!(SECRET_KEY.test(k) || redactString(v).hits > 0 || v.length >= 24)) continue;
        const n = envName('MCP', name, k);
        const prefix = /^Bearer\s/i.test(v) ? 'Bearer ' : '';
        needed[n] = { where: `mcpServers.${name}.${bag}.${k}`, prefix };
        c[bag][k] = prefix + '${' + n + '}';
      }
    }
    mcp[name] = redactObject(c, ['MCP', name], needed);
  }
  fs.writeFileSync(path.join(out, 'mcp-servers.json'), templatize(JSON.stringify(mcp, null, 2)) + '\n');

  // plugins: marketplaces + installed + enabled state
  const known = readJson(path.join(CLAUDE_DIR, 'plugins', 'known_marketplaces.json'));
  const installed = readJson(path.join(CLAUDE_DIR, 'plugins', 'installed_plugins.json'));
  const plugins = {
    marketplaces: Object.fromEntries(Object.entries(known).map(([k, v]) => [k, v.source])),
    plugins: Object.fromEntries(Object.entries(installed.plugins || {}).map(([id, arr]) => [id, {
      version: arr[0]?.version, scope: arr[0]?.scope || 'user', enabled: settings.enabledPlugins?.[id] ?? true,
    }])),
  };
  fs.writeFileSync(path.join(out, 'plugins.json'), templatize(JSON.stringify(plugins, null, 2)) + '\n');

  // file trees: skills, agents, commands, hooks, rules...
  const links = {};
  const onFile = (buf, dst) => {
    if (!isText(buf)) return buf;
    const r = redactString(buf.toString('utf8'));
    if (r.hits) fileHits.push(`${path.relative(out, dst).replace(/\\/g, '/')} (${r.hits})`);
    return templatize(r.s);
  };
  for (const d of TREE_DIRS) {
    const src = path.join(CLAUDE_DIR, d);
    if (!fs.existsSync(src)) continue;
    for (const name of fs.readdirSync(src)) {
      const p = path.join(src, name);
      if (SKIP_NAMES.has(name) || /backup|\$base/i.test(name)) continue;
      // git-cloned skills: remember the remote so install clones them fresh
      const remote = fs.existsSync(path.join(p, '.git')) ? sh(`git -C "${p}" remote get-url origin`) : null;
      if (remote) links[`${d}/${name}`] = { git: remote };
      copyTree(p, path.join(out, 'claude', d, name), onFile);
    }
  }
  for (const f of TOP_FILES) {
    const p = path.join(CLAUDE_DIR, f);
    if (fs.existsSync(p)) copyTree(p, path.join(out, 'claude', f), onFile);
  }

  // external tools present on this machine
  const tools = TOOLS.map(t => ({ name: t.name, version: sh(t.check) || (t.pip ? pipVersion(t.pip) : null), pip: t.pip || null, pipVersion: t.pip ? pipVersion(t.pip) : null }));

  const count = (d) => fs.existsSync(path.join(out, 'claude', d)) ? fs.readdirSync(path.join(out, 'claude', d)).length : 0;
  const manifest = {
    xenon: 1,
    exportedAt: new Date().toISOString(),
    platform: process.platform,
    claudeVersion: sh('claude --version'),
    tools,
    links,
    secrets: needed,
    redactedFiles: fileHits,
    counts: { ...Object.fromEntries(TREE_DIRS.map(d => [d, count(d)])), mcpServers: Object.keys(mcp).length, marketplaces: Object.keys(plugins.marketplaces).length, plugins: Object.keys(plugins.plugins).length },
  };
  writeJson(path.join(out, 'manifest.json'), manifest);
  const env = Object.entries(needed).map(([k, v]) => `# ${v.where}\n${k}=`).join('\n');
  fs.writeFileSync(path.join(out, 'secrets.example.env'), '# Copy to secrets.env (never commit it), fill in, then:\n#   node xenon.mjs install --secrets secrets.env\n' + env + '\n');

  const c = manifest.counts;
  log(`  skills ${c.skills}, agents ${c.agents}, commands ${c.commands}, hooks ${c.hooks}, rules ${c.rules}`);
  log(`  MCP servers ${c.mcpServers}, marketplaces ${c.marketplaces}, plugins ${c.plugins}`);
  log(`  secrets turned into placeholders: ${Object.keys(needed).length}; files with inline secrets redacted: ${fileHits.length}`);
  const leaks = scanForSecrets(out);
  if (leaks.length) { console.error('LEAK SCAN FAILED — secret-looking strings remain in:\n' + leaks.join('\n')); process.exit(2); }
  log('  leak scan: clean');
}

function scanForSecrets(dir) {
  const hits = [];
  const walk = (p) => {
    for (const n of fs.readdirSync(p)) {
      const f = path.join(p, n);
      if (fs.statSync(f).isDirectory()) { walk(f); continue; }
      const buf = fs.readFileSync(f);
      if (!isText(buf)) continue;
      const t = buf.toString('utf8');
      if (SECRET_VALUE.some(re => { re.lastIndex = 0; return re.test(t); })) hits.push(path.relative(dir, f));
    }
  };
  walk(dir);
  return hits;
}

// ======================= INSTALL =======================
function loadSecrets(file) {
  const vals = { ...process.env };
  if (file && fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && m[2]) vals[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return vals;
}
function fillSecrets(text, vals, missing) {
  return text.replace(/\$\{(XENON_[A-Z0-9_]+)\}/g, (m, k) => {
    if (vals[k]) return JSON.stringify(vals[k]).slice(1, -1);
    missing.add(k);
    return m;
  });
}
function whichCmd(bin) {
  const out = sh(IS_WIN ? `where ${bin}` : `command -v ${bin}`);
  return out ? out.split(/\r?\n/)[0].replace(/\\/g, '/') : null;
}
// Absolute command paths from the source machine (Program Files, venvs...) are re-resolved on PATH here.
function relocateCommand(cmd) {
  if (!cmd || !/[\\/]/.test(cmd) || fs.existsSync(cmd)) return cmd;
  const base = path.basename(cmd.replace(/\\/g, '/')).replace(/\.(exe|cmd|bat)$/i, '');
  return whichCmd(base) || cmd;
}
function relocateHookCommand(c) {
  if (/^"[^"]+"/.test(c)) return c.replace(/^"([^"]+)"/, (x, p) => `"${relocateCommand(p)}"`);
  if (/^\S+$/.test(c)) return relocateCommand(c);
  return c;
}

function doInstall(from, { dry, skipTools, skipPlugins, secrets }) {
  const m = readJson(path.join(from, 'manifest.json'), null);
  if (!m) { console.error(`No snapshot at ${from}. Run "node xenon.mjs export" on the source machine first.`); process.exit(1); }
  log(`Xenon install: snapshot of ${m.exportedAt} (${m.platform}) -> ${CLAUDE_DIR}${dry ? '  [dry run]' : ''}`);
  const vals = loadSecrets(secrets);
  const missing = new Set();
  const report = { ok: [], warn: [] };

  // 1. external tools
  log('\n[1/5] tools');
  if (skipTools) log('  skipped (--skip-tools)');
  else for (const t of TOOLS) {
    const want = m.tools.find(x => x.name === t.name);
    if (!want?.version && !t.required) continue; // the source machine did not have it either
    if (toolPresent(t)) { log(`  ✓ ${t.name}`); continue; }
    let done = false;
    for (const h of t.hints) {
      const cmd = h.startsWith('pip install') && want?.pipVersion ? `${h}==${want.pipVersion}` : h;
      if (run(cmd, dry) && (dry || toolPresent(t))) { done = true; break; }
    }
    if (done) for (const a of t.after || []) run(a, dry);
    (done ? report.ok : report.warn).push(`${t.name}: ${done ? 'installed' : 'not installed automatically — try: ' + (t.hints.join('  |  ') || 'install it manually')}`);
  }

  // 2. files: skills, agents, commands, hooks, rules, CLAUDE.md ...
  log('\n[2/5] skills, agents, commands, hooks, rules, memory files');
  const src = path.join(from, 'claude');
  const fix = (buf) => isText(buf) ? Buffer.from(detemplatize(buf.toString('utf8'))) : buf;
  if (fs.existsSync(src)) for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry), d = path.join(CLAUDE_DIR, entry);
    if (fs.statSync(s).isDirectory()) {
      const names = fs.readdirSync(s);
      if (!dry) {
        if (fs.existsSync(d)) backup(d);
        for (const name of names) {
          const dst = path.join(d, name), link = m.links?.[`${entry}/${name}`];
          fs.rmSync(dst, { recursive: true, force: true });
          if (link?.git && run(`git clone --depth 1 ${link.git} "${dst}"`, false)) continue;
          copyTree(path.join(s, name), dst, fix);
        }
      }
      log(`  ✓ ${entry}: ${names.length}`);
    } else {
      if (!dry) { if (fs.existsSync(d)) backup(d); fs.mkdirSync(CLAUDE_DIR, { recursive: true }); fs.writeFileSync(d, fix(fs.readFileSync(s))); }
      log(`  ✓ ${entry}`);
    }
  }

  // 3. settings.json (hooks, permissions, env, model, enabledPlugins, marketplaces...)
  log('\n[3/5] settings.json');
  const settings = JSON.parse(fillSecrets(detemplatize(fs.readFileSync(path.join(from, 'settings.json'), 'utf8')), vals, missing));
  if (settings.env?.HOME) settings.env.HOME = HOME.replace(/\\/g, '/');
  for (const groups of Object.values(settings.hooks || {})) for (const g of groups) for (const h of g.hooks || []) {
    if (h.type === 'command' && h.command) h.command = relocateHookCommand(h.command);
  }
  const sp = path.join(CLAUDE_DIR, 'settings.json');
  if (!dry) { backup(sp); writeJson(sp, settings); }
  log(`  ✓ settings.json (${Object.keys(settings).length} keys, ${Object.keys(settings.hooks || {}).length} hook events)`);

  // 4. MCP servers into ~/.claude.json (user scope) — merged, nothing else in that file is touched
  log('\n[4/5] MCP servers');
  const mcp = JSON.parse(fillSecrets(detemplatize(fs.readFileSync(path.join(from, 'mcp-servers.json'), 'utf8')), vals, missing));
  for (const c of Object.values(mcp)) if (c.command) c.command = relocateCommand(c.command);
  if (!dry) {
    backup(CLAUDE_JSON);
    const cj = readJson(CLAUDE_JSON);
    cj.mcpServers = { ...(cj.mcpServers || {}), ...mcp };
    writeJson(CLAUDE_JSON, cj);
  }
  for (const [n, c] of Object.entries(mcp)) {
    const ok = !c.command || fs.existsSync(c.command) || !!whichCmd(c.command);
    log(`  ${ok ? '✓' : '!'} ${n}${ok ? '' : `  (command not found: ${c.command})`}`);
    if (!ok) report.warn.push(`MCP ${n}: command ${c.command} not found — install it, then restart Claude Code`);
  }

  // 5. plugins (via the claude CLI)
  log('\n[5/5] plugins');
  const pj = readJson(path.join(from, 'plugins.json'));
  const localDirMissing = (s) => s?.source === 'directory' && !fs.existsSync(detemplatize(s.path || ''));
  if (skipPlugins) log('  skipped (--skip-plugins)');
  else if (!sh('claude --version')) report.warn.push('claude CLI not on PATH — plugins not installed. Install Claude Code, then re-run: node xenon.mjs install --skip-tools');
  else {
    for (const [name, s] of Object.entries(pj.marketplaces || {})) {
      if (localDirMissing(s)) { report.warn.push(`marketplace ${name}: local directory ${s.path} does not exist here — skipped`); continue; }
      const ref = s.source === 'github' ? s.repo : s.source === 'directory' ? detemplatize(s.path) : s.url;
      run(`claude plugin marketplace add "${ref}"`, dry); // non-zero usually means "already added"
    }
    for (const [id, p] of Object.entries(pj.plugins || {})) {
      if (localDirMissing(pj.marketplaces?.[id.split('@')[1]])) continue;
      if (!run(`claude plugin install "${id}" --scope ${p.scope || 'user'}`, dry)) { report.warn.push(`plugin ${id}: install failed`); continue; }
      if (p.enabled === false) run(`claude plugin disable "${id}"`, dry);
    }
  }

  // summary
  log('\n==== Xenon summary ====');
  for (const o of report.ok) log('  ✓ ' + o);
  for (const k of missing) report.warn.push(`secret ${k} not provided — add it to your secrets file (see snapshot/secrets.example.env) or export it, then re-run`);
  for (const w of report.warn) warn(w);
  log(report.warn.length ? `\nDone with ${report.warn.length} warning(s). Restart Claude Code, then run: node xenon.mjs verify` : '\nDone. Restart Claude Code — this machine now matches the snapshot.');
}

// ======================= VERIFY =======================
function doVerify(from) {
  const m = readJson(path.join(from, 'manifest.json'), null);
  if (!m) { console.error(`No snapshot at ${from}`); process.exit(1); }
  const diffs = [];
  for (const d of TREE_DIRS) {
    const want = fs.existsSync(path.join(from, 'claude', d)) ? fs.readdirSync(path.join(from, 'claude', d)) : [];
    const have = new Set(fs.existsSync(path.join(CLAUDE_DIR, d)) ? fs.readdirSync(path.join(CLAUDE_DIR, d)) : []);
    for (const n of want) if (!have.has(n)) diffs.push(`missing ${d}/${n}`);
  }
  const haveMcp = readJson(CLAUDE_JSON).mcpServers || {};
  for (const n of Object.keys(readJson(path.join(from, 'mcp-servers.json')))) if (!haveMcp[n]) diffs.push(`missing MCP server ${n}`);
  const pj = readJson(path.join(from, 'plugins.json'));
  const inst = readJson(path.join(CLAUDE_DIR, 'plugins', 'installed_plugins.json')).plugins || {};
  const enabled = readJson(path.join(CLAUDE_DIR, 'settings.json')).enabledPlugins || {};
  for (const [id, p] of Object.entries(pj.plugins || {})) {
    if (!inst[id]) diffs.push(`missing plugin ${id}`);
    else if ((enabled[id] ?? true) !== p.enabled) diffs.push(`plugin ${id} enabled=${enabled[id] ?? true} (want ${p.enabled})`);
  }
  for (const t of m.tools) { const def = TOOLS.find(x => x.name === t.name); if (t.version && def && !toolPresent(def)) diffs.push(`missing tool ${t.name}`); }
  log(diffs.length ? diffs.map(d => '  ✗ ' + d).join('\n') + `\n${diffs.length} difference(s).` : '  ✓ this machine matches the snapshot.');
  process.exit(diffs.length ? 1 : 0);
}

// ======================= CLI =======================
const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => rest.includes(n);
const opt = (n) => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : undefined; };
const snap = path.resolve(opt('--from') || opt('--out') || DEFAULT_SNAPSHOT);
if (cmd === 'export') doExport(snap);
else if (cmd === 'install') doInstall(snap, { dry: flag('--dry-run'), skipTools: flag('--skip-tools'), skipPlugins: flag('--skip-plugins'), secrets: opt('--secrets') && path.resolve(opt('--secrets')) });
else if (cmd === 'verify') doVerify(snap);
else log('usage: node xenon.mjs <export|install|verify> [--from|--out dir] [--dry-run] [--skip-tools] [--skip-plugins] [--secrets file]');
