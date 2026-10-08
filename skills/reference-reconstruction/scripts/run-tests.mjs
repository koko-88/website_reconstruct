import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// These three suites may launch browsers; assets skip if optional parsers are absent. Keep their browser processes from
// overlapping; dependency-free validation retains Node's default concurrency.
const browserEnabled=Boolean(process.env.REFERENCE_PLAYWRIGHT_MODULE);
const files=['test-capture.mjs','test-settled-appearance.mjs','test-assets.mjs']
  .map(file=>fileURLToPath(new URL(file,import.meta.url)));
const args=['--test','--test-reporter=tap',...(browserEnabled?['--test-concurrency=1']:[]),...files];
console.log('Reference regression mode: '+(browserEnabled?'browser-enabled, serial (test-concurrency=1)':'dependency-free, default concurrency'));
const result=spawnSync(process.execPath,args,{stdio:'inherit',env:process.env});
if(result.error) console.error(result.error.message);
process.exitCode=result.status??1;
