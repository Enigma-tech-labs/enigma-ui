'use client';

import { useId, type ComponentPropsWithRef } from 'react';
import { cx } from './class-names.js';

export interface TextFieldProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type'
> {
  /** The visible label, tied to the input. */
  label: string;
  /** `date`, `time` and `datetime-local` use the browser's own picker, in the reader's language and calendar. */
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'search'
    | 'tel'
    | 'url'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local';
  /** Help text under the input, read with it. */
  hint?: string;
  /** The translated error. Marks the input invalid and announces the message. */
  error?: string;
  /** data-testid on the input, for tests. */
  testId?: string;
}

/**
 * Label, input, hint and error as one control. Every other prop goes to the input,
 * so value, onChange, name and ref work as on a native input (and with form libraries).
 *
 * ```tsx
 * <TextField label="Email" type="email" hint="We only use it for order updates." />
 * ```
 */
export function TextField({
  label,
  type = 'text',
  hint,
  error,
  testId,
  id,
  className,
  ...input
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy =
    cx(hint && `${inputId}-hint`, error && `${inputId}-error`) || undefined;

  return (
    <div className={cx('ui-field', className)}>
      <label className="ui-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        {...input}
        className="ui-input"
        id={inputId}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        data-testid={testId}
      />
      {hint && (
        <p className="ui-field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ui-field__error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
