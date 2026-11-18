import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  contentChildren,
  ElementRef,
  inject,
  input,
  model,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';

/** One tab: its label, and the content shown while it is chosen. */
@Component({
  selector: 'ui-tab',
  template: `<ng-template><ng-content /></ng-template>`,
})
export class TabComponent {
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly content = viewChild.required(TemplateRef);
}

let nextId = 0;

/**
 * Views of one thing side by side, such as an order's details and history. Tab reaches
 * the chosen tab, arrow keys move between tabs and show each one (mirrored right to
 * left), Home and End go to the first and last.
 *
 * ```html
 * <ui-tabs label="Order 1042" [(selected)]="tab">
 *   <ui-tab label="Details">…</ui-tab>
 *   <ui-tab label="History">…</ui-tab>
 * </ui-tabs>
 * ```
 */
@Component({
  selector: 'ui-tabs',
  imports: [NgTemplateOutlet],
  host: { class: 'ui-tabs' },
  template: `
    <div class="ui-tabs__list" role="tablist" [attr.aria-label]="label()">
      @for (tab of tabs(); track tab; let i = $index) {
        <button
          #tabButton
          type="button"
          role="tab"
          class="ui-tab"
          [id]="id + '-tab-' + i"
          [attr.aria-selected]="i === selected()"
          [attr.aria-controls]="id + '-panel-' + i"
          [tabIndex]="i === selected() ? 0 : -1"
          [disabled]="tab.disabled()"
          [attr.data-testid]="testId() ? testId() + '-' + i : null"
          (click)="selected.set(i)"
          (keydown)="keydown($event)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    @for (tab of tabs(); track tab; let i = $index) {
      <div
        role="tabpanel"
        class="ui-tabs__panel"
        tabindex="0"
        [id]="id + '-panel-' + i"
        [attr.aria-labelledby]="id + '-tab-' + i"
        [hidden]="i !== selected()"
      >
        @if (i === selected()) {
          <ng-container [ngTemplateOutlet]="tab.content()" />
        }
      </div>
    }
  `,
})
export class TabsComponent {
  /** Names the tab list, such as the thing the tabs are about. */
  readonly label = input.required<string>();
  /** The index of the chosen tab; two-way with `[(selected)]`. */
  readonly selected = model(0);
  /** data-testid prefix; each tab gets -<index>. */
  readonly testId = input<string>();

  protected readonly id = `ui-tabs-${nextId++}`;
  protected readonly tabs = contentChildren(TabComponent);
  private readonly buttons =
    viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  protected keydown(event: KeyboardEvent): void {
    const rtl = getComputedStyle(this.host).direction === 'rtl';
    const steps: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
    };
    const enabled = this.tabs().map((t) => !t.disabled());
    let next = -1;
    if (event.key in steps) next = this.step(steps[event.key]);
    else if (event.key === 'Home') next = enabled.indexOf(true);
    else if (event.key === 'End') next = enabled.lastIndexOf(true);
    if (next < 0) return;
    event.preventDefault();
    this.selected.set(next);
    this.buttons()[next]?.nativeElement.focus();
  }

  /** The next enabled tab from the chosen one, wrapping round. */
  private step(direction: number): number {
    const tabs = this.tabs();
    for (let i = 1; i <= tabs.length; i++) {
      const next =
        (this.selected() + direction * i + tabs.length * 2) % tabs.length;
      if (!tabs[next].disabled()) return next;
    }
    return -1;
  }
}
