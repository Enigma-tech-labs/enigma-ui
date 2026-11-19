import { cx } from './class-names.js';

export interface StepperProps {
  /** Names the list of steps: "Checkout". */
  label: string;
  steps: string[];
  /** Index of the current step, from 0. Steps before it are done. */
  current?: number;
  /** Read before each done step. Translate it. */
  doneLabel?: string;
  /** The marker's number: (n) => n.toLocaleString('ar-EG') for Arabic digits. */
  number?: (n: number) => string;
  className?: string;
}

/**
 * Where the user is in a flow of steps, such as checkout. It shows the steps only: the
 * page shows the current step's content.
 *
 * ```tsx
 * <Stepper label="Checkout" steps={['Cart', 'Address', 'Payment']} current={1} />
 * ```
 */
export function Stepper({
  label,
  steps,
  current = 0,
  doneLabel = 'Done',
  number = String,
  className,
}: StepperProps) {
  return (
    <ol className={cx('ui-steps', className)} aria-label={label}>
      {steps.map((step, i) => (
        <li
          key={i}
          className={cx(
            'ui-steps__item',
            i < current && 'ui-steps__item--done',
            i === current && 'ui-steps__item--current',
          )}
          aria-current={i === current ? 'step' : undefined}
        >
          <span className="ui-steps__marker" aria-hidden="true">
            {i < current ? (
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            ) : (
              number(i + 1)
            )}
          </span>
          <span className="ui-steps__label">
            {i < current && (
              <span className="ui-visually-hidden">{doneLabel}: </span>
            )}
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
