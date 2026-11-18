import { DialogRef } from '@angular/cdk/dialog';
import { ApplicationRef, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent, UiDialog } from './dialog';

@Component({
  imports: [DialogComponent, ButtonComponent],
  template: `
    <ui-dialog title="Delete report.pdf?">
      <p>This cannot be undone.</p>
      <div ui-dialog-actions>
        <button
          ui-button
          variant="danger"
          data-testid="confirm"
          (click)="ref.close(true)"
        >
          Delete
        </button>
      </div>
    </ui-dialog>
  `,
})
class DeleteDialog {
  readonly ref = inject<DialogRef<boolean>>(DialogRef);
}

describe('UiDialog', () => {
  async function open() {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();

    const ref = TestBed.inject(UiDialog).open<boolean>(DeleteDialog);
    const results: (boolean | undefined)[] = [];
    ref.closed.subscribe((result) => results.push(result));
    await TestBed.inject(ApplicationRef).whenStable();

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    return { ref, results, dialog, opener };
  }

  afterEach(() => document.body.replaceChildren());

  it('names the dialog after its heading and focuses the heading', async () => {
    const { dialog } = await open();
    const heading = dialog.querySelector('h2')!;

    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(document.activeElement).toBe(heading);
  });

  it('closes with the action result', async () => {
    const { dialog, results } = await open();
    dialog.querySelector<HTMLButtonElement>('[data-testid="confirm"]')!.click();
    expect(results).toEqual([true]);
  });

  it('closes without a result from the close button and returns focus', async () => {
    const { dialog, results, opener } = await open();
    dialog
      .querySelector<HTMLButtonElement>('[data-testid="ui-dialog-close"]')!
      .click();
    await TestBed.inject(ApplicationRef).whenStable();

    expect(results).toEqual([undefined]);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});
