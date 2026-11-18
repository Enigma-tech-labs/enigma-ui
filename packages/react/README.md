# @enigma-tech-lab/react

Accessible React 19 components in the Enigma Technology Lab design system, right to left ready: button, text field, select and dialog. Select and dialog are built on React Aria; styles come from [`@enigma-tech-lab/css`](../css).

```shell
pnpm add @enigma-tech-lab/react
```

```ts
// main.tsx, once, before your own styles
import '@enigma-tech-lab/css/ui.css';
```

```tsx
import { Button, Dialog, DialogActions, Select, TextField } from '@enigma-tech-lab/react';
```

Works with React Server Components: the files that need the browser start with `'use client'`.

[Docs](https://enigma-tech-labs.github.io/enigma-ui/) · [Source](https://github.com/Enigma-tech-labs/enigma-ui). MIT licence.
