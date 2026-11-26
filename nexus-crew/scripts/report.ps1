<#
.SYNOPSIS  Summarise .crew\ledger.csv: worker runs and logged Claude delegations, tokens, minutes and cost,
           and what the worker share would have cost on Claude.
.DESCRIPTION
  Worker rows come from worker.ps1; Claude rows from claude-log.ps1 (log every Agent result's total_tokens).
  Cost uses "pricing" in .crew\config.json (in_per_million, out_per_million; Claude rows have one total, so they
  use in_per_million as a blended rate). "compare_model" (default: the first claude* entry in pricing) prices the
  worker tokens as if Claude had done that work, which is the saving this skill is for.
.EXAMPLE  .\report.ps1
.EXAMPLE  .\report.ps1 -Since 20261125     # only rows from that date on (timestamp prefix yyyyMMdd)
#>
param([string]$Since = '')
. "$PSScriptRoot\_common.ps1"
$ledger = Join-Path $CrewDir 'ledger.csv'
if (-not (Test-Path -LiteralPath $ledger)) { 'No runs recorded yet (.crew\ledger.csv).'; return }
$rows = @(Import-Csv -LiteralPath $ledger -Encoding UTF8)
if ($Since) { $rows = @($rows | Where-Object { $_.timestamp -ge $Since }) }
if (-not $rows.Count) { 'No runs in that range.'; return }
$pricing = Get-Cfg 'pricing' $null

function To-Num($v) { $n = 0.0; if ([double]::TryParse([string]$v, [ref]$n)) { return $n } else { return 0.0 } }
function Get-Price([string]$Model) {
    if ($pricing -and $Model -and $pricing.PSObject.Properties[$Model]) { return $pricing.PSObject.Properties[$Model].Value }
    return $null
}
function Get-Cost([string]$Model, [double]$In, [double]$Out) {
    $pr = Get-Price $Model
    if (-not $pr) { return $null }
    return ($In / 1e6) * (To-Num $pr.in_per_million) + ($Out / 1e6) * (To-Num $pr.out_per_million)
}

$table = foreach ($grp in ($rows | Group-Object { "$($_.provider)|$($_.model)" })) {
    $first = $grp.Group[0]
    $in  = ($grp.Group | ForEach-Object { To-Num $_.input_tokens } | Measure-Object -Sum).Sum
    $out = ($grp.Group | ForEach-Object { To-Num $_.output_tokens } | Measure-Object -Sum).Sum
    $secs = ($grp.Group | ForEach-Object { To-Num $_.seconds } | Measure-Object -Sum).Sum
    $c = Get-Cost $first.model $in $out
    [pscustomobject]@{
        Side = $(if ($first.provider -eq 'claude') { 'claude' } else { 'worker' })
        Provider = $first.provider; Model = $first.model; Runs = $grp.Count
        Ok = @($grp.Group | Where-Object { $_.ok -eq 'True' }).Count
        Minutes = [math]::Round($secs / 60, 1); TokensIn = [long]$in; TokensOut = [long]$out
        EstCost = $(if ($null -ne $c) { '{0:N4}' -f $c } else { 'n/a' }); _cost = $c
    }
}
$table | Select-Object Side, Provider, Model, Runs, Ok, Minutes, TokensIn, TokensOut, EstCost | Format-Table -AutoSize | Out-String

$w = @($table | Where-Object Side -eq 'worker'); $cl = @($table | Where-Object Side -eq 'claude')
$wTok = ($w | ForEach-Object { $_.TokensIn + $_.TokensOut } | Measure-Object -Sum).Sum
$cTok = ($cl | ForEach-Object { $_.TokensIn + $_.TokensOut } | Measure-Object -Sum).Sum
'Runs by mode: ' + (($rows | Group-Object mode | ForEach-Object { $_.Name + '=' + $_.Count }) -join ', ')
if (-not $cl.Count) { 'Claude side: nothing logged. Log each Agent result with claude-log.ps1 to measure the split.'; return }
$share = if ($wTok + $cTok) { [math]::Round(100 * $wTok / ($wTok + $cTok)) } else { 0 }
$orch = @($rows | Where-Object { $_.mode -eq 'claude-orchestrator' })
$oTok = ($orch | ForEach-Object { To-Num $_.input_tokens } | Measure-Object -Sum).Sum
"Token split: worker $wTok ($share%), Claude $cTok (delegations $($cTok - $oTok), orchestrator $oTok)"
if (-not $orch.Count) {
    'WARNING: the orchestrator (main session) is not logged, so this split overstates the saving. At the end of the batch run: claude-log.ps1 -Unit ALL -Role orchestrator -Model <model> -Tokens <main-session tokens from the host usage view>.'
}
$cmp = Get-Cfg 'compare_model' $null
if (-not $cmp -and $pricing) { $cmp = @($pricing.PSObject.Properties.Name | Where-Object { $_ -like 'claude*' })[0] }
$cmpPrice = Get-Price $cmp
$wCost = ($w | Where-Object { $null -ne $_._cost } | ForEach-Object { $_._cost } | Measure-Object -Sum).Sum
$cCost = ($cl | Where-Object { $null -ne $_._cost } | ForEach-Object { $_._cost } | Measure-Object -Sum).Sum
if ($cmpPrice) {
    $wIn = ($w | ForEach-Object { $_.TokensIn } | Measure-Object -Sum).Sum; $wOut = ($w | ForEach-Object { $_.TokensOut } | Measure-Object -Sum).Sum
    $asClaude = Get-Cost $cmp $wIn $wOut
    'Cost: workers {0:N2} + Claude {1:N2} = {2:N2}. The worker share on {3} would have cost {4:N2}, so the crew saved about {5:N2}.' -f $wCost, $cCost, ($wCost + $cCost), $cmp, $asClaude, ($asClaude - $wCost)
} else { 'Add a claude-* model to "pricing" (or set compare_model) to see the saving in money.' }
