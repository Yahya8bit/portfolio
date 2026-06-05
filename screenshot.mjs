import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const url = process.argv[2];
const label = process.argv[3];

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  process.exit(1);
}

const OUT_DIR = join(process.cwd(), 'temporary screenshots');
await mkdir(OUT_DIR, { recursive: true });

// find next index: highest existing screenshot-N + 1, never overwrite
const files = await readdir(OUT_DIR).catch(() => []);
let max = 0;
for (const f of files) {
  const m = f.match(/^screenshot-(\d+)/);
  if (m) max = Math.max(max, Number(m[1]));
}
const n = max + 1;
const name = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outPath = join(OUT_DIR, name);

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(outPath);
} finally {
  await browser.close();
}
