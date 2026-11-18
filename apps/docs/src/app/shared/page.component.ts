import { Component, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CodeBlockComponent } from './code-block.component';
import type { FrameworkCode } from './docs-settings';

/** Page chrome: heading, lead paragraph and, for components, the import line. */
@Component({
  selector: 'app-page',
  imports: [CodeBlockComponent],
  host: { class: 'doc-page' },
  template: `
    <header class="doc-section">
      <h1 class="ui-heading doc-h1">{{ title() }}</h1>
      <p class="doc-lead">{{ lead() }}</p>
      @if (usage(); as code) {
        <app-code-block caption="Use it" [code]="code" />
      }
    </header>
    <ng-content />
  `,
})
export class PageComponent {
  readonly title = input.required<string>();
  readonly lead = input.required<string>();
  readonly usage = input<FrameworkCode>();

  constructor() {
    const title = inject(Title);
    queueMicrotask(() => title.setTitle(`${this.title()} · Enigma UI`));
  }
}
