import { Component, signal } from '@angular/core';
import { PaginationComponent } from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-pagination-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    PaginationComponent,
  ],
  template: `
    <app-page
      title="Pagination"
      lead="Moves through long lists a page at a time. A named navigation landmark: each page button says its number, the current page is marked, and the line of shown rows is announced when it changes."
      [usage]="usage"
    >
      <app-example
        title="Pages"
        description="The first and last page, the current one and its neighbours. Previous and next stay focusable at the ends, so focus never jumps away. On a phone only the arrows and the current page show."
        [code]="basic"
      >
        <ui-pagination
          class="doc-wide"
          [(page)]="page"
          [total]="230"
          [pageSize]="10"
        />
      </app-example>

      <app-example
        title="Rows per page"
        description="Changing the size goes back to page 1, so the reader never lands on a page that no longer exists. Two paginations on one page need different names, so this one is called Order pages."
        [code]="sizes"
      >
        <ui-pagination
          class="doc-wide"
          [(page)]="sizedPage"
          [(pageSize)]="pageSize"
          [total]="42"
          [pageSizes]="[10, 20, 50]"
          [labels]="{ nav: 'Order pages' }"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-pagination
          class="doc-wide"
          [(page)]="arabicPage"
          [total]="230"
          [pageSize]="10"
          [labels]="labelsAr"
        />
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class PaginationPageComponent {
  protected readonly page = signal(5);
  protected readonly sizedPage = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly arabicPage = signal(2);
  protected readonly labelsAr = {
    nav: 'التنقل بين الصفحات',
    previous: 'الصفحة السابقة',
    next: 'الصفحة التالية',
    page: (n: number) => `صفحة ${n}`,
    summary: (first: number, last: number, total: number) =>
      `${first}–${last} من ${total}`,
    pageSize: 'عدد الصفوف',
  };

  protected readonly usage = {
    angular: `import { PaginationComponent } from '@enigma-tech-lab/angular';`,
    react: `import { Pagination } from '@enigma-tech-lab/react';`,
    html: `<nav class="ui-pagination" aria-label="Pagination">...</nav>`,
  };

  protected readonly basic = {
    angular: `page = signal(5);

<ui-pagination [(page)]="page" [total]="230" [pageSize]="10" />`,
    react: `const [page, setPage] = useState(5);

<Pagination page={page} onPageChange={setPage} total={230} pageSize={10} />`,
    html: `<nav class="ui-pagination" aria-label="Pagination">
  <p class="ui-pagination__summary" role="status">41–50 of 230</p>
  <ul class="ui-pagination__list">
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__step" aria-label="Previous page">
      <svg class="ui-pagination__arrow" aria-hidden="true">...</svg></button></li>
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__page" aria-label="Page 1">1</button></li>
    <li><span class="ui-pagination__gap" aria-hidden="true">…</span></li>
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__page" aria-label="Page 5" aria-current="page">5</button></li>
    ...
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__step" aria-label="Next page">
      <svg class="ui-pagination__arrow" aria-hidden="true">...</svg></button></li>
  </ul>
</nav>
<!-- At the first or last page: aria-disabled="true" on the arrow, not disabled, so it keeps focus. -->`,
  };

  protected readonly sizes = {
    angular: `<ui-pagination
  [(page)]="page"
  [(pageSize)]="pageSize"
  [total]="42"
  [pageSizes]="[10, 20, 50]"
  [labels]="{ nav: 'Order pages' }"
/>`,
    react: `<Pagination
  page={page}
  onPageChange={setPage}
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  total={42}
  pageSizes={[10, 20, 50]}
  labels={{ nav: 'Order pages' }}
/>`,
    html: `<div class="ui-pagination__size">
  <label for="page-size">Rows per page</label>
  <select class="ui-input" id="page-size">
    <option>10</option>
    <option>20</option>
    <option>50</option>
  </select>
</div>`,
  };

  protected readonly arabic = {
    angular: `labels = {
  nav: 'التنقل بين الصفحات',
  previous: 'الصفحة السابقة',
  next: 'الصفحة التالية',
  page: (n: number) => \`صفحة \${n}\`,
  summary: (first: number, last: number, total: number) => \`\${first}–\${last} من \${total}\`,
  pageSize: 'عدد الصفوف',
};

<ui-pagination [(page)]="page" [total]="230" [pageSize]="10" [labels]="labels" />`,
    react: `<Pagination page={page} onPageChange={setPage} total={230} pageSize={10} labels={labels} />`,
    html: `<!-- dir="rtl" on the page: the arrows turn round by themselves -->
<nav class="ui-pagination" aria-label="التنقل بين الصفحات">...</nav>`,
  };

  protected readonly api = {
    angular: [
      {
        name: 'page',
        type: 'number (model)',
        description: 'Required. The current page, from 1. Bind [(page)].',
      },
      {
        name: 'total',
        type: 'number',
        description: 'Required. Rows across all pages.',
      },
      {
        name: 'pageSize',
        type: 'number (model)',
        default: '10',
        description: 'Rows per page. Bind [(pageSize)] with a picker.',
      },
      {
        name: 'pageSizes',
        type: 'number[]',
        default: '[]',
        description: 'Offer these sizes in a picker. Empty: no picker.',
      },
      {
        name: 'labels',
        type: 'Partial<PaginationLabels>',
        description:
          'Translated texts: nav, previous, next, page(n), summary(first, last, total), pageSize.',
      },
    ],
    react: [
      {
        name: 'page / onPageChange',
        type: 'number / (page) => void',
        description: 'Required. The current page, from 1.',
      },
      {
        name: 'total',
        type: 'number',
        description: 'Required. Rows across all pages.',
      },
      {
        name: 'pageSize / onPageSizeChange',
        type: 'number / (size) => void',
        default: '10',
        description: 'Rows per page; a new size also calls onPageChange(1).',
      },
      {
        name: 'pageSizes',
        type: 'number[]',
        default: '[]',
        description: 'Offer these sizes in a picker. Empty: no picker.',
      },
      {
        name: 'labels',
        type: 'Partial<PaginationLabels>',
        description:
          'Translated texts: nav, previous, next, page(n), summary(first, last, total), pageSize.',
      },
    ],
    html: [
      {
        name: 'nav.ui-pagination + aria-label',
        type: 'element + class',
        description: 'A named navigation landmark.',
      },
      {
        name: 'ui-pagination__summary role="status"',
        type: 'class + attribute',
        description: 'Which rows are shown, announced when it changes.',
      },
      {
        name: 'ui-pagination__page + aria-label + aria-current',
        type: 'class + attribute',
        description:
          'Name every page button, and mark the current one with aria-current="page".',
      },
      {
        name: 'ui-pagination__step + aria-disabled',
        type: 'class + attribute',
        description:
          'Previous and next; at the ends use aria-disabled="true", not disabled.',
      },
      {
        name: 'ui-pagination__gap aria-hidden',
        type: 'class + attribute',
        description: 'The "…" between page numbers.',
      },
    ],
  };
}
