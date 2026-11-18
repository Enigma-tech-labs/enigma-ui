import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-type',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Type"
      lead="Five faces from the brand book, all free under the SIL Open Font License, shipped inside the package. Each stack lists a Latin face then an Arabic one, so mixed text picks the right face for every letter."
    >
      @for (lang of samples; track lang.code) {
        <section
          class="doc-section doc-card"
          [attr.lang]="lang.code"
          [attr.dir]="lang.dir"
        >
          <p class="ui-label doc-muted">{{ lang.label }}</p>
          <p class="ui-heading doc-type-3xl">{{ lang.headline }}</p>
          <p class="ui-heading doc-type-2xl">{{ lang.sub }}</p>
          <p class="doc-type-lg">{{ lang.lead }}</p>
          <p>{{ lang.body }}</p>
          <p class="doc-muted doc-type-sm">{{ lang.small }}</p>
        </section>
      }

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
        <h2 class="ui-heading doc-h2">Sizes</h2>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="Type sizes"
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

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">In code</h2>
        <app-code-block [text]="usage" caption="HTML" />
        <ul class="doc-list">
          <li>
            Body text never goes under 1rem; 0.875rem is for hints and captions
            only.
          </li>
          <li>
            Arabic is never letter-spaced: spacing breaks the joins between
            letters. <code>.ui-label</code> drops its spacing in Arabic by
            itself.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class TypeComponent {
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

  protected readonly roles = [
    {
      role: 'Headlines',
      use: 'class="ui-heading"',
      faces: 'Archivo Expanded ExtraBold · Alexandria ExtraBold',
    },
    {
      role: 'Body',
      use: 'var(--ui-font)',
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

  protected readonly usage = `<h1 class="ui-heading" style="font-size: var(--ui-text-3xl)">Order history</h1>
<p>Body text needs nothing: the stylesheet sets the font on the page.</p>
<span class="ui-label">Status</span>`;
}
