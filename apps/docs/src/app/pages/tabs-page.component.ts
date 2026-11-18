import { Component } from '@angular/core';
import {
  BadgeComponent,
  TabComponent,
  TabsComponent,
} from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-tabs-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    TabsComponent,
    TabComponent,
    BadgeComponent,
  ],
  template: `
    <app-page
      title="Tabs"
      lead="Views of one thing side by side, such as an order's details and its history. Tab reaches the chosen tab, the arrow keys move between tabs and show each one, Home and End go to the first and last. The chosen tab gets a bar and full-strength text, not only a colour."
      [usage]="usage"
    >
      <app-example title="An order" [code]="basic">
        <ui-tabs label="Order 1042" class="doc-wide">
          <ui-tab label="Details">
            <p class="doc-flat">
              Delivered to 12 Tahrir Street, Cairo.
              <ui-badge variant="success">Paid</ui-badge>
            </p>
          </ui-tab>
          <ui-tab label="Invoice" disabled>
            <p class="doc-flat">Not ready yet.</p>
          </ui-tab>
          <ui-tab label="History">
            <p class="doc-flat">
              Placed on 2 November, delivered on 4 November.
            </p>
          </ui-tab>
        </ui-tabs>
      </app-example>

      <app-example
        title="In Arabic"
        description="The tabs run right to left and the arrow keys follow: the right arrow goes back."
        [rtl]="true"
        [code]="arabic"
      >
        <ui-tabs label="الطلب ١٠٤٢" class="doc-wide">
          <ui-tab label="التفاصيل">
            <p class="doc-flat">اتسلّم في ١٢ شارع التحرير، القاهرة.</p>
          </ui-tab>
          <ui-tab label="السجل">
            <p class="doc-flat">اتطلب يوم ٢ نوفمبر.</p>
          </ui-tab>
        </ui-tabs>
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TabsPageComponent {
  protected readonly usage = {
    angular: `import { TabComponent, TabsComponent } from '@enigma-tech-lab/angular';`,
    react: `import { Tabs } from '@enigma-tech-lab/react';
// Arrow keys follow the locale's direction: wrap Arabic pages in <I18nProvider locale="ar">.`,
    html: `<!-- Tabs need script for the keyboard. Follow the WAI-ARIA tabs pattern with these classes: -->
<div class="ui-tabs">
  <div class="ui-tabs__list" role="tablist" aria-label="Order 1042">
    <button class="ui-tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">Details</button>
    <button class="ui-tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">History</button>
  </div>
  <div class="ui-tabs__panel" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>
  <div class="ui-tabs__panel" role="tabpanel" id="p2" aria-labelledby="t2" tabindex="0" hidden>…</div>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-tabs label="Order 1042" [(selected)]="tab">
  <ui-tab label="Details">…</ui-tab>
  <ui-tab label="Invoice" disabled>…</ui-tab>
  <ui-tab label="History">…</ui-tab>
</ui-tabs>`,
    react: `<Tabs
  label="Order 1042"
  tabs={[
    { id: 'details', label: 'Details', content: <Details /> },
    { id: 'invoice', label: 'Invoice', content: <Invoice />, disabled: true },
    { id: 'history', label: 'History', content: <History /> },
  ]}
  selected={tab}
  onChange={setTab}
/>`,
    html: `<!-- See "Use it" -->`,
  };

  protected readonly arabic = {
    angular: `<ui-tabs label="الطلب ١٠٤٢">
  <ui-tab label="التفاصيل">…</ui-tab>
  <ui-tab label="السجل">…</ui-tab>
</ui-tabs>`,
    react: `<I18nProvider locale="ar">
  <Tabs label="الطلب ١٠٤٢" tabs={tabs} />
</I18nProvider>`,
    html: `<!-- dir="rtl" on the page; the arrow keys must flip in your script -->`,
  };

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required, on ui-tabs. Names the tab list.',
      },
      {
        name: '[(selected)]',
        type: 'number',
        default: '0',
        description: 'The index of the chosen tab.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid prefix; each tab gets -<index>.',
      },
      {
        name: 'ui-tab label',
        type: 'string',
        description: 'Required. The text on the tab.',
      },
      {
        name: 'ui-tab disabled',
        type: 'boolean',
        default: 'false',
        description: 'Shown but not chosen; arrow keys skip it.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the tab list.',
      },
      {
        name: 'tabs',
        type: 'TabItem[]',
        description: 'Required. { id, label, content, disabled? }.',
      },
      {
        name: 'selected, defaultSelected',
        type: 'string',
        description: "The chosen tab's id, controlled or not.",
      },
      {
        name: 'onChange',
        type: '(id: string) => void',
        description: 'Called when another tab is chosen.',
      },
    ],
    html: [
      { name: 'ui-tabs', type: 'class', description: 'The wrapper.' },
      {
        name: 'ui-tabs__list',
        type: 'class',
        description: 'On the element with role="tablist".',
      },
      {
        name: 'ui-tab',
        type: 'class',
        description:
          'On each button with role="tab"; aria-selected marks the chosen one.',
      },
      {
        name: 'ui-tabs__panel',
        type: 'class',
        description: 'On each element with role="tabpanel".',
      },
    ],
  };
}
