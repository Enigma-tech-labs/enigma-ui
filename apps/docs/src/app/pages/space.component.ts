import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-space',
  imports: [PageComponent, CodeBlockComponent],
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

  protected readonly usage = `.order-summary {
  display: grid;
  gap: var(--ui-space-4);
  padding: var(--ui-space-6);
  margin-block-end: var(--ui-space-12);
}`;
}
