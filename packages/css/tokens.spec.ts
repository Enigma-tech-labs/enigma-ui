import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** WCAG 2.x relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Reads every `--ui-*: light-dark(#light, #dark)` token from ui.css. */
const css = readFileSync(join(import.meta.dirname, 'ui.css'), 'utf8');
const tokens = Object.fromEntries(
  [
    ...css.matchAll(
      /--ui-([\w-]+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/g,
    ),
  ].map(([, name, light, dark]) => [name, { light, dark }]),
) as Record<string, { light: string; dark: string }>;

// Small text needs 7:1; borders, focus rings and large text need 3:1.
const pairs: [foreground: string, background: string, min: number][] = [
  ['text', 'bg', 7],
  ['text', 'surface', 7],
  ['text-muted', 'surface', 7],
  ['on-primary', 'primary', 7],
  ['on-secondary', 'secondary', 7],
  ['on-danger', 'danger', 7],
  ['on-highlight', 'highlight', 7],
  ['danger', 'surface', 7],
  ['danger', 'danger-soft', 7],
  ['on-success', 'success', 7],
  ['success', 'success-soft', 7],
  ['on-warning', 'warning', 7],
  ['warning', 'warning-soft', 7],
  ['text-muted', 'bg', 7],
  ['primary', 'bg', 7],
  // Alert and toast: body text on the soft tones.
  ['text', 'success-soft', 7],
  ['text', 'warning-soft', 7],
  ['text', 'danger-soft', 7],
  ['border', 'surface', 3],
  ['focus', 'bg', 3],
  // Graphics: the info icon on its fill, the progress fill on its track, a switch knob.
  ['primary', 'highlight', 3],
  ['primary', 'secondary', 3],
  ['border', 'bg', 3],
];

describe('design tokens', () => {
  it('reads every token from ui.css', () => {
    expect(Object.keys(tokens).length).toBeGreaterThanOrEqual(22);
  });

  for (const theme of ['light', 'dark'] as const) {
    it.each(pairs)(
      `${theme}: --ui-%s on --ui-%s reaches %d:1`,
      (fg, bg, min) => {
        expect(
          contrast(tokens[fg][theme], tokens[bg][theme]),
        ).toBeGreaterThanOrEqual(min);
      },
    );
  }
});
