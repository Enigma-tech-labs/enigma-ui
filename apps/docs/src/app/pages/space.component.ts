import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import type { FrameworkCode } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-space',
  imports: [PageComponent, CodeBlockComponent, ExampleComponent],
  template: `
    <app-page
      title="Space and shadow"
      lead="One spacing scale for every padding, margin and gap, one radius, and one shadow. The page is flat; only what floats over it has a shadow."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Spacing</h2>
        <p>
          The number in a token is quarters of a rem, 4 pixels each:
          <code>--ui-space-4</code> is 1rem. Half steps (<code>0-5</code>,
          <code>1-5</code>, <code>2-5</code>) are only for inside small
          controls. Padding, margin and gap all take the same tokens; there is
          no separate scale for each.
        </p>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Spacing tokens"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">rem</th>
                <th scope="col">px</th>
                <th scope="col">For</th>
                <th scope="col">
                  <span class="ui-visually-hidden">Size</span>
                </th>
              </tr>
            </thead>
            <tbody>
              @for (s of space; track s.n) {
                <tr>
                  <td>
                    <code>--ui-space-{{ s.n }}</code>
                  </td>
                  <td>{{ s.rem }}</td>
                  <td>{{ s.px }}</td>
                  <td>{{ s.use }}</td>
                  <td class="doc-space__cell">
                    <span
                      class="doc-space__bar"
                      [style.inline-size]="'var(--ui-space-' + s.n + ')'"
                    ></span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-code-block [text]="usage" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Padding, margin and gap classes</h2>
        <p>
          For one-off space in markup, every step has a class: the letter, the
          side, then the step. <code>ui-p-4</code> is
          <code>padding: var(--ui-space-4)</code>, <code>ui-mt-0-5</code> is a
          0.125rem top margin. Sides are logical, so start and end flip in
          Arabic. Margin also takes <code>auto</code>. Gap is
          <code>ui-gap-</code><em>step</em> both ways, <code>ui-gap-x-</code
          ><em>step</em> between columns and <code>ui-gap-y-</code
          ><em>step</em> between rows. They work the same in Angular, React and
          plain HTML.
        </p>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Padding and margin classes"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Padding</th>
                <th scope="col">Margin</th>
                <th scope="col">Sets</th>
              </tr>
            </thead>
            <tbody>
              @for (u of utilities; track u.side) {
                <tr>
                  <td>
                    <code>ui-p{{ u.side }}-</code><em>step</em>
                  </td>
                  <td>
                    <code>ui-m{{ u.side }}-</code><em>step</em>
                  </td>
                  <td>{{ u.sets }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-code-block [text]="utilityUsage" caption="HTML" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the classes</h2>
        <p>
          Move the slider to pick a step; every demo below and its code follow
          it. The tinted, dashed area is the space the class adds.
        </p>
        <div class="ui-field doc-step">
          <label class="ui-field__label" for="space-step">Step</label>
          <input
            id="space-step"
            class="doc-step__range"
            type="range"
            min="0"
            [max]="space.length - 1"
            [value]="index()"
            [attr.aria-valuetext]="step().n + ', ' + step().rem"
            (input)="index.set(+$any($event.target).value)"
          />
          <output for="space-step" class="doc-step__value">
            <code>{{ step().n }}</code> · {{ step().rem }} · {{ step().px }}px
          </output>
        </div>

        <app-example
          title="Padding"
          [description]="
            'ui-p-' + step().n + ': space inside the box, on all four sides.'
          "
          [code]="demoCode('padding')"
        >
          <div class="doc-tint" [class]="'ui-p-' + step().n">
            <div class="doc-block">Content</div>
          </div>
        </app-example>

        <app-example
          title="Margin"
          [description]="
            'ui-mb-' +
            step().n +
            ' on the first box: space outside it, before the next one.'
          "
          [code]="demoCode('margin')"
        >
          <div class="doc-tint doc-tint--flow">
            <div class="doc-block" [class]="'ui-mb-' + step().n">First</div>
            <div class="doc-block">Second</div>
          </div>
        </app-example>

        <app-example
          title="Gap"
          [description]="
            'ui-gap-' +
            step().n +
            ' on a flex or grid parent: the same space between every child, none at the edges.'
          "
          [code]="demoCode('gap')"
        >
          <div class="doc-tint doc-tint--row" [class]="'ui-gap-' + step().n">
            @for (item of ['One', 'Two', 'Three', 'Four', 'Five']; track item) {
              <div class="doc-block">{{ item }}</div>
            }
          </div>
        </app-example>

        <app-example
          title="Start flips in Arabic"
          [description]="
            'ui-ps-' +
            step().n +
            ' is padding on the start side: the left in English, the right in Arabic.'
          "
          [code]="demoCode('start')"
          [rtl]="true"
        >
          <div class="doc-tint" [class]="'ui-ps-' + step().n">
            <div class="doc-block">المحتوى</div>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Radius</h2>
        <p>
          Every radius follows <code>--ui-radius</code>: override that one token
          and the whole kit re-shapes. Something nested inside a rounded box
          takes a smaller radius than the box.
        </p>
        <div class="doc-swatches">
          @for (r of radii; track r.token) {
            <div class="doc-swatch">
              <div
                class="doc-swatch__chip doc-swatch__chip--surface doc-swatch__chip--square"
                [style.border-radius]="'var(' + r.token + ')'"
              ></div>
              <code>{{ r.token }}</code>
              <span>{{ r.value }}</span>
              <span class="doc-muted">{{ r.use }}</span>
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the radius</h2>
        <p>
          Move the slider to set <code>--ui-radius</code>. The real components
          below follow it, and so does every other radius token, because each
          one is worked out from the base.
        </p>
        <div class="ui-field doc-step">
          <label class="ui-field__label" for="radius-step">Base radius</label>
          <input
            id="radius-step"
            class="doc-step__range"
            type="range"
            min="0"
            [max]="radiusSteps.length - 1"
            [value]="radiusIndex()"
            [attr.aria-valuetext]="radius()"
            (input)="radiusIndex.set(+$any($event.target).value)"
          />
          <output for="radius-step" class="doc-step__value">
            <code>{{ radius() }}</code> · {{ radiusPx() }}px
          </output>
        </div>

        <app-example
          title="One token re-shapes the kit"
          description="Button, field and badge take the base; the card takes double."
          [code]="radiusCode()"
        >
          <div class="doc-swatches" [style]="radiusStyle()">
            <div class="ui-card">
              <p class="ui-card__title">Order</p>
              <div class="ui-field">
                <label class="ui-field__label" for="radius-demo-input"
                  >Coupon</label
                >
                <input
                  id="radius-demo-input"
                  class="ui-input"
                  value="ENIGMA10"
                />
              </div>
              <div class="doc-tint--row ui-gap-2 ui-mt-4">
                <button class="ui-button ui-button--primary" type="button">
                  Apply
                </button>
                <span class="ui-badge ui-badge--success">Saved</span>
              </div>
            </div>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Control height</h2>
        <p>
          <code>--ui-control-height</code> is 2.75rem, 44 pixels: the smallest
          touch target. Buttons, fields, list items and tabs are never shorter.
        </p>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Shadow</h2>
        <div class="doc-depth">
          <div class="ui-card">
            <p class="ui-card__title">On the page</p>
            <p>Cards, tables and fields: a 1px divider, no shadow.</p>
          </div>
          <div class="doc-depth__float">
            <p class="ui-card__title">Floating</p>
            <p>
              <code>--ui-shadow</code>, and a border for high contrast. Switch
              the theme to see it in dark mode.
            </p>
          </div>
        </div>
        <ul class="doc-list">
          <li>
            A shadow means "this floats and will go away": lists, menus,
            popovers, tooltips, dialogs and toasts. Never add one to a card to
            make it stand out; use space or a heading.
          </li>
          <li>
            Light mode casts an ink shadow. A dark shadow can't be seen on a
            dark page, so dark mode uses a light slate glow
            (<code>--ui-shadow-color</code>): a shade, never pure white.
          </li>
          <li>
            Windows high contrast removes shadows, so every floating layer also
            has a border (transparent until then) to keep its edge.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the shadow</h2>
        <p>
          Move the slider to set how far the layer floats: the offset and the
          blur grow together. The colour stays
          <code>--ui-shadow-color</code>, so it still works in dark mode.
        </p>
        <div class="ui-field doc-step">
          <label class="ui-field__label" for="shadow-step">Depth</label>
          <input
            id="shadow-step"
            class="doc-step__range"
            type="range"
            min="0"
            max="16"
            [value]="depth()"
            [attr.aria-valuetext]="shadow()"
            (input)="depth.set(+$any($event.target).value)"
          />
          <output for="shadow-step" class="doc-step__value">
            <code>{{ shadow() }}</code>
          </output>
        </div>

        <app-example
          title="A floating layer"
          description="Every menu, popover, dialog and toast reads --ui-shadow, so one override moves them all."
          [code]="shadowCode()"
        >
          <div class="doc-depth" [style.--ui-shadow]="shadowValue()">
            <div class="doc-depth__float">
              <p class="ui-card__title">Floating</p>
              <p>A menu, popover or dialog.</p>
            </div>
          </div>
        </app-example>
      </section>
    </app-page>
  `,
})
export class SpaceComponent {
  protected readonly space = [
    ['0', 'Reset a default margin or padding.'],
    ['0-5', 'Badge padding, an icon nudged into line with text.'],
    ['1', 'Inside lists and menus, between an icon and its label.'],
    ['1-5', 'Between a label, its control and its hint.'],
    ['2', 'Between buttons in a row (--ui-gap).'],
    ['2-5', 'Textarea and badge padding.'],
    ['3', 'Inside a control, between the items of a list.'],
    ['4', 'Between fields in a form, around a dialog on small screens.'],
    ['5', 'Between groups of fields.'],
    ['6', 'Card and dialog padding.'],
    ['7', 'Large card padding.'],
    ['8', 'Empty states, between blocks inside a section.'],
    ['10', 'Between sections on small screens.'],
    ['12', 'Between sections.'],
    ['16', 'Above and below a page header.'],
    ['20', 'Between bands of a landing page.'],
    ['24', 'Hero padding.'],
    ['32', 'Hero padding on wide screens.'],
  ].map(([n, use]) => {
    const quarters = Number(n.replace('-', '.'));
    return {
      n,
      use,
      rem: quarters ? `${quarters / 4}rem` : '0',
      px: quarters * 4,
    };
  });

  protected readonly radii = [
    {
      token: '--ui-radius-none',
      value: '0',
      use: 'Square: a drawer against the screen edge, the foot of a bottom sheet.',
    },
    {
      token: '--ui-radius-xs',
      value: '0.125rem',
      use: 'Hairline details. No component uses it yet.',
    },
    { token: '--ui-radius-sm', value: '0.25rem', use: 'Skeleton text lines.' },
    {
      token: '--ui-radius-md',
      value: '0.375rem',
      use: 'Items inside a list or menu (smaller than the list around them), tooltips.',
    },
    {
      token: '--ui-radius',
      value: '0.5rem',
      use: 'The base: buttons, fields, lists, menus, popovers, alerts.',
    },
    {
      token: '--ui-radius-lg',
      value: '0.75rem',
      use: 'Medium panels of your own. No component uses it yet.',
    },
    {
      token: '--ui-radius-xl',
      value: '1rem',
      use: 'Cards, dialogs and the top of a bottom sheet.',
    },
    {
      token: '--ui-radius-2xl',
      value: '1.5rem',
      use: 'Large panels of your own. No component uses it yet.',
    },
    {
      token: '--ui-radius-full',
      value: '9999px',
      use: 'Pills and circles: badges, switches, spinners, progress bars, round icons.',
    },
  ];

  /** Base radius choices in rem, 0 to 1.5 in eighths; starts at the default 0.5rem. */
  protected readonly radiusSteps = Array.from({ length: 13 }, (_, i) => i / 8);
  protected readonly radiusIndex = signal(4);
  protected readonly radius = computed(() => {
    const rem = this.radiusSteps[this.radiusIndex()];
    return rem ? `${rem}rem` : '0';
  });
  protected readonly radiusPx = computed(
    () => this.radiusSteps[this.radiusIndex()] * 16,
  );
  /** The scale is worked out on :root, so a nested override has to repeat it. */
  protected readonly radiusStyle = computed(() => {
    const r = this.radius();
    return {
      '--ui-radius': r,
      '--ui-radius-xs': `calc(${r} / 4)`,
      '--ui-radius-sm': `calc(${r} / 2)`,
      '--ui-radius-md': `calc(${r} * 0.75)`,
      '--ui-radius-lg': `calc(${r} * 1.5)`,
      '--ui-radius-xl': `calc(${r} * 2)`,
      '--ui-radius-2xl': `calc(${r} * 3)`,
    };
  });
  protected readonly radiusCode = computed((): FrameworkCode => {
    const css = `:root {\n  --ui-radius: ${this.radius()};\n}`;
    return { angular: css, react: css, html: css };
  });

  /** Shadow depth: offset n px, blur 3n px; 8 is the default 0 8px 24px. */
  protected readonly depth = signal(8);
  protected readonly shadow = computed(
    () => `0 ${this.depth()}px ${this.depth() * 3}px`,
  );
  protected readonly shadowValue = computed(
    () => `${this.shadow()} var(--ui-shadow-color)`,
  );
  protected readonly shadowCode = computed((): FrameworkCode => {
    const css = `:root {\n  --ui-shadow: ${this.shadowValue()};\n}`;
    return { angular: css, react: css, html: css };
  });

  /** The step every demo uses; starts at --ui-space-4. */
  protected readonly index = signal(7);
  protected readonly step = computed(() => this.space[this.index()]);

  protected demoCode(
    demo: 'padding' | 'margin' | 'gap' | 'start',
  ): FrameworkCode {
    const n = this.step().n;
    const html = {
      padding: `<div class="ui-p-${n}">Content</div>`,
      margin: `<div class="ui-mb-${n}">First</div>\n<div>Second</div>`,
      gap: `<div class="ui-gap-${n}" style="display: flex; flex-wrap: wrap">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>`,
      start: `<div dir="rtl" lang="ar">\n  <div class="ui-ps-${n}">المحتوى</div>\n</div>`,
    }[demo];
    const react = html
      .replace(/class=/g, 'className=')
      .replace(
        'style="display: flex; flex-wrap: wrap"',
        "style={{ display: 'flex', flexWrap: 'wrap' }}",
      );
    return { angular: html, react, html };
  }

  protected readonly utilities = [
    { side: '', sets: 'All four sides.' },
    { side: 'x', sets: 'Inline: start and end (left and right in English).' },
    { side: 'y', sets: 'Block: top and bottom.' },
    { side: 't', sets: 'Top (block start).' },
    { side: 'b', sets: 'Bottom (block end).' },
    { side: 's', sets: 'Start: left in English, right in Arabic.' },
    { side: 'e', sets: 'End: right in English, left in Arabic.' },
  ];

  protected readonly utilityUsage = `<section class="ui-card ui-p-8 ui-mb-12">
  <h2 class="ui-heading ui-mb-4">Order summary</h2>
  <div class="ui-py-2" style="display: flex">
    <span>Delivery</span>
    <span class="ui-ms-auto">EGP 45</span>
  </div>
</section>`;

  protected readonly usage = `.order-summary {
  display: grid;
  gap: var(--ui-space-4);
  padding: var(--ui-space-6);
  margin-block-end: var(--ui-space-12);
}`;
}
