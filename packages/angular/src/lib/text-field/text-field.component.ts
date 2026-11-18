import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

/**
 * Label, input, hint and error as one form control. Works with Reactive Forms
 * (`formControlName`, `[formControl]`) and template forms (`ngModel`).
 *
 * Pass the already translated error text in `error`; when it is set the input is
 * marked `aria-invalid` and the message is announced.
 */
@Component({
  selector: 'ui-text-field',
  host: { class: 'ui-field' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <input
      class="ui-input"
      [id]="id"
      [type]="type()"
      [value]="value()"
      [disabled]="disabled()"
      [attr.autocomplete]="autocomplete()"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="describedBy()"
      [attr.data-testid]="testId()"
      (input)="update($event)"
      (blur)="onTouched()"
    />
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
    @if (error()) {
      <p class="ui-field__error" [id]="id + '-error'" role="alert">
        {{ error() }}
      </p>
    }
  `,
})
export class TextFieldComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<
    'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  >('text');
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly autocomplete = input<string>();
  readonly testId = input<string>();

  protected readonly id = `ui-text-field-${nextId++}`;
  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );

  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected update(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
