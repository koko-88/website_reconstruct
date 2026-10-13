param(
    [Parameter(Mandatory)][ValidateSet('blender', 'polypane')][string]$Capability,
    [Parameter(Mandatory)][string]$Executable
)
$ErrorActionPreference = 'Stop'
if (-not [IO.Path]::IsPathRooted($Executable) -or -not (Test-Path -LiteralPath $Executable -PathType Leaf)) {
    throw 'Pass the verified absolute path of the existing application. This command never installs it.'
}
$application = (Resolve-Path -LiteralPath $Executable).Path
$expected = if ($Capability -eq 'blender') { 'blender.exe' } else { 'Polypane.exe' }
if ([IO.Path]::GetFileName($application) -ine $expected) { throw "Expected $expected" }
$port = if ($Capability -eq 'blender') { 9876 } else { 5858 }
$probe = [Net.Sockets.TcpClient]::new()
try {
    $connection = $probe.ConnectAsync('127.0.0.1', $port)
    $listening = $connection.Wait(1000) -and $probe.Connected
} catch { $listening = $false } finally { $probe.Dispose() }
if ($listening) {
    Write-Output "$Capability endpoint already listens on loopback:$port; verify it with the MCP health tool."
    return
}
# Do not restart an existing application: it may contain unsaved work.
if (Get-Process -Name ([IO.Path]::GetFileNameWithoutExtension($expected)) -ErrorAction SilentlyContinue) {
    throw "$Capability is already running without its endpoint. Preserve its session; enable its existing bridge/debugging configuration before retrying."
}
if ($Capability -eq 'polypane') {
    $started = Start-Process -FilePath $application -ArgumentList '--remote-debugging-port=5858' -WindowStyle Hidden -PassThru
} else {
    # The installed/enabled addon owns startup. Never replace a scene or enable providers here.
    $started = Start-Process -FilePath $application -WindowStyle Hidden -PassThru
}
Write-Output "$Capability started as PID $($started.Id). Probe its MCP endpoint; process launch alone is not certification."
