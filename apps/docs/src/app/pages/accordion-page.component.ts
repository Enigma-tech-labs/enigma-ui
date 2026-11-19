import { Component } from '@angular/core';
import {
  AccordionComponent,
  AccordionItemComponent,
} from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-accordion-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AccordionComponent,
    AccordionItemComponent,
  ],
  template: `
    <app-page
      title="Accordion"
      lead="A stack of sections that open and close, such as questions and answers. Built on the native details element, so it opens with Enter and Space, works without script, and the browser's find-in-page opens the section that holds the match."
      [usage]="usage"
    >
      <app-example
        title="Questions"
        description="single keeps one section open at a time."
        [code]="basic"
      >
        <ui-accordion single class="doc-wide">
          <details ui-accordion-item heading="Can I change my order?" open>
            <p>Yes, until it ships. Open the order and choose Edit.</p>
          </details>
          <details ui-accordion-item heading="How do refunds work?">
            <p>
              Send the item back within 14 days. The money is back in 5 working
              days.
            </p>
          </details>
          <details ui-accordion-item heading="Do you deliver outside Cairo?">
            <p>Yes, to every governorate, in 2 to 4 days.</p>
          </details>
        </ui-accordion>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-accordion class="doc-wide">
          <details ui-accordion-item heading="أقدر أغيّر طلبي؟">
            <p>أيوه، لحد ما يتشحن.</p>
          </details>
          <details ui-accordion-item heading="الاسترجاع بيتم إزاي؟">
            <p>رجّع المنتج خلال ١٤ يوم.</p>
          </details>
        </ui-accordion>
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class AccordionPageComponent {
  protected readonly usage = {
    angular: `import { AccordionComponent, AccordionItemComponent } from '@enigma-tech-lab/angular';
// Each item is a native <details ui-accordion-item>.`,
    react: `import { Accordion, AccordionItem } from '@enigma-tech-lab/react';`,
    html: `<div class="ui-accordion">
  <details class="ui-accordion__item" name="faq">
    <summary>Can I change my order?</summary>
    <div class="ui-accordion__content"><p>Yes, until it ships.</p></div>
  </details>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-accordion single>
  <details ui-accordion-item heading="Can I change my order?" open>
    <p>Yes, until it ships. Open the order and choose Edit.</p>
  </details>
  <details ui-accordion-item heading="How do refunds work?">
    <p>Send the item back within 14 days.</p>
  </details>
</ui-accordion>`,
    react: `<Accordion single>
  <AccordionItem heading="Can I change my order?" open>
    <p>Yes, until it ships. Open the order and choose Edit.</p>
  </AccordionItem>
  <AccordionItem heading="How do refunds work?">
    <p>Send the item back within 14 days.</p>
  </AccordionItem>
</Accordion>`,
    html: `<!-- The same name on each details keeps one open at a time -->
<div class="ui-accordion">
  <details class="ui-accordion__item" name="faq" open>
    <summary>Can I change my order?</summary>
    <div class="ui-accordion__content"><p>Yes, until it ships.</p></div>
  </details>
  <details class="ui-accordion__item" name="faq">
    <summary>How do refunds work?</summary>
    <div class="ui-accordion__content"><p>Send the item back within 14 days.</p></div>
  </details>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-accordion>
  <details ui-accordion-item heading="أقدر أغيّر طلبي؟">…</details>
</ui-accordion>`,
    react: `<Accordion>
  <AccordionItem heading="أقدر أغيّر طلبي؟">…</AccordionItem>
</Accordion>`,
    html: `<!-- dir="rtl" on the page: the chevron moves to the left -->`,
  };

  protected readonly api = {
    angular: [
      {
        name: 'single',
        type: 'boolean',
        default: 'false',
        description: 'On ui-accordion: one section open at a time.',
      },
      {
        name: 'heading',
        type: 'string',
        description: 'Required, on each item: the text that opens it.',
      },
      {
        name: 'open, [(open)]',
        type: 'boolean',
        default: 'false',
        description: 'On each item: open or not.',
      },
    ],
    react: [
      {
        name: 'single',
        type: 'boolean',
        default: 'false',
        description: 'On Accordion: one section open at a time.',
      },
      {
        name: 'heading',
        type: 'string',
        description: 'Required, on AccordionItem.',
      },
      {
        name: '...props',
        type: 'details props',
        description: 'On AccordionItem: open, onToggle.',
      },
    ],
    html: [
      { name: 'ui-accordion', type: 'class', description: 'The wrapper.' },
      {
        name: 'ui-accordion__item',
        type: 'class',
        description: 'On each details; one name for one-at-a-time.',
      },
      {
        name: 'ui-accordion__content',
        type: 'class',
        description: 'Around the content after the summary.',
      },
    ],
  };
}
