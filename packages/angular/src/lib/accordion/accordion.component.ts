import {
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

let nextId = 0;

/**
 * A stack of sections that open and close, such as questions and answers. Native
 * `<details>`, so it opens with Enter and Space and works without script.
 *
 * ```html
 * <ui-accordion single>
 *   <details ui-accordion-item heading="Can I change my order?">…</details>
 * </ui-accordion>
 * ```
 */
@Component({
  selector: 'ui-accordion',
  host: { class: 'ui-accordion' },
  template: `<ng-content />`,
})
export class AccordionComponent {
  /** Keeps one section open at a time: opening one closes the others. */
  readonly single = input(false, { transform: booleanAttribute });
  readonly name = `ui-accordion-${nextId++}`;
}

/** One section of an accordion: a native `<details>` with its heading. */
@Component({
  selector: 'details[ui-accordion-item]',
  host: {
    class: 'ui-accordion__item',
    '[open]': 'open()',
    '[attr.name]': 'group?.single() ? group.name : null',
    '(toggle)': 'openChange.emit(host.open)',
  },
  template: `
    <summary>{{ heading() }}</summary>
    <div class="ui-accordion__content"><ng-content /></div>
  `,
})
export class AccordionItemComponent {
  /** The text of the summary that opens it. */
  readonly heading = input.required<string>();
  /** Open or not: a bare `open` attribute, `[open]`, or two-way `[(open)]`. */
  readonly open = input(false, { transform: booleanAttribute });
  readonly openChange = output<boolean>();

  protected readonly group = inject(AccordionComponent, { optional: true });
  protected readonly host: HTMLDetailsElement =
    inject(ElementRef).nativeElement;
}
