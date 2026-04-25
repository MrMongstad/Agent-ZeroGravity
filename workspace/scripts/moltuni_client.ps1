<#
.SYNOPSIS
    Fetches specialized prompts from the Moltuni API and saves them to the local prompt library.
.DESCRIPTION
    Part of the Prompt Engineering Protocol v1.0. This script pulls high-performing 
    prompts for technical or creative tasks to supplement Jarvis's baseline capabilities.
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$Query,
    
    [Parameter(Mandatory=$false)]
    [string]$Category = \"DEV_PROMPTS\"
)

# Load environment variables (enforcing the Unified Workspace Model)
$envFilePath = Join-Path $PSScriptRoot \"..\..\.env\"
if (Test-Path $envFilePath) {
    Get-Content $envFilePath | Where-Object { $_ -match \"^MOLTUNI_API_KEY=(.*)$\" } | ForEach-Object {
        $script:MoltuniKey = $Matches[1].Trim('\"','''')
    }
}

if (-not $script:MoltuniKey) {
    Write-Error \"MOLTUNI_API_KEY not found in .env file. Execution aborted.\"
    exit 1
}

$headers = @{
    \"Authorization\" = \"Bearer $script:MoltuniKey\"
    \"Content-Type\"  = \"application/json\"
}

try {
    # Reconstructed API Endpoint
    $apiUrl = \"https://api.moltuni.com/v1/prompts?query=$([System.Web.HttpUtility]::UrlEncode($Query))&category=$Category\"
    Write-Host \"[*] Fetching prompts from Moltuni: $Query\" -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get
    
    if ($response -and $response.prompts) {
        $libraryPath = Join-Path $PSScriptRoot \"..\memory\prompt_library\$Category.md\"
        $promptContent = \"# Moltuni Prompts - $Query`n`n\"
        foreach ($p in $response.prompts) {
            $promptContent += \"## $($p.title)`n$($p.content)`n`n\"
        }
        
        Set-Content -Path $libraryPath -Value $promptContent -Encoding utf8
        Write-Host \"[+] Successfully updated $libraryPath\" -ForegroundColor Green
    } else {
        Write-Warning \"No prompts found for query: $Query\"
    }
} catch {
    Write-Error \"Moltuni API Call Failed: $($_.Exception.Message)\"
}
