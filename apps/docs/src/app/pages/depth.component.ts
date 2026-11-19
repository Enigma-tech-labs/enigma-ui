import { Component, inject } from '@angular/core';
import {
  ButtonComponent,
  DialogCloseDirective,
  DialogComponent,
  PopoverTriggerDirective,
  TooltipDirective,
  UiDialog,
  UiToast,
} from '@enigma-tech-lab/angular';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-depth',
  imports: [
    PageComponent,
    CodeBlockComponent,
    ButtonComponent,
    DialogComponent,
    DialogCloseDirective,
    PopoverTriggerDirective,
    TooltipDirective,
  ],
  template: `
    <app-page
      title="Depth and z-index"
      lead="The page is flat. Only what floats over it has a shadow: lists, menus, popovers, tooltips, dialogs and toasts. Layer tokens put them in a fixed order, so any mix can be open at once: a drawer, a popover inside it, a tooltip on that, and a toast over all."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Flat and floating</h2>
        <div class="doc-depth">
          <div class="ui-card">
            <p class="ui-card__title">On the page</p>
            <p>Cards, tables and fields: a 1px divider, no shadow.</p>
          </div>
          <div class="doc-depth__float">
            <p class="ui-card__title">Floating</p>
            <p><code>--ui-shadow</code>, and a border for high contrast.</p>
          </div>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Layers</h2>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Layers"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Value</th>
                <th scope="col">For</th>
              </tr>
            </thead>
            <tbody>
              @for (l of layers; track l.token) {
                <tr>
                  <td>
                    <code>{{ l.token }}</code>
                  </td>
                  <td>{{ l.value }}</td>
                  <td>{{ l.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-code-block [text]="usage" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try them all at once</h2>
        <p>
          Open the drawer, open the popover inside it, point at the popover's
          button for its tooltip, then press it to send a toast. Each one lands
          on top of the one before.
        </p>
        <div class="doc-row">
          <button ui-button type="button" (click)="dialog.open(stack)">
            Open the drawer
          </button>
          <button
            ui-button
            variant="secondary"
            type="button"
            (click)="sendToast()"
          >
            Send a toast
          </button>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            A shadow means "this floats and will go away". Never add one to a
            card to make it stand out; use space or a heading.
          </li>
          <li>
            Windows high contrast removes shadows, so every floating layer also
            has a border (transparent until then) to keep its edge.
          </li>
          <li>
            Angular (CDK), native <code>&lt;dialog&gt;</code> and
            <code>popover</code> open in the browser's top layer, above any
            z-index, newest on top; toasts raise themselves back above. React
            overlays use the tokens.
          </li>
          <li>
            Inside a component, stack with 1 and 2 only (a table's sticky
            header, its loading cover). Never invent a number between the
            layers.
          </li>
        </ul>
      </section>
    </app-page>

    <ng-template #stack>
      <ui-dialog
        title="Layers test"
        description="A drawer, with a popover and a tooltip inside it."
        variant="drawer"
      >
        <button ui-button variant="secondary" [uiPopoverTrigger]="fee">
          Delivery fee
        </button>
        <ng-template #fee>
          <p class="ui-popover__title">EGP 45 in Cairo and Giza</p>
          <button
            ui-button
            variant="secondary"
            type="button"
            uiTooltip="Sends a toast over all of this"
            (click)="sendToast()"
          >
            Send a toast
          </button>
        </ng-template>
        <div ui-dialog-actions>
          <button ui-button variant="secondary" type="button" uiDialogClose>
            Close
          </button>
        </div>
      </ui-dialog>
    </ng-template>
  `,
})
export class DepthComponent {
  protected readonly dialog = inject(UiDialog);
  private readonly toast = inject(UiToast);

  protected sendToast(): void {
    this.toast.show('A toast, above every layer', { tone: 'success' });
  }

  protected readonly layers = [
    {
      token: '(none)',
      value: '1, 2',
      use: "Inside one component: a table's sticky header and loading cover.",
    },
    {
      token: '--ui-layer-dialog',
      value: '1000',
      use: 'Dialogs, alert dialogs, drawers and bottom sheets, with their backdrop.',
    },
    {
      token: '--ui-layer-popover',
      value: '1100',
      use: 'Select and combobox lists, menus, popovers: they open from inside a dialog.',
    },
    {
      token: '--ui-layer-tooltip',
      value: '1200',
      use: 'Tooltips: they label controls inside popovers and menus.',
    },
    {
      token: '--ui-layer-toast',
      value: '1300',
      use: 'Toasts: on top of everything, so a note sent from a dialog is seen.',
    },
  ];

  protected readonly usage = `.my-banner {
  position: fixed;
  z-index: var(--ui-layer-popover);
  border: 1px solid transparent; /* the edge in high contrast */
  box-shadow: var(--ui-shadow);
}`;
}
