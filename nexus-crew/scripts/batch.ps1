<#
.SYNOPSIS  Unattended worker batch: use it while the Claude budget is spent or you are away.
.DESCRIPTION
  For each unit in -Build:    worker build, Gate 1, WIP checkpoint commit, review pack, worker cross-review.
  For each unit in -GateOnly: the same without the build (units that are already built).
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
function Write-Log($m) { Add-Content -LiteralPath $log -Value "$(Get-Date -Format 'HH:mm:ss') $m" -Encoding UTF8 }

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
        if ($Build -contains $u) {
            Write-Log "$u : worker build"
            $out = & (Join-Path $PSScriptRoot 'worker.ps1') -Unit $u -Mode build 2>&1 | Out-String
            $status = ([regex]::Match($out, 'STATUS:\s*(\S+)')).Groups[1].Value
            Write-Log "$u : build status=$status"
        }
        $g = & (Join-Path $PSScriptRoot 'gates.ps1') -Unit $u 2>&1 | Out-String
        $fails = ([regex]::Matches($g, '\[FAIL\][^\r\n]*') | ForEach-Object Value) -join '; '
        $gate1 = if ($fails) { "FAIL: $fails" } else { 'PASS' }
        Write-Log "$u : Gate 1 $gate1"
        Save-Checkpoint $u "built + Gate 1 $(if ($fails) { 'FAIL' } else { 'PASS' })"
        $gate2 = 'skipped (Gate 1 failed)'
        if (-not $fails) {
            & (Join-Path $PSScriptRoot 'review-pack.ps1') -Unit $u 2>$null | Out-Null
            $r = & (Join-Path $PSScriptRoot 'worker.ps1') -Unit $u -Mode review 2>&1 | Out-String
            $gate2 = ([regex]::Match($r, 'VERDICT:\s*(\S+)')).Groups[1].Value
            Write-Log "$u : Gate 2 cross-review $gate2"
        }
        $results += "| $u | $gate1 | $gate2 | ``.crew/runs/$u/`` |"
    } catch {
        Write-Log "$u : ERROR $($_.Exception.Message)"
        $results += "| $u | ERROR | - | see the batch log |"
    }
}
$section = "`n## Unattended worker batch ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))`nNo Claude usage. Nothing merged: each unit still needs Gate 3 (Claude review) and the cross-review fixes.`n`n| Unit | Gate 1 | Gate 2 (worker cross-review) | Logs |`n|---|---|---|---|`n" + ($results -join "`n") + "`n`nBatch log: ``$log``.`n"
Add-Content -LiteralPath (Join-Path $CrewDir 'STATUS.md') -Value $section -Encoding UTF8
Write-Log 'batch done'
$results