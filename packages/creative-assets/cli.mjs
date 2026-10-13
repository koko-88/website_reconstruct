#!/usr/bin/env node
import { exportModel, inspectModel, processImage, processMedia, processTexture } from './pipeline.mjs';
const [command, ...args] = process.argv.slice(2);
try {
  let result;
  if (command === 'image' && args.length === 4) result = await processImage(args[0], args[1], { source: args[2], license: args[3] });
  else if (command === 'model' && args.length === 3) result = await exportModel(...args);
  else if (command === 'inspect' && args.length === 1) result = await inspectModel(args[0]);
  else if (command === 'texture' && args.length === 3) result = await processTexture(...args);
  else if (command === 'media' && args.length === 4) result = await processMedia(args[0], args[1], { source: args[2], license: args[3] });
  else throw new Error('Usage: creative-assets image SOURCE OUTPUT ATTRIBUTION LICENSE | model EXPORTER SOURCE-DIR PUBLIC-DIR | inspect MODEL.glb | texture SOURCE OUTPUT.ktx2 DECODER-DIR | media SOURCE OUTPUT.mp4 ATTRIBUTION LICENSE');
  console.log(JSON.stringify(result, null, 2));
} catch (error) { console.error(error.message); process.exitCode = 1; }
