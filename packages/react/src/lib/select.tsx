'use client';

import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Text,
  type Key,
} from 'react-aria-components';
import { cx } from './class-names.js';

export interface SelectOption<T extends Key> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends Key> {
  /** The visible label; it names the button and the list. */
  label: string;
  options: readonly SelectOption<T>[];
  /** The chosen value, when you control it. */
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T) => void;
  /** Shown while nothing is chosen. */
  placeholder?: string;
  /** The translated error. Marks the select invalid and announces the message. */
  error?: string;
  disabled?: boolean;
  /** Form field name, so the value is sent with a native form. */
  name?: string;
  /** data-testid on the button; options get -option-<index>. */
  testId?: string;
  className?: string;
}

/**
 * A single-choice select on React Aria, so options get arrow keys, Home/End, typeahead
 * and the listbox roles; Escape closes the list and returns focus to the button.
 *
 * ```tsx
 * <Select label="City" options={cities} value={city} onChange={setCity} />
 * ```
 */
export function Select<T extends Key>({
  label,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  error,
  disabled,
  name,
  testId,
  className,
}: SelectProps<T>) {
  return (
    <AriaSelect
      className={({ isInvalid }) =>
        cx('ui-field', isInvalid && 'ui-field--invalid', className)
      }
      value={value}
      defaultValue={defaultValue}
      onChange={(key) => key !== null && onChange?.(key as T)}
      placeholder={placeholder}
      isInvalid={!!error}
      isDisabled={disabled}
      name={name}
      disabledKeys={options.filter((o) => o.disabled).map((o) => o.value)}
    >
      <Label className="ui-field__label">{label}</Label>
      <AriaButton className="ui-select__trigger" data-testid={testId}>
        <SelectValue
          className={({ isPlaceholder }) =>
            isPlaceholder ? 'ui-select__placeholder' : ''
          }
        />
        <svg
          className="ui-select__chevron"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </AriaButton>
      {error && (
        <Text
          slot="errorMessage"
          elementType="p"
          className="ui-field__error"
          role="alert"
        >
          {error}
        </Text>
      )}
      <Popover
        offset={4}
        style={{
          inlineSize: 'var(--trigger-width)',
          zIndex: 'var(--ui-layer-popover)',
        }}
      >
        <ListBox className="ui-listbox">
          {options.map((option, index) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              className={({ isFocused }) =>
                cx('ui-option', isFocused && 'ui-option--active')
              }
              data-testid={testId ? `${testId}-option-${index}` : undefined}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
