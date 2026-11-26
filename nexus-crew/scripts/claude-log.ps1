<#
.SYNOPSIS  Record one Claude delegation (planner, builder, reviewer) in .crew\ledger.csv so report.ps1 can show
           the real split between worker and Claude usage, not an estimate.
.DESCRIPTION
  Agent results end with a usage block such as "total_tokens: 41235  duration_ms: 93000". Pass those numbers.
  Roles: plan, build, review, sentinel, debug, other, and orchestrator: the main session's OWN tokens for the
  batch (briefs, escalations, merges). Log it once at the end (-Unit ALL), from the host's usage view; without
  it the report overstates the saving.
.EXAMPLE  .\claude-log.ps1 -Unit U-003 -Role review -Model sonnet -Tokens 41235 -Seconds 93
.EXAMPLE  .\claude-log.ps1 -Unit ALL -Role orchestrator -Model opus -Tokens 250000
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [Parameter(Mandatory)][ValidateSet('plan', 'build', 'review', 'sentinel', 'debug', 'other', 'orchestrator')][string]$Role,
    [Parameter(Mandatory)][string]$Model,
    [Parameter(Mandatory)][long]$Tokens,
    [int]$Seconds = 0
)
. "$PSScriptRoot\_common.ps1"
Add-LedgerRow $Unit ("claude-" + $Role) 0 'claude' $Model $Seconds '' $true $Tokens ''
"logged claude $Role for $Unit : $Tokens tokens ($Model)"
