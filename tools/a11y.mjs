// Accessibility audit of the built docs site: every page, in light and dark, in each
// framework view, plus open dialogs, alerts and the select list. Fails on any
// WCAG 2.2 AA or best-practice violation found by axe.
//
// Run after building the docs: pnpm nx a11y docs   (CI runs `node tools/a11y.mjs`)
import { AxeBuilder } from '@axe-core/playwright';
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

// A static server for the build, under the same base path as GitHub Pages.
// Unknown paths get index.html, as the 404.html fallback does on Pages.
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
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(index);
  }
}).listen(0);
const site = `http://localhost:${server.address().port}${base}`;

// The pages come from the router, so a new page is audited without editing this file.
const routes = await readFile('apps/docs/src/app/app.routes.ts', 'utf8');
const paths = [...routes.matchAll(/path: '([^'*]*)'/g)].map(([, p]) => p);

const browser = await chromium.launch();
const failures = [];

async function audit(page, label, { disableRules = [] } = {}) {
  const result = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22aa',
      'best-practice',
    ])
    .disableRules(disableRules)
    .analyze();
  for (const v of result.violations) {
    failures.push({
      label,
      rule: v.id,
      impact: v.impact,
      help: v.help,
      targets: v.nodes.map((n) => n.target.join(' ')),
    });
  }
  return result.violations.length;
}

async function open(theme, framework, path) {
  // Reduced motion turns the kit's animations off, so colours are measured at rest, not mid-fade.
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  await context.addInitScript(
    ([t, f]) => {
      localStorage.setItem('enigma-ui:theme', t);
      localStorage.setItem('enigma-ui:framework', f);
    },
    [theme, framework],
  );
  const page = await context.newPage();
  await page.goto(site + path);
  await page.locator('app-page').waitFor();
  return { page, close: () => context.close() };
}

let audits = 0;
for (const theme of ['light', 'dark']) {
  for (const framework of ['angular', 'react', 'html']) {
    for (const path of paths) {
      // Only component pages change with the framework.
      if (framework !== 'angular' && !path.startsWith('components/')) continue;
      const { page, close } = await open(theme, framework, path);
      await audit(page, `${theme} ${framework} /${path}`);
      audits++;
      await close();
    }
  }

  const states = [
    ['angular', 'components/dialog', 'Edit address', 'dialog'],
    ['angular', 'components/dialog', 'Read the terms', 'dialog'],
    ['angular', 'components/alert-dialog', 'Delete file', 'alertdialog'],
    ['angular', 'components/alert-dialog', 'Leave the page', 'alertdialog'],
    ['angular', 'components/drawer', 'Add building', 'dialog'],
    ['angular', 'components/drawer', 'Add building in Arabic', 'dialog'],
    ['html', 'components/dialog', 'Edit address', 'dialog'],
    ['html', 'components/drawer', 'Add building', 'dialog'],
    ['html', 'components/alert-dialog', 'Delete file', 'alertdialog'],
  ];
  for (const [framework, path, button, role] of states) {
    const { page, close } = await open(theme, framework, path);
    await page.getByRole('button', { name: button, exact: true }).click();
    await page.getByRole(role).waitFor();
    await audit(page, `${theme} ${framework} /${path}: "${button}" open`);
    audits++;
    await close();
  }

  // The CDK puts popup lists at the end of <body>, outside any landmark. That is how
  // overlays work and the list is announced through its button, so `region` is off here.
  const { page, close } = await open(theme, 'angular', 'components/select');
  await page.getByRole('button', { name: /City/ }).first().click();
  await page.getByRole('listbox').waitFor();
  await page.keyboard.press('ArrowDown');
  await audit(page, `${theme} angular /components/select: list open`, {
    disableRules: ['region'],
  });
  audits++;
  await close();
}

await browser.close();
server.close();

if (failures.length) {
  for (const f of failures) {
    console.error(
      `✖ [${f.impact}] ${f.rule}: ${f.help}\n  ${f.label}\n  ${f.targets.slice(0, 3).join('\n  ')}`,
    );
  }
  console.error(
    `\n${failures.length} accessibility problems in ${audits} audits.`,
  );
  process.exit(1);
}
console.log(`✔ ${audits} audits, no accessibility problems.`);
