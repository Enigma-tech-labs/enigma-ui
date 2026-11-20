import { Component, computed, input, model } from '@angular/core';
import { pageSlots } from './page-slots';

export interface PaginationLabels {
  /** The name of the navigation landmark. */
  nav: string;
  previous: string;
  next: string;
  /** The name of a page button. */
  page: (page: number) => string;
  /** The line that says which rows are shown. */
  summary: (first: number, last: number, total: number) => string;
  /** The label of the rows-per-page picker. */
  pageSize: string;
}

const englishLabels: PaginationLabels = {
  nav: 'Pagination',
  previous: 'Previous page',
  next: 'Next page',
  page: (page) => `Page ${page}`,
  summary: (first, last, total) =>
    total === 0 ? 'No results' : `${first}–${last} of ${total}`,
  pageSize: 'Rows per page',
};

let nextId = 0;

/**
 * Page navigation, 1-based. Bind `[(page)]` (and `[(pageSize)]` with `pageSizes`).
 * Previous and next stay focusable at the ends, marked unavailable instead of
 * disabled, so focus never jumps away. Pass translated `labels`.
 *
 * ```html
 * <ui-pagination [(page)]="page" [total]="total()" [pageSize]="20" />
 * ```
 */
@Component({
  selector: 'ui-pagination',
  template: `
    <nav class="ui-pagination" [attr.aria-label]="text().nav">
      <p class="ui-pagination__summary" role="status">{{ summary() }}</p>
      @if (pageSizes().length) {
        <div class="ui-pagination__size">
          <label [for]="sizeId">{{ text().pageSize }}</label>
          <select
            class="ui-input"
            [id]="sizeId"
            data-testid="ui-pagination-size"
            (change)="changeSize($event)"
          >
            @for (size of pageSizes(); track size) {
              <option [value]="size" [selected]="size === pageSize()">
                {{ size }}
              </option>
            }
          </select>
        </div>
      }
      <ul class="ui-pagination__list">
        <li>
          <button
            type="button"
            class="ui-button ui-button--ghost ui-button--sm ui-pagination__step"
            data-testid="ui-pagination-previous"
            [attr.aria-label]="text().previous"
            [attr.aria-disabled]="page() <= 1 || null"
            (click)="go(page() - 1)"
          >
            <svg
              class="ui-pagination__arrow"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M10 3 5 8l5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </button>
        </li>
        @for (slot of slots(); track $index) {
          <li>
            @if (slot === 0) {
              <span class="ui-pagination__gap" aria-hidden="true">…</span>
            } @else {
              <button
                type="button"
                class="ui-button ui-button--ghost ui-button--sm ui-pagination__page"
                [attr.aria-label]="text().page(slot)"
                [attr.aria-current]="slot === page() ? 'page' : null"
                (click)="go(slot)"
              >
                {{ slot }}
              </button>
            }
          </li>
        }
        <li>
          <button
            type="button"
            class="ui-button ui-button--ghost ui-button--sm ui-pagination__step"
            data-testid="ui-pagination-next"
            [attr.aria-label]="text().next"
            [attr.aria-disabled]="page() >= pageCount() || null"
            (click)="go(page() + 1)"
          >
            <svg
              class="ui-pagination__arrow"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="m6 3 5 5-5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  `,
})
export class PaginationComponent {
  /** The current page, starting at 1. */
  readonly page = model.required<number>();
  readonly pageSize = model(10);
  /** The number of rows across all pages. */
  readonly total = input.required<number>();
  /** Offer these page sizes in a picker. Empty: no picker. */
  readonly pageSizes = input<readonly number[]>([]);
  /** Translated texts; any you leave out stay English. */
  readonly labels = input<Partial<PaginationLabels>>({});

  protected readonly sizeId = `ui-pagination-size-${nextId++}`;
  protected readonly text = computed(() => ({
    ...englishLabels,
    ...this.labels(),
  }));
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize())),
  );
  protected readonly slots = computed(() =>
    pageSlots(this.page(), this.pageCount()),
  );
  protected readonly summary = computed(() => {
    const first = Math.min(
      this.total(),
      (this.page() - 1) * this.pageSize() + 1,
    );
    const last = Math.min(this.total(), this.page() * this.pageSize());
    return this.text().summary(first, last, this.total());
  });

  protected go(page: number): void {
    if (page >= 1 && page <= this.pageCount() && page !== this.page()) {
      this.page.set(page);
    }
  }

  protected changeSize(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    this.page.set(1);
  }
}
