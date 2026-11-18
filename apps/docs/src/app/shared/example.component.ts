import { Component, input } from '@angular/core';
import { CodeBlockComponent } from './code-block.component';
import type { FrameworkCode } from './docs-settings';

/** One example: a title, a live preview, and its code in the reader's framework. */
@Component({
  selector: 'app-example',
  imports: [CodeBlockComponent],
  host: { class: 'doc-card' },
  template: `
    <h2 class="doc-card__title" [id]="anchor()">{{ title() }}</h2>
    @if (description()) {
      <p class="doc-card__text">{{ description() }}</p>
    }
    <div
      class="doc-preview"
      [attr.dir]="rtl() ? 'rtl' : null"
      [attr.lang]="rtl() ? 'ar' : null"
    >
      <ng-content />
    </div>
    <app-code-block [code]="code()" />
  `,
})
export class ExampleComponent {
  readonly title = input.required<string>();
  readonly anchor = input<string>();
  readonly description = input<string>();
  readonly code = input<FrameworkCode>({});
  /** Shows the preview in Arabic, right to left. */
  readonly rtl = input(false);
}
