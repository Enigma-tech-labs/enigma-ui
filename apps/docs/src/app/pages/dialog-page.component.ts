import { Component, inject, signal } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import {
  ButtonComponent,
  DialogComponent,
  UiDialog,
} from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { DocsSettings } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-delete-file-dialog',
  imports: [DialogComponent, ButtonComponent],
  template: `
    <ui-dialog title="Delete report.pdf?">
      <p>This removes the file for everyone. It cannot be undone.</p>
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
export class DeleteFileDialogComponent {
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
}

@Component({
  selector: 'app-dialog-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Dialog"
      lead="A modal window. While it is open, focus moves into it and stays there; Escape closes it, and focus goes back to the button that opened it."
      [usage]="usage"
    >
      @if (settings.framework() === 'html') {
        <p class="doc-note">
          Without a framework, use the native dialog element with
          <code>showModal()</code>. The browser traps focus, closes on Escape
          and returns focus by itself.
        </p>
      }

      <app-example title="Confirm a destructive action" [code]="confirm">
        @if (settings.framework() === 'html') {
          <button
            class="ui-button ui-button--danger ui-button--md"
            type="button"
            (click)="native.showModal()"
          >
            Delete file
          </button>
          <dialog
            #native
            class="ui-dialog"
            aria-labelledby="doc-delete-title"
            (close)="answer.set(native.returnValue)"
          >
            <header class="ui-dialog__header">
              <h2 class="ui-dialog__title" id="doc-delete-title">
                Delete report.pdf?
              </h2>
            </header>
            <p>This removes the file for everyone. It cannot be undone.</p>
            <form method="dialog" class="ui-dialog__actions">
              <button
                class="ui-button ui-button--secondary ui-button--md"
                value="cancel"
              >
                Cancel
              </button>
              <button
                class="ui-button ui-button--danger ui-button--md"
                value="delete"
              >
                Delete
              </button>
            </form>
          </dialog>
        } @else {
          <button ui-button variant="danger" type="button" (click)="open()">
            Delete file
          </button>
        }
        @if (answer()) {
          <p class="doc-muted" role="status">You chose: {{ answer() }}</p>
        }
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class DialogPageComponent {
  protected readonly settings = inject(DocsSettings);
  private readonly dialog = inject(UiDialog);
  protected readonly answer = signal('');

  protected open(): void {
    this.dialog
      .open<boolean>(DeleteFileDialogComponent)
      .closed.subscribe((ok) => this.answer.set(ok ? 'delete' : 'cancel'));
  }

  protected readonly usage = {
    react: `import { Button, Dialog, DialogActions } from '@enigma-tech-lab/react';`,
    angular: `import { ButtonComponent, DialogComponent, UiDialog } from '@enigma-tech-lab/angular';`,
    html: `<dialog class="ui-dialog" aria-labelledby="title">...</dialog>`,
  };

  protected readonly confirm = {
    react: `export function DeleteFile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="danger" onClick={() => setOpen(true)}>
        Delete file
      </Button>
      <Dialog title="Delete report.pdf?" open={open} onOpenChange={setOpen}>
        <p>This removes the file for everyone. It cannot be undone.</p>
        <DialogActions>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={remove}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}`,
    angular: `@Component({
  selector: 'app-delete-file-dialog',
  imports: [DialogComponent, ButtonComponent],
  template: \`
    <ui-dialog title="Delete report.pdf?">
      <p>This removes the file for everyone. It cannot be undone.</p>
      <div ui-dialog-actions>
        <button ui-button variant="secondary" (click)="ref.close(false)">Cancel</button>
        <button ui-button variant="danger" (click)="ref.close(true)">Delete</button>
      </div>
    </ui-dialog>
  \`,
})
export class DeleteFileDialogComponent {
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
}

// Where the button is:
private readonly dialog = inject(UiDialog);

open(): void {
  this.dialog.open<boolean>(DeleteFileDialogComponent)
    .closed.subscribe((confirmed) => { /* ... */ });
}`,
    html: `<button class="ui-button ui-button--danger ui-button--md" type="button"
  onclick="document.getElementById('delete-file').showModal()">Delete file</button>

<dialog class="ui-dialog" id="delete-file" aria-labelledby="delete-title">
  <header class="ui-dialog__header">
    <h2 class="ui-dialog__title" id="delete-title">Delete report.pdf?</h2>
  </header>
  <p>This removes the file for everyone. It cannot be undone.</p>
  <form method="dialog" class="ui-dialog__actions">
    <button class="ui-button ui-button--secondary ui-button--md" value="cancel">Cancel</button>
    <button class="ui-button ui-button--danger ui-button--md" value="delete">Delete</button>
  </form>
</dialog>
<!-- dialog.returnValue is "cancel" or "delete" after it closes -->`,
  };

  protected readonly api = {
    react: [
      {
        name: 'title',
        type: 'string',
        description: 'Required. The heading; it names the dialog.',
      },
      {
        name: 'open',
        type: 'boolean',
        description: 'Required. Whether the dialog is open.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description:
          'Required. Called with false on Escape, a backdrop click or the close button.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Close'",
        description:
          'Accessible name of the close button; pass the translated text.',
      },
      {
        name: '<DialogActions>',
        type: 'component',
        description: 'Wrap the buttons in it; they line up at the end.',
      },
    ],
    angular: [
      {
        name: 'UiDialog.open(component, data?)',
        type: 'DialogRef<R>',
        description:
          'Opens the component as a modal. Read data with inject(DIALOG_DATA); closed emits the result.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Required on ui-dialog. The heading; it names the dialog.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Close'",
        description:
          'Accessible name of the close button; pass the translated text.',
      },
      {
        name: '[ui-dialog-actions]',
        type: 'content slot',
        description:
          'Put the buttons in an element with this attribute; they line up at the end.',
      },
    ],
    html: [
      {
        name: 'dialog.ui-dialog',
        type: 'element + class',
        description:
          'Open it with showModal(), never show(), so focus is trapped.',
      },
      {
        name: 'aria-labelledby',
        type: 'attribute',
        description: 'Points at the heading id, so the dialog is named.',
      },
      {
        name: 'ui-dialog__header, ui-dialog__title',
        type: 'class',
        description: 'The heading row and the heading.',
      },
      {
        name: 'form[method="dialog"].ui-dialog__actions',
        type: 'element + class',
        description:
          'Buttons inside close the dialog and set returnValue to their value.',
      },
    ],
  };
}
