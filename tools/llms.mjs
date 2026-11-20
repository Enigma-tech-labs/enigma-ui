// Builds the AI guide of the docs site from the docs pages themselves, so it cannot drift:
//   apps/docs/public/llms.txt       short index and the rules (the llms.txt convention)
//   apps/docs/public/llms-full.txt  everything: setup, rules and every component's usage and options
//
// Run: pnpm llms        Check in CI: pnpm llms --check (fails when the files are stale)

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'apps/docs/src/app/pages');
const outDir = join(root, 'apps/docs/public');
const SITE = readFileSync(
  join(root, 'apps/docs/src/app/shared/site.ts'),
  'utf8',
)
  .match(/SITE_URL = '([^']+)'/)[1]
  .replace(/\/$/, '');
const FRAMEWORKS = ['angular', 'react', 'vue', 'html'];
const LABEL = {
  angular: 'Angular',
  react: 'React',
  vue: 'Vue 3 preview',
  html: 'Plain HTML and CSS',
};
const VUE_PREVIEW = [
  'alert',
  'badge',
  'button',
  'card',
  'checkbox',
  'progress',
  'radio-group',
  'skeleton',
  'spinner',
  'switch',
  'text-field',
  'textarea',
];

/** Evaluate a literal initializer (objects, arrays, strings, template literals without holes). */
function evaluate(node) {
  const js = ts.transpileModule(`export default (${node.getText()});`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', js)(module, module.exports);
  return module.exports.default;
}

function readPage(file) {
  const text = readFileSync(join(pagesDir, file), 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const page = { file, usage: null, api: null, title: '', lead: '' };
  const header = text.match(/<app-page\s+title="([^"]*)"\s+lead="([^"]*)"/s);
  if (header) {
    page.title = header[1];
    page.lead = header[2].replace(/\s+/g, ' ').replace(/&#64;/g, '@');
  }
  ts.forEachChild(source, function visit(node) {
    if (
      ts.isPropertyDeclaration(node) &&
      node.initializer &&
      ['usage', 'api'].includes(node.name.getText())
    ) {
      try {
        page[node.name.getText()] = evaluate(node.initializer);
      } catch {
        // an initializer that is not a literal is left out
      }
    }
    ts.forEachChild(node, visit);
  });
  return page;
}

const slugOf = (file) => file.replace(/-page\.component\.ts$/, '');

const components = readdirSync(pagesDir)
  .filter((f) => f.endsWith('-page.component.ts'))
  .sort()
  .map(readPage)
  .filter((p) => p.title);

const nav = readFileSync(join(root, 'apps/docs/src/app/shared/nav.ts'), 'utf8');
const pathOf = (slug) =>
  nav.match(new RegExp(`path: '(/(?:components|foundations)/${slug})'`))?.[1] ??
  `/components/${slug}`;

const tokens = readFileSync(join(root, 'packages/css/ui.css'), 'utf8');
const tokenNames = (prefix) => [
  ...new Set(
    [...tokens.matchAll(new RegExp(`--ui-${prefix}[\\w-]*(?=:)`, 'g'))].map(
      (m) => m[0],
    ),
  ),
];

const fence = (lang, code) => '```' + lang + '\n' + code.trim() + '\n```';

const rules = `## Rules for AI assistants

Follow these every time you write code with Enigma UI.

1. Use the kit's components and classes. Do not hand-build a button, field, dialog or table that the kit already has.
2. Restyle only through the \`--ui-*\` tokens and Tailwind classes. Never override a \`.ui-*\` class, and never copy the kit's CSS into the project.
3. Never invent props, classes or components. If a name is not in this guide, it does not exist: check the component's page on the docs site.
4. Use colour tokens, never raw hex values: \`bg-primary\`, \`text-on-primary\`, \`var(--ui-primary)\`. Colours switch with the theme (\`data-theme="light"\` or \`"dark"\`, or the system setting).
5. Space comes from the scale: \`p-4\`, \`gap-3\`, \`ui-p-4\` (without Tailwind). Do not write pixel values.
6. Use logical properties (\`ms-2\`, \`pe-4\`, \`start\`, \`end\`), never \`left\` or \`right\`, so the layout flips in right-to-left languages.
7. Always set \`lang\` and \`dir\` on \`<html>\`. In an Arabic app translate every label a component shows (close buttons, toast region, pagination).
8. Every control needs a visible label. Colour never carries meaning alone: an error also has text.
9. Put your own CSS in \`@layer components\` or \`@layer base\`, or a plain rule beats the kit's classes.
10. Open native dialogs with \`showModal()\`, never \`show()\`.
11. Angular: components are standalone, import each one in \`imports\`. Use signals and the new control flow (\`@if\`, \`@for\`). React: React 19, function components. Vue: use only the controls listed in the preview section; it is not at framework parity yet.
12. When unsure, say so and point to the docs page instead of guessing.`;

const setup = {
  angular: `${fence('sh', 'pnpm add @enigma-ui/angular @enigma-ui/css @angular/cdk@^22.2.0\npnpm add -D tailwindcss @tailwindcss/postcss')}

Needs Node 22, Angular 22.2 (core, common, forms, router), the same major of the Angular CDK, RxJS 7.8, Tailwind 4.1.

${fence('json', '// .postcssrc.json, next to angular.json\n{ "plugins": { "@tailwindcss/postcss": {} } }')}

${fence('css', "/* the global stylesheet (src/styles.css), first lines; never in a component's styles */\n@import 'tailwindcss';\n@import '@enigma-ui/css/tailwind.css';\n@import '@angular/cdk/overlay-prebuilt.css';\n@import '@angular/cdk/a11y-prebuilt.css';")}

UiDialog, UiAlertDialog and UiToast are provided in root: inject them where needed.`,
  react: `${fence('sh', 'pnpm add @enigma-ui/react @enigma-ui/css\npnpm add -D tailwindcss @tailwindcss/vite')}

Needs Node 22, React 19, Tailwind 4.1.

${fence('ts', "// vite.config.ts\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({ plugins: [react(), tailwindcss()] });")}

${fence('css', "/* src/index.css, imported once in main.tsx, above every other CSS import */\n@import 'tailwindcss';\n@import '@enigma-ui/css/tailwind.css';")}

Wrap the app in \`ToastProvider\` if you use toasts (\`useToast()\` throws without it). For Arabic also wrap it in React Aria's \`I18nProvider locale="ar"\`.`,
  vue: `${fence('sh', 'pnpm add @enigma-ui/vue @enigma-ui/css vue')}

Vue 3.5 preview: only Alert, Badge, Button, Card, Checkbox, Progress, RadioGroup, Skeleton, Spinner, Switch, TextField and Textarea are available. The rest of the component set is not in Vue yet.

${fence('css', "/* src/main.css, imported once from main.ts */\n@import '@enigma-ui/css/ui.css';")}

${fence(
  'vue',
  `<script setup lang="ts">
import { Button, TextField } from '@enigma-ui/vue';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <form>
    <TextField v-model="email" label="Email" type="email" required />
    <Button type="submit">Continue</Button>
  </form>
</template>`,
)}

See the [Vue integration guide](${SITE}/integrations/vue).`,
  html: `${fence('sh', 'pnpm add @enigma-ui/css @enigma-ui/icons\npnpm add -D tailwindcss @tailwindcss/cli')}

${fence('css', "/* src/app.css */\n@import 'tailwindcss';\n@import '@enigma-ui/css/tailwind.css';\n@import '@enigma-ui/icons/icons.css';")}

The component markup uses icon classes, \`<i class="ui-icon ui-icon-chevron-down" aria-hidden="true"></i>\`, drawn by \`icons.css\`. Every icon name is on ${SITE}/foundations/icons

${fence('sh', 'npx @tailwindcss/cli -i src/app.css -o dist/app.css --watch')}

Without Tailwind, load \`@enigma-ui/css/ui.css\` alone and use the \`ui-\` classes (\`ui-p-4\`, \`ui-head-md\`). The package ships no JavaScript: behaviour is yours to write, each page lists the elements and attributes it needs. Keep the \`fonts\` folder next to the CSS.`,
};

function tokenSection() {
  return `## Tokens

All design values are \`--ui-*\` custom properties on \`:root\`. With Tailwind they are the theme: \`p-4\` is \`--ui-space-4\`, \`bg-primary\` is \`--ui-primary\`, \`rounded-xl\` is \`--ui-radius-xl\`.

- Colour: ${tokenNames(
    '(?:primary|on-primary|surface|on-surface|border|danger|focus|highlight)',
  )
    .slice(0, 16)
    .map((t) => `\`${t}\``)
    .join(', ')}. Full list on ${SITE}/foundations/colour
- Space: \`--ui-space-1\` to \`--ui-space-*\`, as classes \`ui-p-*\`, \`ui-m-*\`, \`ui-gap-*\` (sides \`x y t b s e\`, logical).
- Type: one class sets face, weight, size and line height: \`ui-head-3xl\` … \`ui-head-2xs\`, \`ui-body-lg|md|sm\` (weight suffix \`-m\` \`-s\` \`-b\`), \`ui-label\`.
- Layout: \`class="ui-page"\` gives a centred 12-column grid; children take \`ui-col-6\`, \`ui-col-md-4\` (\`sm md lg xl 2xl\`).
- Also: radius, shadow (\`shadow-ui\`), z-index (\`z-dialog\`), motion (\`duration-fast\`, \`ease-ui\`), focus (\`focus-visible:focus-ring\`).

Re-brand by overriding tokens after the import. The "on" colour must reach 7:1 against its ground and the focus colour 3:1 against the page, in both themes:

${fence('css', ':root {\n  --ui-primary: light-dark(#0f5132, #6ee7b7);\n  --ui-on-primary: light-dark(#ffffff, #0b1020);\n  --ui-focus: light-dark(#0f5132, #6ee7b7);\n}')}`;
}

function componentSection(page, framework) {
  const slug = slugOf(page.file);
  const lines = [
    `### ${page.title}`,
    '',
    page.lead,
    '',
    `Docs: ${SITE}${pathOf(slug)}`,
    '',
  ];
  const usage = page.usage?.[framework];
  if (usage)
    lines.push(
      fence(
        framework === 'html' ? 'html' : framework === 'react' ? 'tsx' : 'ts',
        usage,
      ),
      '',
    );
  const api = page.api?.[framework];
  if (api?.length) {
    lines.push(
      '| Name | Type | Default | What it does |',
      '| --- | --- | --- | --- |',
    );
    for (const r of api) {
      const cell = (s) =>
        String(s ?? '')
          .replace(/\|/g, '\\|')
          .replace(/\s+/g, ' ');
      lines.push(
        `| \`${cell(r.name)}\` | \`${cell(r.type)}\` | ${r.default ? `\`${cell(r.default)}\`` : ''} | ${cell(r.description)} |`,
      );
    }
    lines.push('');
  }
  return lines.join('\n');
}

function buildFull() {
  const vueComponents = components.filter((page) =>
    VUE_PREVIEW.includes(slugOf(page.file)),
  );
  if (vueComponents.length !== VUE_PREVIEW.length) {
    throw new Error(
      'Vue preview component docs do not match the supported set',
    );
  }

  const parts = [
    `# Enigma UI: guide for AI assistants (full)

Enigma UI is the Enigma Technology Lab design system: plain CSS tokens and component styles (\`@enigma-ui/css\`), with Angular (\`@enigma-ui/angular\`) and React (\`@enigma-ui/react\`) components, plus a Vue 3 preview. Accessible (WCAG 2.2 AA, text at 7:1), light and dark, left-to-right and right-to-left (Arabic first-class). ${components.length} documented components; Vue currently provides ${VUE_PREVIEW.length} core controls.

Site and live demos: ${SITE}/
Pick one framework section below and ignore the others.`,
    rules,
    tokenSection(),
  ];
  for (const fw of FRAMEWORKS) {
    parts.push(`# ${LABEL[fw]}\n\n## Setup (${LABEL[fw]})\n\n${setup[fw]}`);
    if (fw === 'vue') {
      parts.push(
        `## Components (${LABEL[fw]})\n\nVue preview controls only; other components are not available in Vue yet.\n\n` +
          vueComponents
            .map(
              (page) =>
                `- [${page.title}](${SITE}${pathOf(slugOf(page.file))}): ${page.lead.split(/(?<=\.)\s/)[0]}`,
            )
            .join('\n'),
      );
    } else {
      parts.push(
        `## Components (${LABEL[fw]})\n\n` +
          components.map((c) => componentSection(c, fw)).join('\n'),
      );
    }
  }
  return parts.join('\n\n') + '\n';
}

function buildIndex() {
  return `# Enigma UI

> The Enigma Technology Lab design system: plain CSS tokens and component styles, with Angular and React components plus a Vue 3 preview. Accessible (WCAG 2.2 AA), light and dark, right-to-left ready. Give this file to your AI assistant before it writes UI code with the kit.

Packages: \`@enigma-ui/css\` (any stack), \`@enigma-ui/angular\` (Angular 22, standalone, signals), \`@enigma-ui/react\` (React 19, React Aria), and \`@enigma-ui/vue\` (Vue 3.5 preview: 12 core controls). Tailwind CSS 4.1 runs under the kit: its classes read the kit's tokens.

${rules}

## Docs

- [Full guide for AI assistants](${SITE}/llms-full.txt): setup per framework, tokens, and framework component availability. Fetch this before writing code.
- [Getting started](${SITE}/getting-started): the seven setup steps
- [Colour](${SITE}/foundations/colour), [Typography](${SITE}/foundations/typography), [Space](${SITE}/foundations/space), [Layout](${SITE}/foundations/layout), [Right to left](${SITE}/foundations/direction)
- [Accessibility](${SITE}/accessibility)

## Components

${components.map((c) => `- [${c.title}](${SITE}${pathOf(slugOf(c.file))}): ${c.lead.split(/(?<=\.)\s/)[0]}`).join('\n')}
`;
}

const files = {
  'llms.txt': buildIndex(),
  'llms-full.txt': buildFull(),
};

const check = process.argv.includes('--check');
let stale = false;
for (const [name, content] of Object.entries(files)) {
  const path = join(outDir, name);
  if (check) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) {
      console.error(`${name} is out of date: run pnpm llms`);
      stale = true;
    }
  } else {
    writeFileSync(path, content);
    console.log(`wrote apps/docs/public/${name} (${content.length} bytes)`);
  }
}
if (stale) process.exit(1);
