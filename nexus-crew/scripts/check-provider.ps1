<#
.SYNOPSIS  Preflight for the worker provider: is the key accepted, does the model answer, does it call tools?
.DESCRIPTION
  Sends two tiny requests to <base_url>/v1/messages (the Anthropic Messages API) with the key as x-api-key
  and as a Bearer token: a plain question, then one with a tool definition. Prints READY or NOT READY.
  The key is never printed. Costs a few hundred tokens.
.EXAMPLE  .\check-provider.ps1
.EXAMPLE  .\check-provider.ps1 -Provider openrouter -Model deepseek/deepseek-v4.1-flash-1017
#>
param([string]$Provider = '', [string]$Model = '', [switch]$SkipTools, [switch]$SkipCli)
. "$PSScriptRoot\_common.ps1"

$P = Resolve-Provider $Provider $Model
$keyState = 'MISSING'
if ($P.Key) { $keyState = 'present (' + $P.Key.Length + ' chars)' } elseif (-not $P.KeyEnv) { $keyState = 'not needed' }
'provider  : ' + $P.Id + ' (' + $P.Label + '), catalog status: ' + $P.Status
'base url  : ' + $P.BaseUrl
'model     : ' + $(if ($P.Model) { $P.Model } else { '(none)' })
'key       : ' + $keyState + $(if ($P.KeyEnv) { ' [' + $P.KeyEnv + ']' } else { '' })
if (-not $P.Model) { 'verdict   : NOT READY (no model: set model in .crew\config.json or pass -Model)'; exit 1 }
if ($P.KeyEnv -and -not $P.Key) { 'verdict   : NOT READY (set ' + $P.KeyEnv + ' in the environment or in .env)'; exit 1 }

function Send-Messages([hashtable]$Body) {
    $json = $Body | ConvertTo-Json -Depth 10 -Compress
    $headers = @{ 'anthropic-version' = '2023-06-01' }
    if ($P.Key) { $headers['x-api-key'] = $P.Key; $headers['Authorization'] = 'Bearer ' + $P.Key }
    $sw = [Diagnostics.Stopwatch]::StartNew()
    try {
        $r = Invoke-WebRequest -UseBasicParsing -Method Post -Uri ($P.BaseUrl + '/v1/messages') -Headers $headers -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($json)) -TimeoutSec 120
        return [pscustomobject]@{ Ok = $true; Status = [int]$r.StatusCode; Ms = $sw.ElapsedMilliseconds; Json = ($r.Content | ConvertFrom-Json); Text = '' }
    } catch {
        $status = 0; $text = ''
        if ($_.Exception.Response) {
            try { $status = [int]$_.Exception.Response.StatusCode } catch { }
            try { $sr = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream()); $text = $sr.ReadToEnd() } catch { }
        }
        if (-not $text -and $_.ErrorDetails) { $text = $_.ErrorDetails.Message }
        if (-not $text) { $text = $_.Exception.Message }
        if ($P.Key) { $text = $text.Replace($P.Key, '***') }
        if ($text.Length -gt 400) { $text = $text.Substring(0, 400) }
        return [pscustomobject]@{ Ok = $false; Status = $status; Ms = $sw.ElapsedMilliseconds; Json = $null; Text = $text }
    }
}
function Get-ReplyText($Json) {
    return ((@($Json.content) | Where-Object { $_.type -eq 'text' } | ForEach-Object { $_.text }) -join '').Trim()
}
function Get-Usage($Json) {
    if ($Json.usage) { return ('tokens in/out ' + $Json.usage.input_tokens + '/' + $Json.usage.output_tokens) }
    return 'tokens n/a'
}

$basic = Send-Messages @{ model = $P.Model; max_tokens = 512; messages = @(@{ role = 'user'; content = 'Reply with exactly the word OK.' }) }
if (-not $basic.Ok) {
    'basic call: FAILED http ' + $basic.Status + ' after ' + $basic.Ms + ' ms: ' + $basic.Text
    'verdict   : NOT READY'
    exit 1
}
$reply = Get-ReplyText $basic.Json
if ($reply.Length -gt 60) { $reply = $reply.Substring(0, 60) }
'basic call: OK in ' + $basic.Ms + ' ms, reply "' + $reply + '", ' + (Get-Usage $basic.Json)

$toolState = 'skipped'
if (-not $SkipTools) {
    $tool = @{ name = 'get_time'; description = 'Returns the current time. Call this tool whenever the user asks for the time.'; input_schema = @{ type = 'object'; properties = @{} } }
    $t = Send-Messages @{ model = $P.Model; max_tokens = 512; tools = @($tool); messages = @(@{ role = 'user'; content = 'What time is it? You must use the get_time tool.' }) }
    if (-not $t.Ok) {
        'tool call : FAILED http ' + $t.Status + ' after ' + $t.Ms + ' ms: ' + $t.Text
        'verdict   : NOT READY (the provider or model rejects tool definitions; workers need tool calling)'
        exit 1
    }
    $used = @(@($t.Json.content) | Where-Object { $_.type -eq 'tool_use' }).Count -gt 0
    if ($used) { $toolState = 'OK'; 'tool call : OK in ' + $t.Ms + ' ms, the model returned a tool_use block' }
    else { $toolState = 'not observed'; 'tool call : request accepted in ' + $t.Ms + ' ms but the model answered in text; try a model that supports tools if workers stall' }
}
$cliState = 'skipped'
if (-not $SkipCli) {
    if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
        'cli trip  : SKIPPED, the claude CLI is not on PATH (workers need it)'
        $cliState = 'claude CLI missing'
    } else {
        # The real worker route: headless claude with the worker's own settings file. This is what catches
        # a settings env block that redirects the base URL, which the direct API calls above cannot see.
        $tmp = Join-Path ([IO.Path]::GetTempPath()) ('crew-check-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tmp | Out-Null
        try {
            $sf = New-WorkerSettingsFile $P (Join-Path $tmp 'settings.json')
            Initialize-WorkerEnv $P
            $cliArgs = @('-p', 'Reply with exactly the word OK.', '--bare', '--model', $P.Model, '--settings', $sf, '--strict-mcp-config', '--output-format', 'json', '--no-session-persistence')
            $psi = New-Object Diagnostics.ProcessStartInfo
            $psi.FileName = (Get-Command claude).Source
            $psi.Arguments = (($cliArgs | ForEach-Object { if ($_ -match '[\s"]') { '"' + $_.Replace('"', '\"') + '"' } else { $_ } }) -join ' ')
            $psi.UseShellExecute = $false; $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true; $psi.RedirectStandardInput = $true
            $psi.WorkingDirectory = $tmp
            $sw = [Diagnostics.Stopwatch]::StartNew()
            $proc = [Diagnostics.Process]::Start($psi)
            $proc.StandardInput.Close()
            $soTask = $proc.StandardOutput.ReadToEndAsync(); $seTask = $proc.StandardError.ReadToEndAsync()
            $finished = $proc.WaitForExit(120000)
            if (-not $finished) { try { $proc.Kill() } catch { } }
            $cliOut = ''; try { $cliOut = $soTask.Result } catch { }
            $reason = ''
            $cliOk = $false
            if (-not $finished) { $reason = 'no answer within 120 s' }
            else {
                try { $cj = $cliOut | ConvertFrom-Json; if ($cj.is_error) { $reason = [string]$cj.result } else { $cliOk = $true; $reason = ([string]$cj.result).Trim() } }
                catch { $reason = 'unreadable output: ' + $cliOut.Substring(0, [Math]::Min(120, $cliOut.Length)) }
            }
            if ($reason.Length -gt 120) { $reason = $reason.Substring(0, 120) }
            if ($P.Key) { $reason = $reason.Replace($P.Key, '***') }
            if ($cliOk) { $cliState = 'OK'; 'cli trip  : OK in ' + [int]$sw.Elapsed.TotalSeconds + ' s, reply "' + $reason + '" (the exact route a worker takes)' }
            else {
                'cli trip  : FAILED after ' + [int]$sw.Elapsed.TotalSeconds + ' s: ' + $reason
                '            A worker would fail the same way although the direct API calls worked. Usual cause: a settings'
                '            "env" block (for example in ~/.claude/settings.json) points ANTHROPIC_BASE_URL at another host.'
                '            The worker overrides it in its own --settings file; run once with --debug-file to see where requests go.'
                'verdict   : NOT READY'
                exit 1
            }
        } finally { try { [IO.Directory]::Delete($tmp, $true) } catch { } }
    }
}
'verdict   : READY (tool calling: ' + $toolState + ', cli trip: ' + $cliState + ')'