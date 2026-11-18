import {
  afterRenderEffect,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { DocsSettings } from '../shared/docs-settings';
import { PageComponent } from '../shared/page.component';

const brand = [
  {
    name: 'Red',
    token: 'brand-red',
    value: '#DC4B4B',
    use: 'Logo and large fills. Carries danger in product UI.',
  },
  {
    name: 'Blue',
    token: 'brand-blue',
    value: '#0059FF',
    use: 'Logo and large fills. The primary colour in product UI.',
  },
  { name: 'Ink', token: 'ink', value: '#0B1020', use: 'Dark ground and text.' },
  { name: 'Paper', token: 'paper', value: '#F6F7FB', use: 'Light ground.' },
  {
    name: 'Slate',
    token: 'slate',
    value: '#586087',
    use: 'Labels, secondary text, borders.',
  },
];

const pairs = [
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
  { name: 'Focus ring on background', fg: 'focus', bg: 'bg', min: 3 },
];

/** WCAG 2.x contrast of two computed `rgb(r, g, b)` colours. */
function contrast(a: string, b: string): number {
  const lum = (rgb: string) => {
    const [r, g, bl] = (rgb.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
      const c = Number(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

@Component({
  selector: 'app-colour',
  imports: [PageComponent],
  template: `
    <app-page
      title="Colour"
      lead="Two brand colours, three neutrals, and the product shades made from them. Every shade is a brand colour darkened or lightened along its own hue until small text reaches 7:1."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Brand</h2>
        <p>
          From the brand book, used as is. Red and blue never meet as large
          areas: one carries the screen, the other is the accent.
        </p>
        <div class="doc-swatches">
          @for (c of brand; track c.token) {
            <div class="doc-swatch">
              <div
                class="doc-swatch__chip"
                [style.background]="'var(--ui-' + c.token + ')'"
              ></div>
              <strong>{{ c.name }}</strong>
              <code>--ui-{{ c.token }}</code>
              <code>{{ c.value }}</code>
              <span class="doc-muted">{{ c.use }}</span>
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Product colours</h2>
        <p>
          Each row is a text colour on its ground, measured live in the theme on
          screen. Switch the theme at the top to measure the other one. 7:1 is
          the bar for text, 3:1 for borders and focus rings.
        </p>
        <div class="doc-pairs">
          @for (p of pairs; track p.name; let i = $index) {
            <div
              class="doc-pair"
              data-pair
              [style.background]="'var(--ui-' + p.bg + ')'"
              [style.color]="'var(--ui-' + p.fg + ')'"
            >
              <strong>{{ p.name }}</strong>
              <code>--ui-{{ p.fg }} on --ui-{{ p.bg }}</code>
              <strong
                >{{ ratios()[i] ?? '…' }}:1 ·
                {{ +(ratios()[i] ?? 0) >= p.min ? 'passes' : 'fails' }}
                {{ p.min }}:1</strong
              >
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Brand blue and brand red as they are: fills, borders, the logo and
            large text only. White on blue is 5.4:1 and white on red 4.1:1,
            under the 7:1 bar for small text.
          </li>
          <li>
            Blue is the primary action. Red is for errors, destructive actions
            and alerts, nothing else, so it keeps its meaning.
          </li>
          <li>
            Success and warning are not brand colours. They are chosen to pass
            7:1 and to stay clear of brand red.
          </li>
          <li>
            Never a hex value in product code: use the
            <code>--ui-*</code> tokens, so dark mode and re-branding keep
            working.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class ColourComponent {
  protected readonly brand = brand;
  protected readonly pairs = pairs;
  protected readonly ratios = signal<string[]>([]);

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const settings = inject(DocsSettings);
    afterRenderEffect(() => {
      settings.theme();
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
