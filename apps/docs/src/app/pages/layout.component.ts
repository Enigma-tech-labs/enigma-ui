import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-layout',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Layout"
      lead="Components fit their container, not a list of devices. Most need no breakpoint at all: they wrap and shrink, and work down to 320 pixels wide, the width of a phone or of a page zoomed to 400%."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">One breakpoint</h2>
        <p>
          Below <strong>40rem</strong> (640px at the default text size) is a
          phone. The kit uses it only where a component must change shape, and
          it is in rem, so it moves with the reader's text size. CSS cannot read
          a custom property inside <code>&#64;media</code>, so the value is
          written out.
        </p>
        <app-code-block [text]="usage" caption="CSS" />
        <ul class="doc-list">
          <li>Pagination shows only the current page and the arrows.</li>
          <li>On a phone, a side bar's links go in a drawer.</li>
        </ul>
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
            Use the spacing scale for gaps and the logical properties for sides,
            so the same layout works right to left.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class LayoutComponent {
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

  protected readonly usage = `@media (max-width: 40rem) {
  .my-toolbar {
    flex-direction: column;
  }
}`;
}
