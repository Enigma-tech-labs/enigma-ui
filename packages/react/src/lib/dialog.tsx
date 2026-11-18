'use client';

import { useId, type ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { Button } from './button.js';
import { cx } from './class-names.js';
import { useOverflow } from './use-overflow.js';

export type DialogSize = 'sm' | 'md' | 'lg';
export type DialogVariant = 'default' | 'alert' | 'drawer' | 'sheet';

export interface DialogProps {
  /** The heading; it names the dialog. */
  title: string;
  /** A sentence under the title; screen readers read it with the title. */
  description?: string;
  size?: DialogSize;
  /**
   * `alert`: centred heading and actions, as in an alert dialog.
   * `drawer`: a full-height side panel on the inline end (left in Arabic), for forms
   * and details next to a list.
   * `sheet`: a bottom sheet, for a short choice or details on a phone.
   */
  variant?: DialogVariant;
  open: boolean;
  /** Called with `false` on Escape, a backdrop click or the close button. */
  onOpenChange: (open: boolean) => void;
  /**
   * `false`: Escape and a click on the backdrop no longer close it, and the close
   * button is hidden. The content must then offer its own way out.
   */
  dismissable?: boolean;
  /**
   * `false`: a click on the backdrop no longer closes it; Escape and the close button
   * still do. For a form that must not be lost to a stray click.
   */
  closeOnBackdrop?: boolean;
  /**
   * `'alertdialog'` for a message that needs an answer: a backdrop click is ignored,
   * the close button is hidden, and Escape still calls `onOpenChange(false)`.
   */
  role?: 'dialog' | 'alertdialog';
  /** Accessible name of the close button; pass the translated text. */
  closeLabel?: string;
  /** Shown before the heading, as the tone icon of an alert. */
  icon?: ReactNode;
  /** The buttons at the end; they stay visible while the body scrolls. */
  actions?: ReactNode;
  children?: ReactNode;
}

/**
 * A modal dialog on React Aria: focus moves into it and stays there, the page behind
 * does not scroll, and focus returns to the opener on close.
 *
 * ```tsx
 * <Dialog
 *   title="Edit address"
 *   open={open}
 *   onOpenChange={setOpen}
 *   actions={<Button onClick={save}>Save</Button>}
 * >
 *   <TextField label="Street" />
 * </Dialog>
 * ```
 */
export function Dialog({
  title,
  description,
  size = 'md',
  variant = 'default',
  open,
  onOpenChange,
  dismissable = true,
  closeOnBackdrop = true,
  role = 'dialog',
  closeLabel = 'Close',
  icon,
  actions,
  children,
}: DialogProps) {
  const descriptionId = useId();
  // While the body scrolls it takes focus, so the keyboard can scroll it too.
  const [bodyRef, scrolls] = useOverflow<HTMLDivElement>('y', open);
  const alert = role === 'alertdialog';
  const closable = dismissable && !alert;

  return (
    <ModalOverlay
      className="ui-dialog-backdrop"
      isOpen={open}
      onOpenChange={onOpenChange}
      isDismissable={closable && closeOnBackdrop}
      // An alert ignores the backdrop, but Escape still means "no answer".
      isKeyboardDismissDisabled={!closable && !alert}
    >
      <Modal>
        <AriaDialog
          role={role}
          className={cx(
            'ui-dialog',
            size !== 'md' && `ui-dialog--${size}`,
            variant !== 'default' && `ui-dialog--${variant}`,
          )}
          aria-describedby={description ? descriptionId : undefined}
        >
          <header className="ui-dialog__header">
            {icon}
            <div className="ui-dialog__heading">
              <Heading slot="title" level={2} className="ui-dialog__title">
                {title}
              </Heading>
              {description && (
                <p className="ui-dialog__description" id={descriptionId}>
                  {description}
                </p>
              )}
            </div>
            {closable && (
              <Button
                type="button"
                variant="ghost"
                className="ui-dialog__close"
                aria-label={closeLabel}
                data-testid="ui-dialog-close"
                onClick={() => onOpenChange(false)}
              >
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </Button>
            )}
          </header>
          {children != null && children !== false && (
            <div
              ref={bodyRef}
              className="ui-dialog__body"
              tabIndex={scrolls ? 0 : undefined}
            >
              {children}
            </div>
          )}
          {actions && <footer className="ui-dialog__actions">{actions}</footer>}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
