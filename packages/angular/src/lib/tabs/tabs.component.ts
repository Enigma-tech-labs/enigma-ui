import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';

/** Scrolls a tab to the middle of its list, moving only the list, never the page. */
function centerTab(tab: HTMLElement | null | undefined): void {
  const list = tab?.parentElement;
  if (!tab || !list) return;
  const t = tab.getBoundingClientRect();
  const l = list.getBoundingClientRect();
  // Smooth or not comes from the CSS scroll-behavior, which honours reduced motion.
  list.scrollBy?.({ left: t.left + t.width / 2 - (l.left + l.width / 2) });
}

/**
 * Marks a tab's content to be created only when the tab is shown, such as a list that
 * loads from an API. Without it, the content is created with the page.
 *
 * ```html
 * <ui-tab label="Invoices">
 *   <ng-template uiTabContent><app-invoices /></ng-template>
 * </ui-tab>
 * ```
 */
@Directive({ selector: 'ng-template[uiTabContent]' })
export class TabContentDirective {
  readonly template = inject(TemplateRef);
}

/** One tab: its label, and the content shown while it is chosen. */
@Component({
  selector: 'ui-tab',
  template: `<ng-template><ng-content /></ng-template>`,
})
export class TabComponent {
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  /**
   * Keeps lazy content once it has been shown, so coming back finds it as it was.
   * Off, it is created again, and loads again, each time the tab is chosen.
   */
  readonly keep = input(false, { transform: booleanAttribute });

  private readonly lazy = contentChild(TabContentDirective);
  private readonly projected = viewChild.required(TemplateRef);
  readonly content = computed(() => this.lazy()?.template ?? this.projected());
  /** Set once the tab has been chosen. */
  readonly visited = signal(false);
}

let nextId = 0;

/**
 * Views of one thing side by side, such as an order's details and history. Tab reaches
 * the chosen tab, arrow keys move between tabs and show each one (mirrored right to
 * left), Home and End go to the first and last. When the tabs are wider than the page
 * they scroll, and the chosen one moves to the middle.
 *
 * ```html
 * <ui-tabs label="Order 1042" [(selected)]="tab">
 *   <ui-tab label="Details">…</ui-tab>
 *   <ui-tab label="History" keep>
 *     <ng-template uiTabContent><app-history /></ng-template>
 *   </ui-tab>
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
        @if (i === selected() || (tab.keep() && tab.visited())) {
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

  constructor() {
    effect(() => this.tabs()[this.selected()]?.visited.set(true));
    afterRenderEffect(() =>
      centerTab(this.buttons()[this.selected()]?.nativeElement),
    );
  }

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

/**
 * Tabs that are pages, each with its own address: links styled as tabs, over your
 * `<router-outlet>`. They stay links, not a tablist, so Tab moves through them and
 * each one can open in a new browser tab. The current link scrolls to the middle.
 *
 * ```html
 * <ui-tab-nav label="Account">
 *   <a class="ui-tab" routerLink="profile" routerLinkActive ariaCurrentWhenActive="page">Profile</a>
 *   <a class="ui-tab" routerLink="billing" routerLinkActive ariaCurrentWhenActive="page">Billing</a>
 * </ui-tab-nav>
 * <router-outlet />
 * ```
 */
@Component({
  selector: 'ui-tab-nav',
  host: {
    class: 'ui-tabs__list',
    role: 'navigation',
    '[attr.aria-label]': 'label()',
  },
  template: `<ng-content />`,
})
export class TabNavComponent {
  /** Names the navigation landmark, such as the section the pages belong to. */
  readonly label = input.required<string>();

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const center = () =>
      centerTab(host.querySelector<HTMLElement>('[aria-current="page"]'));
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      center();
      // The router (or your own code) moves aria-current; follow it wherever it goes.
      const observer = new MutationObserver(center);
      observer.observe(host, {
        subtree: true,
        attributeFilter: ['aria-current'],
      });
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
