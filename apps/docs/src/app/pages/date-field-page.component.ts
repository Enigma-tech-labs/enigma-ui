import { Component } from '@angular/core';
import { TextFieldComponent } from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-date-field-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    TextFieldComponent,
  ],
  template: `
    <app-page
      title="Date and number fields"
      lead="The text field with the browser's own date, time and number inputs. The picker comes in the reader's language and calendar, works with the keyboard and screen readers, and opens the right keypad on a phone. The value stays a plain ISO date, such as 2026-12-01."
      [usage]="usage"
    >
      <app-example
        title="Date"
        description="min and max keep the picker to dates that make sense. To show a month with closed days or a range, use the calendar instead."
        [code]="date"
      >
        <ui-text-field
          label="Move-in date"
          type="date"
          min="2026-01-01"
          hint="Any day from January 2026."
          class="doc-field"
        />
      </app-example>

      <app-example title="Time" [code]="time">
        <ui-text-field
          label="Delivery time"
          type="time"
          step="900"
          class="doc-field"
        />
      </app-example>

      <app-example
        title="Number"
        description="In Angular, the form control gets a number, or null when the field is empty."
        [code]="number"
      >
        <ui-text-field
          label="Rooms"
          type="number"
          [min]="1"
          [max]="12"
          class="doc-field"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-text-field label="تاريخ الاستلام" type="date" class="doc-field" />
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class DateFieldPageComponent {
  protected readonly usage = {
    angular: `import { TextFieldComponent } from '@enigma-tech-lab/angular';
// ui-text-field with type="date", "time", "datetime-local" or "number".`,
    react: `import { TextField } from '@enigma-tech-lab/react';
// TextField with type="date", "time", "datetime-local" or "number".`,
    html: `<input class="ui-input" type="date" id="move-in" />`,
  };

  protected readonly date = {
    angular: `<ui-text-field
  label="Move-in date"
  type="date"
  min="2026-01-01"
  hint="Any day from January 2026."
  formControlName="moveIn"
/>`,
    react: `<TextField
  label="Move-in date"
  type="date"
  min="2026-01-01"
  hint="Any day from January 2026."
  value={moveIn}
  onChange={(e) => setMoveIn(e.target.value)}
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="move-in">Move-in date</label>
  <input class="ui-input" type="date" id="move-in" min="2026-01-01" aria-describedby="move-in-hint" />
  <p class="ui-field__hint" id="move-in-hint">Any day from January 2026.</p>
</div>`,
  };

  protected readonly time = {
    angular: `<!-- step in seconds: 900 offers quarter hours -->
<ui-text-field label="Delivery time" type="time" step="900" formControlName="time" />`,
    react: `<TextField label="Delivery time" type="time" step={900} />`,
    html: `<input class="ui-input" type="time" id="time" step="900" />`,
  };

  protected readonly number = {
    angular: `<ui-text-field label="Rooms" type="number" [min]="1" [max]="12" formControlName="rooms" />`,
    react: `<TextField
  label="Rooms"
  type="number"
  min={1}
  max={12}
  value={rooms ?? ''}
  onChange={(e) => setRooms(e.target.value === '' ? null : e.target.valueAsNumber)}
/>`,
    html: `<input class="ui-input" type="number" id="rooms" min="1" max="12" />`,
  };

  protected readonly arabic = {
    angular: `<ui-text-field label="تاريخ الاستلام" type="date" formControlName="date" />`,
    react: `<TextField label="تاريخ الاستلام" type="date" />`,
    html: `<!-- dir="rtl" and lang="ar" on the page: the browser's picker follows -->`,
  };

  protected readonly api = {
    angular: [
      {
        name: 'type',
        type: "'date' | 'time' | 'datetime-local' | 'number'",
        description:
          'On ui-text-field. Every other text field input works too.',
      },
      {
        name: 'min, max',
        type: 'string | number',
        description:
          "The range: '2026-01-31' for a date, '09:00' for a time, 1 for a number.",
      },
      {
        name: 'step',
        type: 'string | number',
        description: 'The steps: seconds for a time, units for a number.',
      },
    ],
    react: [
      {
        name: 'type',
        type: "'date' | 'time' | 'datetime-local' | 'number'",
        description: 'On TextField. min, max and step pass to the input.',
      },
    ],
    html: [
      {
        name: 'input.ui-input',
        type: 'element + class',
        description:
          'With type="date", "time", "datetime-local" or "number", inside a ui-field.',
      },
    ],
  };
}
