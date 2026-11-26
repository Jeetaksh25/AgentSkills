<#
.SYNOPSIS  Goldfish check of a unit brief before dispatch: a fresh, read-only worker (no conversation history)
           looks for open decisions, wrong facts and untestable done-tests, and prints ONE line.
.DESCRIPTION
  Idea from Google's Elephant-Goldfish Model: the orchestrator (elephant) knows too much to see what its brief
  leaves out; a stateless reviewer (goldfish) does not. It runs on the cheap worker, so it costs almost no
  Claude usage, and a gap fixed here saves a whole build-and-fix loop.
    BRIEF READY unit=U-001 file=<findings>                    -> start the unit
    BRIEF GAPS  unit=U-001 blockers=1 majors=2 file=<findings> -> fix the brief (read the findings), then re-check
  Works before the worktree exists (it reads the base checkout).
.EXAMPLE  .\brief-check.ps1 -Unit U-001
.EXAMPLE  'U-001','U-002' | ForEach-Object { .\brief-check.ps1 -Unit $_ }
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [int]$Variant = 0
)
. "$PSScriptRoot\_common.ps1"
$name = Get-UnitName $Unit $Variant
$run  = Get-RunDir $Unit
$findings = Join-Path $run "brief-check-$name.md"
if (Test-Path -LiteralPath $findings) { Remove-Item -LiteralPath $findings -Force }
$out = & (Join-Path $PSScriptRoot 'worker.ps1') -Unit $Unit -Variant $Variant -Mode brief 2>&1 | Out-String
$verdict = [regex]::Match($out, 'VERDICT:\s*(READY|GAPS)[^\r\n]*')
if (-not $verdict.Success) {
    $status = ([regex]::Match($out, 'STATUS:\s*(\S+)')).Groups[1].Value
    if (-not $status) { $status = 'no verdict (launcher or provider error)' }
    "BRIEF ERROR unit=$name reason=`"$status`" log=$(([regex]::Match($out, 'log=(\S.*)')).Groups[1].Value.Trim())"
    exit 1
}
if ($verdict.Groups[1].Value -eq 'READY') { "BRIEF READY unit=$name file=$findings"; exit 0 }
$b = ([regex]::Match($verdict.Value, 'blockers=(\d+)')).Groups[1].Value
$m = ([regex]::Match($verdict.Value, 'majors=(\d+)')).Groups[1].Value
"BRIEF GAPS unit=$name blockers=$b majors=$m file=$findings"
exit 1
