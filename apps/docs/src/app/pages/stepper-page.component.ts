import { Component, signal } from '@angular/core';
import { ButtonComponent, StepperComponent } from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

const STEPS = ['Cart', 'Address', 'Payment', 'Review'];

@Component({
  selector: 'app-stepper-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    StepperComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Stepper"
      lead="Shows where someone is in a flow of steps, such as checkout. It only shows the steps; your page shows the current step's content and the Back and Next buttons. Done steps have a tick and are read as Done, and the current one is announced as the current step."
      [usage]="usage"
    >
      <app-example
        title="Checkout"
        description="Press Next and Back. On a narrow screen only the current step's name shows."
        [code]="basic"
      >
        <div class="grid w-full gap-6">
          <ui-stepper label="Checkout" [steps]="steps" [current]="current()" />
          <div class="flex gap-2">
            <button
              ui-button
              variant="secondary"
              type="button"
              [disabled]="current() === 0"
              (click)="current.set(current() - 1)"
            >
              Back
            </button>
            <button
              ui-button
              type="button"
              [disabled]="current() === steps.length - 1"
              (click)="current.set(current() + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-stepper
          class="w-full"
          label="إتمام الطلب"
          doneLabel="تم"
          [number]="arabicDigits"
          [steps]="['السلة', 'العنوان', 'الدفع', 'المراجعة']"
          [current]="2"
        />
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class StepperPageComponent {
  protected readonly steps = STEPS;
  protected readonly current = signal(1);
  protected readonly arabicDigits = (n: number) => n.toLocaleString('ar-EG');

  protected readonly usage = {
    angular: `import { StepperComponent } from '@enigma-tech-lab/angular';`,
    react: `import { Stepper } from '@enigma-tech-lab/react';`,
    html: `<ol class="ui-steps" aria-label="Checkout">...</ol>`,
  };

  protected readonly basic = {
    angular: `<ui-stepper
  label="Checkout"
  [steps]="['Cart', 'Address', 'Payment', 'Review']"
  [current]="step()"
/>
<!-- Then the current step's content, and Back / Next that change step() -->`,
    react: `<Stepper
  label="Checkout"
  steps={['Cart', 'Address', 'Payment', 'Review']}
  current={step}
/>
{/* Then the current step's content, and Back / Next that change step */}`,
    html: `<ol class="ui-steps" aria-label="Checkout">
  <li class="ui-steps__item ui-steps__item--done">
    <span class="ui-steps__marker" aria-hidden="true"><svg>…tick…</svg></span>
    <span class="ui-steps__label"><span class="ui-visually-hidden">Done: </span>Cart</span>
  </li>
  <li class="ui-steps__item ui-steps__item--current" aria-current="step">
    <span class="ui-steps__marker" aria-hidden="true">2</span>
    <span class="ui-steps__label">Address</span>
  </li>
  <li class="ui-steps__item">
    <span class="ui-steps__marker" aria-hidden="true">3</span>
    <span class="ui-steps__label">Payment</span>
  </li>
</ol>`,
  };

  protected readonly arabic = {
    angular: `<ui-stepper label="إتمام الطلب" doneLabel="تم"
  [number]="arabicDigits"
  [steps]="['السلة', 'العنوان', 'الدفع', 'المراجعة']" [current]="2" />

arabicDigits = (n: number) => n.toLocaleString('ar-EG');`,
    react: `<Stepper label="إتمام الطلب" doneLabel="تم"
  number={(n) => n.toLocaleString('ar-EG')}
  steps={['السلة', 'العنوان', 'الدفع', 'المراجعة']} current={2} />`,
    html: `<!-- dir="rtl" on the page: the steps run from the right -->
<ol class="ui-steps" aria-label="إتمام الطلب">...</ol>`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. Names the list: "Checkout".',
    },
    {
      name: 'steps',
      type: 'string[]',
      description: 'Required. The step names, in order.',
    },
    {
      name: 'current',
      type: 'number',
      default: '0',
      description: 'Index of the current step. Steps before it are done.',
    },
    {
      name: 'doneLabel',
      type: 'string',
      default: "'Done'",
      description: 'Read before each done step. Translate it.',
    },
    {
      name: 'number',
      type: '(n: number) => string',
      default: 'String',
      description: "The marker's number, for Arabic digits.",
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: this.shared,
    html: [
      {
        name: 'ui-steps',
        type: 'class',
        description: 'On the ol. Give it an aria-label.',
      },
      {
        name: 'ui-steps__item--done | --current',
        type: 'class',
        description:
          'Per step. Put aria-current="step" on the current one, and "Done: " in a ui-visually-hidden span on done ones.',
      },
      {
        name: 'ui-steps__marker | __label',
        type: 'class',
        description: 'The circle (aria-hidden) and the name.',
      },
    ],
  };
}
