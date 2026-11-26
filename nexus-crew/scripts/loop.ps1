<#
.SYNOPSIS  The worker self-fix loop: build -> Gate 1 -> fix -> Gate 1 ... -> cross-review -> fix -> Gate 1,
           all on the cheap worker, ending in ONE line that says whether the unit is ready for the Claude review.
.DESCRIPTION
  This is what makes the crew save Claude usage: the orchestrator dispatches one loop per unit and reads one
  summary line, instead of driving every gate and fix round by hand.
    1. worker build (or -Mode test for tier 2-3 units: the worker writes the failing tests only, and the loop
       stops there for the Claude builder)
    2. Gate 1. On FAIL: fix-round.ps1 -FromGates, worker -Mode fix, Gate 1 again, up to -Rounds times
    3. stall check: when a fix round leaves exactly the same failing gates and output, stop early ("no progress")
    4. Gate 2 (unless -NoCrossReview): review pack, worker cross-review; on FIXES, one more fix round from its
       findings and Gate 1 again. Only ONE cross-review cycle, so two workers never ping-pong.
    5. fresh review pack for Gate 3
  Final line (also in .crew\runs\<unit>\loop-<name>.txt):
    LOOP READY    unit=U-001 rounds=2 gates=PASS crossreview=FIXED pack=<path>   -> dispatch the Claude reviewer
    LOOP ESCALATE unit=U-001 reason=<why> digest=<path>                          -> Claude builder or re-plan
.EXAMPLE  .\loop.ps1 -Unit U-001
.EXAMPLE  .\loop.ps1 -Unit U-002 -Rounds 3 -Skip 'e2e'
.EXAMPLE  .\loop.ps1 -Unit U-003 -SkipBuild          # already built (by Claude, say): gates, fixes, cross-review
.EXAMPLE  .\loop.ps1 -Unit U-003 -SkipBuild -FixFirst -NoCrossReview   # apply the Claude review's fix round
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [int]$Variant = 0,
    [ValidateSet('build', 'test')][string]$Mode = 'build',
    [int]$Rounds = -1,
    [switch]$SkipBuild,
    [switch]$FixFirst,
    [switch]$NoCrossReview,
    [switch]$InRepo,
    [string]$Only = '',
    [string]$Skip = ''
)
. "$PSScriptRoot\_common.ps1"
if ($Rounds -lt 0) { $Rounds = [int](Get-Cfg 'max_fix_rounds' 3) }
$name = Get-UnitName $Unit $Variant
$run  = Get-RunDir $Unit
$dig  = Join-Path $run "gates-$name.txt"
$sum  = Join-Path $run "loop-$name.txt"
$common = @{ Unit = $Unit; Variant = $Variant }
if ($InRepo) { $common.InRepo = $true }
$gateArgs = @{} + $common
if ($Only) { $gateArgs.Only = $Only }
if ($Skip) { $gateArgs.Skip = $Skip }
$sw = [Diagnostics.Stopwatch]::StartNew()
$log = New-Object System.Collections.Generic.List[string]
function Step([string]$m) { $line = (Get-Date -Format 'HH:mm:ss') + ' ' + $m; $log.Add($line); Write-Host $line }

function Finish([string]$Verdict, [string]$Detail) {
    $line = "LOOP $Verdict unit=$name $Detail minutes=$([math]::Round($sw.Elapsed.TotalMinutes, 1))"
    Write-Utf8 $sum (((@($log) + $line) -join "`n") + "`n")
    $line
    if ($Verdict -ne 'READY') { exit 1 }
    exit 0
}
function Invoke-Worker([string]$M) {
    $out = & (Join-Path $PSScriptRoot 'worker.ps1') @common -Mode $M 2>&1 | Out-String
    $status = ([regex]::Match($out, 'STATUS:\s*(\S+)')).Groups[1].Value
    if (-not $status -and $M -eq 'review') { $status = ([regex]::Match($out, 'VERDICT:\s*(\S+)')).Groups[1].Value }
    $meta = ([regex]::Match($out, 'seconds=\d+ turns=\S*')).Value
    Step "worker $M -> $(if ($status) { $status } else { 'no status' }) $meta"
    return [pscustomobject]@{ Status = $status; Out = $out }
}
function Invoke-Gates([switch]$Quick) {
    $ga = @{} + $gateArgs
    if ($Quick) { $ga.Quick = $true }
    & (Join-Path $PSScriptRoot 'gates.ps1') @ga 2>&1 | Out-Null
    $first = (Get-Content -Encoding UTF8 -LiteralPath $dig -TotalCount 1)
    Step "gate 1 -> $first"
    return ($first -match '^GATES PASS')
}
# Staged gates (staged_gates, default on): the brief's own checks first, the full project gates only once
# those pass. A failing unit never waits for, or holds, the project-wide lock on a full suite.
$staged = [bool](Get-Cfg 'staged_gates' $true)
function Invoke-StagedGates {
    if (-not $staged) { return (Invoke-Gates) }
    if (-not (Invoke-Gates -Quick)) { return $false }
    $first = (Get-Content -Encoding UTF8 -LiteralPath $dig -TotalCount 1)
    if ($first -notmatch '\(quick\)') { return $true }   # the brief has no Checks: that was already the full run
    return (Invoke-Gates)
}
# New test files the brief requires (Files lines marked "(new" whose path looks like a test) that are
# missing or empty after the build. A build or fix worker that runs out of turns often leaves exactly these.
$work = Get-UnitPath $Unit $Variant -InRepo:$InRepo
function Get-MissingTests {
    $briefPath = Get-BriefPath $Unit
    $missing = @(); $inFiles = $false
    foreach ($line in Get-Content -Encoding UTF8 -LiteralPath $briefPath) {
        if ($line -match '^##\s') { $inFiles = ($line -match '^##\s+Files'); continue }
        if (-not $inFiles -or $line -notmatch '^\s*-\s*`([^`]+)`\s*\(new') { continue }
        $rel = $Matches[1]
        if ($rel -notmatch '(\.|_)(test|spec)\.|[\\/](tests?|__tests__)[\\/]') { continue }
        $full = Join-Path $work $rel
        $body = if (Test-Path -LiteralPath $full) { @(Get-Content -Encoding UTF8 -LiteralPath $full | Where-Object { $_ -match '\S' }).Count } else { 0 }
        if ($body -lt 3) { $missing += $rel }
    }
    return $missing
}
function Repair-MissingTests {
    $m = @(Get-MissingTests)
    if (-not $m.Count) { return }
    Step "missing or empty test files: $($m -join ', ') -> worker test"
    $t = Invoke-Worker 'test'
    if (Test-Fatal $t.Status) { Finish 'ESCALATE' "reason=`"writing the missing tests ended $($t.Status)$(Get-Notes $t)`"" }
}
# Failing gate lines and their output, without the timestamp header: used to spot a fix round that changed nothing.
function Get-FailPrint { return ((Get-Content -Encoding UTF8 -LiteralPath $dig | Select-Object -Skip 1 | Where-Object { $_ -notmatch '^\[(PASS|SKIP)\]' }) -join "`n") }
function Test-Fatal($s) { return ($s -in @('BLOCKED', 'TIMEOUT', 'TURN_LIMIT', 'LEAK')) -or -not $s }
# The worker's own NOTES (its question or diagnosis), one line, quotes made safe for the summary line.
function Get-Notes($w) {
    $q = ([regex]::Match($w.Out, '(?ms)NOTES:\s*(.{0,300})')).Groups[1].Value.Trim()
    if (-not $q) { return '' }
    return ': ' + ((($q -replace '`{3}[\s\S]*$', '') -replace '\s+', ' ').Trim() -replace '"', "'")
}

# 1. build or tests
if (-not $SkipBuild) {
    $b = Invoke-Worker $Mode
    if (Test-Fatal $b.Status) {
        $why = if ($b.Status) { $b.Status } else { 'the worker gave no status (launcher or provider error)' }
        Finish 'ESCALATE' "reason=`"$why$(Get-Notes $b)`""
    }
    if ($Mode -eq 'test') { Finish 'READY' 'tests-written=yes next=claude-builder' }
}

# 2-3. gates with worker fix rounds
$round = 0
# -FixFirst: a fix round (from the Claude review, say) is already in the brief, so apply it before gating;
# otherwise a unit whose gates already pass would never see the fixes.
if ($FixFirst) {
    $round++
    $f = Invoke-Worker 'fix'
    if (Test-Fatal $f.Status) { Finish 'ESCALATE' "reason=`"fix round ended $($f.Status)$(Get-Notes $f)`"" }
}
Repair-MissingTests
$pass = Invoke-StagedGates
while (-not $pass) {
    if ($round -ge $Rounds) { Finish 'ESCALATE' "reason=`"Gate 1 still failing after $round worker fix rounds`" digest=$dig" }
    $before = Get-FailPrint
    $round++
    & (Join-Path $PSScriptRoot 'fix-round.ps1') @common -FromGates | Out-Null
    $f = Invoke-Worker 'fix'
    if (Test-Fatal $f.Status) { Finish 'ESCALATE' "reason=`"fix round $round ended $($f.Status)$(Get-Notes $f)`" digest=$dig" }
    Repair-MissingTests
    $pass = Invoke-StagedGates
    if (-not $pass -and (Get-FailPrint) -eq $before) { Finish 'ESCALATE' "reason=`"no progress: fix round $round left the same failures`" digest=$dig" }
}

# 4. one cross-review cycle
$cross = 'skipped'
if (-not $NoCrossReview) {
    & (Join-Path $PSScriptRoot 'review-pack.ps1') @common | Out-Null
    $rv = Invoke-Worker 'review'
    $cross = if ($rv.Status) { $rv.Status } else { 'none' }
    if ($cross -eq 'FIXES') {
        if ($round -ge $Rounds + 1) { $cross = 'FIXES-unapplied' }
        else {
            $round++
            & (Join-Path $PSScriptRoot 'fix-round.ps1') @common -FromCrossReview | Out-Null
            $f = Invoke-Worker 'fix'
            if (Test-Fatal $f.Status) { Finish 'ESCALATE' "reason=`"cross-review fix round ended $($f.Status)$(Get-Notes $f)`"" }
            if (-not (Invoke-StagedGates)) { Finish 'ESCALATE' "reason=`"Gate 1 failed after the cross-review fixes`" digest=$dig" }
            $cross = 'FIXED'
        }
    }
}

# 5. fresh pack for Gate 3
& (Join-Path $PSScriptRoot 'review-pack.ps1') @common | Out-Null
$gateLine = (Get-Content -Encoding UTF8 -LiteralPath $dig -TotalCount 1) -replace '^GATES\s+', '' -replace '\s+unit=.*$', ''
Finish 'READY' "rounds=$round gates=`"$gateLine`" crossreview=$cross pack=$(Join-Path $run "review-pack-$name.md")"
