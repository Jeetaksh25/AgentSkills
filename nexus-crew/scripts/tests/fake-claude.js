// Stand-in for the claude CLI, used by selftest.ps1 through NEXUS_CREW_CLAUDE. It reads the task from -p,
// acts by mode in the current directory (the unit worktree), and prints one JSON result line like
// `claude -p --output-format json` does. FAKE_LEAK=<path> makes a build write outside the worktree.
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const task = args[args.indexOf('-p') + 1] || '';
const mode = (task.match(/Mode:\s*(\w+)/) || [])[1] || 'build';
let result = 'STATUS: DONE\nNOTES: fake worker';

if (mode === 'build') {
  fs.mkdirSync('src', { recursive: true });
  fs.appendFileSync(path.join('src', 'a.txt'), 'built\n');
  if (process.env.FAKE_LEAK) fs.writeFileSync(process.env.FAKE_LEAK, 'leaked\n');
} else if (mode === 'test') {
  fs.mkdirSync('tests', { recursive: true });
  fs.writeFileSync(
    path.join('tests', 'x.test.js'),
    "const assert = require('assert');\nassert.ok(true);\nconsole.log('ok');\n",
  );
} else if (mode === 'brief') {
  result =
    '[Blocker] Interfaces: the return type is not stated. Fix: say it returns a string.\n' +
    'VERDICT: GAPS blockers=1 majors=0';
} else if (mode === 'review') {
  result = 'VERDICT: PASS';
}

process.stdout.write(
  JSON.stringify({
    type: 'result',
    subtype: 'success',
    is_error: false,
    num_turns: 1,
    result,
    usage: { input_tokens: 10, cache_read_input_tokens: 0, cache_creation_input_tokens: 0, output_tokens: 5 },
  }) + '\n',
);
