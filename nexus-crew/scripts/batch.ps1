<#
.SYNOPSIS  Unattended worker batch: use it while the Claude budget is spent or you are away.
.DESCRIPTION
  For each unit in -Build:    loop.ps1 (worker build, Gate 1, worker fix rounds, cross-review, fix), then a WIP checkpoint.
  For each unit in -GateOnly: the same with -SkipBuild (units that are already built).
  The checkpoint commit happens only when the secret scan passed; -Push also pushes the crew branch.
  Units run one after another (several batches in separate shells give parallelism, see references/pipeline.md).
  Nothing is merged: merging needs the Claude Gate 3 review. Results are appended to .crew\STATUS.md.
.EXAMPLE  .\batch.ps1 -Build U-002,U-003 -GateOnly U-001 -Push
#>
param([string[]]$Build = @(), [string[]]$GateOnly = @(), [switch]$Push)
. "$PSScriptRoot\_common.ps1"
if (-not ($Build.Count + $GateOnly.Count)) { throw 'Pass -Build and/or -GateOnly with unit ids.' }
$log = Join-Path $CrewDir ("runs\batch-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + ".log")
New-Item -ItemType Directory -Force (Split-Path $log -Parent) | Out-Null
function Write-Log($m) { Write-Utf8 $log ("$(Get-Date -Format 'HH:mm:ss') $m`n") -Append }

function Save-Checkpoint($u, $note) {
    $w = Join-Path $WtRoot $u
    $digest = Join-Path $CrewDir "runs\$u\gates-$u.txt"
    $secretOk = (Test-Path -LiteralPath $digest) -and (Select-String -LiteralPath $digest -Pattern '\[PASS\] secret scan' -Quiet)
    if (-not $secretOk) { Write-Log "$u : NOT committed (secret scan missing or failed)"; return }
    $msg = "wip(${u}): $note (worker batch, not reviewed, not merged)"
    $trailer = Get-Cfg 'commit_trailer' $null
    if ($trailer) { $msg = $msg + "`n`n" + $trailer }
    git -C $w add -A 2>$null
    git -C $w commit -q -m $msg 2>$null
    if ($Push) { git -C $w push -q origin "crew/$u" 2>$null; Write-Log "$u : checkpoint committed and pushed ($note)" }
    else { Write-Log "$u : checkpoint committed locally ($note)" }
}

$results = @()
foreach ($u in ($Build + $GateOnly)) {
    try {
        $loopArgs = @{ Unit = $u }
        if ($GateOnly -contains $u) { $loopArgs.SkipBuild = $true }
        Write-Log "$u : worker loop ($(if ($loopArgs.SkipBuild) { 'gates + fixes + cross-review' } else { 'build + gates + fixes + cross-review' }))"
        $out = & (Join-Path $PSScriptRoot 'loop.ps1') @loopArgs 2>&1 | Out-String
        $final = (($out -split "`r?`n") | Where-Object { $_ -match '^LOOP ' } | Select-Object -Last 1)
        if (-not $final) { $final = 'LOOP ERROR (no summary line; see the run folder)' }
        Write-Log "$u : $final"
        Save-Checkpoint $u ($final -replace '^LOOP ([A-Z]+).*', 'worker loop $1')
        $results += "| $u | $final | ``.crew/runs/$u/`` |"
    } catch {
        Write-Log "$u : ERROR $($_.Exception.Message)"
        $results += "| $u | ERROR | see the batch log |"
    }
}
$section = "`n## Unattended worker batch ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))`nNo Claude usage. Nothing merged: each READY unit still needs Gate 3 (Claude review); ESCALATE units need a Claude builder or a re-plan.`n`n| Unit | Loop result | Logs |`n|---|---|---|`n" + ($results -join "`n") + "`n`nBatch log: ``$log``.`n"
Write-Utf8 (Join-Path $CrewDir 'STATUS.md') $section -Append
Write-Log 'batch done'
$results