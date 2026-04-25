# API Key Validator — ASCII safe, reads from both env files
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Parse-EnvFile($path) {
    $vars = @{}
    if (-not (Test-Path $path)) { return $vars }
    Get-Content $path | ForEach-Object {
        if ($_ -match '^\s*([^#=][^=]*)=["'']?([^"''#\r\n]*)["'']?\s*$') {
            $k = $matches[1].Trim()
            $v = $matches[2].Trim()
            if ($v -ne "") { $vars[$k] = $v }
        }
    }
    return $vars
}

function Test-Key($name, $active) {
    $status = if ($active) { "[ACTIVE]" } else { "[DEAD]  " }
    Write-Host ("{0,-40} {1}" -f $name, $status)
}

function Safe-Get($url, $headers) {
    try {
        $r = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -TimeoutSec 8 -ErrorAction Stop
        return $r.StatusCode -lt 400
    } catch {
        $code = $_.Exception.Response.StatusCode.Value__
        if ($code -in @(400, 422, 429)) { return $true }  # key valid, bad request/rate limited
        return $false
    }
}

function Safe-Post($url, $headers, $body) {
    try {
        $r = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body ($body | ConvertTo-Json -Depth 5) -ContentType "application/json" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        return $r.StatusCode -lt 400
    } catch {
        $code = $_.Exception.Response.StatusCode.Value__
        if ($code -in @(400, 422, 429)) { return $true }
        return $false
    }
}

$root = "C:\Users\steph\Desktop\Antigravity and Agent 0"
$e1 = Parse-EnvFile "$root\.env"
$e2 = Parse-EnvFile "$root\.env.recovered"

Write-Host ""
Write-Host "===================================================="
Write-Host "  .env (ACTIVE FILE)"
Write-Host "===================================================="

# Anthropic current
if ($e1["ANTHROPIC_API_KEY"]) {
    $h = @{ "x-api-key" = $e1["ANTHROPIC_API_KEY"]; "anthropic-version" = "2023-06-01" }
    $b = @{ model = "claude-3-haiku-20240307"; max_tokens = 1; messages = @(@{ role = "user"; content = "hi" }) }
    Test-Key "Anthropic (current key)" (Safe-Post "https://api.anthropic.com/v1/messages" $h $b)
}

# Gemini current
if ($e1["GEMINI_API_KEY"]) {
    $ok = Safe-Get "https://generativelanguage.googleapis.com/v1/models?key=$($e1['GEMINI_API_KEY'])" @{}
    Test-Key "Gemini/Google (current key)" $ok
}

# OpenRouter
if ($e1["OPENROUTER_API_KEY"]) {
    $ok = Safe-Get "https://openrouter.ai/api/v1/models" @{ Authorization = "Bearer $($e1['OPENROUTER_API_KEY'])" }
    Test-Key "OpenRouter" $ok
}

# GitHub PAT
if ($e1["GITHUB_PERSONAL_ACCESS_TOKEN"]) {
    $ok = Safe-Get "https://api.github.com/user" @{ Authorization = "token $($e1['GITHUB_PERSONAL_ACCESS_TOKEN'])"; "User-Agent" = "curl" }
    Test-Key "GitHub PAT (github_pat_)" $ok
}

# GitHub MCP token
if ($e1["MCP_GITHUB_TOKEN"]) {
    $ok = Safe-Get "https://api.github.com/user" @{ Authorization = "token $($e1['MCP_GITHUB_TOKEN'])"; "User-Agent" = "curl" }
    Test-Key "GitHub MCP token (ghp_)" $ok
}

# Pinecone
if ($e1["PINECONE_API_KEY"]) {
    $ok = Safe-Get "https://api.pinecone.io/indexes" @{ "Api-Key" = $e1["PINECONE_API_KEY"] }
    Test-Key "Pinecone" $ok
}

# Apify
if ($e1["APIFY_TOKEN"]) {
    $ok = Safe-Get "https://api.apify.com/v2/users/me?token=$($e1['APIFY_TOKEN'])" @{}
    Test-Key "Apify" $ok
}

# Firecrawl
if ($e1["FIRECRAWL_API_KEY"]) {
    $ok = Safe-Get "https://api.firecrawl.dev/v1/team" @{ Authorization = "Bearer $($e1['FIRECRAWL_API_KEY'])" }
    Test-Key "Firecrawl" $ok
}

# Perplexity
if ($e1["PERPLEXITY_API_KEY"]) {
    $h = @{ Authorization = "Bearer $($e1['PERPLEXITY_API_KEY'])" }
    $b = @{ model = "sonar"; max_tokens = 1; messages = @(@{ role = "user"; content = "hi" }) }
    Test-Key "Perplexity" (Safe-Post "https://api.perplexity.ai/chat/completions" $h $b)
}

# Supabase access token
if ($e1["SUPABASE_ACCESS_TOKEN"]) {
    $ok = Safe-Get "https://api.supabase.com/v1/projects" @{ Authorization = "Bearer $($e1['SUPABASE_ACCESS_TOKEN'])" }
    Test-Key "Supabase (access token)" $ok
}

Write-Host ""
Write-Host "===================================================="
Write-Host "  .env.recovered (OLD OPENCLAW)"
Write-Host "===================================================="

# Old Anthropic
if ($e2["ANTHROPIC_API_KEY"]) {
    $h = @{ "x-api-key" = $e2["ANTHROPIC_API_KEY"]; "anthropic-version" = "2023-06-01" }
    $b = @{ model = "claude-3-haiku-20240307"; max_tokens = 1; messages = @(@{ role = "user"; content = "hi" }) }
    Test-Key "Anthropic (recovered key)" (Safe-Post "https://api.anthropic.com/v1/messages" $h $b)
}

# Old Gemini
if ($e2["GEMINI_API_KEY"]) {
    $ok = Safe-Get "https://generativelanguage.googleapis.com/v1/models?key=$($e2['GEMINI_API_KEY'])" @{}
    Test-Key "Gemini (recovered key)" $ok
}

# xAI
if ($e2["XAI_API_KEY"]) {
    $ok = Safe-Get "https://api.x.ai/v1/models" @{ Authorization = "Bearer $($e2['XAI_API_KEY'])" }
    Test-Key "xAI / Grok" $ok
}

# Telegram
if ($e2["TELEGRAM_BOT_TOKEN"]) {
    $ok = Safe-Get "https://api.telegram.org/bot$($e2['TELEGRAM_BOT_TOKEN'])/getMe" @{}
    Test-Key "Telegram Bot" $ok
}

Write-Host ""
Write-Host "===================================================="
Write-Host "  DONE"
Write-Host "===================================================="
Write-Host ""
