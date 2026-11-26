<#
.SYNOPSIS  Append the next "## Fix round N" to a unit brief, numbered automatically, always UTF-8 without BOM.
.DESCRIPTION
  Use this, never Add-Content/Set-Content/Out-File: Windows PowerShell 5.1 writes those in the ANSI codepage
  or with a BOM, which corrupted briefs in a real run. Exactly one source per call:
    -FromGates        the [FAIL] lines of the latest Gate 1 digest (.crew\runs\<unit>\gates-<unit>.txt)
    -FromCrossReview  the FINDINGS of the latest worker cross-review (crossreview-<unit>.md)
    -File <path>      a fix list you wrote (Markdown; numbered items work best)
    -Text <string>    a short fix list given inline
  -Title adds a label, for example "Claude review". Prints the round number it wrote.
.EXAMPLE  .\fix-round.ps1 -Unit U-003 -FromGates
.EXAMPLE  .\fix-round.ps1 -Unit U-003 -File .crew\runs\U-003\claude-fixes.md -Title 'Claude review'
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [int]$Variant = 0,
    [switch]$FromGates,
    [switch]$FromCrossReview,
    [string]$File = '',
    [string]$Text = '',
    [string]$Title = '',
    [switch]$InRepo   # accepted so loop.ps1 can pass its common arguments; briefs live in the main checkout
)
. "$PSScriptRoot\_common.ps1"
$sources = @($FromGates, $FromCrossReview, [bool]$File, [bool]$Text) | Where-Object { $_ }
if (@($sources).Count -ne 1) { throw 'Pass exactly one of -FromGates, -FromCrossReview, -File, -Text.' }

$name  = Get-UnitName $Unit $Variant
$run   = Get-RunDir $Unit
$brief = Get-BriefPath $Unit
$body  = ''
if ($FromGates) {
    $dig = Join-Path $run "gates-$name.txt"
    if (-not (Test-Path -LiteralPath $dig)) { throw "No gate digest: $dig. Run gates.ps1 first." }
    $lines = Get-Content -Encoding UTF8 -LiteralPath $dig
    $out = New-Object System.Collections.Generic.List[string]
    $n = 0; $keep = $false
    foreach ($l in $lines) {
        if ($l -match '^\[FAIL\]\s*(.*)$') { $n++; $out.Add("$n. Make the gate pass: $($Matches[1]). Its output:"); $keep = $true; continue }
        if ($l -match '^\[(PASS|SKIP)\]') { $keep = $false; continue }
        if ($keep -and $l -match '^\s{4}(.*)$') { $out.Add('    ' + $Matches[1]) }
    }
    if (-not $n) { throw "The gate digest has no [FAIL] lines; nothing to fix." }
    $out.Add('Fix the cause in the code under test. Never weaken, skip or delete a test.')
    $body = $out -join "`n"
    if (-not $Title) { $Title = 'Gate 1' }
} elseif ($FromCrossReview) {
    $cr = Join-Path $run "crossreview-$name.md"
    if (-not (Test-Path -LiteralPath $cr)) { throw "No cross-review: $cr. Run worker.ps1 -Mode review first." }
    $t = Get-Content -Raw -Encoding UTF8 -LiteralPath $cr
    $m = [regex]::Match($t, '(?ms)FINDINGS:\s*\r?\n(.*?)(?:\r?\n```|\z)')
    if (-not $m.Success -or $m.Groups[1].Value.Trim() -match '^(none)?$') { throw 'The cross-review has no findings; nothing to fix.' }
    $body = $m.Groups[1].Value.Trim()
    if (-not $Title) { $Title = 'cross-review' }
} elseif ($File) {
    $body = (Get-Content -Raw -Encoding UTF8 -LiteralPath $File).Trim()
} else {
    $body = $Text.Trim()
}

$existing = Get-Content -Raw -Encoding UTF8 -LiteralPath $brief
$round = ([regex]::Matches($existing, '(?m)^## Fix round (\d+)') | ForEach-Object { [int]$_.Groups[1].Value } | Measure-Object -Maximum).Maximum
if (-not $round) { $round = 0 }
$round++
$head = "## Fix round $round"
if ($Title) { $head += " ($Title)" }
$sep = "`n`n"; if ($existing.EndsWith("`n")) { $sep = "`n" }
Write-Utf8 $brief ($sep + $head + "`nApply exactly, then re-run the Checks.`n" + $body + "`n") -Append
"wrote $head to $brief"
