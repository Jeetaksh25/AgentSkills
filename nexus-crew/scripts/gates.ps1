<#
.SYNOPSIS  Gate 1: run the automatic checks for a unit and write a short digest.
.DESCRIPTION
  Runs, in this order:
    1. auto-detected checks: cargo fmt/clippy/test when Cargo.toml exists, and the typecheck/lint/test scripts
       when package.json exists (pnpm, yarn or npm by lockfile). Switch off with "autodetect_gates": false.
    2. the commands in .crew\config.json "gates" (strings, or objects with name and command)
    3. every command listed under "## Checks" in the unit brief; the executable must be in allowed_executables
  Always: a change check against the base branch, and a secret scan of the working diff and of every commit
  since the base (a secret removed in a later commit is still in the pushed history).
  Writes .crew\runs\<unit>\gates-<name>.txt (digest) and gates-<name>.log (full output). Exit code 1 on FAIL.
  Local services: each entry of config "services" (for example Postgres in Docker) is probed first. When one
  is down, the gates whose label matches its "gates" regex run its "when_down" command instead, or are marked
  [SKIP] with the start hint. A skip never fails the gate, but the digest says so on its first line, so
  "PASS" never silently means "half the tests did not run".
  -Only <regex> runs only the gates whose label matches; -Skip <regex> marks matching gates [SKIP].
  Run ONE gate at a time on a busy machine: timing-sensitive tests fail under parallel load.
.EXAMPLE  .\gates.ps1 -Unit U-001
.EXAMPLE  .\gates.ps1 -Unit U-001 -Only 'typecheck|lint'
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [int]$Variant = 0,
    [switch]$InRepo,
    [string]$Only = '',
    [string]$Skip = '',
    # Quick: only the brief's own Checks plus the change, scope and secret checks; the project-wide gates
    # (full suites) are left out. loop.ps1 uses it for fix rounds and runs the full gates once quick passes.
    # Without brief Checks a quick run is a full run.
    [switch]$Quick
)
. "$PSScriptRoot\_common.ps1"

$name = Get-UnitName $Unit $Variant
$work = Get-UnitPath $Unit $Variant -InRepo:$InRepo
Set-CrewUnitEnv $work
$run  = Get-RunDir $Unit
$full = Join-Path $run "gates-$name.log"
$dig  = Join-Path $run "gates-$name.txt"
Write-Utf8 $full ''
$results = New-Object System.Collections.ArrayList

# ---- local services ----
function Test-Service($svc) {
    if ($svc.tcp) {
        $hp = ([string]$svc.tcp) -split ':'
        $c = New-Object Net.Sockets.TcpClient
        try { $ar = $c.BeginConnect($hp[0], [int]$hp[1], $null, $null); return ($ar.AsyncWaitHandle.WaitOne(1500) -and $c.Connected) }
        catch { return $false } finally { $c.Close() }
    }
    if ($svc.check) { Invoke-CrewShell ([string]$svc.check) | Out-Null; return ($LASTEXITCODE -eq 0) }
    return $true
}
$downServices = @()
foreach ($svc in @(Get-Cfg 'services' @())) {
    if (-not (Test-Service $svc)) { $downServices += $svc }
}
# No services configured, but the repo has a compose file and Docker is not answering: say so once.
$serviceNote = ''
if (-not @(Get-Cfg 'services' @()).Count) {
    $compose = @('docker-compose.yml', 'compose.yaml', 'compose.yml', 'infra\docker-compose.yml', 'infra\compose.yaml') | Where-Object { Test-Path -LiteralPath (Join-Path $work $_) } | Select-Object -First 1
    if ($compose -and (Get-Command docker -ErrorAction SilentlyContinue)) {
        docker info 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) { $serviceNote = "NOTE: $compose exists but Docker is not running; tests that need it will fail. Add a 'services' entry to .crew\config.json to skip or swap them (references/configuration.md)." }
    }
}

function Add-Skip([string]$Label, [string]$Why) { [void]$results.Add([pscustomobject]@{ Gate = $Label; Status = 'SKIP'; Detail = $Why }) }

function Invoke-Gate([string]$Label, [string]$CommandLine) {
    if ($Only -and $Label -notmatch $Only) { return }
    if ($Skip -and $Label -match $Skip) { Add-Skip $Label "skipped by -Skip '$Skip'"; return }
    foreach ($svc in $downServices) {
        if ($svc.gates -and $Label -match [string]$svc.gates) {
            if ($svc.when_down) { $Label = "$Label (without $($svc.name))"; $CommandLine = [string]$svc.when_down; break }
            $hint = ''; if ($svc.hint) { $hint = "; start it with: $($svc.hint)" }
            Add-Skip $Label "$($svc.name) is not running$hint"; return
        }
    }
    $exe = ($CommandLine -split '\s+')[0]
    if (-not (Get-Command $exe -ErrorAction SilentlyContinue)) {
        [void]$results.Add([pscustomobject]@{ Gate = $Label; Status = 'FAIL'; Detail = "$exe is not installed" }); return
    }
    Push-Location $work
    try { $out = Invoke-CrewShell $CommandLine; $code = $LASTEXITCODE } finally { Pop-Location }
    Write-Utf8 $full ("===== $Label :: $CommandLine (exit $code)`n$out`n") -Append
    # One re-run of a failed gate (retry_failed_gates, default 1). A timeout in a test the unit never
    # touched sent workers chasing unrelated files until TURN_LIMIT in a real run.
    $retries = [int](Get-Cfg 'retry_failed_gates' 1); $flaky = $false
    for ($i = 0; $code -ne 0 -and $i -lt $retries; $i++) {
        Push-Location $work
        try { $out2 = Invoke-CrewShell $CommandLine; $code2 = $LASTEXITCODE } finally { Pop-Location }
        Write-Utf8 $full ("===== $Label :: retry $($i + 1) (exit $code2)`n$out2`n") -Append
        if ($code2 -eq 0) { $code = 0; $flaky = $true } else { $out = $out2; $code = $code2 }
    }
    $detail = ''
    if ($code -ne 0) { $detail = (($out -split "`r?`n") | Where-Object { $_ -match '\S' } | Select-Object -Last 25) -join "`n" }
    if ($flaky) { $detail = 'failed once, passed on re-run (flaky; see the gate log)' }
    $status = 'FAIL'; if ($code -eq 0) { $status = 'PASS' }
    [void]$results.Add([pscustomobject]@{ Gate = $Label; Status = $status; Detail = $detail })
}

# One gate run at a time per project (gate_lock, default on): parallel loops ran the full UI suite
# four times at once and unrelated timing-sensitive tests timed out. Waits up to 60 minutes.
$gateLock = $null
if ([bool](Get-Cfg 'gate_lock' $true)) {
    $sha = [Security.Cryptography.SHA1]::Create()
    $key = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($CrewRoot.ToLowerInvariant()))) -replace '-', '').Substring(0, 16)
    $gateLock = New-Object Threading.Mutex($false, "Local\nexus-crew-gates-$key")
    $waited = [Diagnostics.Stopwatch]::StartNew()
    try { [void]$gateLock.WaitOne([TimeSpan]::FromMinutes(60)) } catch [Threading.AbandonedMutexException] { }
    if ($waited.Elapsed.TotalSeconds -ge 5) { Write-Host "gates: waited $([int]$waited.Elapsed.TotalSeconds)s for another unit's gates" }
}

$briefFile = Join-Path $CrewDir "units\$Unit.md"
$briefHasChecks = $false
if (Test-Path -LiteralPath $briefFile) {
    $inC = $false
    foreach ($bl in Get-Content -Encoding UTF8 -LiteralPath $briefFile) {
        if ($bl -match '^##\s') { $inC = ($bl -match '^##\s+Checks'); continue }
        if ($inC -and $bl -match '^\s*-\s*`[^`]+`') { $briefHasChecks = $true; break }
    }
}
$quickRun = $Quick -and $briefHasChecks
$auto = (-not $quickRun) -and [bool](Get-Cfg 'autodetect_gates' $true)
if ($auto -and (Test-Path -LiteralPath (Join-Path $work 'Cargo.toml'))) {
    Invoke-Gate 'cargo fmt'    'cargo fmt --all -- --check'
    Invoke-Gate 'cargo clippy' 'cargo clippy --all-targets -- -D warnings'
    Invoke-Gate 'cargo test'   'cargo test'
}
$pkg = Join-Path $work 'package.json'
if ($auto -and (Test-Path -LiteralPath $pkg)) {
    $scripts = (Get-Content -Raw -Encoding UTF8 -LiteralPath $pkg | ConvertFrom-Json).scripts
    $pm = 'npm'
    if (Test-Path -LiteralPath (Join-Path $work 'pnpm-lock.yaml')) { $pm = 'pnpm' } elseif (Test-Path -LiteralPath (Join-Path $work 'yarn.lock')) { $pm = 'yarn' }
    $ws = Test-Path -LiteralPath (Join-Path $work 'pnpm-workspace.yaml')
    foreach ($s in 'typecheck', 'lint', 'test') {
        if ($pm -eq 'pnpm' -and $ws) { Invoke-Gate "pnpm $s" "pnpm -r --if-present run $s" }
        elseif ($scripts -and ($scripts.PSObject.Properties.Name -contains $s)) { Invoke-Gate "$pm $s" "$pm run $s" }
    }
}
$configGates = @(Get-Cfg 'gates' @()); if ($quickRun) { $configGates = @() }
foreach ($g in $configGates) {
    if ($g -is [string]) { Invoke-Gate $g $g }
    elseif ($g.command) {
        $label = $g.name; if (-not $label) { $label = [string]$g.command }
        Invoke-Gate $label ([string]$g.command)
    }
}
# Brief-defined checks: lines like  - `node --test tests/x.test.js`
$allowed = Get-AllowedExe
$brief = Join-Path $CrewDir "units\$Unit.md"
if (Test-Path -LiteralPath $brief) {
    $inChecks = $false
    foreach ($line in Get-Content -Encoding UTF8 -LiteralPath $brief) {
        if ($line -match '^##\s') { $inChecks = ($line -match '^##\s+Checks'); continue }
        if ($inChecks -and $line -match '^\s*-\s*`([^`]+)`') {
            $cmd = $Matches[1].Trim()
            if ($allowed -contains (($cmd -split '\s+')[0])) { Invoke-Gate "brief: $cmd" $cmd }
            else { [void]$results.Add([pscustomobject]@{ Gate = "brief: $cmd"; Status = 'FAIL'; Detail = 'executable not in allowed_executables' }) }
        }
    }
}

if ($gateLock) { try { $gateLock.ReleaseMutex() } catch { }; $gateLock.Dispose() }

$base = Get-DiffBase $work -InRepo:$InRepo
git -C $work add -A -N 2>&1 | Out-Null
# Changes exist (not for in-repo runs): committed WIP counts.
if (-not $InRepo) {
    # stderr stays out of the list: on Windows git warns "LF will be replaced by CRLF" per file, and those
    # lines would read as changed paths (the selftest caught it).
    $changes = @(git -C $work diff --name-only $base 2>$null)
    $gitOk = ($LASTEXITCODE -eq 0)
    $st = 'FAIL'; $dt = 'no changes against the base branch'
    if (-not $gitOk) { $dt = "git diff failed, so changes could not be read: $((git -C $work diff --name-only $base 2>&1 | Out-String).Trim())" }
    elseif ($changes) { $st = 'PASS'; $dt = '' }
    [void]$results.Add([pscustomobject]@{ Gate = 'has changes'; Status = $st; Detail = $dt })
    # Scope: every changed file must be listed under the brief's "## Files" (backticked paths; * and **
    # allowed). A fix worker chasing a flaky unrelated test edited two out-of-scope files in a real run.
    if ($gitOk -and $changes -and (Test-Path -LiteralPath $brief)) {
        $allowedFiles = @(); $inFiles = $false
        foreach ($line in Get-Content -Encoding UTF8 -LiteralPath $brief) {
            if ($line -match '^##\s') { $inFiles = ($line -match '^##\s+Files'); continue }
            if ($inFiles -and $line -match '^\s*-\s*`([^`]+)`') { $allowedFiles += ($Matches[1].Trim() -replace '\\', '/') }
        }
        if ($allowedFiles.Count -gt 0) {
            $patterns = foreach ($f in $allowedFiles) {
                '^' + ([regex]::Escape($f) -replace '\\\*\\\*', '.*' -replace '\\\*', '[^/]*') + '$'
            }
            $outside = @($changes | ForEach-Object { "$_".Trim() -replace '\\', '/' } | Where-Object {
                $p = $_; $_ -and -not ($patterns | Where-Object { $p -match $_ })
            })
            if ($outside.Count -gt 0) {
                [void]$results.Add([pscustomobject]@{ Gate = 'scope'; Status = 'FAIL'; Detail = "changed outside the brief's Files list (revert them, or ask for the brief to be widened): $($outside -join ', ')" })
            } else {
                [void]$results.Add([pscustomobject]@{ Gate = 'scope'; Status = 'PASS'; Detail = '' })
            }
        }
    }
}
# Secret scan: the working diff plus every commit since the base. Fails closed when git cannot be read.
$diff = git -C $work diff --text $base | Out-String
$scanned = ($LASTEXITCODE -eq 0)
$history = git -C $work log -p --text --no-color "$base..HEAD" | Out-String
$scanned = $scanned -and ($LASTEXITCODE -eq 0)
$all = "$diff`n$history"
$leak = -not $scanned
$why = ''
if (-not $scanned) { $why = 'git could not produce the diff, so nothing was scanned' }
foreach ($m in [regex]::Matches($all, '(?m)^\+\+\+ b/(?:.*/)?(\.env[^\r\n/]*)\r?$')) {
    if ($m.Groups[1].Value -ne '.env.example') { $leak = $true; $why = 'an .env file is part of the diff' }
}
foreach ($sv in (Get-SecretValues)) { if ($all.Contains($sv)) { $leak = $true; $why = 'a configured API key or secret value appears in the diff'; break } }
if ($all -match '-----BEGIN [A-Z ]*PRIVATE KEY-----') { $leak = $true; $why = 'a private key block appears in the diff' }
$ls = 'PASS'; $ld = ''
if ($leak) { $ls = 'FAIL'; $ld = $why }
[void]$results.Add([pscustomobject]@{ Gate = 'secret scan'; Status = $ls; Detail = $ld })

$overall = 'PASS'; if ($results | Where-Object Status -eq 'FAIL') { $overall = 'FAIL' }
$skips = @($results | Where-Object Status -eq 'SKIP').Count
$tag = $overall; if ($skips) { $tag = "$overall ($skips SKIPPED, not verified)" }
if ($quickRun) { $tag = "$tag (quick)" }
$lines = @("GATES $tag  unit=$name  $(Get-Date -Format s)")
foreach ($svc in $downServices) { $lines += "SERVICE DOWN: $($svc.name)$(if ($svc.hint) { ' -> ' + $svc.hint })" }
if ($serviceNote) { $lines += $serviceNote }
foreach ($r in $results) {
    $lines += "[$($r.Status)] $($r.Gate)"
    if ($r.Detail) { $lines += (($r.Detail -split "`n") | ForEach-Object { "    $_" }) }
}
Write-Utf8 $dig (($lines -join "`n") + "`n")
$lines
if ($overall -eq 'FAIL') { exit 1 }