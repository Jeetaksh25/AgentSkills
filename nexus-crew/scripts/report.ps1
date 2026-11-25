<#
.SYNOPSIS  Summarise the worker runs in .crew\ledger.csv: runs, minutes, tokens and an optional cost estimate.
.DESCRIPTION
  Cost is estimated only for models listed under "pricing" in .crew\config.json (in_per_million, out_per_million
  in your currency). Claude-side usage is not tracked here: use the Nexus ledger or the host's usage view.
.EXAMPLE  .\report.ps1
.EXAMPLE  .\report.ps1 -Since 20261125     # only runs from that date on (timestamp prefix yyyyMMdd)
#>
param([string]$Since = '')
. "$PSScriptRoot\_common.ps1"
$ledger = Join-Path $CrewDir 'ledger.csv'
if (-not (Test-Path -LiteralPath $ledger)) { 'No worker runs recorded yet (.crew\ledger.csv).'; return }
$rows = @(Import-Csv -LiteralPath $ledger -Encoding UTF8)
if ($Since) { $rows = @($rows | Where-Object { $_.timestamp -ge $Since }) }
if (-not $rows.Count) { 'No worker runs in that range.'; return }
$pricing = Get-Cfg 'pricing' $null

function To-Num($v) { $n = 0.0; if ([double]::TryParse([string]$v, [ref]$n)) { return $n } else { return 0.0 } }

$table = foreach ($grp in ($rows | Group-Object { "$($_.provider)|$($_.model)" })) {
    $first = $grp.Group[0]
    $in  = ($grp.Group | ForEach-Object { To-Num $_.input_tokens } | Measure-Object -Sum).Sum
    $out = ($grp.Group | ForEach-Object { To-Num $_.output_tokens } | Measure-Object -Sum).Sum
    $secs = ($grp.Group | ForEach-Object { To-Num $_.seconds } | Measure-Object -Sum).Sum
    $cost = 'n/a'
    if ($pricing -and $first.model -and $pricing.PSObject.Properties[$first.model]) {
        $pr = $pricing.PSObject.Properties[$first.model].Value
        $cost = '{0:N4}' -f (($in / 1e6) * (To-Num $pr.in_per_million) + ($out / 1e6) * (To-Num $pr.out_per_million))
    }
    [pscustomobject]@{
        Provider = $first.provider; Model = $first.model; Runs = $grp.Count
        Ok = @($grp.Group | Where-Object { $_.ok -eq 'True' }).Count
        Minutes = [math]::Round($secs / 60, 1); TokensIn = [long]$in; TokensOut = [long]$out; EstCost = $cost
    }
}
$table | Format-Table -AutoSize | Out-String
$byMode = $rows | Group-Object mode | ForEach-Object { $_.Name + '=' + $_.Count }
'Runs by mode: ' + ($byMode -join ', ')
'Claude-side usage is not in this ledger.'