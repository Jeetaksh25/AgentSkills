<#
.SYNOPSIS  Gate 1: run the automatic checks for a unit and write a short digest.
.DESCRIPTION
  Runs, in this order:
    1. auto-detected checks: cargo fmt/clippy/test when Cargo.toml exists, and the typecheck/lint/test scripts
       when package.json exists (pnpm, yarn or npm by lockfile). Switch off with "autodetect_gates": false.
    2. the commands in .crew\config.json "gates" (strings, or objects with name and command)
    3. every command listed under "## Checks" in the unit brief; the executable must be in allowed_executables
  Always: a change check against the base branch, and a secret scan of the working diff and of every commit
  since the base (a secret removed in a later commit is still in the pushed history).
  Writes .crew\runs\<unit>\gates-<name>.txt (digest) and gates-<name>.log (full output). Exit code 1 on FAIL.
  Run ONE gate at a time on a busy machine: timing-sensitive tests fail under parallel load.
.EXAMPLE  .\gates.ps1 -Unit U-001
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [int]$Variant = 0,
    [switch]$InRepo
)
. "$PSScriptRoot\_common.ps1"

$name = Get-UnitName $Unit $Variant
$work = Get-UnitPath $Unit $Variant -InRepo:$InRepo
Set-CrewUnitEnv $work
$run  = Get-RunDir $Unit
$full = Join-Path $run "gates-$name.log"
$dig  = Join-Path $run "gates-$name.txt"
Set-Content -LiteralPath $full -Value '' -Encoding UTF8
$results = New-Object System.Collections.ArrayList

function Invoke-Gate([string]$Label, [string]$CommandLine) {
    $exe = ($CommandLine -split '\s+')[0]
    if (-not (Get-Command $exe -ErrorAction SilentlyContinue)) {
        [void]$results.Add([pscustomobject]@{ Gate = $Label; Status = 'FAIL'; Detail = "$exe is not installed" }); return
    }
    Push-Location $work
    try { $out = Invoke-CrewShell $CommandLine; $code = $LASTEXITCODE } finally { Pop-Location }
    Add-Content -LiteralPath $full -Value "===== $Label :: $CommandLine (exit $code)`n$out" -Encoding UTF8
    $detail = ''
    if ($code -ne 0) { $detail = (($out -split "`r?`n") | Where-Object { $_ -match '\S' } | Select-Object -Last 25) -join "`n" }
    $status = 'FAIL'; if ($code -eq 0) { $status = 'PASS' }
    [void]$results.Add([pscustomobject]@{ Gate = $Label; Status = $status; Detail = $detail })
}

$auto = [bool](Get-Cfg 'autodetect_gates' $true)
if ($auto -and (Test-Path -LiteralPath (Join-Path $work 'Cargo.toml'))) {
    Invoke-Gate 'cargo fmt'    'cargo fmt --all -- --check'
    Invoke-Gate 'cargo clippy' 'cargo clippy --all-targets -- -D warnings'
    Invoke-Gate 'cargo test'   'cargo test'
}
$pkg = Join-Path $work 'package.json'
if ($auto -and (Test-Path -LiteralPath $pkg)) {
    $scripts = (Get-Content -Raw -Encoding UTF8 -LiteralPath $pkg | ConvertFrom-Json).scripts
    $pm = 'npm'
    if (Test-Path -LiteralPath (Join-Path $work 'pnpm-lock.yaml')) { $pm = 'pnpm' } elseif (Test-Path -LiteralPath (Join-Path $work 'yarn.lock')) { $pm = 'yarn' }
    $ws = Test-Path -LiteralPath (Join-Path $work 'pnpm-workspace.yaml')
    foreach ($s in 'typecheck', 'lint', 'test') {
        if ($pm -eq 'pnpm' -and $ws) { Invoke-Gate "pnpm $s" "pnpm -r --if-present run $s" }
        elseif ($scripts -and ($scripts.PSObject.Properties.Name -contains $s)) { Invoke-Gate "$pm $s" "$pm run $s" }
    }
}
foreach ($g in @(Get-Cfg 'gates' @())) {
    if ($g -is [string]) { Invoke-Gate $g $g }
    elseif ($g.command) {
        $label = $g.name; if (-not $label) { $label = [string]$g.command }
        Invoke-Gate $label ([string]$g.command)
    }
}
# Brief-defined checks: lines like  - `node --test tests/x.test.js`
$allowed = Get-AllowedExe
$brief = Join-Path $CrewDir "units\$Unit.md"
if (Test-Path -LiteralPath $brief) {
    $inChecks = $false
    foreach ($line in Get-Content -Encoding UTF8 -LiteralPath $brief) {
        if ($line -match '^##\s') { $inChecks = ($line -match '^##\s+Checks'); continue }
        if ($inChecks -and $line -match '^\s*-\s*`([^`]+)`') {
            $cmd = $Matches[1].Trim()
            if ($allowed -contains (($cmd -split '\s+')[0])) { Invoke-Gate "brief: $cmd" $cmd }
            else { [void]$results.Add([pscustomobject]@{ Gate = "brief: $cmd"; Status = 'FAIL'; Detail = 'executable not in allowed_executables' }) }
        }
    }
}

$base = Get-DiffBase $work -InRepo:$InRepo
git -C $work add -A -N 2>&1 | Out-Null
# Changes exist (not for in-repo runs): committed WIP counts.
if (-not $InRepo) {
    $changes = git -C $work diff --name-only $base
    $st = 'FAIL'; $dt = 'no changes against the base branch'
    if ($changes) { $st = 'PASS'; $dt = '' }
    [void]$results.Add([pscustomobject]@{ Gate = 'has changes'; Status = $st; Detail = $dt })
}
# Secret scan: the working diff plus every commit since the base. Fails closed when git cannot be read.
$diff = git -C $work diff --text $base | Out-String
$scanned = ($LASTEXITCODE -eq 0)
$history = git -C $work log -p --text --no-color "$base..HEAD" | Out-String
$scanned = $scanned -and ($LASTEXITCODE -eq 0)
$all = "$diff`n$history"
$leak = -not $scanned
$why = ''
if (-not $scanned) { $why = 'git could not produce the diff, so nothing was scanned' }
foreach ($m in [regex]::Matches($all, '(?m)^\+\+\+ b/(?:.*/)?(\.env[^\r\n/]*)\r?$')) {
    if ($m.Groups[1].Value -ne '.env.example') { $leak = $true; $why = 'an .env file is part of the diff' }
}
foreach ($sv in (Get-SecretValues)) { if ($all.Contains($sv)) { $leak = $true; $why = 'a configured API key or secret value appears in the diff'; break } }
if ($all -match '-----BEGIN [A-Z ]*PRIVATE KEY-----') { $leak = $true; $why = 'a private key block appears in the diff' }
$ls = 'PASS'; $ld = ''
if ($leak) { $ls = 'FAIL'; $ld = $why }
[void]$results.Add([pscustomobject]@{ Gate = 'secret scan'; Status = $ls; Detail = $ld })

$overall = 'PASS'; if ($results | Where-Object Status -eq 'FAIL') { $overall = 'FAIL' }
$lines = @("GATES $overall  unit=$name  $(Get-Date -Format s)")
foreach ($r in $results) {
    $lines += "[$($r.Status)] $($r.Gate)"
    if ($r.Detail) { $lines += (($r.Detail -split "`n") | ForEach-Object { "    $_" }) }
}
$lines | Set-Content -LiteralPath $dig -Encoding UTF8
$lines
if ($overall -eq 'FAIL') { exit 1 }