import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-breadcrumbs-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    BreadcrumbsComponent,
  ],
  template: `
    <app-page
      title="Breadcrumbs"
      lead="Where the page sits, as a trail of links back up. A named navigation landmark around an ordered list; the last item is the page itself, marked as current and not a link. The slashes are drawn, not read out."
      [usage]="usage"
    >
      <app-example title="An order" [code]="basic">
        <ui-breadcrumbs>
          <li><a href="#home">Home</a></li>
          <li><a href="#orders">Orders</a></li>
          <li><span aria-current="page">Order 1042</span></li>
        </ui-breadcrumbs>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-breadcrumbs label="مسار الصفحة">
          <li><a href="#home">الرئيسية</a></li>
          <li><a href="#orders">الطلبات</a></li>
          <li><span aria-current="page">الطلب ١٠٤٢</span></li>
        </ui-breadcrumbs>
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class BreadcrumbsPageComponent {
  protected readonly usage = {
    angular: `import { BreadcrumbsComponent } from '@enigma-tech-lab/angular';
// Put each link in an <li>. Works with routerLink or href.`,
    react: `import { Breadcrumbs } from '@enigma-tech-lab/react';`,
    html: `<nav class="ui-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/orders">Orders</a></li>
    <li><span aria-current="page">Order 1042</span></li>
  </ol>
</nav>`,
  };

  protected readonly basic = {
    angular: `<ui-breadcrumbs>
  <li><a routerLink="/">Home</a></li>
  <li><a routerLink="/orders">Orders</a></li>
  <li><span aria-current="page">Order 1042</span></li>
</ui-breadcrumbs>`,
    react: `<Breadcrumbs>
  <li><a href="/">Home</a></li>
  <li><a href="/orders">Orders</a></li>
  <li><span aria-current="page">Order 1042</span></li>
</Breadcrumbs>`,
    html: `<nav class="ui-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/orders">Orders</a></li>
    <li><span aria-current="page">Order 1042</span></li>
  </ol>
</nav>`,
  };

  protected readonly arabic = {
    angular: `<ui-breadcrumbs label="مسار الصفحة">…</ui-breadcrumbs>`,
    react: `<Breadcrumbs label="مسار الصفحة">…</Breadcrumbs>`,
    html: `<nav class="ui-breadcrumbs" aria-label="مسار الصفحة">…</nav>`,
  };

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        default: "'Breadcrumb'",
        description: 'Names the landmark, translated.',
      },
      {
        name: '<li> children',
        type: 'content',
        description: 'One per step; the last holds aria-current="page".',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        default: "'Breadcrumb'",
        description: 'Names the landmark, translated.',
      },
      {
        name: 'children',
        type: '<li> elements',
        description: 'One per step; the last holds aria-current="page".',
      },
    ],
    html: [
      {
        name: 'ui-breadcrumbs',
        type: 'class',
        description: 'On a nav with aria-label, around an ol.',
      },
      {
        name: 'aria-current="page"',
        type: 'attribute',
        description: 'On the last item, which is not a link.',
      },
    ],
  };
}
