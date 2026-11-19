import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import type { FrameworkCode } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-layout',
  imports: [PageComponent, CodeBlockComponent, ExampleComponent],
  template: `
    <app-page
      title="Layout"
      lead="Components fit their container, not a list of devices. Most need no breakpoint at all: they wrap and shrink, and work down to 320 pixels wide, the width of a phone or of a page zoomed to 400%."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Breakpoints</h2>
        <p>
          The kit's breakpoints are Tailwind's five, with the same names and
          values. They are in rem, so they move with the reader's text size:
          40rem is 640px only at the default size. Each one is a token for max
          widths and scripts; CSS cannot read a custom property inside a query,
          so <code>&#64;container</code> writes the value out.
        </p>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Breakpoints"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Token</th>
                <th scope="col">rem</th>
                <th scope="col">px</th>
                <th scope="col">Starts</th>
              </tr>
            </thead>
            <tbody>
              @for (b of breakpoints; track b.name) {
                <tr>
                  <td>
                    <code>{{ b.name }}</code>
                  </td>
                  <td>
                    <code>--ui-breakpoint-{{ b.name }}</code>
                  </td>
                  <td>{{ b.rem }}rem</td>
                  <td>{{ b.rem * 16 }}</td>
                  <td>{{ b.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Tailwind's <code>&#64;container</code> variants have their own,
          smaller scale, sized for cards and panels rather than pages. The names
          overlap: Tailwind's <code>&#64;sm</code> is 24rem, not 40rem.
        </p>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Tailwind container sizes"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Tailwind variant</th>
                <th scope="col">rem</th>
                <th scope="col">px</th>
              </tr>
            </thead>
            <tbody>
              @for (c of containerSizes; track c.name) {
                <tr>
                  <td>
                    <code>&#64;{{ c.name }}</code>
                  </td>
                  <td>{{ c.rem }}rem</td>
                  <td>{{ c.rem * 16 }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Container queries</h2>
        <p>
          Put <code>ui-container</code> on the box, then let its children answer
          to the box's width with <code>&#64;container</code>. The same card
          list then works in a side bar, a dialog and the full page, on any
          screen, with no screen query.
        </p>
        <app-code-block [text]="usage" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the breakpoints</h2>
        <p>
          Move the slider to set the box's width. The breakpoints it has passed
          fill in and the cards add a column at each one. A box wider than this
          page is drawn smaller to fit, at its real width, so every breakpoint
          can be reached on a phone too.
        </p>
        <div class="ui-field doc-step">
          <label class="ui-field__label" for="layout-width">Box width</label>
          <input
            id="layout-width"
            class="doc-step__range"
            type="range"
            min="20"
            max="100"
            [value]="width()"
            [attr.aria-valuetext]="readout()"
            (input)="width.set(+$any($event.target).value)"
          />
          <output for="layout-width" class="doc-step__value">{{
            readout()
          }}</output>
        </div>

        <app-example
          title="Cards that follow their box"
          description="One column below sm, then one more at each breakpoint, up to six at 2xl."
          [code]="demoCode"
        >
          <div
            #stage
            class="doc-bp"
            [style.block-size.px]="height()"
            aria-hidden="true"
          >
            <div
              #frame
              class="doc-bp__frame ui-container"
              [style.inline-size.rem]="width()"
              [style.scale]="scale()"
            >
              <div class="doc-bp__chips">
                @for (b of breakpoints; track b.name) {
                  <span
                    class="doc-bp__chip"
                    [class]="'doc-bp__chip--' + b.name"
                    >{{ b.name }}</span
                  >
                }
              </div>
              <div class="doc-bp__grid">
                @for (n of cards; track n) {
                  <div class="doc-block">Card {{ n }}</div>
                }
              </div>
            </div>
          </div>
        </app-example>
        <app-code-block [text]="demoCss" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Widths</h2>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Widths"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">What</th>
                <th scope="col">Width</th>
              </tr>
            </thead>
            <tbody>
              @for (w of widths; track w.what) {
                <tr>
                  <td>{{ w.what }}</td>
                  <td>{{ w.width }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Nothing scrolls sideways at 320px except a wide table, which scrolls
            inside its own frame and can be reached with the keyboard.
          </li>
          <li>
            A floating layer is never wider than the screen less 2rem, so its
            edges stay in view.
          </li>
          <li>
            Below sm, pagination shows only the current page and the arrows, and
            a side bar's links go in a drawer.
          </li>
          <li>
            Use the spacing scale for gaps and the logical properties for sides,
            so the same layout works right to left.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class LayoutComponent {
  protected readonly breakpoints = [
    { name: 'sm', rem: 40, use: 'Large phones held sideways, small tablets.' },
    { name: 'md', rem: 48, use: 'Tablets.' },
    { name: 'lg', rem: 64, use: 'Laptops, tablets held sideways.' },
    { name: 'xl', rem: 80, use: 'Desktops.' },
    { name: '2xl', rem: 96, use: 'Wide desktops.' },
  ];

  protected readonly containerSizes = (
    [
      ['3xs', 16],
      ['2xs', 18],
      ['xs', 20],
      ['sm', 24],
      ['md', 28],
      ['lg', 32],
      ['xl', 36],
      ['2xl', 42],
      ['3xl', 48],
      ['4xl', 56],
      ['5xl', 64],
      ['6xl', 72],
      ['7xl', 80],
    ] as const
  ).map(([name, rem]) => ({ name, rem }));

  protected readonly cards = [1, 2, 3, 4, 5, 6];

  /** The demo box's width in rem; 20rem is the 320px smallest screen. */
  protected readonly width = signal(48);
  protected readonly readout = computed(() => {
    const w = this.width();
    const passed = this.breakpoints.filter((b) => w >= b.rem);
    const at = passed.length ? passed[passed.length - 1].name : 'below sm';
    return `${w}rem · ${w * 16}px · ${at}`;
  });

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  /** A box wider than the page is scaled down to fit; its layout width, which the queries read, is unchanged. */
  protected readonly scale = signal(1);
  protected readonly height = signal<number | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stage = this.stage().nativeElement;
      const frame = this.frame().nativeElement;
      const fit = () => {
        const s = Math.min(1, stage.clientWidth / frame.offsetWidth);
        this.scale.set(s);
        this.height.set(frame.offsetHeight * s);
      };
      fit();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(fit);
      observer.observe(stage);
      observer.observe(frame);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected readonly widths = [
    {
      what: 'Dialog (--ui-dialog-size)',
      width: '24rem small, 32rem, 48rem large',
    },
    { what: 'Toast', width: '24rem' },
    { what: 'Popover', width: '22rem at most' },
    { what: 'Tooltip', width: '18rem at most' },
    { what: 'Smallest screen', width: '320px' },
  ];

  protected readonly usage = `/* <div class="ui-container"><ul class="products">…</ul></div> */
.products {
  display: grid;
  gap: var(--ui-space-4);
}
@container (width >= 40rem) {
  .products {
    grid-template-columns: repeat(2, 1fr);
  }
}
@container (width >= 64rem) {
  .products {
    grid-template-columns: repeat(3, 1fr);
  }
}`;

  private readonly demoHtml = `<div class="ui-container">
  <div class="cards">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</div>`;

  protected readonly demoCode: FrameworkCode = {
    angular: this.demoHtml,
    react: this.demoHtml.replace(/class=/g, 'className='),
    html: this.demoHtml,
  };

  protected readonly demoCss = `.cards {
  display: grid;
  grid-template-columns: repeat(var(--columns, 1), minmax(0, 1fr));
  gap: var(--ui-space-3);
}
@container (width >= 40rem) { .cards { --columns: 2; } } /* sm */
@container (width >= 48rem) { .cards { --columns: 3; } } /* md */
@container (width >= 64rem) { .cards { --columns: 4; } } /* lg */
@container (width >= 80rem) { .cards { --columns: 5; } } /* xl */
@container (width >= 96rem) { .cards { --columns: 6; } } /* 2xl */`;
}
