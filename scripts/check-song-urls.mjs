// Script to verify all OSRS Wiki audio URLs are reachable
// Reads filenames directly from musicTracks.js

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.join(__dirname, '../scapedle/src/musicTracks.js'), 'utf8');

// Extract all url: "..." values
const urlMatches = [...src.matchAll(/url:\s*"([^"]+)"/g)].map(m => m[1]);
const tracks = [...new Set(urlMatches)]; // deduplicate

const BATCH_SIZE = 10;
const DELAY_MS = 300;

async function checkTrack(filename) {
  const apiUrl = `https://oldschool.runescape.wiki/api.php?action=query&prop=imageinfo&iiprop=url&titles=File:${encodeURIComponent(decodeURIComponent(filename))}&format=json&origin=*`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return { filename, status: 'HTTP_ERROR', code: res.status };
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return { filename, status: 'NO_DATA' };
    const page = Object.values(pages)[0];
    if (page?.missing !== undefined) return { filename, status: 'NOT_FOUND' };
    const audioUrl = page?.imageinfo?.[0]?.url;
    if (!audioUrl) return { filename, status: 'NO_URL' };
    return { filename, status: 'OK', audioUrl };
  } catch (err) {
    return { filename, status: 'FETCH_ERROR', error: err.message };
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log(`Checking ${tracks.length} unique track URLs from musicTracks.js...\n`);
  const results = [];

  for (let i = 0; i < tracks.length; i += BATCH_SIZE) {
    const batch = tracks.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(checkTrack));
    results.push(...batchResults);
    const done = Math.min(i + BATCH_SIZE, tracks.length);
    process.stdout.write(`\r  Progress: ${done}/${tracks.length}`);
    if (i + BATCH_SIZE < tracks.length) await sleep(DELAY_MS);
  }

  console.log('\n');

  const failed = results.filter(r => r.status !== 'OK');
  const ok = results.filter(r => r.status === 'OK');

  console.log(`Results: ${ok.length} OK, ${failed.length} FAILED\n`);

  if (failed.length === 0) {
    console.log('All tracks resolved successfully!');
  } else {
    console.log('=== FAILED TRACKS ===');
    for (const f of failed) {
      console.log(`  [${f.status}] ${f.filename}`);
    }
  }
}

main().catch(console.error);
