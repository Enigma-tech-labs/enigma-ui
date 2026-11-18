import { booleanAttribute, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Styles a native `<button>`. While `loading` is true the button is disabled,
 * marked `aria-busy`, and shows a spinner next to its label.
 *
 * ```html
 * <button ui-button variant="danger" [loading]="saving()">Delete</button>
 * ```
 */
@Component({
  selector: 'button[ui-button]',
  template: `
    @if (loading()) {
      <span class="ui-spinner" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  host: {
    '[class]': 'classes()',
    '[disabled]': 'disabled() || loading()',
    '[attr.aria-busy]': 'loading() || null',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(
    () => `ui-button ui-button--${this.variant()} ui-button--${this.size()}`,
  );
}
