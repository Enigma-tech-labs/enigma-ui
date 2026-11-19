import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

/** The star outline, 24 × 24. */
export const STAR =
  'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z';

/**
 * Stars out of five. To pick: native radios in a fieldset, so arrow keys move between the
 * stars and screen readers say "3 stars, 3 of 5". With `readonly` it only shows a score,
 * read as one image: "4.5 out of 5 stars". Translate both with `starLabel` and `scoreLabel`.
 *
 * ```html
 * <ui-rating label="How was the food?" formControlName="food" />
 * <ui-rating label="Average" [value]="4.5" readonly />
 * ```
 */
@Component({
  selector: 'ui-rating',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
  template: `
    <ng-template #star>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path [attr.d]="starPath" />
      </svg>
    </ng-template>
    @if (readonly()) {
      <span
        class="ui-rating ui-rating--readonly"
        role="img"
        [attr.aria-label]="scoreLabel()(current() ?? 0, max())"
      >
        <span class="ui-rating__stars">
          @for (n of stars(); track n) {
            <span
              class="ui-rating__star"
              [class.ui-rating__star--on]="n <= rounded()"
            >
              <ng-container [ngTemplateOutlet]="star" />
            </span>
          }
        </span>
      </span>
    } @else {
      <fieldset class="ui-rating" [disabled]="disabled()">
        <legend class="ui-field__label">{{ label() }}</legend>
        <span class="ui-rating__stars">
          @for (n of stars(); track n) {
            <label class="ui-rating__star">
              <input
                type="radio"
                class="ui-visually-hidden"
                [name]="id"
                [value]="n"
                [checked]="n === current()"
                (change)="pick(n)"
                (blur)="onTouched()"
              />
              <ng-container [ngTemplateOutlet]="star" />
              <span class="ui-visually-hidden">{{ starLabel()(n) }}</span>
            </label>
          }
        </span>
      </fieldset>
    }
  `,
  imports: [NgTemplateOutlet],
})
export class RatingComponent implements ControlValueAccessor {
  /** Names the stars. Required when people pick. */
  readonly label = input('');
  readonly max = input(5);
  readonly readonly = input(false, { transform: booleanAttribute });
  /** The score to show when `readonly`. A form control sets it otherwise. */
  readonly value = input<number | null>(null);
  /** The name of one star: (n) => `${n} stars`. */
  readonly starLabel = input<(stars: number) => string>((n) =>
    n === 1 ? '1 star' : `${n} stars`,
  );
  /** The read-only score in words: (value, max) => `${value} out of ${max} stars`. */
  readonly scoreLabel = input<(value: number, max: number) => string>(
    (value, max) => `${value} out of ${max} stars`,
  );

  protected readonly starPath = STAR;
  protected readonly id = `ui-rating-${nextId++}`;
  protected readonly disabled = signal(false);
  private readonly written = signal<number | null>(null);
  protected readonly current = computed(() => this.value() ?? this.written());
  protected readonly rounded = computed(() => Math.round(this.current() ?? 0));
  protected readonly stars = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 1),
  );

  private onChange: (value: number) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected pick(stars: number): void {
    this.written.set(stars);
    this.onChange(stars);
  }

  writeValue(value: number | null): void {
    this.written.set(value);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
