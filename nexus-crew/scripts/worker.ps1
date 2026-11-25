<#
.SYNOPSIS  Run one worker for one unit: a headless Claude Code session pointed at a cheap
           Anthropic-compatible API (Ollama, OpenRouter, DeepSeek, Z.ai, Moonshot, any gateway).
.DESCRIPTION
  Modes:  build  = implement the brief (tests first)   -> edits files in the unit worktree
          test   = write the done-tests only           -> edits test files only
          review = cross-review the unit's review pack -> writes .crew\runs\<unit>\crossreview-<unit>.md
  The worker runs with --bare (no user hooks, plugins or CLAUDE.md), a clean environment (the parent
  session's CLAUDE_* and ANTHROPIC_* variables would break auth) and the key from the environment or .env.
  The key reaches the worker through apiKeyHelper, so it is sent as both x-api-key and a Bearer token.
  -DryRun prints what would run (the key is never printed) and starts nothing.
.EXAMPLE  .\worker.ps1 -Unit U-001 -Mode build
.EXAMPLE  .\worker.ps1 -Unit U-001 -Mode review -Provider openrouter -Model deepseek/deepseek-v4.1-flash-1017
.EXAMPLE  .\worker.ps1 -Unit U-001 -DryRun
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [ValidateSet('build', 'test', 'review')][string]$Mode = 'build',
    [int]$Variant = 0,
    [string]$Provider = '',
    [string]$Model = '',
    [switch]$InRepo,
    [switch]$DryRun
)
. "$PSScriptRoot\_common.ps1"

$P = Resolve-Provider $Provider $Model
if (-not $P.Model) { throw ('No model for provider ' + $P.Id + '. Set model in .crew\config.json, CREW_MODEL, or pass -Model.') }
if ($P.KeyEnv -and -not $P.Key -and -not $DryRun) { throw ($P.KeyEnv + ' is not set: export it, or put it in ' + (Join-Path $CrewRoot '.env') + ' (never commit that file).') }
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { throw 'The claude CLI is not on PATH (workers are headless Claude Code sessions).' }

$name = Get-UnitName $Unit $Variant
$work = Get-UnitPath $Unit $Variant -InRepo:$InRepo
if (-not (Test-Path -LiteralPath $work)) { throw "No worktree for $name. Run: unit.ps1 -Action start -Unit $Unit" }
Set-CrewUnitEnv $work

$bashTools = @(Get-AllowedExe | ForEach-Object { 'Bash(' + $_ + ':*)' })
if ($Mode -eq 'review') { $tools = 'Read,Glob,Grep,Bash(git diff:*),Bash(git status:*),Bash(git log:*)' }
else { $tools = (@('Read', 'Write', 'Edit', 'MultiEdit', 'Glob', 'Grep', 'Bash(git status:*)', 'Bash(git diff:*)') + $bashTools) -join ',' }

if ($DryRun) {
    $keyState = 'MISSING'
    if ($P.Key) { $keyState = 'present (' + $P.Key.Length + ' chars) from ' + $(if ($P.KeyEnv) { $P.KeyEnv } else { 'the provider preset' }) }
    elseif (-not $P.KeyEnv) { $keyState = 'not needed' }
    'provider : ' + $P.Id + ' (' + $P.Label + ', catalog status ' + $P.Status + ')'
    'base url : ' + $P.BaseUrl
    'model    : ' + $P.Model
    'key      : ' + $keyState
    'mode     : ' + $Mode
    'worktree : ' + $work
    'tools    : ' + $tools
    return
}

$run   = Get-RunDir $Unit
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

# System prompt = role rules + project conventions + lessons learnt from past reviews.
function Get-PromptText([string]$m) {
    $custom = Join-Path $CrewDir "prompts\worker-$m.md"
    if (Test-Path -LiteralPath $custom) { return (Get-Content -Raw -Encoding UTF8 -LiteralPath $custom) }
    return (Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $SkillRoot "assets\prompts\worker-$m.md"))
}
$sys   = Join-Path $run "$Mode-$name-$stamp.system.md"
$parts = @(Get-PromptText $Mode)
$proj = Join-Path $CrewDir 'project.md'
if (Test-Path -LiteralPath $proj) { $parts += "`n# Project conventions (from .crew/project.md)`n" + (Get-Content -Raw -Encoding UTF8 -LiteralPath $proj) }
$lessons = Join-Path $CrewDir 'lessons.md'
if (Test-Path -LiteralPath $lessons) { $parts += "`n# Lessons (hard rules from past reviews)`n" + (Get-Content -Raw -Encoding UTF8 -LiteralPath $lessons) }
[IO.File]::WriteAllText($sys, ($parts -join "`n"), (New-Object Text.UTF8Encoding $false))

# Payload = the brief, or the review pack for review mode. It goes into a UTF-8 file that the worker
# reads with its Read tool: Windows PowerShell 5.1 pipes stdin to native programs as ASCII, which
# turns non-ASCII text into "?". The path is quoted because it may contain spaces.
$inputFile = Join-Path $run "$Mode-$name-$stamp.input.md"
if ($Mode -eq 'review') {
    $pack = Join-Path $run "review-pack-$name.md"
    if (-not (Test-Path -LiteralPath $pack)) { throw "Missing $pack. Run review-pack.ps1 first." }
    $payload = Get-Content -Raw -Encoding UTF8 -LiteralPath $pack
    $task = "You are cross-reviewing a Nexus Crew unit. First read the review pack with the Read tool: '$inputFile'. Then follow your system instructions exactly."
} else {
    $payload = Get-Content -Raw -Encoding UTF8 -LiteralPath (Get-BriefPath $Unit)
    $task = "Mode: $Mode. First read the unit brief with the Read tool: '$inputFile'. Work in the current directory. Follow your system instructions exactly."
}
[IO.File]::WriteAllText($inputFile, $payload, (New-Object Text.UTF8Encoding $false))

# Connection details (base URL, model, key helper) go into the worker's own --settings file and into the
# process environment; New-WorkerSettingsFile in _common.ps1 explains why both are needed.
$settingsFile = New-WorkerSettingsFile $P (Join-Path $run "$Mode-$name-$stamp.settings.json")
Initialize-WorkerEnv $P
$OutputEncoding = New-Object Text.UTF8Encoding $false

$log = Join-Path $run "$Mode-$name-$stamp.json"
$sw  = [Diagnostics.Stopwatch]::StartNew()
$cliArgs = @('-p', $task, '--bare', '--model', $P.Model, '--add-dir', $run, '--settings', $settingsFile,
    '--strict-mcp-config', '--append-system-prompt-file', $sys, '--permission-mode', 'acceptEdits',
    '--output-format', 'json', '--no-session-persistence', '--allowedTools', $tools)
Push-Location $work
try { $raw = & claude @cliArgs 2>&1 | Out-String } finally { Pop-Location }
$sw.Stop()
[IO.File]::WriteAllText($log, $raw, (New-Object Text.UTF8Encoding $false))

# Parse the JSON result: the last line that is a JSON object (warnings may precede it).
$j = $null
$jsonLine = ($raw -split "`r?`n") | Where-Object { $_ -match '^\s*\{".*\}\s*$' } | Select-Object -Last 1
if ($jsonLine) { try { $j = $jsonLine | ConvertFrom-Json } catch { $j = $null } }
$ok = $false; $turns = ''; $inTok = ''; $outTok = ''; $result = ''
if ($j) {
    $ok = -not $j.is_error; $turns = $j.num_turns; $result = [string]$j.result
    if ($j.usage) { $inTok = $j.usage.input_tokens; $outTok = $j.usage.output_tokens }
}
if ($Mode -eq 'review' -and $result) {
    [IO.File]::WriteAllText((Join-Path $run "crossreview-$name.md"), $result, (New-Object Text.UTF8Encoding $false))
}
Add-LedgerRow $Unit $Mode $Variant $P.Id $P.Model ([int]$sw.Elapsed.TotalSeconds) $turns $ok $inTok $outTok

"unit=$name mode=$Mode provider=$($P.Id) model=$($P.Model) ok=$ok seconds=$([int]$sw.Elapsed.TotalSeconds) turns=$turns tokens_in=$inTok tokens_out=$outTok"
"log=$log"
if ($Mode -ne 'review') { 'changed:'; git -C $work status --short }
'--- worker report ---'
if ($result) { $result } elseif (-not $j) { $raw.Substring(0, [Math]::Min(1500, $raw.Length)) }
if (-not $ok) { exit 1 }