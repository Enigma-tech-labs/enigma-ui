import { Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import type { AlertTone } from '../dialog/alert-dialog';
import { ToneIconComponent } from './tone-icon.component';

/**
 * A message in the page, such as a problem with the whole form or a notice about an
 * account. The title says the tone in words; the icon and colour repeat it.
 *
 * It is not announced when the page loads. For a message that appears after an action,
 * add `role="alert"` (urgent) or `role="status"`, or use a toast.
 *
 * ```html
 * <ui-alert tone="warning" title="Your plan ends on 1 December">
 *   Renew it to keep your reports.
 *   <div ui-alert-actions><button ui-button size="sm">Renew</button></div>
 * </ui-alert>
 * ```
 */
@Component({
  selector: 'ui-alert',
  imports: [ToneIconComponent, ButtonComponent],
  host: { '[class]': 'classes()' },
  template: `
    <svg ui-tone-icon class="ui-alert__icon" [tone]="tone()"></svg>
    <div class="ui-alert__body">
      @if (title()) {
        <p class="ui-alert__title">{{ title() }}</p>
      }
      <ng-content />
      <div class="ui-alert__actions">
        <ng-content select="[ui-alert-actions]" />
      </div>
    </div>
    @if (dismissible()) {
      <button
        ui-button
        variant="ghost"
        type="button"
        class="ui-alert__close"
        [attr.aria-label]="closeLabel()"
        (click)="dismiss.emit()"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    }
  `,
})
export class AlertComponent {
  readonly tone = input<AlertTone>('info');
  readonly title = input<string>();
  /** Shows a close button; remove the alert on `(dismiss)`. */
  readonly dismissible = input(false);
  /** Accessible name of the close button; pass the translated text. */
  readonly closeLabel = input('Dismiss');
  readonly dismiss = output();

  protected readonly classes = computed(
    () => `ui-alert ui-alert--${this.tone()}`,
  );
}
