# Enigma UI

The design system of Enigma Technology Lab: accessible, Arabic and English from the start, and built to work with any frontend.

**[Read the docs](https://enigma-tech-labs.github.io/enigma-ui/)** ([setup guide](https://enigma-tech-labs.github.io/enigma-ui/getting-started)): every component live, with the code for your framework.

| Package                                  | What it is                                                                                          | Status                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------ |
| [`@enigma-ui/css`](packages/css)         | Fonts, design tokens and every component style, in plain CSS. Works in any stack, framework or not. | Ready                          |
| [`@enigma-ui/angular`](packages/angular) | Angular 22 components on the Angular CDK.                                                           | Ready: all 50 components below |
| [`@enigma-ui/react`](packages/react)     | React 19 components on React Aria.                                                                  | Ready: all 50 components below |
| [`@enigma-ui/icons`](packages/icons)     | The kit's icon set, as SVG, CSS masks and typed names. Arrows flip in right-to-left text.           | Ready                          |
| [`@enigma-ui/vue`](packages/vue)         | Vue 3 core controls styled by the shared CSS package.                                               | Preview                        |

## Components

Every one ships in Angular and React with the same name, the same options and the same markup, and in plain HTML through `@enigma-ui/css`.

- **Forms:** button, calendar, checkbox, chip input, combobox, date picker, fieldset, file field, number field, phone field, PIN input, radio group, rating, search field, segmented control, select, slider, switch, text field, textarea
- **Feedback:** alert, badge, empty state, progress, skeleton, spinner, toast
- **Navigation:** app shell, breadcrumbs, command palette, language switcher, menu, navigation, pagination, stepper, tabs
- **Overlays:** alert dialog, bottom sheet, dialog, drawer, popover, tooltip
- **Content:** accordion, avatar, card, data table, divider, stat, tag, tree

## How it fits together

- **One source for how it looks.** Every visual decision lives in [`packages/css/ui.css`](packages/css/ui.css). Framework packages write markup and class names only, never styles, so a fix there reaches every framework at once.
- **Behaviour from tested headless libraries.** Keyboard, focus and screen reader behaviour come from the standard headless library of each framework, not from code written again here.
- **The same component in every framework.** Same name, same options, same stories. A component is done when it ships in all of them.

## The brand behind it

Every value comes from the Enigma brand book:

- **Colour.** Brand blue `#0059FF` is the primary colour, brand red `#DC4B4B` carries danger, on ink `#0B1020` and paper `#F6F7FB` grounds, with slate `#586087` for secondary text. Product UI needs shades the brand book doesn't name. Each one is the brand colour darkened or lightened along its own hue until small text reaches 7:1. Red and blue never meet as large areas.
- **Type.** IBM Plex Sans and IBM Plex Sans Arabic for body text, Archivo Expanded and Alexandria for headlines, IBM Plex Mono for labels. The font files ship in the package (SIL Open Font License). Arabic is never letter-spaced.
- **Light and dark.** Every colour is a `light-dark()` pair. The theme follows the user's system setting; set `data-theme="light"` or `"dark"` on any ancestor to force one.
- **Measured contrast.** A unit test reads `ui.css` and fails if any text pair falls under 7:1, or any border or focus ring under 3:1, in either theme.
- **Audited on every push.** CI runs axe (WCAG 2.2 AA and best practice) on every docs page, in both themes and every framework view, with dialogs, alerts and lists open. Any problem fails the build.
- **Right to left without a second stylesheet.** All spacing and alignment use logical properties, so `dir="rtl"` is enough.

## Use it

Any stack, on Tailwind CSS 4 (the kit's tokens become the Tailwind theme: `p-4`, `bg-primary`, `head-md`):

```css
@import 'tailwindcss';
@import '@enigma-ui/css/tailwind.css';
```

Without Tailwind, `@import '@enigma-ui/css/ui.css';` and the kit's own `ui-*` classes.

Icons: `<ui-icon>` in Angular and `<Icon>` in React come with those packages. In plain HTML, add `@enigma-ui/icons` and `@import '@enigma-ui/icons/icons.css';`, then write `<i class="ui-icon ui-icon-search"></i>`.

Angular:

```shell
pnpm add @enigma-ui/angular @enigma-ui/css @angular/cdk
pnpm add -D tailwindcss @tailwindcss/postcss
```

```css
/* styles.css; .postcssrc.json: { "plugins": { "@tailwindcss/postcss": {} } } */
@import 'tailwindcss';
@import '@enigma-ui/css/tailwind.css';
@import '@angular/cdk/overlay-prebuilt.css';
@import '@angular/cdk/a11y-prebuilt.css';
```

```ts
import { ButtonComponent, SelectComponent, TextFieldComponent } from '@enigma-ui/angular';
```

React:

```shell
pnpm add @enigma-ui/react @enigma-ui/css
pnpm add -D tailwindcss @tailwindcss/vite
```

```css
/* src/index.css; add tailwindcss() from @tailwindcss/vite to the Vite plugins */
@import 'tailwindcss';
@import '@enigma-ui/css/tailwind.css';
```

```tsx
import './index.css';
import { Button, Select, TextField } from '@enigma-ui/react';
```

Vue:

```shell
pnpm add @enigma-ui/vue @enigma-ui/css vue
```

```ts
import { Button, TextField } from '@enigma-ui/vue';
```

The Vue package currently provides core controls; the remaining components are not yet at framework parity.

A client re-brands by overriding `--ui-primary`, `--ui-focus`, `--ui-highlight` and their `--ui-on-*` pairs on `:root`; Tailwind classes and kit components follow. The [theme builder](https://enigma-tech-labs.github.io/enigma-ui/foundations/theme) makes those values from one brand colour and checks every pair.

## Work on it

Requires Node 22 and pnpm 10.

```shell
pnpm install
pnpm nx serve docs           # the docs site on http://localhost:4200
pnpm nx run-many -t test     # Vitest, including the contrast check
pnpm nx run-many -t lint     # ESLint, including the Angular template accessibility rules
pnpm llms --check            # verify checked-in AI docs match their source pages
pnpm nx build css            # package styles and fonts into dist/packages/css
pnpm nx build angular        # package into dist/packages/angular
pnpm nx build vue            # package into dist/packages/vue
pnpm nx a11y docs            # accessibility audit of the built docs site (axe, WCAG 2.2 AA)
pnpm nx interactions docs    # browser keyboard and focus interaction checks
pnpm nx visual docs          # screenshot regression checks for the docs site
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org), checked by commitlint on every commit. CI runs lint, unit and browser interaction tests, builds the packages and docs, checks screenshot regressions, and audits accessibility on every push and pull request. It publishes the docs site from `main`.

## Release

Each package (`css`, `angular`, `react`, `icons`, `vue`) is versioned on its own by [Nx Release](https://nx.dev/features/manage-releases), from the conventional commits that touch it (`feat` = minor, `fix` = patch). [`tools/release.mjs`](tools/release.mjs) versions, publishes to npm, then writes the changelog, tags and GitHub releases, so a failed publish leaves nothing pushed.

```shell
pnpm release:dry                                   # see what would happen, for every package
pnpm release:react --dry-run                       # one package
pnpm release:vue --dry-run                          # Vue package
node tools/release.mjs --first-release --specifier=0.1.0 --dry-run
```

Real releases are off until `RELEASE_ENABLED=true` is set (locally, or as a repository variable for the release workflow). The first release needs `--first-release` and a `--specifier`, because there is no earlier tag to compare with.

## Licence

Code: [MIT](LICENSE). Fonts: SIL Open Font License, see [`packages/css/fonts/licenses`](packages/css/fonts/licenses).
