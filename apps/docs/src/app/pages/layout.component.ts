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
        <h2 class="ui-heading doc-h2">Page and grid</h2>
        <p>
          Start every page with <code>ui-page</code> on its wrapper. That one
          class centres the page, caps its width, adds side padding and makes a
          12-column grid with a gap. The padding and the gap grow with the
          screen on their own, from 1rem on a phone to 3rem and 2rem on a wide
          desktop. Each child fills the whole row until you give it a column
          class.
        </p>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Page and grid classes"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Class or token</th>
                <th scope="col">Does</th>
              </tr>
            </thead>
            <tbody>
              @for (c of pageClasses; track c.name) {
                <tr>
                  <td>
                    <code>{{ c.name }}</code>
                  </td>
                  <td>{{ c.does }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          A breakpoint class reads the width its grid's columns get, not the
          screen's. On a full page that is the screen less the side padding, so
          md starts on a screen of about 51rem rather than 48rem. In a nested
          <code>ui-grid</code> inside a narrow column, the cards switch later
          still, because their grid is narrower. You never write a query
          yourself.
        </p>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the page</h2>
        <p>
          Move the slider to set the screen's width. The padding and gap grow,
          the side bar moves beside the content at md, and the cards add a
          column at sm and lg of their own grid. A screen wider than this page
          is drawn smaller to fit, at its real width, so every breakpoint can be
          reached on a phone too.
        </p>
        <div class="ui-field doc-step">
          <label class="ui-field__label" for="layout-width">Screen width</label>
          <input
            id="layout-width"
            class="doc-step__range"
            type="range"
            min="20"
            max="112"
            [value]="width()"
            [attr.aria-valuetext]="readout()"
            (input)="width.set(+$any($event.target).value)"
          />
          <output for="layout-width" class="doc-step__value">{{
            readout()
          }}</output>
        </div>

        <app-example
          title="A page from four classes"
          description="ui-page, ui-col-md-4 and ui-col-lg-3 for the side bar, and a nested ui-grid for the cards. No CSS of your own."
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
              <div #page class="ui-page">
                <div class="doc-bp__chips">
                  @for (b of breakpoints; track b.name) {
                    <span
                      class="doc-bp__chip"
                      [class]="'doc-bp__chip--' + b.name"
                      >{{ b.name }}</span
                    >
                  }
                </div>
                <div class="doc-block">Header</div>
                <div class="doc-block ui-col-md-4 ui-col-lg-3">Side bar</div>
                <div class="ui-grid ui-col-md-8 ui-col-lg-9">
                  @for (n of cards; track n) {
                    <div class="doc-block ui-col-sm-6 ui-col-lg-4">
                      Card {{ n }}
                    </div>
                  }
                </div>
                <div class="doc-block">Footer</div>
              </div>
            </div>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Your own components</h2>
        <p>
          Only for a component of your own that must change shape, such as a
          card that puts its picture beside the text when there is room. Put
          <code>ui-container</code> on the box and write
          <code>&#64;container</code> with a breakpoint's value. It works the
          way a screen query does, but reads the box, so the same card fits a
          side bar, a dialog and the full page.
        </p>
        <app-code-block [text]="usage" caption="CSS" />
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

  protected readonly pageClasses = [
    {
      name: 'ui-page',
      does: 'The page wrapper: centred, 12 columns, side padding and gap that grow with the screen.',
    },
    {
      name: 'ui-grid',
      does: 'The same 12 columns and gap with no padding, to split a column again.',
    },
    {
      name: 'ui-col-1 … ui-col-12',
      does: 'Spans that many of the 12 columns.',
    },
    {
      name: 'ui-col-sm-6, ui-col-md-4 …',
      does: 'Spans that many from that breakpoint up: sm, md, lg, xl, 2xl. Below it, the child fills the row.',
    },
    {
      name: '--ui-page-max',
      does: 'Widest the columns get, 96rem (2xl). Set 64rem for a narrower site.',
    },
    { name: '--ui-page-gutter', does: 'Side padding, 1rem to 3rem.' },
    {
      name: '--ui-grid-gap',
      does: 'Gap between columns and rows, 1rem to 2rem.',
    },
  ];

  /** The demo screen's width in rem; 20rem is the 320px smallest screen. */
  protected readonly width = signal(48);
  /** Width the page's columns get, in rem: the screen less the side padding, measured. */
  protected readonly columnsWidth = signal(0);
  protected readonly readout = computed(() => {
    const w = this.width();
    const c = this.columnsWidth();
    const passed = this.breakpoints.filter((b) => c >= b.rem);
    const at = passed.length ? passed[passed.length - 1].name : 'below sm';
    return `Screen ${w}rem (${w * 16}px) · columns ${c}rem · ${at}`;
  });

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private readonly page = viewChild.required<ElementRef<HTMLElement>>('page');
  /** A box wider than the page is scaled down to fit; its layout width, which the queries read, is unchanged. */
  protected readonly scale = signal(1);
  protected readonly height = signal<number | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stage = this.stage().nativeElement;
      const frame = this.frame().nativeElement;
      const page = this.page().nativeElement;
      const fit = () => {
        const s = Math.min(1, stage.clientWidth / frame.offsetWidth);
        this.scale.set(s);
        this.height.set(frame.offsetHeight * s);
        const style = getComputedStyle(page);
        const rem = parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        );
        const content =
          page.clientWidth -
          parseFloat(style.paddingInlineStart) -
          parseFloat(style.paddingInlineEnd);
        this.columnsWidth.set(Math.round((content / rem) * 10) / 10);
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

  protected readonly usage = `/* <div class="ui-container"><article class="product">…</article></div> */
.product {
  display: grid;
  gap: var(--ui-space-4);
}
@container (width >= 40rem) {
  .product {
    grid-template-columns: 12rem 1fr;
  }
}`;

  private readonly demoHtml = `<div class="ui-page">
  <header>Header</header>
  <nav class="ui-col-md-4 ui-col-lg-3">Side bar</nav>
  <main class="ui-grid ui-col-md-8 ui-col-lg-9">
    <article class="ui-col-sm-6 ui-col-lg-4">Card 1</article>
    <article class="ui-col-sm-6 ui-col-lg-4">Card 2</article>
    <article class="ui-col-sm-6 ui-col-lg-4">Card 3</article>
  </main>
  <footer>Footer</footer>
</div>`;

  protected readonly demoCode: FrameworkCode = {
    angular: this.demoHtml,
    react: this.demoHtml.replace(/class=/g, 'className='),
    html: this.demoHtml,
  };
}
