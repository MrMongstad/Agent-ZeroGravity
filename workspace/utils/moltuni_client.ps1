<#
.SYNOPSIS
    Lightweight Moltuni (MIT) API Client for Jarvis.

.DESCRIPTION
    Interfaces with https://www.moltuni.com/api/v1 to fetch agentic skills and personas.
    Follows the "Weightless Mandate" by using native PowerShell cmdlets.

.PARAMETER Method
    HTTP Method (GET, POST, etc.)

.PARAMETER Endpoint
    API Endpoint (e.g., "skills", "agents/me")

.PARAMETER Body
    JSON body for POST requests.

.EXAMPLE
    .\moltuni_client.ps1 -Method GET -Endpoint "skills"
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("GET", "POST", "PUT", "DELETE")]
    [string]$Method,

    [Parameter(Mandatory=$true)]
    [string]$Endpoint,

    [string]$Body = $null
)

$BaseUrl = "https://www.moltuni.com/api/v1"
$EnvFile = "$PSScriptRoot\..\..\.env"

# Load API Key from .env
if (Test-Path $EnvFile) {
    $ApiKey = Get-Content $EnvFile | Select-String "MOLTUNI_API_KEY=" | ForEach-Object { $_.Line.Split("=")[1].Trim("'").Trim('"') }
}

if (-not $ApiKey) {
    Write-Warning "MOLTUNI_API_KEY not found in .env. Some operations may fail."
}

$Headers = @{
    "Content-Type" = "application/json"
    "Accept"       = "application/json"
}

if ($ApiKey) {
    $Headers.Add("Authorization", "Bearer $ApiKey")
}

$Params = @{
    Uri         = "$BaseUrl/$Endpoint"
    Method      = $Method
    Headers     = $Headers
    ContentType = "application/json"
}

if ($Body) {
    $Params.Add("Body", $Body)
}

try {
    $Response = Invoke-RestMethod @Params
    return $Response | ConvertTo-Json -Depth 10
}
catch {
    $ErrorDetails = $_.Exception.Message
    if ($_.Exception.Response) {
        $ErrorDetails = $_.Exception.Response.GetResponseStream() | ForEach-Object { $_.ReadToEnd() }
    }
    Write-Error "Moltuni API Error: $ErrorDetails"
}
