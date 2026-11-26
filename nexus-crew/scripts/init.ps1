<#
.SYNOPSIS  Set up Nexus Crew in the current git project: creates .crew/ and the ignore rules.
.DESCRIPTION
  Creates .crew\config.json (provider, model, gates), project.md, lessons.md, units\_TEMPLATE.md and
  worker-settings.json, and makes sure .env and .crew/runs/ are git-ignored. Existing files are kept
  unless -Force. It never writes an API key: put the key in the environment or in the project's .env.
.EXAMPLE  & "$HOME\.claude\skills\nexus-crew\scripts\init.ps1" -Provider openrouter
.EXAMPLE  & "$HOME\.claude\skills\nexus-crew\scripts\init.ps1" -Provider custom   # then edit base_url, key_env, model
.EXAMPLE  & "$HOME\.claude\skills\nexus-crew\scripts\init.ps1" -Provider ollama-cloud -Profile economy
#>
param(
    [string]$Provider = '',
    # premium | balanced | economy (aliases: quality, cheap, ...). Which model and effort does each kind of
    # work; see assets\profiles.json and route.ps1. Change later with route.ps1 -Set <profile>.
    [string]$Profile = 'balanced',
    [string]$Model = '',
    [string]$BaseBranch = '',
    [string[]]$AllowedExecutables = @(),
    [switch]$CopyPrompts,
    [switch]$Force
)
. "$PSScriptRoot\_common.ps1"

$cat = Get-ProviderCatalog
$known = ($cat.providers.PSObject.Properties.Name) -join ', '
if (-not $Provider) { throw ('Pass -Provider <id>. Known: ' + $known) }
$entry = $cat.providers.PSObject.Properties[$Provider]
if (-not $entry) { throw ("Unknown provider '" + $Provider + "'. Known: " + $known) }
$preset = $entry.Value

if (-not $Model) { $Model = $preset.default_model }
if (-not $BaseBranch) { $BaseBranch = Get-BaseBranch }
if (-not $AllowedExecutables.Count) {
    if (Test-Path -LiteralPath (Join-Path $CrewRoot 'Cargo.toml')) { $AllowedExecutables += 'cargo', 'rustc' }
    if (Test-Path -LiteralPath (Join-Path $CrewRoot 'package.json')) {
        $AllowedExecutables += 'node', 'npx'
        if (Test-Path -LiteralPath (Join-Path $CrewRoot 'pnpm-lock.yaml')) { $AllowedExecutables += 'pnpm' } else { $AllowedExecutables += 'npm' }
    }
    if (Test-Path -LiteralPath (Join-Path $CrewRoot 'pyproject.toml')) { $AllowedExecutables += 'python', 'pytest' }
    if (Test-Path -LiteralPath (Join-Path $CrewRoot 'go.mod')) { $AllowedExecutables += 'go' }
    if (@(Get-ChildItem -LiteralPath $CrewRoot -Filter '*.sln' -ErrorAction SilentlyContinue).Count) { $AllowedExecutables += 'dotnet' }
    if (-not $AllowedExecutables.Count) { $AllowedExecutables = @('node') }
}

function Put-File([string]$Path, [string]$Text) {
    if ((Test-Path -LiteralPath $Path) -and -not $Force) { return "kept     $Path" }
    New-Item -ItemType Directory -Force (Split-Path $Path -Parent) | Out-Null
    [IO.File]::WriteAllText($Path, ($Text -replace "`r`n", "`n"), (New-Object Text.UTF8Encoding $false))
    return "created  $Path"
}
function Read-Asset([string]$Rel) { return (Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $SkillRoot $Rel)) }

$profileName = Resolve-ProfileName $Profile
$cfg = [ordered]@{
    profile              = $profileName
    provider             = $Provider
    model                = $Model
    base_branch          = $BaseBranch
    allowed_executables  = @($AllowedExecutables | Select-Object -Unique)
    autodetect_gates     = $true
    gates                = @()
    max_parallel_workers = 6
    worktree_root        = $null
    commit_trailer       = $null
    # Edit to your real prices. Claude rows are logged as one total, so their in_per_million is a blended rate.
    pricing              = [ordered]@{
        $(if ($Model) { $Model } else { 'deepseek-v4.1-flash:1017' }) = [ordered]@{ in_per_million = 0.15; out_per_million = 0.60 }
        'claude-sonnet' = [ordered]@{ in_per_million = 6.0; out_per_million = 15.0 }
        'claude-opus'   = [ordered]@{ in_per_million = 10.0; out_per_million = 25.0 }
    }
    compare_model        = 'claude-sonnet'
}
if ($Provider -eq 'custom') { $cfg['base_url'] = $null; $cfg['key_env'] = $null }

Put-File $ConfigPath ($cfg | ConvertTo-Json -Depth 6)
Put-File (Join-Path $CrewDir 'project.md') (Read-Asset 'assets\project-template.md')
Put-File (Join-Path $CrewDir 'lessons.md') (Read-Asset 'assets\lessons-header.md')
Put-File (Join-Path $CrewDir 'units\_TEMPLATE.md') (Read-Asset 'assets\unit-template.md')
Put-File (Join-Path $CrewDir 'worker-settings.json') (Read-Asset 'assets\worker-settings.json')
if ($CopyPrompts) {
    foreach ($m in 'build', 'test', 'review') { Put-File (Join-Path $CrewDir "prompts\worker-$m.md") (Read-Asset "assets\prompts\worker-$m.md") }
}

function Add-IgnoreLine([string]$Line) {
    $gi = Join-Path $CrewRoot '.gitignore'
    $raw = ''
    if (Test-Path -LiteralPath $gi) { $raw = Get-Content -Raw -Encoding UTF8 -LiteralPath $gi }
    if (@($raw -split "`r?`n") -contains $Line) { return "kept     .gitignore has $Line" }
    $prefix = ''
    if ($raw -and -not $raw.EndsWith("`n")) { $prefix = "`n" }
    [IO.File]::AppendAllText($gi, $prefix + $Line + "`n", (New-Object Text.UTF8Encoding $false))
    return "added    $Line to .gitignore"
}
Add-IgnoreLine '.env'
Add-IgnoreLine '.crew/runs/'

''
"project   : $CrewRoot"
"provider  : $Provider ($($preset.label))  status: $($preset.status)"
"model     : $(if ($Model) { $Model } else { '(none: set "model" in .crew\config.json)' })"
"key       : $(if ($preset.key_env) { 'set ' + $preset.key_env + ' in the environment or in ' + (Join-Path $CrewRoot '.env') + ' (never commit it)' } elseif ($preset.static_key) { 'none needed' } else { 'set key_env in .crew\config.json' })"
"worktrees : $WtRoot"
''
'Next: fill in .crew\project.md, then verify the provider before dispatching any unit:'
'  & "<skill>\scripts\check-provider.ps1"'