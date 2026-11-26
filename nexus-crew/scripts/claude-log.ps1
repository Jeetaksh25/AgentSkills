<#
.SYNOPSIS  Record one Claude delegation (planner, builder, reviewer) in .crew\ledger.csv so report.ps1 can show
           the real split between worker and Claude usage, not an estimate.
.DESCRIPTION
  Agent results end with a usage block such as "total_tokens: 41235  duration_ms: 93000". Pass those numbers.
  Roles: plan, build, review, sentinel, debug, other.
.EXAMPLE  .\claude-log.ps1 -Unit U-003 -Role review -Model sonnet -Tokens 41235 -Seconds 93
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [Parameter(Mandatory)][ValidateSet('plan', 'build', 'review', 'sentinel', 'debug', 'other')][string]$Role,
    [Parameter(Mandatory)][string]$Model,
    [Parameter(Mandatory)][long]$Tokens,
    [int]$Seconds = 0
)
. "$PSScriptRoot\_common.ps1"
Add-LedgerRow $Unit ("claude-" + $Role) 0 'claude' $Model $Seconds '' $true $Tokens ''
"logged claude $Role for $Unit : $Tokens tokens ($Model)"
