import { Component, computed, input } from '@angular/core';

export type StatTrend = 'up' | 'down' | 'flat';
export type StatTone = 'positive' | 'negative' | 'neutral';

/**
 * One number with its label, and how it changed. Write the change so it reads alone
 * ("+12% on last month"); the arrow and colour only repeat it. `tone` is separate from
 * `trend` because up is not always good: rising costs are `trend="up" tone="negative"`.
 *
 * ```html
 * <ui-stat label="Revenue" value="EGP 84,200" change="+12% on last month" trend="up" tone="positive" />
 * ```
 */
@Component({
  selector: 'ui-stat',
  host: { class: 'ui-stat' },
  template: `
    <p class="ui-stat__label">{{ label() }}</p>
    <p class="ui-stat__value">{{ value() }}</p>
    @if (change()) {
      <p [class]="changeClasses()">
        @if (trend(); as trend) {
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            @switch (trend) {
              @case ('up') {
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
              }
              @case ('down') {
                <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
              }
              @default {
                <path d="M3 8h10" />
              }
            }
          </svg>
        }
        {{ change() }}
      </p>
    }
  `,
})
export class StatComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  /** How it changed, in words or with a sign: "+12% on last month". */
  readonly change = input<string>();
  /** The arrow beside the change. */
  readonly trend = input<StatTrend>();
  /** The colour of the change: good, bad or neither. */
  readonly tone = input<StatTone>('neutral');

  protected readonly changeClasses = computed(() =>
    this.tone() === 'neutral'
      ? 'ui-stat__change'
      : `ui-stat__change ui-stat__change--${this.tone()}`,
  );
}
