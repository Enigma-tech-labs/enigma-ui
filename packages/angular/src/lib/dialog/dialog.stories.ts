import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent, UiDialog } from './dialog';

@Component({
  selector: 'ui-delete-file-dialog',
  imports: [DialogComponent, ButtonComponent],
  template: `
    <ui-dialog title="Delete report.pdf?">
      <p>
        The file is removed for everyone on the team. This cannot be undone.
      </p>
      <div ui-dialog-actions>
        <button ui-button variant="secondary" (click)="ref.close(false)">
          Cancel
        </button>
        <button ui-button variant="danger" (click)="ref.close(true)">
          Delete
        </button>
      </div>
    </ui-dialog>
  `,
})
class DeleteFileDialog {
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
}

@Component({
  selector: 'ui-dialog-demo',
  imports: [ButtonComponent],
  template: `
    <button ui-button variant="danger" (click)="open()">Delete file</button>
    <p aria-live="polite">{{ result() }}</p>
  `,
})
class DialogDemo {
  private readonly dialog = inject(UiDialog);
  protected readonly result = signal('');

  protected open(): void {
    this.dialog
      .open<boolean>(DeleteFileDialog)
      .closed.subscribe((deleted) =>
        this.result.set(deleted ? 'File deleted.' : 'Nothing changed.'),
      );
  }
}

const meta: Meta<DialogDemo> = {
  title: 'Dialog',
  component: DialogDemo,
};
export default meta;

export const Confirm: StoryObj<DialogDemo> = {};
