<#
.SYNOPSIS  Manage a Nexus Crew unit's git worktree.
.EXAMPLE   .\unit.ps1 -Action start  -Unit U-001
.EXAMPLE   .\unit.ps1 -Action finish -Unit U-001 -Message "feat(core): window resize"
.EXAMPLE   .\unit.ps1 -Action abort  -Unit U-001 -Variant 2
.DESCRIPTION
  start  creates branch crew/<unit> in <project>.crew\<unit> from the base (default: the branch the main checkout is on)
  path   prints the worktree path
  finish commits what is left (checkpointed work is fine), merges with --no-ff, removes the worktree and branch
  abort  removes the worktree and force-deletes the branch
#>
param(
    [Parameter(Mandatory)][ValidateSet('start', 'finish', 'abort', 'path')][string]$Action,
    [Parameter(Mandatory)][string]$Unit,
    [int]$Variant = 0,
    [string]$Base = '',
    [string]$Message = ''
)
. "$PSScriptRoot\_common.ps1"

$name   = Get-UnitName $Unit $Variant
$path   = Get-UnitPath $Unit $Variant
$branch = "crew/$name"
if (-not $Base) { $Base = (git -C $CrewRoot rev-parse --abbrev-ref HEAD).Trim() }

switch ($Action) {
    'path' { $path }
    'start' {
        if (Test-Path -LiteralPath $path) { "exists: $path"; break }
        New-Item -ItemType Directory -Force $WtRoot | Out-Null
        git -C $CrewRoot worktree add -q -b $branch $path $Base 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "git worktree add failed for $name" }
        "started $name at $path (branch $branch from $Base)"
    }
    'finish' {
        if (-not $Message) { throw '-Message is required (a Conventional Commit; add your attribution trailer if your setup requires one)' }
        $trailer = Get-Cfg 'commit_trailer' $null
        if ($trailer) { $Message = $Message + "`n`n" + $trailer }
        git -C $path add -A
        # Work that was checkpointed earlier has nothing left to commit.
        if (git -C $path status --porcelain) {
            git -C $path commit -q -m $Message
            if ($LASTEXITCODE -ne 0) { throw "commit failed in $path" }
        }
        git -C $CrewRoot merge --no-ff -q $branch -m "merge $branch"
        if ($LASTEXITCODE -ne 0) { throw "merge of $branch failed: resolve conflicts in $CrewRoot" }
        git -C $CrewRoot worktree remove $path
        git -C $CrewRoot branch -q -d $branch
        "finished ${name}: merged into $Base"
    }
    'abort' {
        git -C $CrewRoot worktree remove --force $path 2>&1 | Out-Null
        git -C $CrewRoot branch -q -D $branch 2>&1 | Out-Null
        "aborted $name"
    }
}