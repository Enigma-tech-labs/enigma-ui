import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import type { FrameworkCode } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

const styles = [
  ['head-3xl', '2.25–3.5rem / 1.1', 'Landing hero.'],
  ['head-2xl', '2–2.75rem / 1.15', 'Page title.'],
  ['head-xl', '1.625–2rem / 1.2', 'Big section.'],
  ['head-lg', '1.75rem / 1.25', 'Section.'],
  ['head-md', '1.5rem / 1.3', 'Sub-section.'],
  ['head-sm', '1.25rem / 1.3', 'Card or dialog title.'],
  ['head-xs', '1.125rem / 1.4', 'Group or list header.'],
  ['head-2xs', '1rem / 1.4', 'Smallest headline.'],
  ['body-lg', '1.25rem / 1.5', 'Lead paragraph.'],
  ['body-md', '1rem / 1.5', 'Body text and controls.'],
  ['body-sm', '0.875rem / 1.5', 'Hints and captions only.'],
].map(([name, size, use]) => ({ name, size, use }));

@Component({
  selector: 'app-typography',
  imports: [
    PageComponent,
    CodeBlockComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Typography"
      lead="Five free faces from the brand book, shipped in the package. Every stack is Latin then Arabic."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Families</h2>
        <p>Headlines, body and labels each have one stack.</p>
        <app-token-table label="Font families" [rows]="families" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Type styles</h2>
        <p>
          One class sets face, weight, size and line height; the token of the
          same name is for <code>font</code> in your CSS.
        </p>
        <app-token-table
          label="Type styles"
          tokenHeading="Class and token"
          [rows]="styleRows"
        />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the scale</h2>
        <p>The same line in English and Arabic, at every step.</p>
        <app-step
          label="Style"
          [max]="styles.length - 1"
          [valuetext]="style().name + ', ' + style().size"
          [(value)]="index"
        >
          <code>ui-{{ style().name }}</code> · {{ style().size }}
        </app-step>

        <app-example
          [title]="'ui-' + style().name"
          [description]="style().use"
          [code]="demoCode()"
        >
          <div class="doc-type-demo">
            <p [class]="'ui-' + style().name" lang="en" dir="ltr">
              Code nobody dares to touch
            </p>
            <p [class]="'ui-' + style().name" lang="ar" dir="rtl">
              الكود اللي محدش بيجرؤ يلمسه
            </p>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Body weights</h2>
        <p>Body classes take a weight suffix; heads stay ExtraBold.</p>
        <app-token-table
          label="Body weights"
          tokenHeading="Class"
          [rows]="weights"
        />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Size tokens</h2>
        <p>Sizes alone, for inside a control where a style does not fit.</p>
        <app-token-table label="Size tokens" [rows]="sizes" />
        <app-code-block [text]="css" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Body text never under 1rem; <code>ui-body-sm</code> is hints only.
          </li>
          <li>Pick the class by look, the h1–h6 by the outline.</li>
          <li>Arabic is never letter-spaced or set in italics.</li>
        </ul>
      </section>
    </app-page>
  `,
})
export class TypographyComponent {
  protected readonly styles = styles;

  protected readonly families: TokenRow[] = [
    {
      token: '--ui-font-display',
      value: 'Archivo Expanded · Alexandria',
      use: 'Headlines, ExtraBold. Class ui-head-*.',
    },
    {
      token: '--ui-font',
      value: 'IBM Plex Sans · IBM Plex Sans Arabic',
      use: 'Body and controls. Class ui-body-*.',
    },
    {
      token: '--ui-font-mono',
      value: 'IBM Plex Mono · IBM Plex Sans Arabic',
      use: 'Labels, upper case. Class ui-label.',
    },
  ].map((r) => ({
    ...r,
    previewText: 'Aa أب',
    preview: { 'font-family': `var(${r.token})`, 'font-size': '1.25rem' },
  }));

  protected readonly styleRows: TokenRow[] = styles.map((s) => ({
    token: `ui-${s.name} · --ui-${s.name}`,
    value: s.size,
    use: s.use,
    previewClass: `ui-${s.name}`,
    previewText: 'Aa',
  }));

  protected readonly weights: TokenRow[] = [
    ['', '400', 'Regular: body text.'],
    ['-m', '500', 'Medium: labels in a form.'],
    ['-s', '600', 'SemiBold: totals, a key figure.'],
    ['-b', '700', 'Bold: a word that must stand out.'],
  ].map(([suffix, value, use]) => ({
    token: `ui-body-md${suffix}`,
    value,
    use,
    previewClass: `ui-body-md${suffix}`,
    previewText: 'Total 1,240 EGP',
  }));

  protected readonly sizes: TokenRow[] = [
    ['--ui-text-3xl', '2.75rem', 'Page headline.'],
    ['--ui-text-2xl', '2rem', 'Section headline.'],
    ['--ui-text-xl', '1.5rem', 'Sub-section headline.'],
    ['--ui-text-lg', '1.25rem', 'Lead paragraph, dialog title.'],
    ['--ui-font-size', '1rem', 'Body text and controls.'],
    ['--ui-text-sm', '0.875rem', 'Hints, captions, labels.'],
  ].map(([token, value, use]) => ({
    token,
    value,
    use,
    previewText: 'Aa',
    preview: { 'font-size': `var(${token})`, 'line-height': '1' },
  }));

  /** Starts at body-md. */
  protected readonly index = signal(9);
  protected readonly style = computed(() => styles[this.index()]);
  protected readonly demoCode = computed((): FrameworkCode => {
    const n = this.style().name;
    const html = `<h2 class="ui-${n}">Code nobody dares to touch</h2>`;
    return {
      angular: html,
      react: html.replace(/class=/g, 'className='),
      html: `${html}\n\n<style>\n  .my-title {\n    font: var(--ui-${n});\n  }\n</style>`,
    };
  });

  protected readonly css = `.order-card__title {
  font: var(--ui-head-sm);
}
.order-card__total {
  font: var(--ui-body-md);
  font-weight: 600;
}`;
}
