import { Component } from '@angular/core';
import { ButtonComponent, TooltipDirective } from '@enigma-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-tooltip-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    ButtonComponent,
    TooltipDirective,
  ],
  template: `
    <app-page
      title="Tooltip"
      lead="A short label for a control, shown on hover and on keyboard focus and read by screen readers as its description. The pointer can move onto it and Escape hides it. Touch screens never show tooltips, so never put anything needed in one."
      [usage]="usage"
    >
      <app-example
        title="On icon buttons"
        description="The button still needs its own name; the tooltip shows that name to sighted users."
        [code]="basic"
      >
        <button
          ui-button
          variant="ghost"
          aria-label="Copy link"
          uiTooltip="Copy link"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <rect
              x="5"
              y="5"
              width="8"
              height="8"
              rx="1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M3 11V3h8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
        </button>
        <button
          ui-button
          variant="secondary"
          uiTooltip="Sends the invoice to the customer's email"
        >
          Send invoice
        </button>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <button
          ui-button
          variant="secondary"
          uiTooltip="بيبعت الفاتورة لإيميل العميل"
        >
          ابعت الفاتورة
        </button>
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TooltipPageComponent {
  protected readonly usage = {
    angular: `import { TooltipDirective } from '@enigma-ui/angular';
// On the Angular CDK overlay. Add @angular/cdk/overlay-prebuilt.css.`,
    react: `import { Tooltip } from '@enigma-ui/react';`,
    html: `<!-- A tooltip needs script to show and hide. The markup it uses: -->
<button class="ui-button ui-button--ghost" aria-label="Copy link" aria-describedby="tip">…</button>
<span class="ui-tooltip" role="tooltip" id="tip">Copy link</span>`,
  };

  protected readonly basic = {
    angular: `<button ui-button variant="ghost" aria-label="Copy link" uiTooltip="Copy link">
  <svg aria-hidden="true">…</svg>
</button>
<button ui-button variant="secondary" uiTooltip="Sends the invoice to the customer's email">
  Send invoice
</button>`,
    react: `<Tooltip text="Copy link">
  <Button variant="ghost" aria-label="Copy link"><svg aria-hidden="true">…</svg></Button>
</Tooltip>`,
    html: `<!-- See "Use it" -->`,
  };

  protected readonly arabic = {
    angular: `<button ui-button variant="secondary" uiTooltip="بيبعت الفاتورة لإيميل العميل">ابعت الفاتورة</button>`,
    react: `<Tooltip text="بيبعت الفاتورة لإيميل العميل"><Button variant="secondary">ابعت الفاتورة</Button></Tooltip>`,
    html: `<!-- dir="rtl" on the page; the markup is the same -->`,
  };

  protected readonly api = {
    angular: [
      {
        name: 'uiTooltip',
        type: 'string',
        description: 'Required. The short label, on any focusable element.',
      },
    ],
    react: [
      {
        name: 'text',
        type: 'string',
        description: 'Required. The short label.',
      },
      {
        name: 'children',
        type: 'ReactElement',
        description: 'One focusable element, such as Button.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom' | 'start' | 'end'",
        default: "'top'",
        description: 'Where it shows, if there is room.',
      },
    ],
    html: [
      {
        name: 'ui-tooltip',
        type: 'class',
        description: 'On the element with role="tooltip".',
      },
      {
        name: 'aria-describedby',
        type: 'attribute',
        description: "On the control, pointing at the tooltip's id.",
      },
    ],
  };
}
