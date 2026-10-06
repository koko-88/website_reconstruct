[CmdletBinding()]
param()

$ErrorActionPreference = 'SilentlyContinue'
$CodexConfig = Join-Path $HOME '.codex\config.toml'

function New-CapabilityResult {
    param(
        [string]$Capability,
        [string]$Status,
        [string]$Surface,
        [string]$Resolved = $null,
        [string]$Detail = $null
    )

    [pscustomobject]@{
        capability = $Capability
        status     = $Status
        surface    = $Surface
        resolved   = $Resolved
        detail     = $Detail
    }
}

function Invoke-VersionProbe {
    param(
        [string]$Executable,
        [string[]]$VersionArgs = @('--version')
    )

    try {
        $output = (& $Executable @VersionArgs 2>&1 | Select-Object -First 4) -join ' '
        $exitCode = $LASTEXITCODE
        if ($null -eq $exitCode) { $exitCode = 0 }

        [pscustomobject]@{
            success = ($exitCode -eq 0 -or -not [string]::IsNullOrWhiteSpace($output))
            detail  = $output
        }
    } catch {
        [pscustomobject]@{
            success = $false
            detail  = $_.Exception.Message
        }
    }
}

function Resolve-ExecutableCapability {
    param(
        [string]$Capability,
        [string[]]$Commands,
        [string[]]$PathPatterns = @(),
        [string[]]$VersionArgs = @('--version'),
        [string]$Surface = 'shell'
    )

    $resolved = @()

    foreach ($command in $Commands) {
        $cmd = Get-Command $command -ErrorAction SilentlyContinue
        if ($cmd -and $cmd.Source) {
            $resolved += $cmd.Source
        }
    }

    foreach ($pattern in $PathPatterns) {
        if ([string]::IsNullOrWhiteSpace($pattern)) { continue }
        $resolved += Get-ChildItem -Path $pattern -File -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty FullName
    }

    $resolved = @($resolved | Where-Object { $_ } | Select-Object -Unique)

    foreach ($candidate in $resolved) {
        $probe = Invoke-VersionProbe -Executable $candidate -VersionArgs $VersionArgs
        if ($probe.success) {
            return New-CapabilityResult -Capability $Capability -Status 'AVAILABLE' -Surface $Surface -Resolved $candidate -Detail $probe.detail
        }
    }

    if ($resolved.Count -gt 0) {
        return New-CapabilityResult -Capability $Capability -Status 'PRESENT_UNVERIFIED' -Surface $Surface -Resolved ($resolved -join '; ') -Detail 'Executable path found, but deterministic probe did not succeed.'
    }

    New-CapabilityResult -Capability $Capability -Status 'MISSING' -Surface $Surface -Detail "Commands checked: $($Commands -join ', ')"
}


function Resolve-FileCapability {
    param(
        [string]$Capability,
        [string[]]$PathPatterns,
        [string]$Surface = 'desktop'
    )

    $resolved = @()
    foreach ($pattern in $PathPatterns) {
        if ([string]::IsNullOrWhiteSpace($pattern)) { continue }
        $resolved += Get-ChildItem -Path $pattern -File -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty FullName
    }

    $resolved = @($resolved | Where-Object { $_ } | Select-Object -Unique)
    if ($resolved.Count -eq 0) {
        return New-CapabilityResult -Capability $Capability -Status 'MISSING' -Surface $Surface -Detail 'No matching executable/file found.'
    }

    $hit = $resolved[0]
    $item = Get-Item -LiteralPath $hit -ErrorAction SilentlyContinue
    $version = if ($item -and $item.VersionInfo) { $item.VersionInfo.FileVersion } else { $null }

    New-CapabilityResult -Capability $Capability -Status 'AVAILABLE' -Surface $Surface -Resolved $hit -Detail $(if ($version) { "File version: $version" } else { 'Executable/file is present.' })
}

function Test-AgentSkillFamily {
    param(
        [string]$Capability,
        [string]$Pattern
    )

    $roots = @(
        (Join-Path $HOME '.agents\skills'),
        (Join-Path $HOME '.codex\skills'),
        (Join-Path $HOME '.cursor\skills'),
        (Join-Path $HOME '.config\opencode\skills'),
        (Join-Path $HOME '.claude\skills')
    )

    $hits = @()
    foreach ($root in $roots) {
        if (-not (Test-Path $root)) { continue }

        $hits += Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like $Pattern -and (Test-Path (Join-Path $_.FullName 'SKILL.md')) } |
            Select-Object -ExpandProperty FullName
    }

    $hits = @($hits | Select-Object -Unique)

    New-CapabilityResult `
        -Capability $Capability `
        -Status $(if ($hits.Count -gt 0) { 'AVAILABLE' } else { 'MISSING' }) `
        -Surface 'agent-skill' `
        -Resolved $(if ($hits.Count -gt 0) { $hits -join '; ' } else { $null }) `
        -Detail $(if ($hits.Count -gt 0) { "$($hits.Count) skill directories with SKILL.md detected." } else { "No '$Pattern' skills found in known agent roots." })
}

function Get-CodexMcpServerNames {
    if (-not (Test-Path $CodexConfig)) { return @() }

    $raw = Get-Content $CodexConfig -Raw
    @(
        [regex]::Matches($raw, '(?m)^\[mcp_servers\.([^\]]+)\]') |
            ForEach-Object { $_.Groups[1].Value.Trim('"').Trim("'") }
    )
}

function Test-TcpPort {
    param(
        [string]$HostName,
        [int]$Port,
        [int]$TimeoutMs = 600
    )

    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $async = $client.BeginConnect($HostName, $Port, $null, $null)
        if (-not $async.AsyncWaitHandle.WaitOne($TimeoutMs, $false)) {
            return $false
        }
        $client.EndConnect($async)
        return $true
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

function Test-SpectorMcp {
    param([string[]]$ConfiguredServers)

    $candidates = @()
    if ($env:SPECTOR_REPO) {
        $candidates += (Join-Path $env:SPECTOR_REPO 'mcp\dist\index.js')
    }
    if (Test-Path 'K:\') {
        $candidates += 'K:\creative_tools\Spector.js\mcp\dist\index.js'
    }
    $candidates += (Join-Path $HOME 'creative_tools\Spector.js\mcp\dist\index.js')

    $artifact = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
    $configured = $ConfiguredServers -contains 'spector'

    if ($artifact -and $configured) {
        return New-CapabilityResult -Capability 'Spector.js MCP' -Status 'CONFIGURED' -Surface 'mcp-stdio' -Resolved $artifact -Detail 'Build artifact exists and Codex MCP configuration contains [mcp_servers.spector]. Live browser/page workflow must still be exercised by the MCP client.'
    }

    if ($artifact) {
        return New-CapabilityResult -Capability 'Spector.js MCP' -Status 'PRESENT_UNCONFIGURED' -Surface 'mcp-stdio' -Resolved $artifact -Detail 'Build artifact exists, but Codex MCP configuration does not contain [mcp_servers.spector].'
    }

    New-CapabilityResult -Capability 'Spector.js MCP' -Status 'MISSING' -Surface 'mcp-stdio' -Detail 'No known Spector.js MCP build artifact found.'
}

function Test-BlenderMcp {
    param([string[]]$ConfiguredServers)

    $configured = $ConfiguredServers -contains 'blender'
    $bridgeUp = Test-TcpPort -HostName '127.0.0.1' -Port 9876

    if ($configured -and $bridgeUp) {
        return New-CapabilityResult -Capability 'Blender MCP' -Status 'REACHABLE' -Surface 'mcp-local-bridge' -Resolved '127.0.0.1:9876' -Detail 'Codex MCP configuration exists and the Blender add-on bridge port is reachable.'
    }

    if ($configured) {
        return New-CapabilityResult -Capability 'Blender MCP' -Status 'CONFIGURED' -Surface 'mcp-local-bridge' -Detail 'Codex MCP configuration exists; local bridge is not reachable right now (Blender/add-on may not be running).'
    }

    New-CapabilityResult -Capability 'Blender MCP' -Status 'MISSING_CONFIG' -Surface 'mcp-local-bridge' -Detail 'Codex MCP configuration does not contain [mcp_servers.blender].'
}

function Test-BabylonMcps {
    param([string[]]$ConfiguredServers)

    $expected = @(
        'babylon-material',
        'babylon-geometry',
        'babylon-render-graph',
        'babylon-particles',
        'babylon-gui',
        'babylon-flow-graph',
        'babylon-smart-filters'
    )

    $present = @($expected | Where-Object { $ConfiguredServers -contains $_ })
    $missing = @($expected | Where-Object { $ConfiguredServers -notcontains $_ })

    New-CapabilityResult `
        -Capability 'Babylon authoring MCPs' `
        -Status $(if ($missing.Count -eq 0) { 'CONFIGURED' } elseif ($present.Count -gt 0) { 'PARTIAL' } else { 'MISSING_CONFIG' }) `
        -Surface 'mcp-stdio' `
        -Resolved $(if ($present.Count -gt 0) { $present -join ', ' } else { $null }) `
        -Detail $(if ($missing.Count -eq 0) { 'All seven expected Babylon authoring MCP servers are configured. Live tool calls are verified by the MCP client, not by this PowerShell script.' } else { "Missing MCP entries: $($missing -join ', ')" })
}

function Test-GitTrackedFile {
    param([string]$Path)

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) { return $false }
    $null = & git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0) { return $false }

    $null = & git ls-files --error-unmatch -- $Path 2>$null
    return ($LASTEXITCODE -eq 0)
}

function Test-ProjectRuntimeSelection {
    $packagePath = Join-Path (Get-Location) 'package.json'
    $lockPath = Join-Path (Get-Location) 'package-lock.json'
    $creativeCandidates = @(
        'gsap',
        'three',
        'pixi.js',
        'lenis',
        '@theatre/core',
        '@theatre/studio',
        '@babylonjs/core',
        '@babylonjs/loaders',
        '@babylonjs/inspector'
    )

    $packageTracked = Test-GitTrackedFile -Path 'package.json'
    $lockTracked = Test-GitTrackedFile -Path 'package-lock.json'
    $lockExists = Test-Path $lockPath

    if (-not (Test-Path $packagePath)) {
        if ($lockExists) {
            return New-CapabilityResult -Capability 'Project runtime selection' -Status 'ORPHAN_LOCKFILE' -Surface 'project-npm' -Resolved $lockPath -Detail "package-lock.json exists without package.json; tracked=$lockTracked."
        }

        return New-CapabilityResult -Capability 'Project runtime selection' -Status 'NOT_SELECTED' -Surface 'project-npm' -Detail 'No root package.json/package-lock.json exists. This is expected before replanning/bootstrap.'
    }

    try {
        $pkg = Get-Content $packagePath -Raw | ConvertFrom-Json
        $declared = @()
        foreach ($name in $creativeCandidates) {
            if (($pkg.dependencies -and $pkg.dependencies.PSObject.Properties.Name -contains $name) -or
                ($pkg.devDependencies -and $pkg.devDependencies.PSObject.Properties.Name -contains $name)) {
                $declared += $name
            }
        }

        $status = if ($declared.Count -eq 0) {
            'NO_CREATIVE_RUNTIME'
        } elseif ($declared.Count -eq $creativeCandidates.Count -and -not $packageTracked) {
            'TEMP_BUNDLE_UNTRACKED'
        } elseif ($declared.Count -eq $creativeCandidates.Count) {
            'REVIEW_REQUIRED'
        } else {
            'DECLARED'
        }

        $detail = "package.json tracked=$packageTracked; package-lock exists=$lockExists; package-lock tracked=$lockTracked. "
        $detail += if ($declared.Count -gt 0) { "Creative runtime packages declared: $($declared -join ', ')" } else { 'No creative runtime candidate is declared.' }

        return New-CapabilityResult -Capability 'Project runtime selection' -Status $status -Surface 'project-npm' -Resolved $packagePath -Detail $detail
    } catch {
        return New-CapabilityResult -Capability 'Project runtime selection' -Status 'INVALID_PACKAGE_JSON' -Surface 'project-npm' -Resolved $packagePath -Detail $_.Exception.Message
    }
}

$configuredMcpServers = Get-CodexMcpServerNames

$checks = @()
$checks += Test-AgentSkillFamily -Capability 'GSAP AI Skills' -Pattern 'gsap*'
$checks += Test-AgentSkillFamily -Capability 'PixiJS Skills' -Pattern 'pixijs*'

$checks += Resolve-ExecutableCapability -Capability 'glTF Transform' -Commands @('gltf-transform') -VersionArgs @('--version')
$checks += Resolve-ExecutableCapability -Capability 'gltfpack' -Commands @('gltfpack') -VersionArgs @('-h')
$checks += Resolve-ExecutableCapability -Capability 'FFmpeg' -Commands @('ffmpeg') -VersionArgs @('-version')
$checks += Resolve-ExecutableCapability -Capability 'KTX-Software' -Commands @('ktx') -PathPatterns @(
    (Join-Path $HOME 'scoop\apps\ktx-software\current\bin\ktx.exe'),
    (Join-Path $HOME 'scoop\apps\ktx-software\*\bin\ktx.exe')
) -VersionArgs @('--version')
$checks += Resolve-ExecutableCapability -Capability 'Blender' -Commands @('blender') -PathPatterns @(
    'C:\Program Files\Blender Foundation\Blender *\blender.exe'
) -VersionArgs @('--version') -Surface 'desktop-cli'
$checks += Resolve-ExecutableCapability -Capability 'GIMP' -Commands @('gimp','gimp-3.0','gimp-console','gimp-console-3.0') -PathPatterns @(
    (Join-Path $env:LOCALAPPDATA 'Programs\GIMP 3\bin\gimp-console*.exe'),
    'C:\Program Files\GIMP *\bin\gimp-console*.exe'
) -VersionArgs @('--version') -Surface 'desktop-cli'
$checks += Resolve-ExecutableCapability -Capability 'RenderDoc CLI' -Commands @('renderdoccmd') -PathPatterns @(
    'C:\Program Files\RenderDoc\renderdoccmd.exe'
) -VersionArgs @('version') -Surface 'native-cli'
$checks += Resolve-FileCapability -Capability 'RenderDoc GUI' -PathPatterns @(
    'C:\Program Files\RenderDoc\qrenderdoc.exe'
) -Surface 'desktop-gui'

$checks += Test-SpectorMcp -ConfiguredServers $configuredMcpServers
$checks += Test-BlenderMcp -ConfiguredServers $configuredMcpServers
$checks += Test-BabylonMcps -ConfiguredServers $configuredMcpServers

$checks += New-CapabilityResult -Capability 'WebGPU Inspector' -Status 'OPTIONAL_MANUAL_CHECK' -Surface 'browser-extension' -Detail 'Not part of the required workstation baseline; browser-extension presence is not inferred from filesystem heuristics.'
$checks += Test-ProjectRuntimeSelection

$checks | Format-Table -AutoSize

Write-Output ""
Write-Output "JSON:"
$checks | ConvertTo-Json -Depth 5
