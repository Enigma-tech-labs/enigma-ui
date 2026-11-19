import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RatingComponent } from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-rating-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    RatingComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Rating"
      lead="Stars out of five, to pick a score or to show one. Picking uses real radio buttons, so Tab reaches the stars, arrow keys move between them and a screen reader says 3 stars, 3 of 5. Filled stars are solid and empty ones an outline, so the shape tells them apart, not only colour."
      [usage]="usage"
    >
      <app-example title="Pick a score" [code]="pick">
        <ui-rating label="How was the food?" [formControl]="food" />
      </app-example>

      <app-example
        title="Show a score"
        description="Read as one image with the score in words. A score with a fraction fills to the nearest star; the words keep the exact number."
        [code]="show"
      >
        <div class="flex items-center gap-2">
          <ui-rating [value]="4.6" readonly />
          <span class="text-text-muted">4.6 from 212 orders</span>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-rating
          label="ما رأيك في الأكل؟"
          [starLabel]="starArabic"
          [formControl]="foodArabic"
        />
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class RatingPageComponent {
  protected readonly food = new FormControl<number | null>(null);
  protected readonly foodArabic = new FormControl<number | null>(4);
  protected readonly starArabic = (n: number) =>
    n === 1
      ? 'نجمة واحدة'
      : n === 2
        ? 'نجمتان'
        : `${n.toLocaleString('ar-EG')} نجوم`;

  protected readonly usage = {
    angular: `import { RatingComponent } from '@enigma-tech-lab/angular';
// The value is a number, or null before a pick. Works with formControlName, [formControl] and ngModel.`,
    react: `import { Rating } from '@enigma-tech-lab/react';`,
    html: `<fieldset class="ui-rating">...</fieldset>`,
  };

  protected readonly pick = {
    angular: `<ui-rating label="How was the food?" formControlName="food" />`,
    react: `<Rating label="How was the food?" value={food} onChange={setFood} />`,
    html: `<fieldset class="ui-rating">
  <legend class="ui-field__label">How was the food?</legend>
  <span class="ui-rating__stars">
    <label class="ui-rating__star">
      <input type="radio" name="food" value="1" class="ui-visually-hidden" />
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" /></svg>
      <span class="ui-visually-hidden">1 star</span>
    </label>
    <!-- … one label per star, up to 5 -->
  </span>
</fieldset>`,
  };

  protected readonly show = {
    angular: `<ui-rating [value]="4.6" readonly />
<span>4.6 from 212 orders</span>`,
    react: `<Rating value={4.6} readOnly />
<span>4.6 from 212 orders</span>`,
    html: `<span class="ui-rating ui-rating--readonly" role="img" aria-label="4.6 out of 5 stars">
  <span class="ui-rating__stars">
    <span class="ui-rating__star ui-rating__star--on"><svg>…</svg></span>
    <!-- … --on on the first 5 (rounded), plain on the rest -->
  </span>
</span>`,
  };

  protected readonly arabic = {
    angular: `<ui-rating label="ما رأيك في الأكل؟" [starLabel]="star" formControlName="food" />

star = (n: number) => n === 1 ? 'نجمة واحدة' : n === 2 ? 'نجمتان' : \`\${n.toLocaleString('ar-EG')} نجوم\`;`,
    react: `<Rating label="ما رأيك في الأكل؟" starLabel={star} value={food} onChange={setFood} />`,
    html: `<!-- dir="rtl" on the page: the stars run from the right -->
<span class="ui-visually-hidden">٣ نجوم</span>`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description:
        'Names the stars, as the fieldset legend. Required when people pick.',
    },
    {
      name: 'max',
      type: 'number',
      default: '5',
      description: 'How many stars.',
    },
    {
      name: 'starLabel',
      type: '(stars: number) => string',
      default: '`${n} stars`',
      description:
        'The name of one star, read by screen readers. Translate it.',
    },
    {
      name: 'scoreLabel',
      type: '(value, max) => string',
      default: '`${v} out of ${m} stars`',
      description: 'The read-only score in words. Translate it.',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: 'Only shows [value]; nothing to pick.',
      },
      {
        name: 'value',
        type: 'number',
        description:
          'The score to show when readonly. A form control sets it otherwise.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'readOnly',
        type: 'boolean',
        default: 'false',
        description: 'Only shows value; nothing to pick.',
      },
      {
        name: 'value | defaultValue',
        type: 'number | null',
        description: 'Controlled or starting score.',
      },
      {
        name: 'onChange',
        type: '(value: number) => void',
        description: 'Called with the picked number of stars.',
      },
      {
        name: 'name | disabled',
        type: 'string | boolean',
        description: 'Passed to the radios and the fieldset.',
      },
    ],
    html: [
      {
        name: 'ui-rating',
        type: 'class',
        description:
          'On the fieldset, or on the read-only span with role="img".',
      },
      {
        name: 'ui-rating__star',
        type: 'class',
        description: 'One label per star, holding a hidden radio and its name.',
      },
      {
        name: 'ui-rating--readonly | ui-rating__star--on',
        type: 'class',
        description: 'Read-only score, and the stars it fills.',
      },
    ],
  };
}
