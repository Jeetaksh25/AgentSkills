<#
.SYNOPSIS  Build the compact review pack (brief + gates + cross-review + lessons + diff) for a reviewer.
.DESCRIPTION
  Claude reviewers read THIS file instead of the codebase. The diff is taken against the merge base with the
  base branch, so committed WIP checkpoints are included (a diff against HEAD would show nothing).
  Lockfiles stay in the diff stat but out of the diff body. Output: .crew\runs\<unit>\review-pack-<name>.md
.EXAMPLE  .\review-pack.ps1 -Unit U-001
#>
param(
    [Parameter(Mandatory)][string]$Unit,
    [int]$Variant = 0,
    [switch]$InRepo,
    [int]$MaxDiffLines = 1500
)
. "$PSScriptRoot\_common.ps1"

$name = Get-UnitName $Unit $Variant
$work = Get-UnitPath $Unit $Variant -InRepo:$InRepo
$run  = Get-RunDir $Unit
$out  = Join-Path $run "review-pack-$name.md"

git -C $work add -A -N 2>&1 | Out-Null
$base = Get-DiffBase $work -InRepo:$InRepo
$stat = git -C $work diff $base --stat | Out-String
$lock = @(':(exclude,glob)**/Cargo.lock', ':(exclude,glob)**/pnpm-lock.yaml', ':(exclude,glob)**/package-lock.json', ':(exclude,glob)**/yarn.lock', ':(exclude,glob)**/poetry.lock', ':(exclude,glob)**/go.sum')
$diffLines = @(git -C $work diff $base -- . @lock)
if ($LASTEXITCODE -ne 0 -or -not $stat.Trim()) { throw "Empty or failed diff for $name against $base" }
$truncated = $diffLines.Count -gt $MaxDiffLines
if ($truncated) { $diffLines = $diffLines[0..($MaxDiffLines - 1)] }

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("# Review pack: $name")
[void]$sb.AppendLine("Worktree: $work")
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## Brief')
[void]$sb.AppendLine((Get-Content -Raw -Encoding UTF8 -LiteralPath (Get-BriefPath $Unit)))
foreach ($part in @(@('Gate results', "gates-$name.txt"), @('Worker cross-review', "crossreview-$name.md"))) {
    $p = Join-Path $run $part[1]
    [void]$sb.AppendLine("## $($part[0])")
    if (Test-Path -LiteralPath $p) { [void]$sb.AppendLine('```'); [void]$sb.AppendLine((Get-Content -Raw -Encoding UTF8 -LiteralPath $p)); [void]$sb.AppendLine('```') }
    else { [void]$sb.AppendLine('_not run_') }
}
$lessons = Join-Path $CrewDir 'lessons.md'
if (Test-Path -LiteralPath $lessons) { [void]$sb.AppendLine('## Lessons (must not be violated)'); [void]$sb.AppendLine((Get-Content -Raw -Encoding UTF8 -LiteralPath $lessons)) }
[void]$sb.AppendLine('## Diff stat'); [void]$sb.AppendLine('```'); [void]$sb.AppendLine($stat); [void]$sb.AppendLine('```')
[void]$sb.AppendLine('## Diff (vs unit start)')
if ($truncated) { [void]$sb.AppendLine("_Truncated to $MaxDiffLines lines. Read remaining files directly in the worktree if needed._") }
[void]$sb.AppendLine('```diff'); [void]$sb.AppendLine(($diffLines -join "`n")); [void]$sb.AppendLine('```')

[IO.File]::WriteAllText($out, $sb.ToString(), (New-Object Text.UTF8Encoding $false))
"pack=$out lines=$(($sb.ToString() -split "`n").Count) diff_lines=$($diffLines.Count) truncated=$truncated"