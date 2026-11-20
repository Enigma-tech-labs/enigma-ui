'use client';

import {
  parseDate,
  toCalendarDate,
  type CalendarDate,
  type DateValue,
} from '@internationalized/date';
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  Heading,
  RangeCalendar as AriaRangeCalendar,
  type CalendarCellRenderProps,
} from 'react-aria-components';
import { cx } from './class-names.js';

/** A picked range, as ISO dates (YYYY-MM-DD). */
export interface DateRange {
  start: string;
  end: string;
}

interface Shared {
  /** Names the calendar: "Delivery day". */
  label: string;
  /** Earliest and latest dates that can be picked, as YYYY-MM-DD. */
  min?: string;
  max?: string;
  /** Other dates that can't be picked, such as closed days. */
  isDisabled?: (date: string) => boolean;
  className?: string;
}

export interface CalendarProps extends Shared {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (date: string) => void;
}

export interface RangeCalendarProps extends Shared {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onChange?: (range: DateRange) => void;
}

// undefined leaves the calendar uncontrolled; null or '' means controlled with no date.
const date = (iso?: string | null): CalendarDate | null | undefined =>
  iso ? parseDate(iso) : iso === undefined ? undefined : null;
const range = (r?: DateRange | null) =>
  r ? { start: parseDate(r.start), end: parseDate(r.end) } : r;

const Chevron = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const day = (inRange: boolean) => (p: CalendarCellRenderProps) => {
  const middle = inRange && !p.isSelectionStart && !p.isSelectionEnd;
  return cx(
    'ui-calendar__day',
    p.isToday && 'ui-calendar__day--today',
    p.isSelected &&
      (middle ? 'ui-calendar__day--in-range' : 'ui-calendar__day--selected'),
    (p.isDisabled || p.isUnavailable) && 'ui-calendar__day--disabled',
    p.isOutsideMonth && 'ui-calendar__day--outside',
    p.isFocusVisible && 'ui-calendar__day--focus',
  );
};

const Month = ({ inRange = false }: { inRange?: boolean }) => (
  <>
    <div className="ui-calendar__header">
      <Button
        slot="previous"
        className="ui-button ui-button--ghost ui-button--sm ui-calendar__nav"
      >
        <Chevron d="M10 3.5 5.5 8 10 12.5" />
      </Button>
      <Heading level={2} className="ui-calendar__title" />
      <Button
        slot="next"
        className="ui-button ui-button--ghost ui-button--sm ui-calendar__nav"
      >
        <Chevron d="M6 3.5 10.5 8 6 12.5" />
      </Button>
    </div>
    <CalendarGrid className="ui-calendar__grid">
      {(d) => <CalendarCell date={d} className={day(inRange)} />}
    </CalendarGrid>
  </>
);

const limits = ({ min, max, isDisabled, label, className }: Shared) => ({
  'aria-label': label,
  className: cx('ui-calendar', className),
  minValue: date(min),
  maxValue: date(max),
  isDateUnavailable:
    isDisabled && ((d: DateValue) => isDisabled(toCalendarDate(d).toString())),
});

/**
 * A month grid to pick a date. Arrow keys move by day and week (flipped in Arabic), Page Up
 * and Down change the month. Dates are ISO strings, the same as a date input's value.
 * Language and first weekday follow the nearest I18nProvider, else the browser.
 *
 * ```tsx
 * <Calendar label="Delivery day" value={day} onChange={setDay} min="2026-11-19" />
 * ```
 */
export function Calendar({
  value,
  defaultValue,
  onChange,
  ...rest
}: CalendarProps) {
  return (
    <AriaCalendar
      {...limits(rest)}
      value={date(value)}
      defaultValue={date(defaultValue)}
      onChange={(d) => onChange?.(d.toString())}
    >
      <Month />
    </AriaCalendar>
  );
}

/**
 * A month grid to pick a range: the first click is the start, the second the end.
 *
 * ```tsx
 * <RangeCalendar label="Stay" value={stay} onChange={setStay} />
 * ```
 */
export function RangeCalendar({
  value,
  defaultValue,
  onChange,
  ...rest
}: RangeCalendarProps) {
  return (
    <AriaRangeCalendar
      {...limits(rest)}
      value={range(value)}
      defaultValue={range(defaultValue)}
      onChange={(r) =>
        r && onChange?.({ start: r.start.toString(), end: r.end.toString() })
      }
    >
      <Month inRange />
    </AriaRangeCalendar>
  );
}
