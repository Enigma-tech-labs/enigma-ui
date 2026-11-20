import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

export interface TableColumn<T> {
  /** The row field this column shows, and the key in `sort`. */
  key: string;
  /** The translated header text. */
  header: string;
  sortable?: boolean;
  /** `end` for numbers and money: they line up on the last digit. */
  align?: 'start' | 'center' | 'end';
  /** The value to show, when it is not `row[key]`. */
  value?: (row: T) => unknown;
}

export interface TableSort {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface TableCellContext<T> {
  $implicit: T;
  value: unknown;
}

/**
 * A custom cell for one column, matched by key:
 * `<ng-template uiCell="status" let-order>...</ng-template>`.
 */
@Directive({ selector: 'ng-template[uiCell]' })
export class TableCellDirective<T = unknown> {
  readonly key = input.required<string>({ alias: 'uiCell' });
  readonly template = inject<TemplateRef<TableCellContext<T>>>(TemplateRef);
}

let nextId = 0;

/**
 * A data table: a real `<table>` named by its caption, sortable columns with the
 * sort state on the header for screen readers, custom cells, and empty and loading
 * states. Sorting is controlled: bind `[(sort)]` and sort the rows yourself.
 *
 * ```html
 * <ui-data-table caption="Orders" [columns]="columns" [rows]="orders()" [(sort)]="sort">
 *   <ng-template uiCell="status" let-order>
 *     <ui-badge [variant]="tone(order)">{{ order.status }}</ui-badge>
 *   </ng-template>
 * </ui-data-table>
 * ```
 */
@Component({
  selector: 'ui-data-table',
  imports: [NgTemplateOutlet],
  template: `
    <div
      #wrap
      class="ui-table-wrap"
      [attr.tabindex]="scrolls() ? 0 : null"
      [attr.role]="scrolls() ? 'region' : null"
      [attr.aria-labelledby]="scrolls() ? captionId : null"
      [attr.aria-busy]="loading() || null"
    >
      <table class="ui-table">
        <caption
          class="ui-table__caption"
          [id]="captionId"
          [class.ui-visually-hidden]="hideCaption()"
        >
          {{
            caption()
          }}
        </caption>
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              <th
                scope="col"
                [class]="alignClass(column)"
                [attr.aria-sort]="ariaSort(column)"
              >
                @if (column.sortable) {
                  <button
                    type="button"
                    class="ui-table__sort"
                    [attr.data-testid]="'ui-sort-' + column.key"
                    (click)="toggleSort(column)"
                  >
                    {{ column.header }}
                    <svg
                      class="ui-table__sort-icon"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 6.5 8 3.5l3 3"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        [attr.opacity]="
                          ariaSort(column) === 'descending' ? 0.3 : 1
                        "
                      />
                      <path
                        d="M5 9.5 8 12.5l3-3"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        [attr.opacity]="
                          ariaSort(column) === 'ascending' ? 0.3 : 1
                        "
                      />
                    </svg>
                  </button>
                } @else {
                  {{ column.header }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track trackRow($index, row)) {
            <tr>
              @for (column of columns(); track column.key) {
                <td [class]="alignClass(column)">
                  @if (cellTemplate(column.key); as template) {
                    <ng-container
                      [ngTemplateOutlet]="template"
                      [ngTemplateOutletContext]="{
                        $implicit: row,
                        value: valueOf(row, column),
                      }"
                    />
                  } @else {
                    {{ valueOf(row, column) }}
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td class="ui-table__empty" [attr.colspan]="columns().length">
                {{ loading() ? '' : emptyMessage() }}
              </td>
            </tr>
          }
        </tbody>
      </table>
      @if (loading()) {
        <div class="ui-table__loading" aria-hidden="true">
          <span class="ui-spinner"></span>
        </div>
      }
      <span class="ui-visually-hidden" role="status">
        {{ loading() ? loadingLabel() : '' }}
      </span>
    </div>
  `,
})
export class DataTableComponent<T> {
  /** Names the table. Shown above it unless `hideCaption`. */
  readonly caption = input.required<string>();
  /** Keep the caption for screen readers only, when a heading above already names the table. */
  readonly hideCaption = input(false);
  readonly columns = input.required<readonly TableColumn<T>[]>();
  readonly rows = input.required<readonly T[]>();
  /** The column and direction the rows are sorted by. */
  readonly sort = model<TableSort | null>(null);
  /** A field (or function) that identifies a row, so rows keep their state across updates. */
  readonly rowKey = input<keyof T | ((row: T) => unknown)>();
  readonly loading = input(false);
  /** Read to screen readers while loading; pass the translated text. */
  readonly loadingLabel = input('Loading');
  /** Shown when there are no rows; pass the translated text. */
  readonly emptyMessage = input('No results');

  protected readonly captionId = `ui-table-caption-${nextId++}`;
  /** While the table scrolls sideways its wrapper takes focus, so the keyboard can scroll it. */
  protected readonly scrolls = signal(false);
  private readonly wrap = viewChild.required<ElementRef<HTMLElement>>('wrap');
  private readonly cells = contentChildren(TableCellDirective);
  private readonly templates = computed(
    () => new Map(this.cells().map((cell) => [cell.key(), cell.template])),
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const wrap = this.wrap().nativeElement;
      const check = () =>
        this.scrolls.set(wrap.scrollWidth > wrap.clientWidth + 1);
      check();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(check);
      observer.observe(wrap);
      const table = wrap.querySelector('table');
      if (table) observer.observe(table);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected cellTemplate(
    key: string,
  ): TemplateRef<TableCellContext<T>> | undefined {
    return this.templates().get(key) as
      TemplateRef<TableCellContext<T>> | undefined;
  }

  protected valueOf(row: T, column: TableColumn<T>): unknown {
    return column.value
      ? column.value(row)
      : (row as Record<string, unknown>)[column.key];
  }

  protected trackRow(index: number, row: T): unknown {
    const key = this.rowKey();
    if (key === undefined) return index;
    return typeof key === 'function' ? key(row) : row[key];
  }

  protected alignClass(column: TableColumn<T>): string {
    return column.align && column.align !== 'start'
      ? `ui-table__cell--${column.align}`
      : '';
  }

  protected ariaSort(column: TableColumn<T>): string | null {
    if (!column.sortable) return null;
    const sort = this.sort();
    return sort?.key === column.key ? sort.direction : 'none';
  }

  protected toggleSort(column: TableColumn<T>): void {
    const current = this.sort();
    this.sort.set({
      key: column.key,
      direction:
        current?.key === column.key && current.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  }
}
