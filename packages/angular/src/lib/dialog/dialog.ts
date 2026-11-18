import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injectable,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { filter, take } from 'rxjs';
import { ButtonComponent } from '../button/button.component';

export type DialogSize = 'sm' | 'md' | 'lg';
export type DialogVariant = 'default' | 'alert' | 'drawer';

export interface UiDialogConfig<D = unknown> {
  /** Passed to the content: `inject(DIALOG_DATA)` in a component, `let-data` in a template. */
  data?: D;
  /**
   * `false`: Escape and a click on the backdrop no longer close it, and the close
   * button is hidden. The content must then offer its own way out.
   */
  dismissable?: boolean;
  /**
   * `'alertdialog'` for a message that needs an answer: a backdrop click is ignored,
   * the close button is hidden, and Escape closes it with no result.
   */
  role?: 'dialog' | 'alertdialog';
  /** A CSS selector inside the dialog to focus first. Defaults to the heading. */
  initialFocus?: string;
}

/**
 * Opens a component or a template in a modal dialog, on the Angular CDK: focus is
 * trapped inside, the page behind does not scroll, dialogs stack, and focus returns
 * to the opener on close.
 *
 * ```ts
 * const ref = inject(UiDialog).open<boolean>(EditAddressDialog, { data: address });
 * ref.closed.subscribe((saved) => ...);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UiDialog {
  private readonly dialog = inject(Dialog);

  open<R = unknown, D = unknown, C = unknown>(
    content: ComponentType<C> | TemplateRef<C>,
    config: UiDialogConfig<D> = {},
  ): DialogRef<R, C> {
    const alert = config.role === 'alertdialog';
    const ref = this.dialog.open<R, D, C>(content, {
      data: config.data,
      role: config.role ?? 'dialog',
      disableClose: alert || config.dismissable === false,
      backdropClass: 'ui-dialog-backdrop',
      autoFocus: config.initialFocus ?? 'first-heading',
      restoreFocus: true,
    });
    if (alert) {
      // An alert ignores the backdrop, but Escape still means "no answer".
      ref.keydownEvents
        .pipe(
          filter((event) => event.key === 'Escape'),
          take(1),
        )
        .subscribe(() => ref.close());
    }
    return ref;
  }
}

let nextId = 0;

/**
 * The layout inside a dialog: a heading that names it, an optional description,
 * a close button, a body that scrolls when the content is long, and a row of actions.
 *
 * ```html
 * <ui-dialog title="Edit address" description="Used for your next orders.">
 *   <ui-text-field label="Street" formControlName="street" />
 *   <div ui-dialog-actions>
 *     <button ui-button variant="secondary" uiDialogClose>Cancel</button>
 *     <button ui-button (click)="save()">Save</button>
 *   </div>
 * </ui-dialog>
 * ```
 */
@Component({
  selector: 'ui-dialog',
  imports: [ButtonComponent],
  host: { '[class]': 'classes()' },
  template: `
    <header class="ui-dialog__header">
      <ng-content select="[ui-dialog-icon]" />
      <div class="ui-dialog__heading">
        <h2 class="ui-dialog__title" [id]="titleId">{{ title() }}</h2>
        @if (description()) {
          <p class="ui-dialog__description" [id]="descriptionId">
            {{ description() }}
          </p>
        }
      </div>
      @if (!ref.disableClose) {
        <button
          ui-button
          variant="ghost"
          type="button"
          class="ui-dialog__close"
          [attr.aria-label]="closeLabel()"
          data-testid="ui-dialog-close"
          (click)="ref.close()"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </button>
      }
    </header>
    <div #body class="ui-dialog__body" [attr.tabindex]="scrolls() ? 0 : null">
      <ng-content />
    </div>
    <footer class="ui-dialog__actions">
      <ng-content select="[ui-dialog-actions]" />
    </footer>
  `,
})
export class DialogComponent {
  readonly title = input.required<string>();
  /** A sentence under the title; screen readers read it with the title. */
  readonly description = input<string>();
  readonly size = input<DialogSize>('md');
  /**
   * `alert`: centred heading and actions, as in an alert dialog.
   * `drawer`: a full-height side panel on the inline end (left in Arabic), for forms
   * and details next to a list.
   */
  readonly variant = input<DialogVariant>('default');
  /** Accessible name of the close button; pass the translated text. */
  readonly closeLabel = input('Close');

  protected readonly ref = inject(DialogRef);
  /** While the body scrolls it takes focus, so the keyboard can scroll it too. */
  protected readonly scrolls = signal(false);
  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');
  protected readonly titleId = `ui-dialog-title-${nextId}`;
  protected readonly descriptionId = `ui-dialog-description-${nextId++}`;
  protected readonly classes = computed(() =>
    [
      'ui-dialog',
      this.size() !== 'md' && `ui-dialog--${this.size()}`,
      this.variant() !== 'default' && `ui-dialog--${this.variant()}`,
    ]
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    // Name and describe the CDK dialog container after this heading and description.
    afterNextRender(() => {
      const container = host.closest('[role="dialog"], [role="alertdialog"]');
      container?.setAttribute('aria-labelledby', this.titleId);
      if (this.description()) {
        container?.setAttribute('aria-describedby', this.descriptionId);
      }
      // A drawer places itself, which would leave the container with no size.
      if (this.variant() === 'drawer')
        container?.classList.add('ui-dialog-frame');
      const body = this.body().nativeElement;
      const check = () =>
        this.scrolls.set(body.scrollHeight > body.clientHeight + 1);
      check();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(check);
      observer.observe(body);
      Array.from(body.children).forEach((child) => observer.observe(child));
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

/**
 * Closes the dialog it is in when clicked, with an optional result.
 *
 * ```html
 * <button ui-button variant="secondary" uiDialogClose>Cancel</button>
 * <button ui-button [uiDialogClose]="true">Delete</button>
 * ```
 */
@Directive({
  selector: '[uiDialogClose]',
  host: { '(click)': 'ref.close(result())' },
})
export class DialogCloseDirective<R = unknown> {
  readonly result = input<R | undefined, R | ''>(undefined, {
    alias: 'uiDialogClose',
    // A bare `uiDialogClose` attribute closes with no result.
    transform: (value) => (value === '' ? undefined : value),
  });

  protected readonly ref = inject<DialogRef<R>>(DialogRef);
}
