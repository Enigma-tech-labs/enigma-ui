import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button } from './button.js';
import { Dialog, DialogActions } from './dialog.js';

function Host() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Delete file
      </Button>
      <Dialog title="Delete report.pdf?" open={open} onOpenChange={setOpen}>
        <p>This cannot be undone.</p>
        <DialogActions>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('opens a modal named by its heading, with focus inside', async () => {
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete report.pdf?' });
    expect(screen.getByRole('heading', { level: 2 }).className).toBe(
      'ui-dialog__title',
    );
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('closes on the close button and returns focus to the opener', async () => {
    render(<Host />);
    const opener = screen.getByRole('button', { name: 'Delete file' });
    await userEvent.click(opener);
    await userEvent.click(screen.getByTestId('ui-dialog-close'));

    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(opener));
  });

  it('closes on Escape', async () => {
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
