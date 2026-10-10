import fs from 'node:fs';
import path from 'node:path';

// Tool selection is explicit; never search an inherited PATH or launch a shell.
export function mediaExecutable(name, environment = process.env) {
  if (!['ffprobe', 'ffmpeg'].includes(name)) { throw new Error('Unsupported media tool'); }
  const setting = `REFERENCE_${name.toUpperCase()}_PATH`;
  const configured = environment[setting];
  if (!configured) { return null; }
  if (!path.isAbsolute(configured)) { throw new Error(setting + ' must be an absolute executable path'); }
  const executable = fs.realpathSync(configured);
  if (!fs.statSync(executable).isFile()) { throw new Error(setting + ' must identify a file'); }
  if(process.platform==='win32'&&path.extname(executable).toLowerCase()!=='.exe') {
    throw new Error(setting + ' must identify a native .exe executable');
  }
  fs.accessSync(executable,fs.constants.X_OK);
  return executable;
}
