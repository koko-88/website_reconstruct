[CmdletBinding()]
param()

$ErrorActionPreference = 'SilentlyContinue'

function Test-CommandCapability {
    param(
        [string]$Name,
        [string[]]$VersionArgs = @('--version')
    )

    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    if (-not $cmd) {
        return [pscustomobject]@{
            capability = $Name
            status     = 'MISSING'
            surface    = 'shell'
            resolved   = $null
            detail     = $null
        }
    }

    $detail = $null
    try {
        $detail = (& $Name @VersionArgs 2>&1 | Select-Object -First 3) -join ' '
    } catch {}

    [pscustomobject]@{
        capability = $Name
        status     = 'FOUND'
        surface    = 'shell'
        resolved   = $cmd.Source
        detail     = $detail
    }
}

function Test-FirstCommandCapability {
    param(
        [string]$Capability,
        [string[]]$Candidates,
        [string[]]$VersionArgs = @('--version')
    )

    foreach ($candidate in $Candidates) {
        $cmd = Get-Command $candidate -ErrorAction SilentlyContinue
        if ($cmd) {
            $detail = $null
            try {
                $detail = (& $candidate @VersionArgs 2>&1 | Select-Object -First 3) -join ' '
            } catch {}
            return [pscustomobject]@{
                capability = $Capability
                status     = 'FOUND'
                surface    = 'shell'
                resolved   = $cmd.Source
                detail     = $detail
            }
        }
    }

    [pscustomobject]@{
        capability = $Capability
        status     = 'MISSING'
        surface    = 'shell'
        resolved   = $null
        detail     = "Candidates: $($Candidates -join ', ')"
    }
}

function Test-GsapSkills {
    $roots = @(
        (Join-Path $HOME '.codex\skills'),
        (Join-Path $HOME '.cursor\skills'),
        (Join-Path $HOME '.config\opencode\skills'),
        (Join-Path $HOME '.claude\skills')
    )

    $hits = @()
    foreach ($root in $roots) {
        if (Test-Path $root) {
            $matches = Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue |
                Where-Object { $_.Name -like 'gsap-*' } |
                Select-Object -ExpandProperty FullName
            $hits += $matches
        }
    }

    [pscustomobject]@{
        capability = 'GSAP AI Skills'
        status     = if ($hits.Count -gt 0) { 'FOUND' } else { 'MISSING' }
        surface    = 'agent-skill'
        resolved   = if ($hits.Count -gt 0) { ($hits -join '; ') } else { $null }
        detail     = if ($hits.Count -gt 0) { "$($hits.Count) skill directories detected" } else { 'No gsap-* skill directories found in known agent skill roots' }
    }
}

function Test-SpectorMcp {
    $candidates = @()
    if ($env:SPECTOR_REPO) {
        $candidates += (Join-Path $env:SPECTOR_REPO 'mcp\dist\index.js')
    }
    if (Test-Path 'K:\') {
        $candidates += 'K:\creative_tools\Spector.js\mcp\dist\index.js'
    }
    $candidates += (Join-Path $HOME 'creative_tools\Spector.js\mcp\dist\index.js')

    $hit = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1

    [pscustomobject]@{
        capability = 'Spector.js MCP'
        status     = if ($hit) { 'FOUND' } else { 'MISSING' }
        surface    = 'mcp-stdio'
        resolved   = $hit
        detail     = if ($hit) { 'MCP build artifact exists; client configuration still must reference this exact path.' } else { 'No known Spector.js MCP build artifact found.' }
    }
}

$checks = @()
$checks += Test-GsapSkills
$checks += Test-CommandCapability -Name 'gltf-transform'
$checks += Test-CommandCapability -Name 'gltfpack' -VersionArgs @('-h')
$checks += Test-CommandCapability -Name 'ffmpeg' -VersionArgs @('-version')
$checks += Test-CommandCapability -Name 'ktx' -VersionArgs @('--version')
$checks += Test-FirstCommandCapability -Capability 'Blender' -Candidates @('blender') -VersionArgs @('--version')
$checks += Test-FirstCommandCapability -Capability 'GIMP' -Candidates @('gimp','gimp-3.0','gimp-console-3.0') -VersionArgs @('--version')
$checks += Test-SpectorMcp
$checks += [pscustomobject]@{
    capability = 'WebGPU Inspector'
    status     = 'MANUAL_CHECK'
    surface    = 'browser-extension'
    resolved   = $null
    detail     = 'Browser-extension presence is intentionally not inferred from filesystem heuristics.'
}

$checks | Format-Table -AutoSize

Write-Output ""
Write-Output "JSON:"
$checks | ConvertTo-Json -Depth 4
