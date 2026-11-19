# @enigma-tech-lab/angular

Accessible Angular 22 components in the Enigma Technology Lab design system, right to left ready: alert dialog, badge, bottom sheet, button, card, data table, dialog, drawer, pagination, select, text field and textarea. Built on signals and the Angular CDK; styles come from [`@enigma-tech-lab/css`](../css).

```shell
pnpm add @enigma-tech-lab/angular @enigma-tech-lab/css @angular/cdk
pnpm add -D tailwindcss @tailwindcss/postcss
```

```css
/* styles.css; .postcssrc.json: { "plugins": { "@tailwindcss/postcss": {} } } */
@import 'tailwindcss';
@import '@enigma-tech-lab/css/tailwind.css';
@import '@angular/cdk/overlay-prebuilt.css';
@import '@angular/cdk/a11y-prebuilt.css';
```

```ts
import { BadgeComponent, ButtonComponent, CardComponent, DialogComponent, SelectComponent, TextareaComponent, TextFieldComponent, UiAlertDialog, UiDialog } from '@enigma-tech-lab/angular';
```

[Source and docs](https://github.com/Enigma-tech-labs/enigma-ui). MIT licence.
