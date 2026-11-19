import { booleanAttribute, Component, input, output } from '@angular/core';

let nextId = 0;

/**
 * A label the user added or can take away, such as an active filter. For a status
 * ("Paid") use a badge. With `removable`, the × button is read as "Remove Angular";
 * after `remove`, move focus to the next tag or the field that adds tags.
 *
 * ```html
 * <ui-tag removable (remove)="drop('angular')">Angular</ui-tag>
 * ```
 */
@Component({
  selector: 'ui-tag',
  host: { class: 'ui-tag' },
  template: `
    <span [id]="id"><ng-content /></span>
    @if (removable()) {
      <button
        type="button"
        class="ui-tag__remove"
        [id]="id + '-remove'"
        [attr.aria-label]="removeLabel()"
        [attr.aria-labelledby]="id + '-remove ' + id"
        (click)="remove.emit()"
      >
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    }
  `,
})
export class TagComponent {
  readonly removable = input(false, { transform: booleanAttribute });
  /** First word of the remove button's name; the tag's text follows it. */
  readonly removeLabel = input('Remove');
  readonly remove = output<void>();

  protected readonly id = `ui-tag-${nextId++}`;
}
