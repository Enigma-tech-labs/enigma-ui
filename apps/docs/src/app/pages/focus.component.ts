import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-focus',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Focus"
      lead="One ring marks where the keyboard is, on every control: 3px in the focus colour, which reaches 3:1 on the page in both themes. It shows for the keyboard only, never after a mouse click, and it is never removed without a replacement."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Two placements</h2>
        <div class="doc-focus">
          <div class="doc-swatch">
            <span class="ui-button ui-button--primary ui-button--md doc-ring"
              >Save</span
            >
            <strong>Outside</strong>
            <span class="doc-muted"
              >Buttons, fields, links: 2px clear of the edge.</span
            >
          </div>
          <div class="doc-swatch">
            <span class="doc-focus__list">
              <span class="doc-focus__item doc-ring doc-ring--inset"
                >Invoices</span
              >
            </span>
            <strong>Inset</strong>
            <span class="doc-muted"
              >Items in a list, menu, tab bar or side bar, where an outside ring
              would be cut off or touch its neighbour.</span
            >
          </div>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Tokens</h2>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Focus tokens"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--ui-focus</code></td>
                <td>Brand blue: #0047cc on light, #8fb4ff on dark.</td>
              </tr>
              <tr>
                <td><code>--ui-focus-width</code></td>
                <td>3px</td>
              </tr>
              <tr>
                <td><code>--ui-focus-offset</code></td>
                <td>2px, or minus the width for an inset ring.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <app-code-block [text]="usage" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Where focus goes</h2>
        <ul class="doc-list">
          <li>
            A dialog, drawer or sheet takes focus when it opens, keeps it inside
            while open, and gives it back to the button that opened it.
          </li>
          <li>
            A list (select, combobox, menu) keeps focus on its control and marks
            the option the keyboard is on with the inset ring, not the highlight
            alone.
          </li>
          <li>
            A sticky header must not cover the focused control: give the page
            <code>scroll-padding-block-start</code> equal to the header's
            height.
          </li>
          <li>
            In Windows high contrast the ring takes the system colour by itself;
            nothing to add.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class FocusComponent {
  protected readonly usage = `.my-control:focus-visible {
  outline: var(--ui-focus-width) solid var(--ui-focus);
  outline-offset: var(--ui-focus-offset);
}
/* An item inside a list: the ring goes inside its edge. */
.my-item:focus-visible {
  outline: var(--ui-focus-width) solid var(--ui-focus);
  outline-offset: calc(-1 * var(--ui-focus-width));
}`;
}
