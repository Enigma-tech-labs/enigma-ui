# Enigma UI

The design system of Enigma Technology Lab: accessible, Arabic and English from the start, and built to work with any frontend.

**[Read the docs](https://enigma-tech-labs.github.io/enigma-ui/)** ([setup guide](https://enigma-tech-labs.github.io/enigma-ui/getting-started)): every component live, with the code for your framework.

| Package                                        | What it is                                                                                          | Status                                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [`@enigma-tech-lab/css`](packages/css)         | Fonts, design tokens and every component style, in plain CSS. Works in any stack, framework or not. | Ready                                                                                                                        |
| [`@enigma-tech-lab/angular`](packages/angular) | Angular 22 components on the Angular CDK.                                                           | Ready: alert dialog, badge, bottom sheet, button, card, data table, dialog, drawer, pagination, select, text field, textarea |
| [`@enigma-tech-lab/react`](packages/react)     | React 19 components on React Aria.                                                                  | Ready: alert dialog, badge, bottom sheet, button, card, data table, dialog, drawer, pagination, select, text field, textarea |
| `@enigma-tech-lab/vue`                         | Vue components on Reka UI.                                                                          | Planned                                                                                                                      |

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

Any stack:

```css
@import '@enigma-tech-lab/css/ui.css';
```

Angular:

```shell
pnpm add @enigma-tech-lab/angular @enigma-tech-lab/css @angular/cdk
```

```css
/* styles.css */
@import '@enigma-tech-lab/css/ui.css';
@import '@angular/cdk/overlay-prebuilt.css';
@import '@angular/cdk/a11y-prebuilt.css';
```

```ts
import { ButtonComponent, SelectComponent, TextFieldComponent } from '@enigma-tech-lab/angular';
```

React:

```shell
pnpm add @enigma-tech-lab/react @enigma-tech-lab/css
```

```tsx
import '@enigma-tech-lab/css/ui.css';
import { Button, Select, TextField } from '@enigma-tech-lab/react';
```

A client re-brands by overriding `--ui-primary`, `--ui-focus`, `--ui-highlight` and their `--ui-on-*` pairs after `ui.css`.

## Work on it

Requires Node 22 and pnpm 10.

```shell
pnpm install
pnpm nx serve docs           # the docs site on http://localhost:4200
pnpm nx run-many -t test     # Vitest, including the contrast check
pnpm nx run-many -t lint     # ESLint, including the Angular template accessibility rules
pnpm nx build angular        # package into dist/packages/angular
pnpm nx a11y docs            # accessibility audit of the built docs site (axe, WCAG 2.2 AA)
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org), checked by commitlint on every commit. CI runs lint, test, build and the accessibility audit on every push and pull request, and publishes the docs site from `main`.

## Release

[Nx Release](https://nx.dev/features/manage-releases) versions all packages together from the commits since the last tag (`feat` = minor, `fix` = patch), writes the changelog, tags and publishes:

```shell
pnpm nx release --dry-run    # see what would happen
pnpm nx release              # version, changelog, tag, publish to npm
```

The first release needs `--first-release`, because there is no earlier tag to compare with.

## Licence

Code: [MIT](LICENSE). Fonts: SIL Open Font License, see [`packages/css/fonts/licenses`](packages/css/fonts/licenses).
