import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { booleanAttribute, Component, Directive, input } from '@angular/core';

/**
 * Opens a menu from a button, on the Angular CDK: Enter, Space or the down arrow open
 * it, arrow keys and typing move through it, Escape closes it and focus returns here.
 *
 * ```html
 * <button ui-button variant="secondary" [uiMenuTrigger]="actions">Actions</button>
 * <ng-template #actions>
 *   <ui-menu>
 *     <button ui-menu-item (triggered)="edit()">Edit</button>
 *     <button ui-menu-item danger (triggered)="remove()">Delete</button>
 *   </ui-menu>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[uiMenuTrigger]',
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: uiMenuTrigger'],
    },
  ],
})
export class MenuTriggerDirective {}

/** The list of a menu. Put it in the template that `uiMenuTrigger` opens. */
@Component({
  selector: 'ui-menu',
  hostDirectives: [CdkMenu],
  host: { class: 'ui-menu' },
  template: `<ng-content />`,
})
export class MenuComponent {}

/** One action in a menu. Use `(triggered)`: it fires for a click, Enter and Space. */
@Component({
  selector: 'button[ui-menu-item]',
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  host: {
    type: 'button',
    class: 'ui-menu__item',
    '[class.ui-menu__item--danger]': 'danger()',
  },
  template: `<ng-content />`,
})
export class MenuItemComponent {
  /** For an action that destroys something: brand red text. */
  readonly danger = input(false, { transform: booleanAttribute });
}
