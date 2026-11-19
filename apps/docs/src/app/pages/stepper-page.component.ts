import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  StepComponent,
  StepperComponent,
  TextFieldComponent,
} from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-stepper-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    StepperComponent,
    StepComponent,
    TextFieldComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Stepper"
      lead="A flow split into steps, such as checkout. Each step holds its own content, and the stepper shows the current one with Back and Next under it. The step names are buttons, so people can go back. Done steps have a tick and are read as Done, the current one is announced as the current step, and focus moves to the new step's content after each change."
      [usage]="usage"
    >
      <app-example
        title="Checkout, in order"
        description="With linear, Next waits until the step is completed, and the address step is completed once the name is filled in. Press Next with it empty to see the error. Later steps cannot be chosen until then. On a narrow screen only the current step's name shows."
        [code]="basic"
      >
        <ui-stepper
          class="w-full"
          label="Checkout"
          linear
          (blocked)="name.markAsTouched()"
          (finish)="placed.set(true)"
        >
          <ui-step label="Cart">
            <p>2 items, EGP 1,250.</p>
          </ui-step>
          <ui-step label="Address" [completed]="name.valid">
            <ui-text-field
              label="Full name"
              autocomplete="name"
              [formControl]="name"
              [error]="
                name.invalid && name.touched
                  ? 'Enter your full name'
                  : undefined
              "
              class="doc-field"
            />
          </ui-step>
          <ui-step label="Payment">
            <p>Cash on delivery.</p>
          </ui-step>
          <ui-step label="Review">
            <p>
              @if (placed()) {
                Order placed.
              } @else {
                Press Finish to place the order.
              }
            </p>
          </ui-step>
        </ui-stepper>
      </app-example>

      <app-example
        title="In Arabic"
        description="Without linear, every step can be chosen. Translate the button labels and Done."
        [rtl]="true"
        [code]="arabic"
      >
        <ui-stepper
          class="w-full"
          label="إتمام الطلب"
          doneLabel="تم"
          backLabel="السابق"
          nextLabel="التالي"
          finishLabel="إنهاء"
          [number]="arabicDigits"
          [current]="2"
        >
          <ui-step label="السلة"><p>منتجان.</p></ui-step>
          <ui-step label="العنوان"><p>القاهرة.</p></ui-step>
          <ui-step label="الدفع"><p>الدفع عند الاستلام.</p></ui-step>
          <ui-step label="المراجعة"><p>راجع طلبك.</p></ui-step>
        </ui-stepper>
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class StepperPageComponent {
  protected readonly name = new FormControl('', Validators.required);
  protected readonly placed = signal(false);
  protected readonly arabicDigits = (n: number) => n.toLocaleString('ar-EG');

  protected readonly usage = {
    angular: `import { StepComponent, StepperComponent } from '@enigma-tech-lab/angular';`,
    react: `import { Stepper } from '@enigma-tech-lab/react';`,
    html: `<div class="ui-stepper">
  <ol class="ui-steps" aria-label="Checkout">...</ol>
  <section class="ui-stepper__panel">...</section>
  <div class="ui-stepper__actions">...</div>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-stepper label="Checkout" linear
  [(current)]="step"
  (blocked)="name.markAsTouched()"
  (finish)="placeOrder()">
  <ui-step label="Cart">…</ui-step>
  <ui-step label="Address" [completed]="name.valid">
    <ui-text-field label="Full name" [formControl]="name"
      [error]="name.invalid && name.touched ? 'Enter your full name' : undefined" />
  </ui-step>
  <ui-step label="Payment">…</ui-step>
  <ui-step label="Review">…</ui-step>
</ui-stepper>`,
    react: `<Stepper
  label="Checkout"
  linear
  onBlocked={() => setTouched(true)}
  onFinish={placeOrder}
  steps={[
    { label: 'Cart', content: <Cart /> },
    { label: 'Address', content: <Address />, completed: name !== '' },
    { label: 'Payment', content: <Payment /> },
    { label: 'Review', content: <Review /> },
  ]}
/>`,
    html: `<!-- You move between steps with your own script: set the classes,
     aria-current, hidden and disabled, and focus the new panel. -->
<div class="ui-stepper">
  <ol class="ui-steps" aria-label="Checkout">
    <li class="ui-steps__item ui-steps__item--done">
      <button type="button" class="ui-steps__step" id="step-1">
        <span class="ui-steps__marker" aria-hidden="true"><svg>…tick…</svg></span>
        <span class="ui-steps__label"><span class="ui-visually-hidden">Done: </span>Cart</span>
      </button>
    </li>
    <li class="ui-steps__item ui-steps__item--current">
      <button type="button" class="ui-steps__step" id="step-2" aria-current="step">
        <span class="ui-steps__marker" aria-hidden="true">2</span>
        <span class="ui-steps__label">Address</span>
      </button>
    </li>
    <li class="ui-steps__item">
      <button type="button" class="ui-steps__step" id="step-3" disabled>
        <span class="ui-steps__marker" aria-hidden="true">3</span>
        <span class="ui-steps__label">Payment</span>
      </button>
    </li>
  </ol>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-1" hidden>…</section>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-2">…</section>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-3" hidden>…</section>
  <div class="ui-stepper__actions">
    <button class="ui-button ui-button--secondary ui-button--md" type="button">Back</button>
    <button class="ui-button ui-button--primary ui-button--md" type="button">Next</button>
  </div>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  [number]="arabicDigits" [current]="2">
  <ui-step label="السلة">…</ui-step>
  <ui-step label="العنوان">…</ui-step>
  <ui-step label="الدفع">…</ui-step>
  <ui-step label="المراجعة">…</ui-step>
</ui-stepper>

arabicDigits = (n: number) => n.toLocaleString('ar-EG');`,
    react: `<Stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  number={(n) => n.toLocaleString('ar-EG')}
  defaultCurrent={2}
  steps={[
    { label: 'السلة', content: … },
    { label: 'العنوان', content: … },
    { label: 'الدفع', content: … },
    { label: 'المراجعة', content: … },
  ]} />`,
    html: `<!-- dir="rtl" on the page: the steps run from the right -->
<div class="ui-stepper">…</div>`,
  };

  private readonly labels = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. Names the list of steps: "Checkout".',
    },
    {
      name: 'linear',
      type: 'boolean',
      default: 'false',
      description:
        'Each step waits for the ones before it to be completed, and Next waits for the current one.',
    },
    {
      name: 'doneLabel',
      type: 'string',
      default: "'Done'",
      description: 'Read before each done step. Translate it.',
    },
    {
      name: 'backLabel | nextLabel | finishLabel',
      type: 'string',
      default: "'Back' | 'Next' | 'Finish'",
      description: 'The button labels. Translate them.',
    },
    {
      name: 'number',
      type: '(n: number) => string',
      default: 'String',
      description: "The marker's number, for Arabic digits.",
    },
  ];

  protected readonly api = {
    angular: [
      ...this.labels,
      {
        name: 'current',
        type: 'number',
        default: '0',
        description: 'Index of the current step; two-way with [(current)].',
      },
      {
        name: '(blocked)',
        type: 'number',
        description:
          'Linear only: Next or Finish was pressed on this step while it is not completed. Show its errors.',
      },
      {
        name: '(finish)',
        type: 'void',
        description: 'Finish was pressed on the last step.',
      },
      {
        name: 'ui-step label',
        type: 'string',
        description: "Required. The step's name; its content goes inside.",
      },
      {
        name: 'ui-step completed',
        type: 'boolean',
        default: 'true',
        description:
          'Whether the step is filled in, such as its form being valid. A step before the current one shows a tick only when it is.',
      },
    ],
    react: [
      ...this.labels,
      {
        name: 'steps',
        type: '{ label, content, completed? }[]',
        description:
          'Required. Each step stays mounted while hidden, so what was typed is kept. completed defaults to true.',
      },
      {
        name: 'current | defaultCurrent',
        type: 'number',
        default: '0',
        description: 'Index of the current step, controlled or not.',
      },
      {
        name: 'onChange',
        type: '(index: number) => void',
        description: 'The current step changed.',
      },
      {
        name: 'onBlocked',
        type: '(index: number) => void',
        description:
          'Linear only: Next or Finish was pressed on this step while it is not completed.',
      },
      {
        name: 'onFinish',
        type: '() => void',
        description: 'Finish was pressed on the last step.',
      },
    ],
    html: [
      {
        name: 'ui-stepper',
        type: 'class',
        description: 'Wraps the list, the panels and the buttons.',
      },
      {
        name: 'ui-steps',
        type: 'class',
        description: 'On the ol. Give it an aria-label.',
      },
      {
        name: 'ui-steps__item--done | --current',
        type: 'class',
        description:
          'Per li. Put aria-current="step" on the current button, and "Done: " in a ui-visually-hidden span on done ones.',
      },
      {
        name: 'ui-steps__step',
        type: 'class',
        description:
          'The button in each li. Disable it while the step cannot be reached.',
      },
      {
        name: 'ui-steps__marker | __label',
        type: 'class',
        description: 'The circle (aria-hidden) and the name.',
      },
      {
        name: 'ui-stepper__panel | __actions',
        type: 'class',
        description:
          'One panel per step, hidden except the current one, with tabindex="-1" so focus can move to it; then the Back and Next row.',
      },
    ],
  };
}
