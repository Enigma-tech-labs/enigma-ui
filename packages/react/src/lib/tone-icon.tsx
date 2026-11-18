import type { ReactNode } from 'react';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const shapes: Record<AlertTone, ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  success: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  warning: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  danger: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
};

/** The tone's icon: an i, a tick, a warning sign or a cross. Shape tells the tones apart, not only colour. */
export function ToneIcon({
  tone,
  className,
}: {
  tone: AlertTone;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[tone]}
    </svg>
  );
}

/** The cross on close buttons. */
export function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
