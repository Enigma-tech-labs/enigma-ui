import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';

/** A text colour on a ground colour, and the contrast it must reach. */
interface Pair {
  name: string;
  fg: string;
  bg: string;
  min: number;
}

const pairs: Pair[] = [
  { name: 'Text on background', fg: 'text', bg: 'bg', min: 7 },
  { name: 'Text on surface', fg: 'text', bg: 'surface', min: 7 },
  { name: 'Muted text', fg: 'text-muted', bg: 'surface', min: 7 },
  { name: 'Primary', fg: 'on-primary', bg: 'primary', min: 7 },
  { name: 'Secondary', fg: 'on-secondary', bg: 'secondary', min: 7 },
  { name: 'Highlight', fg: 'on-highlight', bg: 'highlight', min: 7 },
  { name: 'Danger', fg: 'on-danger', bg: 'danger', min: 7 },
  { name: 'Danger, soft', fg: 'danger', bg: 'danger-soft', min: 7 },
  { name: 'Success', fg: 'on-success', bg: 'success', min: 7 },
  { name: 'Success, soft', fg: 'success', bg: 'success-soft', min: 7 },
  { name: 'Warning', fg: 'on-warning', bg: 'warning', min: 7 },
  { name: 'Warning, soft', fg: 'warning', bg: 'warning-soft', min: 7 },
  { name: 'Border on surface', fg: 'border', bg: 'surface', min: 3 },
];

const brand = [
  { name: 'Red', token: 'brand-red', use: 'Logo, large fills; danger in UI' },
  {
    name: 'Blue',
    token: 'brand-blue',
    use: 'Logo, large fills; primary in UI',
  },
  { name: 'Ink', token: 'ink', use: 'Dark ground and text' },
  { name: 'Paper', token: 'paper', use: 'Light ground' },
  { name: 'Slate', token: 'slate', use: 'Labels, secondary text, borders' },
];

/** WCAG 2.x contrast of two `rgb(r, g, b)` strings. */
function contrast(a: string, b: string): number {
  const lum = (rgb: string) => {
    const [r, g, bl] = (rgb.match(/\d+(\.\d+)?/g) ?? [])
      .slice(0, 3)
      .map((v) => {
        const c = Number(v) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Colours, with the contrast of each pair measured in the theme on screen. */
@Component({
  selector: 'ui-foundations-colour',
  template: `
    <div style="display: grid; gap: 2rem; max-inline-size: 56rem">
      <section>
        <h2 class="ui-heading" style="font-size: var(--ui-text-xl)">Brand</h2>
        <p style="color: var(--ui-text-muted)">
          From the brand book, used as is. Red and blue never meet as large
          areas.
        </p>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: 1rem"
        >
          @for (c of brand; track c.token) {
            <div>
              <div
                [style.background]="'var(--ui-' + c.token + ')'"
                style="block-size: 4rem; border-radius: var(--ui-radius); border: 1px solid var(--ui-border)"
              ></div>
              <p style="margin: 0.5rem 0 0; font-weight: 600">{{ c.name }}</p>
              <p
                style="margin: 0; color: var(--ui-text-muted); font-family: var(--ui-font-mono); font-size: var(--ui-text-sm)"
              >
                --ui-{{ c.token }}
              </p>
              <p
                style="margin: 0; color: var(--ui-text-muted); font-size: var(--ui-text-sm)"
              >
                {{ c.use }}
              </p>
            </div>
          }
        </div>
      </section>

      <section>
        <h2 class="ui-heading" style="font-size: var(--ui-text-xl)">
          Product UI
        </h2>
        <p style="color: var(--ui-text-muted)">
          Every pair measured in this theme. Switch the theme in the toolbar to
          see the other one.
        </p>
        <div style="display: grid; gap: 0.5rem">
          @for (p of pairs; track p.name; let i = $index) {
            <div
              [style.background]="'var(--ui-' + p.bg + ')'"
              [style.color]="'var(--ui-' + p.fg + ')'"
              style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.5rem; padding: 0.75rem 1rem; border-radius: var(--ui-radius); border: 1px solid var(--ui-divider)"
              data-pair
            >
              <span style="font-weight: 600">{{ p.name }}</span>
              <code style="font-family: var(--ui-font-mono)"
                >--ui-{{ p.fg }} on --ui-{{ p.bg }}</code
              >
              <span style="font-weight: 600">
                {{ ratios()[i] ?? '…' }}:1
                {{ (ratios()[i] ?? 0) >= p.min ? 'passes' : 'FAILS' }}
                {{ p.min }}:1
              </span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
class FoundationsColour {
  protected readonly brand = brand;
  protected readonly pairs = pairs;
  protected readonly ratios = signal<string[]>([]);

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    afterNextRender(() => {
      const rows = [...host.querySelectorAll<HTMLElement>('[data-pair]')];
      this.ratios.set(
        rows.map((row) => {
          const style = getComputedStyle(row);
          return contrast(style.color, style.backgroundColor).toFixed(1);
        }),
      );
    });
  }
}

/** Type, in English and Arabic. */
@Component({
  selector: 'ui-foundations-type',
  template: `
    <div style="display: grid; gap: 2.5rem; max-inline-size: 56rem">
      @for (lang of langs; track lang.code) {
        <section
          [attr.lang]="lang.code"
          [attr.dir]="lang.dir"
          style="display: grid; gap: 1rem"
        >
          <p class="ui-label" style="margin: 0; color: var(--ui-text-muted)">
            {{ lang.label }}
          </p>
          <h1 class="ui-heading" style="font-size: var(--ui-text-3xl)">
            {{ lang.headline }}
          </h1>
          <h2 class="ui-heading" style="font-size: var(--ui-text-2xl)">
            {{ lang.sub }}
          </h2>
          <p
            style="margin: 0; font-size: var(--ui-text-lg); max-inline-size: 40rem"
          >
            {{ lang.lead }}
          </p>
          <p style="margin: 0; max-inline-size: 40rem">{{ lang.body }}</p>
          <p
            style="margin: 0; color: var(--ui-text-muted); font-size: var(--ui-text-sm)"
          >
            {{ lang.small }}
          </p>
        </section>
      }
      <table style="border-collapse: collapse; text-align: start">
        <thead>
          <tr>
            <th style="text-align: start; padding: 0.5rem">Role</th>
            <th style="text-align: start; padding: 0.5rem">Token</th>
            <th style="text-align: start; padding: 0.5rem">Faces</th>
          </tr>
        </thead>
        <tbody>
          @for (r of roles; track r.role) {
            <tr style="border-block-start: 1px solid var(--ui-divider)">
              <td style="padding: 0.5rem">{{ r.role }}</td>
              <td
                style="padding: 0.5rem"
                style="font-family: var(--ui-font-mono)"
              >
                {{ r.token }}
              </td>
              <td style="padding: 0.5rem">{{ r.faces }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
class FoundationsType {
  protected readonly langs = [
    {
      code: 'en',
      dir: 'ltr',
      label: 'English · Archivo Expanded, IBM Plex Sans',
      headline: 'Code nobody dares to touch',
      sub: 'We fix it while you keep using it',
      lead: 'Plain and exact, like a lab report.',
      body: 'Body text is IBM Plex Sans at 1rem. Muted text is slate, darkened until it reaches 7:1 on white.',
      small: 'Small text, 0.875rem, for hints and captions only.',
    },
    {
      code: 'ar',
      dir: 'rtl',
      label: 'العربية · Alexandria، IBM Plex Sans Arabic',
      headline: 'الكود اللي محدش بيجرؤ يلمسه',
      sub: 'ما بنهدّش البيت. بنجدّده وانت ساكن فيه',
      lead: 'واضح ودقيق، زي تقرير معمل.',
      body: 'النص الأساسي بخط IBM Plex Sans Arabic بحجم 1rem، والنص العربي لا تُضاف له مسافات بين الحروف.',
      small: 'نص صغير للتلميحات والتعليقات فقط.',
    },
  ];

  protected readonly roles = [
    {
      role: 'Headlines',
      token: '--ui-font-display + .ui-heading',
      faces: 'Archivo Expanded ExtraBold · Alexandria ExtraBold',
    },
    {
      role: 'Body',
      token: '--ui-font',
      faces: 'IBM Plex Sans · IBM Plex Sans Arabic',
    },
    {
      role: 'Labels',
      token: '--ui-font-mono + .ui-label',
      faces:
        'IBM Plex Mono (Arabic falls back to Plex Sans Arabic, no letter-spacing)',
    },
  ];
}

const meta: Meta = { title: 'Foundations' };
export default meta;

export const Colour: StoryObj = {
  render: () => ({
    moduleMetadata: { imports: [FoundationsColour] },
    template: '<ui-foundations-colour />',
  }),
};

export const Type: StoryObj = {
  render: () => ({
    moduleMetadata: { imports: [FoundationsType] },
    template: '<ui-foundations-type />',
  }),
};
