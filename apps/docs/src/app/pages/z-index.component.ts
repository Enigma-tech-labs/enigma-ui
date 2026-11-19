import { Component, computed, inject, signal } from '@angular/core';
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
import type { FrameworkCode } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import { TokenTableComponent } from '../shared/token-table.component';

@Component({
  selector: 'app-z-index',
  imports: [
    PageComponent,
    CodeBlockComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
    ButtonComponent,
    DialogComponent,
    DialogCloseDirective,
    PopoverTriggerDirective,
    TooltipDirective,
  ],
  template: `
    <app-page
      title="Z-index"
      lead="Layer tokens in a fixed order, so a drawer, a popover in it, a tooltip and a toast can all be open at once."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Layers</h2>
        <p>
          Under 100 stays in one component, 100–999 is page bars, 1000 and up is
          overlays.
        </p>
        <app-token-table label="Layer tokens" [rows]="layers" />
        <app-code-block [text]="usage" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try a layer</h2>
        <p>Pick a token for your element and see which layers cover it.</p>
        <app-step
          label="Layer"
          [max]="layers.length - 1"
          [valuetext]="layer().token + ', ' + layer().value"
          [(value)]="index"
        >
          <code>{{ layer().token }}</code> · {{ layer().value }}
        </app-step>

        <app-example
          title="Your element in the stack"
          [description]="layer().use"
          [code]="layerCode()"
        >
          <div class="doc-stack" aria-hidden="true">
            @for (l of fan; track l.token; let i = $index) {
              <div
                class="doc-stack__card"
                [style.z-index]="'var(' + l.token + ')'"
                [style.inset-inline-start.%]="i * 14"
                [style.inset-block-start.rem]="i * 0.75"
              >
                <code>{{ l.token.replace('--ui-layer-', '') }}</code>
                {{ l.value }}
              </div>
            }
            <div
              class="doc-stack__card doc-stack__card--you"
              [style.z-index]="'var(' + layer().token + ')'"
            >
              Your element · {{ layer().value }}
            </div>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try them all at once</h2>
        <p>Drawer, then its popover, its tooltip, then a toast over all.</p>
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
          <li>Always a token; never a number between two of them.</li>
          <li>
            Native <code>&lt;dialog&gt;</code>, <code>popover</code> and the
            Angular CDK use the top layer; React overlays use the tokens.
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
export class ZIndexComponent {
  protected readonly dialog = inject(UiDialog);
  private readonly toast = inject(UiToast);

  protected sendToast(): void {
    this.toast.show('A toast, above every layer', { tone: 'success' });
  }

  protected readonly layers = [
    {
      token: '--ui-layer-below',
      value: '-1',
      use: 'Behind the content of its own box: a decorative background or pattern.',
    },
    {
      token: '--ui-layer-base',
      value: '0',
      use: 'The page itself. Also resets a z-index set somewhere else.',
    },
    {
      token: '--ui-layer-raised',
      value: '1',
      use: "Inside one component, over its siblings: a table's sticky header.",
    },
    {
      token: '--ui-layer-cover',
      value: '2',
      use: "Inside one component, over everything in it: a table's loading cover.",
    },
    {
      token: '--ui-layer-sticky',
      value: '100',
      use: 'Bars that stick while the page scrolls: a sticky page header, a side bar.',
    },
    {
      token: '--ui-layer-fixed',
      value: '200',
      use: 'Bars fixed to the screen: an app bar, a bottom navigation, a floating action button.',
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
      use: 'Toasts: on top of every overlay, so a note sent from a dialog is seen.',
    },
    {
      token: '--ui-layer-skip-link',
      value: '1400',
      use: 'The "Skip to content" link: when focused, nothing may cover it.',
    },
  ];

  /** Starts at --ui-layer-sticky. */
  protected readonly index = signal(4);
  protected readonly layer = computed(() => this.layers[this.index()]);
  /** The cards your element is placed among. */
  protected readonly fan = this.layers.filter((l) =>
    ['sticky', 'fixed', 'dialog', 'popover', 'tooltip', 'toast'].some((n) =>
      l.token.endsWith(n),
    ),
  );
  protected readonly layerCode = computed((): FrameworkCode => {
    const css = `.my-element {
  position: relative;
  z-index: var(${this.layer().token});
}`;
    return { angular: css, react: css, html: css };
  });

  protected readonly usage = `.my-banner {
  position: fixed;
  z-index: var(--ui-layer-popover);
  border: 1px solid transparent; /* the edge in high contrast */
  box-shadow: var(--ui-shadow);
}`;
}
