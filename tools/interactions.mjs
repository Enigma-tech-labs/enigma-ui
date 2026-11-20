import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist/apps/docs/browser');
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
const checks = [
  {
    route: 'components/select',
    name: 'select keyboard selection',
    async run(page) {
      const trigger = page.getByRole('button', { name: /City/ }).first();
      await trigger.press('ArrowDown');
      await page.getByRole('listbox').waitFor();
      await page.keyboard.press('Enter');
      await trigger.getByText('Cairo').waitFor();
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    },
  },
  {
    route: 'components/combobox',
    name: 'combobox filtered keyboard selection',
    async run(page) {
      const field = page.getByRole('combobox', {
        name: 'Country',
        exact: true,
      });
      await field.fill('United States');
      await page.getByRole('option', { name: 'United States' }).waitFor();
      await field.press('ArrowDown');
      await field.press('Enter');
      assert.equal(await field.inputValue(), 'United States');
      const handle = await field.elementHandle();
      await page.waitForFunction(
        (input) => input?.getAttribute('aria-expanded') === 'false',
        handle,
      );
    },
  },
  {
    route: 'components/tabs',
    name: 'tabs skip disabled choices with arrow keys',
    async run(page) {
      const tabs = page.getByRole('tablist', { name: 'Order' });
      const tab = tabs.getByRole('tab', { name: 'Details', exact: true });
      await tab.press('ArrowRight');
      const history = tabs.getByRole('tab', {
        name: 'History',
        exact: true,
      });
      await page.waitForFunction(
        (element) => element?.getAttribute('aria-selected') === 'true',
        await history.elementHandle(),
      );
      assert.equal(await history.getAttribute('aria-selected'), 'true');
      assert.equal(
        await tabs
          .getByRole('tab', { name: 'Invoice', exact: true })
          .isDisabled(),
        true,
      );
    },
  },
  {
    route: 'components/dialog',
    name: 'dialog traps focus and Escape restores the opener',
    async run(page) {
      const opener = page.getByRole('button', {
        name: 'Edit address',
        exact: true,
      });
      await opener.click();
      const dialog = page.getByRole('dialog', { name: 'Edit address' });
      await dialog.waitFor();
      await page.getByRole('textbox', { name: 'Street' }).focus();
      await page.keyboard.press('Tab');
      assert.equal(
        await dialog.locator(':focus').count(),
        1,
        'Tab should keep focus inside the dialog',
      );
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' });
      assert.equal(
        await opener.evaluate((el) => el === document.activeElement),
        true,
      );
    },
  },
  {
    route: 'foundations/theme',
    name: 'theme preview updates and exports CSS',
    async run(page) {
      const input = page.getByRole('textbox', { name: 'Or type a hex' });
      const css = page.locator('.doc-code pre code');
      const original = await css.textContent();

      await input.fill('not-a-colour');
      assert.equal(await input.getAttribute('aria-invalid'), 'true');
      assert.equal(await css.textContent(), original);

      await input.fill('#0f766e');
      await page.waitForFunction(
        (before) =>
          document.querySelector('.doc-code pre code')?.textContent !== before,
        original,
      );
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Download theme.css' }).click();
      const download = await downloadPromise;
      assert.equal(download.suggestedFilename(), 'enigma-theme.css');
      assert.equal(
        await readFile(await download.path(), 'utf8'),
        await css.textContent(),
      );
    },
  },
];

async function open(route) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
    acceptDownloads: true,
  });
  await context.addInitScript(() => {
    localStorage.setItem('enigma-ui:framework', 'angular');
    localStorage.setItem('enigma-ui:theme', 'light');
  });
  const page = await context.newPage();
  await page.goto(site + route);
  await page.locator('main h1').waitFor();
  return { page, close: () => context.close() };
}

try {
  for (const check of checks) {
    const { page, close } = await open(check.route);
    try {
      await check.run(page);
      console.log(`✔ ${check.name}`);
    } finally {
      await close();
    }
  }
} finally {
  await browser.close();
  await new Promise((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
}

console.log(`✔ ${checks.length} browser interaction checks passed.`);
