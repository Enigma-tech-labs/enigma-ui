import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-typography',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Typography"
      lead="Five faces from the brand book, all free under the SIL Open Font License, shipped inside the package. Each stack lists a Latin face then an Arabic one, so mixed text picks the right face for every letter."
    >
      @for (lang of samples; track lang.code) {
        <section
          class="doc-section doc-card"
          [attr.lang]="lang.code"
          [attr.dir]="lang.dir"
        >
          <p class="ui-label doc-muted">{{ lang.label }}</p>
          <p class="ui-head-2xl">{{ lang.headline }}</p>
          <p class="ui-head-md">{{ lang.sub }}</p>
          <p class="ui-body-lg">{{ lang.lead }}</p>
          <p class="ui-body-md">{{ lang.body }}</p>
          <p class="ui-body-sm doc-muted">{{ lang.small }}</p>
        </section>
      }

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Type styles</h2>
        <p>
          One class sets the face, weight, size and line height together, so a
          headline is <code>class="ui-head-md"</code> instead of four
          declarations. Each class has a token of the same name for the
          <code>font</code> property in your own CSS. Head classes also remove
          the heading's default margin.
        </p>
        <div class="doc-type-list">
          @for (s of styles; track s.name) {
            <div class="doc-type-row">
              <p [class]="'ui-' + s.name">{{ s.sample }}</p>
              <p class="ui-body-sm doc-muted">
                <code>ui-{{ s.name }}</code> · {{ s.size }} · {{ s.use }}
              </p>
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Body weights</h2>
        <p>
          Body classes take a weight suffix. Heads stay ExtraBold: that is the
          brand.
        </p>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Body weights"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Suffix</th>
                <th scope="col">Weight</th>
                <th scope="col">Example</th>
              </tr>
            </thead>
            <tbody>
              @for (w of weights; track w.suffix) {
                <tr>
                  <td>
                    <code>{{ w.suffix || 'none' }}</code>
                  </td>
                  <td>{{ w.weight }}</td>
                  <td>
                    <span [class]="'ui-body-md' + w.suffix"
                      >ui-body-md{{ w.suffix }}</span
                    >
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">In code</h2>
        <app-code-block [text]="usage" caption="HTML" />
        <app-code-block [text]="css" caption="CSS" />
        <ul class="doc-list">
          <li>
            Body text never goes under 1rem; <code>ui-body-sm</code> is for
            hints and captions only.
          </li>
          <li>
            Pick the head by its place in the page and the element by the
            outline: an <code>h2</code> can be <code>ui-head-sm</code>.
          </li>
          <li>
            Arabic is never letter-spaced: spacing breaks the joins between
            letters. <code>.ui-label</code> drops its spacing in Arabic by
            itself.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Roles</h2>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Type roles"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Use</th>
                <th scope="col">Faces</th>
              </tr>
            </thead>
            <tbody>
              @for (r of roles; track r.role) {
                <tr>
                  <td>{{ r.role }}</td>
                  <td>
                    <code>{{ r.use }}</code>
                  </td>
                  <td>{{ r.faces }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Size tokens</h2>
        <p>
          The sizes alone, for the rare case a type style does not fit, such as
          inside a control.
        </p>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Size tokens"
        >
          <table class="doc-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Size</th>
                <th scope="col">For</th>
              </tr>
            </thead>
            <tbody>
              @for (s of sizes; track s.token) {
                <tr>
                  <td>
                    <code>{{ s.token }}</code>
                  </td>
                  <td>{{ s.size }}</td>
                  <td>{{ s.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </app-page>
  `,
})
export class TypographyComponent {
  protected readonly samples = [
    {
      code: 'en',
      dir: 'ltr',
      label: 'English · Archivo Expanded, IBM Plex Sans',
      headline: 'Code nobody dares to touch',
      sub: 'We fix it while you keep using it',
      lead: 'Plain and exact, like a lab report.',
      body: 'Body text is IBM Plex Sans at 1rem. Muted text is slate, darkened until it reaches 7:1 on white.',
      small: 'Small text, 0.875rem, for hints and captions only.',
    },
    {
      code: 'ar',
      dir: 'rtl',
      label: 'العربية · Alexandria، IBM Plex Sans Arabic',
      headline: 'الكود اللي محدش بيجرؤ يلمسه',
      sub: 'ما بنهدّش البيت. بنجدّده وانت ساكن فيه',
      lead: 'واضح ودقيق، زي تقرير معمل.',
      body: 'النص الأساسي بخط IBM Plex Sans Arabic بحجم 1rem، والنص العربي لا تُضاف له مسافات بين الحروف.',
      small: 'نص صغير للتلميحات والتعليقات فقط.',
    },
  ];

  protected readonly styles = [
    {
      name: 'head-3xl',
      sample: 'Hero',
      size: '2.25–3.5rem / 1.1',
      use: 'Landing hero',
    },
    {
      name: 'head-2xl',
      sample: 'Page title',
      size: '2–2.75rem / 1.15',
      use: 'Page title',
    },
    {
      name: 'head-xl',
      sample: 'Big section',
      size: '1.625–2rem / 1.2',
      use: 'Big section',
    },
    {
      name: 'head-lg',
      sample: 'Section',
      size: '1.75rem / 1.25',
      use: 'Section',
    },
    {
      name: 'head-md',
      sample: 'Sub-section',
      size: '1.5rem / 1.3',
      use: 'Sub-section',
    },
    {
      name: 'head-sm',
      sample: 'Card or dialog title',
      size: '1.25rem / 1.3',
      use: 'Card, dialog',
    },
    {
      name: 'head-xs',
      sample: 'Group title',
      size: '1.125rem / 1.4',
      use: 'Group, list header',
    },
    {
      name: 'head-2xs',
      sample: 'Small title',
      size: '1rem / 1.4',
      use: 'Smallest headline',
    },
    {
      name: 'body-lg',
      sample: 'Lead paragraph under a headline.',
      size: '1.25rem / 1.5',
      use: 'Lead',
    },
    {
      name: 'body-md',
      sample: 'Body text and controls.',
      size: '1rem / 1.5',
      use: 'Body',
    },
    {
      name: 'body-sm',
      sample: 'Hints and captions only.',
      size: '0.875rem / 1.5',
      use: 'Hint, caption',
    },
  ];

  protected readonly weights = [
    { suffix: '', weight: '400 Regular' },
    { suffix: '-m', weight: '500 Medium' },
    { suffix: '-s', weight: '600 SemiBold' },
    { suffix: '-b', weight: '700 Bold' },
  ];

  protected readonly roles = [
    {
      role: 'Headlines',
      use: 'class="ui-head-md"',
      faces: 'Archivo Expanded ExtraBold · Alexandria ExtraBold',
    },
    {
      role: 'Body',
      use: 'class="ui-body-md"',
      faces: 'IBM Plex Sans · IBM Plex Sans Arabic',
    },
    {
      role: 'Labels',
      use: 'class="ui-label"',
      faces:
        'IBM Plex Mono, upper case · Arabic falls back to IBM Plex Sans Arabic',
    },
  ];

  protected readonly sizes = [
    { token: '--ui-text-3xl', size: '2.75rem', use: 'Page headline' },
    { token: '--ui-text-2xl', size: '2rem', use: 'Section headline' },
    { token: '--ui-text-xl', size: '1.5rem', use: 'Sub-section headline' },
    {
      token: '--ui-text-lg',
      size: '1.25rem',
      use: 'Lead paragraph, dialog title',
    },
    { token: '--ui-font-size', size: '1rem', use: 'Body text and controls' },
    { token: '--ui-text-sm', size: '0.875rem', use: 'Hints, captions, labels' },
  ];

  protected readonly usage = `<h1 class="ui-head-2xl">Order history</h1>
<p class="ui-body-lg">Every order from the last twelve months.</p>
<h2 class="ui-head-sm">March</h2>
<p class="ui-body-md-s">3 orders · 1,240 EGP</p>
<p class="ui-body-sm">Refunds show after 5 working days.</p>`;

  protected readonly css = `/* Your own component: the token, plus a weight if needed */
.order-card__title {
  font: var(--ui-head-sm);
}
.order-card__total {
  font: var(--ui-body-md);
  font-weight: 600;
}`;
}
