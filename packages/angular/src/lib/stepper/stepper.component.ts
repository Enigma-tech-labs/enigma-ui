import { Component, input } from '@angular/core';

/**
 * Where the user is in a flow of steps, such as checkout. It shows the steps only: the
 * page shows the current step's content. Done steps get a tick and are read as "Done";
 * the current one has aria-current="step".
 *
 * ```html
 * <ui-stepper label="Checkout" [steps]="['Cart', 'Address', 'Payment']" [current]="1" />
 * ```
 */
@Component({
  selector: 'ui-stepper',
  template: `
    <ol class="ui-steps" [attr.aria-label]="label()">
      @for (step of steps(); track $index; let i = $index) {
        <li
          class="ui-steps__item"
          [class.ui-steps__item--done]="i < current()"
          [class.ui-steps__item--current]="i === current()"
          [attr.aria-current]="i === current() ? 'step' : null"
        >
          <span class="ui-steps__marker" aria-hidden="true">
            @if (i < current()) {
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            } @else {
              {{ number()(i + 1) }}
            }
          </span>
          <span class="ui-steps__label">
            @if (i < current()) {
              <span class="ui-visually-hidden">{{ doneLabel() }}: </span>
            }
            {{ step }}
          </span>
        </li>
      }
    </ol>
  `,
})
export class StepperComponent {
  /** Names the list of steps: "Checkout". */
  readonly label = input.required<string>();
  readonly steps = input.required<string[]>();
  /** Index of the current step, from 0. Steps before it are done. */
  readonly current = input(0);
  /** Read before each done step. Translate it. */
  readonly doneLabel = input('Done');
  /** The marker's number: (n) => n.toLocaleString('ar-EG') for Arabic digits. */
  readonly number = input<(n: number) => string>(String);
}
