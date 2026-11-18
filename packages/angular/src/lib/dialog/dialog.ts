import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injectable,
  input,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';

/**
 * Opens a component in a modal dialog. The CDK dialog traps focus while it is open,
 * moves focus to the dialog heading, closes on Escape, and returns focus on close.
 *
 * ```ts
 * const ref = inject(UiDialog).open<boolean>(DeleteFileDialog, { name: 'report.pdf' });
 * ref.closed.subscribe(confirmed => ...);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UiDialog {
  private readonly dialog = inject(Dialog);

  open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C>,
    data?: D,
  ): DialogRef<R, C> {
    return this.dialog.open<R, D, C>(component, {
      data,
      panelClass: 'ui-dialog-panel',
      backdropClass: 'ui-dialog-backdrop',
      autoFocus: 'first-heading',
      restoreFocus: true,
    });
  }
}

let nextId = 0;

/**
 * The layout inside a dialog: a heading that names the dialog, a close button,
 * the body, and an optional row of actions.
 *
 * ```html
 * <ui-dialog title="Delete report.pdf?">
 *   <p>This cannot be undone.</p>
 *   <div ui-dialog-actions>
 *     <button ui-button variant="secondary" (click)="ref.close(false)">Cancel</button>
 *     <button ui-button variant="danger" (click)="ref.close(true)">Delete</button>
 *   </div>
 * </ui-dialog>
 * ```
 */
@Component({
  selector: 'ui-dialog',
  imports: [ButtonComponent],
  host: { class: 'ui-dialog' },
  template: `
    <header class="ui-dialog__header">
      <h2 class="ui-dialog__title" [id]="titleId">{{ title() }}</h2>
      <button
        ui-button
        variant="ghost"
        type="button"
        [attr.aria-label]="closeLabel()"
        data-testid="ui-dialog-close"
        (click)="ref.close()"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    </header>
    <ng-content />
    <footer class="ui-dialog__actions">
      <ng-content select="[ui-dialog-actions]" />
    </footer>
  `,
})
export class DialogComponent {
  readonly title = input.required<string>();
  /** Accessible name of the close button; pass the translated text. */
  readonly closeLabel = input('Close');

  protected readonly ref = inject(DialogRef);
  protected readonly titleId = `ui-dialog-title-${nextId++}`;

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    // Name the CDK dialog container after this heading.
    afterNextRender(() =>
      host
        .closest('[role="dialog"]')
        ?.setAttribute('aria-labelledby', this.titleId),
    );
  }
}
