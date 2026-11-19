# @enigma-tech-lab/css

The Enigma Technology Lab design system in plain CSS: the brand fonts, light and dark design tokens measured to 7:1, and the styles of every component. Works in any stack.

```css
@import '@enigma-tech-lab/css/ui.css';
```

Tokens are `--ui-*` custom properties; the theme follows the system setting, or `data-theme="light"` / `"dark"` on any ancestor. Headlines: `class="ui-heading"`. Labels: `class="ui-label"`. Padding, margin and gap classes for every space step: `ui-p-4`, `ui-mx-auto`, `ui-ms-2`, `ui-gap-3` (sides `x y t b s e`, logical, so they flip in Arabic; `ui-gap-x-*` / `ui-gap-y-*` for columns / rows).

[Source and docs](https://github.com/Enigma-tech-labs/enigma-ui). Code MIT; fonts SIL Open Font License (see `fonts/licenses`).
