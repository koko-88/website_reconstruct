#requires -Version 5.1
[CmdletBinding()]
param(
    [switch]$VerifyOnly,
    [switch]$IncludeAgentCompass,
    [switch]$AddUserPath,
    [string]$EvidenceDirectory
)

$ErrorActionPreference = 'Stop'
$pythonVersion = '3.12.15'
$inspectVersion = '0.3.276'
$evalsVersion = '0.23.0'
$compassVersion = '1.0.0'
$selectedTools = @('inspect-ai')
$selectedCommands = @('inspect')
if ($IncludeAgentCompass) {
    $selectedTools += 'agentcompass'
    $selectedCommands += 'agentcompass'
}

function Invoke-Checked {
    param([string]$Executable, [string[]]$Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Executable failed with exit code $LASTEXITCODE."
    }
}

function Test-DependencySnapshot {
    param([string]$Python, [string]$Constraint)
    if (-not (Test-Path -LiteralPath $Python)) { return $false }
    $checkCode = @'
import importlib.metadata as md, pathlib, platform, re, sys
normalize = lambda name: re.sub(r"[-_.]+", "-", name).lower()
lines = [line.strip() for line in pathlib.Path(sys.argv[1]).read_text(encoding="utf-8-sig").splitlines()]
pairs = [line.split("==", 1) for line in lines if line and not line.startswith("#")]
expected = {normalize(name): version for name, version in pairs}
actual = {normalize(dist.metadata["Name"]): dist.version for dist in md.distributions()}
sys.exit(0 if platform.python_version() == sys.argv[2] and actual == expected else 1)
'@
    & $Python -I -c $checkCode $Constraint $pythonVersion 2>&1 | Out-Null
    return ($LASTEXITCODE -eq 0)
}

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    throw 'uv is required. Install it using https://docs.astral.sh/uv/getting-started/installation/ and rerun.'
}
if (-not $EvidenceDirectory) {
    $EvidenceDirectory = Join-Path ([System.IO.Path]::GetTempPath()) 'benchmark-tooling-verification'
}
New-Item -ItemType Directory -Force -Path $EvidenceDirectory | Out-Null
$savedTimeout = $env:UV_HTTP_TIMEOUT
try {
    $env:UV_HTTP_TIMEOUT = '300'
    $toolRoot = (& uv tool dir | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve uv tool directory.' }
    $binRoot = (& uv tool dir --bin | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve uv executable directory.' }
    if (-not $VerifyOnly) {
        Invoke-Checked uv @('python', 'install', $pythonVersion)
        $inspectArguments = @('tool', 'install', '--python', $pythonVersion,
            '--with', "inspect-evals==$evalsVersion", '--with', 'mcp')
        $compassArguments = @('tool', 'install', '--python', $pythonVersion)
        foreach ($snapshotName in $selectedCommands) {
            $constraint = Join-Path $PSScriptRoot ($snapshotName + '-constraints.txt')
            if (-not (Test-Path -LiteralPath $constraint)) {
                throw "Missing dependency snapshot: $constraint"
            }
        }
        $inspectArguments += @('--constraints', (Join-Path $PSScriptRoot 'inspect-constraints.txt'), "inspect-ai==$inspectVersion")
        $compassArguments += @('--constraints', (Join-Path $PSScriptRoot 'agentcompass-constraints.txt'), "agentcompass==$compassVersion")
        $installItems = ,@('inspect-ai', 'inspect', $inspectArguments)
        if ($IncludeAgentCompass) { $installItems += ,@('agentcompass', 'agentcompass', $compassArguments) }
        foreach ($item in $installItems) {
            $constraint = Join-Path $PSScriptRoot ($item[1] + '-constraints.txt')
            $existingPython = Join-Path $toolRoot ($item[0] + '\Scripts\python.exe')
            $launcher = Join-Path $binRoot ($item[1] + '.exe')
            if ((Test-DependencySnapshot $existingPython $constraint) -and (Test-Path -LiteralPath $launcher)) {
                Write-Output "$($item[0]): runtime and full dependency snapshot already match."
            }
            else {
                $installArguments = @($item[2])
                if (Test-Path -LiteralPath $existingPython) { $installArguments += '--reinstall' }
                Invoke-Checked uv $installArguments
            }
        }
    }
    if ($AddUserPath) {
        $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
        # IntelliJ also supplies an inspect launcher. Preserve other entries,
        # but move uv's bin directory first to disambiguate the requested CLI.
        $entries = @($userPath -split ';' | Where-Object {
            $_ -and $_.TrimEnd('\') -ine $binRoot.TrimEnd('\') })
        $updatedPath = (@($binRoot) + $entries) -join ';'
        if ($updatedPath -cne $userPath) {
            [Environment]::SetEnvironmentVariable('Path', $updatedPath, 'User')
        }
        $processEntries = @($env:Path -split ';' | Where-Object {
            $_ -and $_.TrimEnd('\') -ine $binRoot.TrimEnd('\') })
        $env:Path = (@($binRoot) + $processEntries) -join ';'
    }
    foreach ($toolName in $selectedTools) {
        $toolPython = Join-Path $toolRoot "$toolName\Scripts\python.exe"
        if (-not (Test-Path -LiteralPath $toolPython)) { throw "Missing environment: $toolName" }
        $mode = if ($toolName -eq 'inspect-ai') { 'inspect' } else { 'agentcompass' }
        if (-not (Test-DependencySnapshot $toolPython (Join-Path $PSScriptRoot ($mode + '-constraints.txt')))) {
            throw "$toolName runtime or dependency graph differs from the pinned snapshot. Run without -VerifyOnly to reconcile it."
        }
        Invoke-Checked uv @('pip', 'check', '--python', $toolPython)
        Invoke-Checked $toolPython @((Join-Path $PSScriptRoot 'verify-tooling.py'), $mode,
            '--output', (Join-Path $EvidenceDirectory ($mode + '-verification.json')))
        $receipt = Get-Content (Join-Path $EvidenceDirectory ($mode + '-verification.json')) -Raw | ConvertFrom-Json
        if ($receipt.status -ne 'READY') {
            Write-Warning "$mode status: $($receipt.status). $($receipt.checks.runtime_discovery)"
        }
    }
    foreach ($commandName in $selectedCommands) {
        $command = Get-Command $commandName -ErrorAction SilentlyContinue
        if (-not $command) {
            throw "$commandName is not on this shell's PATH. Rerun with -AddUserPath or refresh the shell after adding $binRoot to user PATH."
        }
        $expectedLauncher = Join-Path $binRoot ($commandName + '.exe')
        if ($command.Source -ine $expectedLauncher) { throw "Another $commandName shadows $expectedLauncher" }
        Invoke-Checked $command.Source @('--version')
        Invoke-Checked $command.Source @('--help')
    }
    Write-Output "Verification evidence: $EvidenceDirectory"
    Write-Output 'CLI/import readiness only; not production acceptance.'
    if ($IncludeAgentCompass) { Write-Output 'AgentCompass native Windows benchmark execution is unsupported.' }
}
finally {
    $env:UV_HTTP_TIMEOUT = $savedTimeout
}
