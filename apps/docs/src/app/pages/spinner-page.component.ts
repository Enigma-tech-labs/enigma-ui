import { Component } from '@angular/core';
import { ButtonComponent, SpinnerComponent } from '@enigma-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-spinner-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    SpinnerComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Spinner"
      lead="Shows that something is loading and says what, in words, to screen readers. Keep it for waits of more than a second. With reduced motion it stops turning and stays as a faint ring."
      [usage]="usage"
    >
      <app-example title="Sizes and labels" [code]="sizes">
        <ui-spinner label="Loading orders" />
        <ui-spinner label="Loading orders" [showLabel]="true" />
        <ui-spinner label="Loading the report" size="lg" [showLabel]="true" />
      </app-example>

      <app-example
        title="In a button"
        description="A busy button already has a spinner: use its loading input, not a second spinner."
        [code]="button"
      >
        <button ui-button [loading]="true">Saving</button>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-spinner label="بنحمّل الطلبات" [showLabel]="true" />
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class SpinnerPageComponent {
  protected readonly usage = {
    angular: `import { SpinnerComponent } from '@enigma-ui/angular';`,
    react: `import { Spinner } from '@enigma-ui/react';`,
    html: `<span class="ui-loading" role="status">
  <span class="ui-spinner" aria-hidden="true"></span>
  <span class="ui-visually-hidden">Loading orders</span>
</span>`,
  };

  protected readonly sizes = {
    angular: `<ui-spinner label="Loading orders" />
<ui-spinner label="Loading orders" showLabel />
<ui-spinner label="Loading the report" size="lg" showLabel />`,
    react: `<Spinner label="Loading orders" />
<Spinner label="Loading orders" showLabel />
<Spinner label="Loading the report" size="lg" showLabel />`,
    html: `<span class="ui-loading" role="status">
  <span class="ui-spinner" aria-hidden="true"></span>
  <span>Loading orders</span>
</span>
<span class="ui-loading ui-loading--lg" role="status">…</span>`,
  };

  protected readonly button = {
    angular: `<button ui-button [loading]="saving()">Save</button>`,
    react: `<Button loading={saving}>Save</Button>`,
    html: `<button class="ui-button ui-button--primary" disabled aria-busy="true">
  <span class="ui-spinner" aria-hidden="true"></span> Saving
</button>`,
  };

  protected readonly arabic = {
    angular: `<ui-spinner label="بنحمّل الطلبات" showLabel />`,
    react: `<Spinner label="بنحمّل الطلبات" showLabel />`,
    html: `<!-- dir="rtl" on the page; the markup is the same -->`,
  };

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        default: "'Loading'",
        description: 'What is loading, translated; read by screen readers.',
      },
      {
        name: 'showLabel',
        type: 'boolean',
        default: 'false',
        description: 'Shows the label next to it too.',
      },
      {
        name: 'size',
        type: "'md' | 'lg'",
        default: "'md'",
        description: 'lg: a big spinner over its label, for a page or panel.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        default: "'Loading'",
        description: 'What is loading, translated.',
      },
      {
        name: 'showLabel',
        type: 'boolean',
        default: 'false',
        description: 'Shows the label next to it too.',
      },
      {
        name: 'size',
        type: "'md' | 'lg'",
        default: "'md'",
        description: 'lg: a big spinner over its label.',
      },
    ],
    html: [
      {
        name: 'ui-loading',
        type: 'class',
        description: 'The spinner and its words, with role="status".',
      },
      {
        name: 'ui-loading--lg',
        type: 'class',
        description: 'The big one, over its label.',
      },
      {
        name: 'ui-spinner',
        type: 'class',
        description: 'The ring; hide it from screen readers.',
      },
    ],
  };
}
