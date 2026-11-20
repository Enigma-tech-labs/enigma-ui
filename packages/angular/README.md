# @enigma-ui/angular

Accessible Angular 22 components in the Enigma Technology Lab design system, right to left ready: alert dialog, badge, bottom sheet, button, card, data table, dialog, drawer, pagination, select, text field and textarea. Built on signals and the Angular CDK; styles come from [`@enigma-ui/css`](../css).

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
import { BadgeComponent, ButtonComponent, CardComponent, DialogComponent, SelectComponent, TextareaComponent, TextFieldComponent, UiAlertDialog, UiDialog } from '@enigma-ui/angular';
```

[Source and docs](https://github.com/Enigma-tech-labs/enigma-ui). MIT licence.
