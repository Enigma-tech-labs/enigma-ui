import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const pagesDir = join(root, 'apps/docs/src/app/pages');
const files = readdirSync(pagesDir)
  .filter(
    (file) =>
      file.endsWith('-page.component.ts') && file !== 'icons-page.component.ts',
  )
  .sort();
const failures = [];
const intentionalDifferences = {
  'accordion-page.component.ts': {
    heading:
      'React accepts ReactNode; Angular accepts text or a projected heading template.',
    description:
      'React accepts ReactNode; Angular accepts text for this summary line.',
  },
  'data-table-page.component.ts': {
    rowKey:
      'Angular track functions allow unknown return types; React keys are restricted to React Key.',
  },
};
const usedDifferences = new Set();

function evaluate(node, context = {}) {
  const js = ts.transpileModule(`export default (${node.getText()});`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', js).call(context, module, module.exports);
  return module.exports.default;
}

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(join(pagesDir, file), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  let api;
  const context = {};
  const initializers = new Map();

  function visit(node) {
    if (ts.isPropertyDeclaration(node) && node.initializer) {
      initializers.set(node.name.getText(source), node.initializer);
      if (node.name.getText(source) === 'api') {
        api = node.initializer;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  if (!api) {
    failures.push(`${file}: missing API table.`);
    continue;
  }
  const hydrated = new Set();
  function hydrate(name) {
    if (hydrated.has(name)) return;
    const initializer = initializers.get(name);
    if (!initializer) {
      failures.push(`${file}: API table references missing field "${name}".`);
      return;
    }
    hydrated.add(name);
    for (const [, dependency] of initializer
      .getText()
      .matchAll(/this\.(\w+)/g)) {
      hydrate(dependency);
    }
    context[name] = evaluate(initializer, context);
  }
  for (const [, dependency] of api.getText().matchAll(/this\.(\w+)/g)) {
    hydrate(dependency);
  }
  api = evaluate(api, context);
  if (!api.angular || !api.react) {
    failures.push(`${file}: API table must document both Angular and React.`);
    continue;
  }

  const rows = {};
  for (const framework of ['angular', 'react']) {
    rows[framework] = new Map();
    for (const row of api[framework]) {
      if (!row?.name || !row?.type) {
        failures.push(`${file}: ${framework} API rows need a name and type.`);
        continue;
      }
      if (rows[framework].has(row.name)) {
        failures.push(`${file}: duplicate ${framework} API row "${row.name}".`);
      }
      rows[framework].set(row.name, row);
    }
  }

  for (const [name, angular] of rows.angular) {
    const react = rows.react.get(name);
    if (!react || name.startsWith('...')) continue;
    for (const field of ['type', 'default']) {
      if ((angular[field] ?? '') !== (react[field] ?? '')) {
        const reason = intentionalDifferences[file]?.[name];
        if (reason && field === 'type') {
          usedDifferences.add(`${file}:${name}`);
          console.log(`ℹ ${file}: ${name} intentionally differs: ${reason}`);
        } else {
          failures.push(
            `${file}: shared prop "${name}" differs: Angular ${field}=${JSON.stringify(angular[field] ?? null)}, React ${field}=${JSON.stringify(react[field] ?? null)}.`,
          );
        }
      }
    }
  }
}

for (const [file, differences] of Object.entries(intentionalDifferences)) {
  for (const name of Object.keys(differences)) {
    if (!usedDifferences.has(`${file}:${name}`)) {
      failures.push(
        `${file}: remove the obsolete intentional-difference note for "${name}".`,
      );
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `✖ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `✔ ${files.length} component API tables checked for Angular/React parity.`,
);
