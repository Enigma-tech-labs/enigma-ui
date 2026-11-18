'use client';

import type { ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { Button } from './button.js';

export interface DialogProps {
  /** The heading; it names the dialog. */
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name of the close button; pass the translated text. */
  closeLabel?: string;
  children: ReactNode;
}

/**
 * A modal on React Aria. Focus moves into it and stays there; Escape or a click on
 * the backdrop closes it, and focus goes back to the element that opened it.
 *
 * ```tsx
 * <Dialog title="Delete report.pdf?" open={open} onOpenChange={setOpen}>
 *   <p>This cannot be undone.</p>
 *   <DialogActions>
 *     <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="danger" onClick={remove}>Delete</Button>
 *   </DialogActions>
 * </Dialog>
 * ```
 */
export function Dialog({
  title,
  open,
  onOpenChange,
  closeLabel = 'Close',
  children,
}: DialogProps) {
  return (
    <ModalOverlay
      className="ui-dialog-backdrop"
      isOpen={open}
      onOpenChange={onOpenChange}
      isDismissable
    >
      <Modal className="ui-dialog-panel">
        <AriaDialog className="ui-dialog">
          <header className="ui-dialog__header">
            <Heading slot="title" level={2} className="ui-dialog__title">
              {title}
            </Heading>
            <Button
              type="button"
              variant="ghost"
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
          </header>
          {children}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

/** The row of buttons at the end of a dialog. */
export function DialogActions({ children }: { children: ReactNode }) {
  return <footer className="ui-dialog__actions">{children}</footer>;
}
