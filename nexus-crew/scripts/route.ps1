<#
.SYNOPSIS  Show or set the crew profile, which decides the model and effort for every kind of work.
.DESCRIPTION
  Profiles (assets\profiles.json; a project copy at .crew\profiles.json replaces it):
    premium   best result first: Claude builds hard and visible work, deep reviews, roomier worker budgets
    balanced  the default: workers build clear-spec work, Claude builds UI screens and critical code
    economy   lowest cost: workers build all non-critical work, batched cheap reviews, opus only where critical
  Aliases: quality/best/careful -> premium; cheap/budget/thrift/save/lean -> economy; default/standard -> balanced.
  The active profile: CREW_PROFILE, else "profile" in .crew\config.json, else balanced. Single kinds can be
  overridden in the config: "routing": { "build_ui": { "who": "opus", "effort": "medium" } }.
  Security and tier 3 work never go below opus.
.EXAMPLE  .\route.ps1                      # the active profile and its full routing table
.EXAMPLE  .\route.ps1 -Kind build_ui       # one line: who builds a UI screen, at what effort
.EXAMPLE  .\route.ps1 -Set cheap           # switch the project to economy
.EXAMPLE  .\route.ps1 -Profile premium     # show another profile without switching
#>
param(
    [string]$Kind = '',
    [string]$Set = '',
    [string]$Profile = ''
)
. "$PSScriptRoot\_common.ps1"

if ($Set) {
    $name = Resolve-ProfileName $Set
    if (-not (Test-Path -LiteralPath $ConfigPath)) { throw "No $ConfigPath. Run init.ps1 first." }
    $cfgObj = Get-Content -Raw -Encoding UTF8 -LiteralPath $ConfigPath | ConvertFrom-Json
    $old = if ($cfgObj.PSObject.Properties['profile']) { $cfgObj.profile } else { '(none: balanced)' }
    $cfgObj | Add-Member -NotePropertyName profile -NotePropertyValue $name -Force
    Write-Utf8 $ConfigPath (($cfgObj | ConvertTo-Json -Depth 10) + "`n")
    "profile: $name (was $old)"
    if ($env:CREW_PROFILE) { "note: CREW_PROFILE=$($env:CREW_PROFILE) is set in this shell and wins over the config." }
    return
}
if ($Profile) { $env:CREW_PROFILE = Resolve-ProfileName $Profile }

function Format-Who($r) {
    if ($r.Who -eq 'worker') { return "worker ($(Get-Cfg 'model' 'worker model')), effort $($r.Effort)" }
    return "claude $($r.Who), effort $($r.Effort)"
}

$prof = Get-CrewProfile
if ($Kind) {
    $r = Get-Route $Kind
    $how = if ($r.Who -eq 'worker') { 'run it with loop.ps1 / worker.ps1' } else { "Agent with model=$($r.Who), effort $($r.Effort)" }
    "ROUTE kind=$($r.Kind) who=$($r.Who) effort=$($r.Effort) profile=$($r.Profile) source=`"$($r.Source)`" -> $how"
    return
}

"profile: $($prof.Name)  -- $($prof.Spec.summary)"
"fix rounds: $(Get-Cfg 'max_fix_rounds' $prof.Spec.max_fix_rounds)   reviews: $($prof.Spec.review_style)   visual check: $($prof.Spec.visual_check)"
''
$rows = foreach ($k in $prof.Catalog.kinds.PSObject.Properties) {
    $r = Get-Route $k.Name
    [pscustomobject]@{ Kind = $k.Name; Uses = (Format-Who $r); For = [string]$k.Value; Note = $(if ($r.Source -ne "profile $($prof.Name)") { $r.Source } else { '' }) }
}
$rows | Format-Table -AutoSize -Wrap | Out-String -Width 200
'Models: ' + (($prof.Catalog.models.PSObject.Properties | ForEach-Object { $_.Name + ' = ' + $_.Value }) -join "`n        ")
