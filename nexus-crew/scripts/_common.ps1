# Shared helpers for Nexus Crew scripts. Works in Windows PowerShell 5.1 and PowerShell 7.
# Dot-source it from the other scripts:  . "$PSScriptRoot\_common.ps1"
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = New-Object Text.UTF8Encoding $false
$OutputEncoding = New-Object Text.UTF8Encoding $false
try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch { }

$IsWin = ($env:OS -eq 'Windows_NT')
$SkillRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

# The MAIN checkout of the project, also when called from inside one of its worktrees.
function Get-MainRoot {
    if ($env:CREW_PROJECT) { return (Resolve-Path -LiteralPath $env:CREW_PROJECT).Path }
    $common = git rev-parse --path-format=absolute --git-common-dir 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $common) { throw 'Not inside a git repository. cd into the project, or set CREW_PROJECT.' }
    $common = ("$common").Trim()
    if ($IsWin) { $common = $common.Replace('/', '\') }
    return (Split-Path $common -Parent)
}

$CrewRoot = Get-MainRoot
$CrewDir  = Join-Path $CrewRoot '.crew'

function Read-DotEnv([string]$Path) {
    $h = @{}
    if (Test-Path -LiteralPath $Path) {
        Get-Content -Encoding UTF8 -LiteralPath $Path | ForEach-Object {
            if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
                $v = $Matches[2].Trim()
                if ($v.Length -ge 2 -and (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'")))) { $v = $v.Substring(1, $v.Length - 2) }
                $h[$Matches[1]] = $v
            }
        }
    }
    return $h
}
$DotEnv = Read-DotEnv (Join-Path $CrewRoot '.env')

# Process environment first, then the project's .env. Values are never printed by these scripts.
function Get-Setting([string]$Name) {
    if (-not $Name) { return $null }
    $v = [Environment]::GetEnvironmentVariable($Name)
    if ($v) { return $v }
    if ($DotEnv.ContainsKey($Name)) { return $DotEnv[$Name] }
    # A key saved with setx (or System > Environment Variables) is invisible to shells opened before it was
    # saved. Read the persisted User and Machine scopes too, so an already-open session still finds it.
    if ($IsWin) {
        foreach ($scope in 'User', 'Machine') {
            $v = [Environment]::GetEnvironmentVariable($Name, $scope)
            if ($v) { return $v }
        }
    }
    return $null
}

# ---- project configuration (.crew/config.json) ----
$ConfigPath = Join-Path $CrewDir 'config.json'
$Config = $null
if (Test-Path -LiteralPath $ConfigPath) { $Config = Get-Content -Raw -Encoding UTF8 -LiteralPath $ConfigPath | ConvertFrom-Json }
function Get-Cfg([string]$Name, $Default) {
    if ($Config -and ($Config.PSObject.Properties.Name -contains $Name) -and $null -ne $Config.$Name) { return $Config.$Name }
    return $Default
}
function Get-AllowedExe { return @(Get-Cfg 'allowed_executables' @('cargo', 'rustc', 'pnpm', 'npm', 'npx', 'node')) }

# Worktrees live NEXT TO the project (<project>.crew\<unit>) so tools never scan them twice.
$WtRoot = Get-Cfg 'worktree_root' $null
if (-not $WtRoot) { $WtRoot = Join-Path (Split-Path $CrewRoot -Parent) ((Split-Path $CrewRoot -Leaf) + '.crew') }
elseif (-not [IO.Path]::IsPathRooted($WtRoot)) { $WtRoot = Join-Path (Split-Path $CrewRoot -Parent) $WtRoot }

# ---- providers ----
function Get-ProviderCatalog {
    return (Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $SkillRoot 'assets\providers.json') | ConvertFrom-Json)
}

# Which worker API to use. Order: -Provider, CREW_PROVIDER, config.json. Model: -Model, CREW_MODEL,
# CREW_WORKER_MODEL, config.json, the preset default.
function Resolve-Provider([string]$Override, [string]$ModelOverride) {
    $cat = Get-ProviderCatalog
    $id = $Override
    if (-not $id) { $id = Get-Setting 'CREW_PROVIDER' }
    if (-not $id) { $id = Get-Cfg 'provider' $null }
    $known = ($cat.providers.PSObject.Properties.Name) -join ', '
    if (-not $id) { throw ('No worker provider chosen. Run scripts\init.ps1 -Provider <id>, or set provider in .crew\config.json. Known: ' + $known) }
    $entry = $cat.providers.PSObject.Properties[$id]
    if (-not $entry) { throw ("Unknown provider '" + $id + "'. Known: " + $known) }
    $preset = $entry.Value
    $base = Get-Cfg 'base_url' $null
    if (-not $base -and $preset.base_url_env) { $base = Get-Setting $preset.base_url_env }
    if (-not $base) { $base = $preset.base_url }
    if (-not $base) { throw ("Provider '" + $id + "' needs base_url in .crew\config.json.") }
    if ($base -notmatch '^[A-Za-z][A-Za-z0-9+.-]*://') { $base = 'http://' + $base }
    $base = $base.TrimEnd('/')
    $keyEnv = Get-Cfg 'key_env' $null
    if (-not $keyEnv) { $keyEnv = $preset.key_env }
    $key = $null
    if ($keyEnv) { $key = Get-Setting $keyEnv } elseif ($preset.static_key) { $key = $preset.static_key }
    $model = $ModelOverride
    if (-not $model) { $model = Get-Setting 'CREW_MODEL' }
    if (-not $model) { $model = Get-Setting 'CREW_WORKER_MODEL' }
    if (-not $model) { $model = Get-Cfg 'model' $null }
    if (-not $model) { $model = $preset.default_model }
    return [pscustomobject]@{ Id = $id; Label = $preset.label; Status = $preset.status; BaseUrl = $base; KeyEnv = $keyEnv; Key = $key; Model = $model; Notes = $preset.notes }
}

# Every secret value the gates must keep out of a diff: all provider keys plus long .env values.
function Get-SecretValues {
    $names = New-Object System.Collections.Generic.List[string]
    foreach ($p in (Get-ProviderCatalog).providers.PSObject.Properties) { if ($p.Value.key_env) { $names.Add([string]$p.Value.key_env) } }
    $k = Get-Cfg 'key_env' $null
    if ($k) { $names.Add([string]$k) }
    $vals = New-Object System.Collections.Generic.List[string]
    foreach ($n in ($names | Select-Object -Unique)) { $v = Get-Setting $n; if ($v -and $v.Length -ge 8) { $vals.Add($v) } }
    foreach ($kv in $DotEnv.GetEnumerator()) {
        $v = [string]$kv.Value
        if ($kv.Key -match '(?i)KEY|TOKEN|SECRET|PASSW|CREDENTIAL|PRIVATE' -and $v.Length -ge 8 -and -not $vals.Contains($v)) { $vals.Add($v) }
    }
    return @($vals)
}

# ---- units ----
function Get-UnitName([string]$Unit, [int]$Variant) {
    if ($Variant -gt 0) { return "$Unit-v$Variant" } else { return $Unit }
}
function Get-UnitPath([string]$Unit, [int]$Variant, [switch]$InRepo) {
    if ($InRepo) { return $CrewRoot }
    return (Join-Path $WtRoot (Get-UnitName $Unit $Variant))
}
function Get-RunDir([string]$Unit) {
    $d = Join-Path $CrewDir "runs\$Unit"
    New-Item -ItemType Directory -Force $d | Out-Null
    return $d
}
function Get-BriefPath([string]$Unit) {
    $p = Join-Path $CrewDir "units\$Unit.md"
    if (-not (Test-Path -LiteralPath $p)) { throw "Brief not found: $p (copy .crew\units\_TEMPLATE.md)" }
    return $p
}

# ---- git ----
function Get-BaseBranch {
    $b = Get-Cfg 'base_branch' $null
    if ($b) { return $b }
    $head = git -C $CrewRoot symbolic-ref --short refs/remotes/origin/HEAD 2>$null
    if ($LASTEXITCODE -eq 0 -and $head) { return (("$head").Trim() -replace '^origin/', '') }
    foreach ($c in 'main', 'master') {
        git -C $CrewRoot rev-parse --verify --quiet "refs/heads/$c" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { return $c }
    }
    return (git -C $CrewRoot rev-parse --abbrev-ref HEAD).Trim()
}
# A unit's diff is measured from where it left the base branch, so committed WIP checkpoints are included.
function Get-DiffBase([string]$Work, [switch]$InRepo) {
    if ($InRepo) { return 'HEAD' }
    $bb = Get-BaseBranch
    $base = git -C $Work merge-base $bb HEAD
    if ($LASTEXITCODE -ne 0 -or -not $base) { throw "Cannot find the merge base with '$bb' in $Work" }
    return "$base".Trim()
}

# ---- running commands ----
function Invoke-CrewShell([string]$CommandLine) {
    if ($IsWin) { return (cmd /c "$CommandLine 2>&1" | Out-String) }
    return (sh -c "$CommandLine 2>&1" | Out-String)
}

# One line per worker run. Old ledgers without the provider column keep their own schema.
function Add-LedgerRow([string]$Unit, [string]$Mode, [int]$Variant, [string]$ProviderId, [string]$Model, [int]$Seconds, $Turns, $Ok, $InTok, $OutTok) {
    $ledger = Join-Path $CrewDir 'ledger.csv'
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    if (-not (Test-Path -LiteralPath $ledger)) { [IO.File]::WriteAllText($ledger, "timestamp,unit,mode,variant,provider,model,seconds,turns,ok,input_tokens,output_tokens`n", (New-Object Text.UTF8Encoding $false)) }
    $first = Get-Content -LiteralPath $ledger -TotalCount 1 -Encoding UTF8
    if ($first -like '*provider*') { $row = "$stamp,$Unit,$Mode,$Variant,$ProviderId,$Model,$Seconds,$Turns,$Ok,$InTok,$OutTok" }
    else { $row = "$stamp,$Unit,$Mode,$Variant,$Model,$Seconds,$Turns,$Ok,$InTok,$OutTok" }
    [IO.File]::AppendAllText($ledger, $row + "`n", (New-Object Text.UTF8Encoding $false))
}

# ---- worker launch pieces (shared by worker.ps1 and check-provider.ps1) ----
# Settings for one worker run: deny rules + apiKeyHelper + env. Two facts shape this:
#  1. --bare reads auth only from ANTHROPIC_API_KEY or apiKeyHelper, and gateways differ on header style;
#     apiKeyHelper output is sent as x-api-key AND as a Bearer token, which every provider in providers.json
#     accepts. The key stays in an environment variable and is never written to disk.
#  2. A settings "env" block beats the process environment, even with --bare, and the user's own
#     ~/.claude/settings.json may set ANTHROPIC_BASE_URL (for example a local proxy). A worker would then
#     send the provider's key to the wrong host (found 2026-11-25: every worker got "Invalid API key"). The
#     --settings file outranks user settings, so the connection details are written into ITS env block.
# The helper is "node -p" because it runs the same under cmd and under Git Bash (cmd /c breaks in Git Bash).
function New-WorkerSettingsFile($Prov, [string]$OutPath) {
    $src = Join-Path $CrewDir 'worker-settings.json'
    if (-not (Test-Path -LiteralPath $src)) { $src = Join-Path $SkillRoot 'assets\worker-settings.json' }
    $settings = Get-Content -Raw -Encoding UTF8 -LiteralPath $src | ConvertFrom-Json
    if (Get-Command node -ErrorAction SilentlyContinue) { $helper = 'node -p "process.env.NEXUS_CREW_KEY"' }
    elseif ($IsWin) { $helper = 'cmd /c echo %NEXUS_CREW_KEY%' }
    else { $helper = 'printenv NEXUS_CREW_KEY' }
    $settings | Add-Member -NotePropertyName apiKeyHelper -NotePropertyValue $helper -Force
    $workerEnv = [ordered]@{
        ANTHROPIC_BASE_URL                       = $Prov.BaseUrl
        ANTHROPIC_MODEL                          = $Prov.Model
        ANTHROPIC_DEFAULT_OPUS_MODEL             = $Prov.Model
        ANTHROPIC_DEFAULT_SONNET_MODEL           = $Prov.Model
        ANTHROPIC_DEFAULT_HAIKU_MODEL            = $Prov.Model
        ANTHROPIC_SMALL_FAST_MODEL               = $Prov.Model
        CLAUDE_CODE_SUBAGENT_MODEL               = $Prov.Model
        CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = '1'
    }
    $settings | Add-Member -NotePropertyName env -NotePropertyValue ([pscustomobject]$workerEnv) -Force
    [IO.File]::WriteAllText($OutPath, ($settings | ConvertTo-Json -Depth 5), (New-Object Text.UTF8Encoding $false))
    return $OutPath
}
# Clean environment for the child only (this script's process): the parent session's CLAUDE_* and
# ANTHROPIC_* variables break auth. The key is exported for the apiKeyHelper to read.
function Initialize-WorkerEnv($Prov) {
    foreach ($e in @(Get-ChildItem Env: | Where-Object { $_.Name -match '^(ANTHROPIC_|CLAUDE)' })) { [Environment]::SetEnvironmentVariable($e.Name, $null, 'Process') }
    if ($Prov.Key) { $env:NEXUS_CREW_KEY = $Prov.Key } else { $env:NEXUS_CREW_KEY = 'none' }
    $env:ANTHROPIC_BASE_URL = $Prov.BaseUrl
    $env:ANTHROPIC_MODEL = $Prov.Model
    $env:ANTHROPIC_DEFAULT_OPUS_MODEL = $Prov.Model
    $env:ANTHROPIC_DEFAULT_SONNET_MODEL = $Prov.Model
    $env:ANTHROPIC_DEFAULT_HAIKU_MODEL = $Prov.Model
    $env:ANTHROPIC_SMALL_FAST_MODEL = $Prov.Model
    $env:CLAUDE_CODE_SUBAGENT_MODEL = $Prov.Model
    $env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = '1'
}

# ---- project hook ----
# .crew\env.ps1 may set up the project's native toolchain and define Initialize-CrewUnit($Work),
# for example to give every checkout its own build folder.
$CrewHook = Join-Path $CrewDir 'env.ps1'
if (Test-Path -LiteralPath $CrewHook) { . $CrewHook }
function Set-CrewUnitEnv([string]$Work) {
    if (Get-Command Initialize-CrewUnit -ErrorAction SilentlyContinue) { Initialize-CrewUnit $Work }
}

# ---- worker budgets (anti-overthinking) ----
# Fast reasoning models (DeepSeek V4.x and friends) loop on re-reading and re-planning when nothing stops
# them. Every worker run gets three hard stops: an effort level (caps thinking), a turn cap and a wall clock.
# Defaults per mode; override any of them in .crewconfig.json "worker_budget": { "build": { ... } }.
$DefaultBudget = @{
    build  = @{ effort = 'low';    max_turns = 60; timeout_min = 20; thinking_tokens = 4000 }
    test   = @{ effort = 'low';    max_turns = 40; timeout_min = 12; thinking_tokens = 3000 }
    fix    = @{ effort = 'low';    max_turns = 30; timeout_min = 10; thinking_tokens = 2000 }
    review = @{ effort = 'medium'; max_turns = 25; timeout_min = 10; thinking_tokens = 6000 }
    brief  = @{ effort = 'medium'; max_turns = 20; timeout_min = 8;  thinking_tokens = 4000 }
}
function Get-WorkerBudget([string]$Mode) {
    $b = @{} + $DefaultBudget[$Mode]
    $cfg = Get-Cfg 'worker_budget' $null
    if ($cfg -and $cfg.PSObject.Properties[$Mode]) {
        foreach ($p in $cfg.PSObject.Properties[$Mode].Value.PSObject.Properties) { $b[$p.Name] = $p.Value }
    }
    return $b
}

# Run a native program with a wall-clock limit; the child gets this process's environment.
# Returns @{ Out; Err; TimedOut; Code; Seconds }. Arguments are quoted for CommandLineToArgvW.
function Invoke-Bounded([string]$Exe, [string[]]$ArgList, [string]$WorkDir, [int]$TimeoutSec) {
    $psi = New-Object Diagnostics.ProcessStartInfo
    $psi.FileName = $Exe
    $psi.Arguments = (($ArgList | ForEach-Object {
        if ($_ -eq '') { '""' } elseif ($_ -match '[\s"]') { '"' + ($_ -replace '(\\*)"', '$1$1\"' -replace '(\\+)$', '$1$1') + '"' } else { $_ }
    }) -join ' ')
    $psi.UseShellExecute = $false; $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true; $psi.RedirectStandardInput = $true
    $psi.StandardOutputEncoding = New-Object Text.UTF8Encoding $false
    $psi.WorkingDirectory = $WorkDir
    $sw = [Diagnostics.Stopwatch]::StartNew()
    $proc = [Diagnostics.Process]::Start($psi)
    $proc.StandardInput.Close()
    $so = $proc.StandardOutput.ReadToEndAsync(); $se = $proc.StandardError.ReadToEndAsync()
    $done = $proc.WaitForExit($TimeoutSec * 1000)
    if (-not $done) {
        # Kill the whole tree: claude may have started node or test processes.
        if ($IsWin) { & taskkill /PID $proc.Id /T /F 2>$null | Out-Null } else { try { $proc.Kill() } catch { } }
        [void]$proc.WaitForExit(5000)
    }
    $out = ''; $err = ''
    try { $out = $so.Result } catch { }
    try { $err = $se.Result } catch { }
    $code = -1; if ($done) { $code = $proc.ExitCode }
    return [pscustomobject]@{ Out = $out; Err = $err; TimedOut = (-not $done); Code = $code; Seconds = [int]$sw.Elapsed.TotalSeconds }
}

# UTF-8 without BOM, always. Never use Add-Content/Set-Content/Out-File on briefs: Windows PowerShell 5.1
# writes them in the ANSI codepage or with a BOM, which corrupted briefs in a real run.
function Write-Utf8([string]$Path, [string]$Text, [switch]$Append) {
    $enc = New-Object Text.UTF8Encoding $false
    if ($Append) { [IO.File]::AppendAllText($Path, $Text, $enc) } else { [IO.File]::WriteAllText($Path, $Text, $enc) }
}
