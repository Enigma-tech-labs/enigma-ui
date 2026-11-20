import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist/apps/docs/browser');
const snapshots = resolve('tools/snapshots');
const update = process.argv.includes('--update');
const index = await readFile(join(root, 'index.html'), 'utf8');
const base = index.match(/<base href="([^"]*)"/)?.[1] ?? '/';
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  const file = resolve(root, '.' + sep + path.slice(base.length));
  try {
    if (!file.startsWith(root + sep)) throw new Error('outside the build');
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    if (extname(path)) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(index);
  }
}).listen(0);

const site = `http://localhost:${server.address().port}${base}`;
const browser = await chromium.launch();
const pages = [
  { route: '', name: 'home' },
  { route: 'integrations/vue', name: 'vue-integration' },
];
const width = 1280;
const height = 900;
const maxChangedRatio = process.platform === 'linux' ? 0.04 : 0.02;
const channelTolerance = 32;

async function compare(page, actualBytes, baselineBytes, name) {
  const { actual, baseline, ratio } = await page.evaluate(
    async ({ actualImage, baselineImage, tolerance }) => {
      async function decode(data) {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D context is unavailable');
        context.drawImage(image, 0, 0);
        return {
          width: canvas.width,
          height: canvas.height,
          data: context.getImageData(0, 0, canvas.width, canvas.height).data,
        };
      }

      const [actual, baseline] = await Promise.all([
        decode(actualImage),
        decode(baselineImage),
      ]);
      if (
        actual.width !== baseline.width ||
        actual.height !== baseline.height
      ) {
        return { actual, baseline, ratio: 1 };
      }

      let changed = 0;
      for (let i = 0; i < actual.data.length; i += 4) {
        if (
          [0, 1, 2].some(
            (channel) =>
              Math.abs(actual.data[i + channel] - baseline.data[i + channel]) >
              tolerance,
          )
        ) {
          changed++;
        }
      }
      return {
        actual,
        baseline,
        ratio: changed / (actual.width * actual.height),
      };
    },
    {
      actualImage: actualBytes.toString('base64'),
      baselineImage: baselineBytes.toString('base64'),
      tolerance: channelTolerance,
    },
  );
  assert.equal(
    actual.width,
    baseline.width,
    `${name}: screenshot width changed`,
  );
  assert.equal(
    actual.height,
    baseline.height,
    `${name}: screenshot height changed`,
  );
  assert.ok(
    ratio <= maxChangedRatio,
    `${name}: ${(ratio * 100).toFixed(2)}% of pixels changed; maximum is ${maxChangedRatio * 100}%`,
  );
  console.log(`✔ ${name}: ${(ratio * 100).toFixed(2)}% changed pixels`);
}

try {
  for (const { route, name } of pages) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: 'reduce',
    });
    await context.addInitScript(() => {
      localStorage.setItem('enigma-ui:framework', 'angular');
      localStorage.setItem('enigma-ui:theme', 'light');
    });
    const page = await context.newPage();
    await page.goto(site + route);
    await page.locator('main h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; scroll-behavior: auto !important; }',
    });

    if (!route) {
      const autoSpin = page.getByRole('switch', { name: 'Auto-spin' });
      if (await autoSpin.isChecked()) await autoSpin.click();
    }

    const image = await page.screenshot({
      clip: { x: 0, y: 0, width, height },
      animations: 'disabled',
    });
    const path = join(snapshots, `${name}.png`);
    if (update) {
      await mkdir(snapshots, { recursive: true });
      await writeFile(path, image);
      console.log(`Updated ${path}`);
    } else {
      await compare(page, image, await readFile(path), name);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
}
