<#
.SYNOPSIS  Self-test for the nexus-crew scripts. Builds a throwaway git project under %TEMP%, drives the REAL
           scripts with a fake worker (tests\fake-claude.cmd: no API calls, no cost), and checks every defence
           a real run needed. Prints PASS or FAIL per check and exits 1 on any failure. Takes about a minute.
.DESCRIPTION
  Run it after any change to the skill's scripts. Checks:
    setup in new worktrees, LEAK detection and the main-checkout deny rule, the scope gate, the flaky-gate
    retry, quick (staged) gates, the missing-test repair in loop.ps1, the project-wide gate lock,
    brief-check.ps1 parsing, and orchestrator accounting in report.ps1.
.EXAMPLE  & "$HOME\.claude\skills\nexus-crew\scripts\selftest.ps1"
.EXAMPLE  & "$HOME\.claude\skills\nexus-crew\scripts\selftest.ps1" -Keep    # keep the temp project to inspect
#>
param([switch]$Keep)
$ErrorActionPreference = 'Continue'
$scripts = $PSScriptRoot
$script:fails = 0
function Check([string]$Name, [bool]$Ok, [string]$Detail = '') {
    if ($Ok) { "PASS  $Name" }
    else {
        $script:fails++
        $tail = (($Detail -split "`r?`n") | Where-Object { $_ -match '\S' } | Select-Object -Last 8) -join "`n        "
        "FAIL  $Name`n        $tail"
    }
}
$enc = New-Object Text.UTF8Encoding $false
function Put([string]$Path, [string]$Text) {
    $d = Split-Path $Path -Parent
    if ($d) { New-Item -ItemType Directory -Force $d | Out-Null }
    [IO.File]::WriteAllText($Path, $Text, $enc)
}

$root = Join-Path ([IO.Path]::GetTempPath()) ('nexus-crew-selftest-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
$proj = Join-Path $root 'proj'
New-Item -ItemType Directory -Force $proj | Out-Null
$oldLoc = Get-Location
$saved = @{ CREW_PROJECT = $env:CREW_PROJECT; NEXUS_CREW_CLAUDE = $env:NEXUS_CREW_CLAUDE; FAKE_LEAK = $env:FAKE_LEAK; CREW_PROFILE = $env:CREW_PROFILE }
$env:CREW_PROFILE = $null
try {
    Set-Location $proj
    git init -q -b main 2>&1 | Out-Null
    git config user.email 'selftest@example.invalid'
    git config user.name 'selftest'
    Put "$proj\src\a.txt" "a`n"
    Put "$proj\src\b.txt" "b`n"
    Put "$proj\.gitignore" ".crew/`nSETUP_RAN`n"
    $counter = (Join-Path $root 'flaky-count') -replace '\\', '/'
    Put "$proj\flaky.js" "const fs=require('fs');const f=process.argv[2];const n=fs.existsSync(f)?+fs.readFileSync(f,'utf8'):0;fs.writeFileSync(f,String(n+1));process.exit(n===0?1:0);`n"
    Put "$proj\slow.js" "setTimeout(()=>{},10000);`n"
    git add -A 2>&1 | Out-Null
    git commit -q -m init 2>&1 | Out-Null

    $env:CREW_PROJECT = $proj
    $env:NEXUS_CREW_CLAUDE = Join-Path $scripts 'tests\fake-claude.cmd'
    $config = [ordered]@{
        provider = 'ollama-local'; model = 'fake'; base_branch = 'main'; allowed_executables = @('node')
        autodetect_gates = $false; gates = @("node flaky.js $counter")
        setup = 'node -e "require(''fs'').writeFileSync(''SETUP_RAN'',''1'')"'
        max_fix_rounds = 1; max_parallel_workers = 2
    }
    Put "$proj\.crew\config.json" ($config | ConvertTo-Json -Depth 4)
    $brief = @'
# T-1 - selftest unit

## Files
- `src/a.txt` (edit)
- `tests/x.test.js` (new)

## Checks
- `node -e "process.exit(0)"`
'@
    Put "$proj\.crew\units\T-1.md" $brief
    Put "$proj\.crew\units\T-2.md" ($brief -replace 'T-1', 'T-2')

    # 1. setup runs in a new worktree
    $o = & "$scripts\unit.ps1" -Action start -Unit T-1 *>&1 | Out-String
    $wt1 = (& "$scripts\unit.ps1" -Action path -Unit T-1 | Out-String).Trim()
    Check 'unit start installs dependencies (setup) in the new worktree' ((Test-Path "$wt1\SETUP_RAN") -and $o -match 'setup=') $o

    # 2. a worker writing into the main checkout is caught; the settings deny the main checkout
    $leak = Join-Path $proj 'LEAKED.txt'
    $env:FAKE_LEAK = $leak
    $o = & "$scripts\worker.ps1" -Unit T-1 -Mode build *>&1 | Out-String
    Check 'a worker that writes into the main checkout reports STATUS: LEAK' (($o -match 'STATUS: LEAK') -and ($o -match 'LEAKED\.txt')) $o
    Remove-Item -LiteralPath $leak -Force -ErrorAction SilentlyContinue
    $env:FAKE_LEAK = $null
    $p = $proj -replace '\\', '/'
    if ($p -match '^([A-Za-z]):(.*)$') { $p = '/' + $Matches[1].ToLowerInvariant() + $Matches[2] }
    $want = "Edit(/$p/**)"
    $set = Get-ChildItem -LiteralPath (Join-Path $proj '.crew\runs\T-1') -Filter 'build-*.settings.json' | Select-Object -Last 1
    $deny = @((Get-Content -Raw -LiteralPath $set.FullName | ConvertFrom-Json).permissions.deny)
    Check "worker settings deny edits to the main checkout ($want)" ($deny -contains $want) ($deny -join ', ')

    # 3. scope gate, flaky retry, quick gates
    Put "$wt1\src\b.txt" "changed`n"
    $o = & "$scripts\gates.ps1" -Unit T-1 *>&1 | Out-String
    Check 'the scope gate fails an edit outside the brief Files list' (($o -match '\[FAIL\] scope') -and ($o -match 'src/b\.txt')) $o
    Check 'a gate that fails once and then passes is reported as flaky, not failed' (($o -match '\[PASS\] node flaky\.js') -and ($o -match 'flaky')) $o
    git -C $wt1 checkout -- src/b.txt 2>&1 | Out-Null
    $o = & "$scripts\gates.ps1" -Unit T-1 -Quick *>&1 | Out-String
    Check 'quick gates run only the brief checks (plus scope and secrets)' (($o -match 'GATES PASS \(quick\)') -and ($o -notmatch 'flaky\.js') -and ($o -match '\[PASS\] scope')) $o

    # 4. loop.ps1 writes a missing new test file with a test-mode worker, then passes staged gates
    $o = & "$scripts\loop.ps1" -Unit T-1 -SkipBuild -NoCrossReview *>&1 | Out-String
    Check 'the loop repairs a missing new test file before gating' (($o -match 'missing or empty test files: tests/x\.test\.js') -and (Test-Path "$wt1\tests\x.test.js") -and ($o -match 'LOOP READY')) $o
    Check 'staged gates: quick first, then the full gates' (($o -match 'GATES PASS \(quick\)') -and ($o -match 'gate 1 -> GATES PASS  unit')) $o

    # 5. the project-wide gate lock makes a second gate run wait for the first
    $config.gates = @('node slow.js')
    Put "$proj\.crew\config.json" ($config | ConvertTo-Json -Depth 4)
    & "$scripts\unit.ps1" -Action start -Unit T-2 *>&1 | Out-Null
    $job = Start-Job -ScriptBlock {
        param($s, $p)
        $env:CREW_PROJECT = $p
        Set-Location $p
        & "$s\gates.ps1" -Unit T-1 *>&1 | Out-String
    } -ArgumentList $scripts, $proj
    Start-Sleep -Seconds 3
    $o = & "$scripts\gates.ps1" -Unit T-2 *>&1 | Out-String
    Receive-Job $job -Wait -AutoRemoveJob | Out-Null
    Check 'parallel gate runs queue on the project lock' ($o -match 'waited \d+s for another unit') $o

    # 6. brief-check.ps1 turns the goldfish verdict into one line
    $o = & "$scripts\brief-check.ps1" -Unit T-1 *>&1 | Out-String
    Check 'brief-check reports the goldfish gaps' ($o -match 'BRIEF GAPS unit=T-1 blockers=1 majors=0') $o

    # 7. report.ps1 counts the orchestrator, and warns when it is missing
    & "$scripts\claude-log.ps1" -Unit T-1 -Role review -Model sonnet -Tokens 500 *>&1 | Out-Null
    $o = & "$scripts\report.ps1" *>&1 | Out-String
    Check 'the report warns when the orchestrator is not logged' ($o -match 'WARNING: the orchestrator') $o
    & "$scripts\claude-log.ps1" -Unit ALL -Role orchestrator -Model opus -Tokens 1000 *>&1 | Out-Null
    $o = & "$scripts\report.ps1" *>&1 | Out-String
    Check 'the report counts the orchestrator in the Claude share' (($o -match 'orchestrator 1000') -and ($o -notmatch 'WARNING: the orchestrator')) $o

    # 8. profiles: aliases, per-kind routes, the opus floor, profile worker budgets, -Set
    $o = & "$scripts\route.ps1" -Kind build_ui *>&1 | Out-String
    Check 'no profile set means balanced (UI screens built by sonnet)' ($o -match 'who=sonnet effort=medium profile=balanced') $o
    $o = & "$scripts\route.ps1" -Set cheap *>&1 | Out-String
    $saved2 = (Get-Content -Raw -LiteralPath "$proj\.crew\config.json" | ConvertFrom-Json).profile
    Check 'route.ps1 -Set resolves an alias and writes it (cheap -> economy)' (($o -match 'profile: economy') -and ($saved2 -eq 'economy')) $o
    $o = & "$scripts\route.ps1" -Kind build_ui *>&1 | Out-String
    Check 'economy routes UI screens to the worker' ($o -match 'who=worker effort=medium profile=economy') $o
    $config = Get-Content -Raw -LiteralPath "$proj\.crew\config.json" | ConvertFrom-Json
    $config | Add-Member -NotePropertyName routing -NotePropertyValue ([pscustomobject]@{ security = [pscustomobject]@{ who = 'haiku'; effort = 'low' } }) -Force
    Put "$proj\.crew\config.json" ($config | ConvertTo-Json -Depth 6)
    $o = & "$scripts\route.ps1" -Kind security *>&1 | Out-String
    Check 'security is never routed below opus, even by a config override' (($o -match 'who=opus') -and ($o -match 'never downgraded')) $o
    $b = & { . "$scripts\_common.ps1"; $env:CREW_PROFILE = 'premium'; Get-WorkerBudget 'build' }
    $env:CREW_PROFILE = $null
    Check 'the premium profile raises the worker build budget' (($b.max_turns -eq 80) -and ($b.effort -eq 'medium')) ("max_turns=$($b.max_turns) effort=$($b.effort)")
    $threw = $false; try { & "$scripts\route.ps1" -Set turbo *>&1 | Out-Null } catch { $threw = $true }
    Check 'an unknown profile name is rejected' $threw
}
finally {
    Set-Location $oldLoc
    foreach ($k in $saved.Keys) { [Environment]::SetEnvironmentVariable($k, $saved[$k], 'Process') }
    if (-not $Keep) {
        foreach ($wt in @(git -C $proj worktree list --porcelain 2>$null | Where-Object { $_ -match '^worktree ' } | ForEach-Object { $_.Substring(9) } | Select-Object -Skip 1)) {
            git -C $proj worktree remove --force $wt 2>&1 | Out-Null
        }
        Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
    } else { "kept: $root" }
}
if ($script:fails) { "selftest: $($script:fails) FAILED"; exit 1 }
'selftest: all checks passed'
