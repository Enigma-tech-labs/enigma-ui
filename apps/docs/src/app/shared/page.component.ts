import { Component, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CodeBlockComponent } from './code-block.component';
import type { FrameworkCode } from './docs-settings';
import { NAV } from './nav';
import { DEFAULT_STORY, STORIES } from './stories';

/**
 * Page chrome: a patterned hero with the chapter, the page's story, the heading and lead,
 * then for components the import line. The chapter and story come from the route.
 */
@Component({
  selector: 'app-page',
  imports: [CodeBlockComponent],
  host: { class: 'doc-page' },
  template: `
    <header class="doc-section doc-hero" [attr.data-chapter]="chapter.title">
      <span class="doc-hero__art" aria-hidden="true"></span>
      <p class="ui-label doc-hero__eyebrow">
        <span class="doc-hero__chapter">Chapter {{ chapter.number }}</span>
        {{ chapter.title }}
      </p>
      <h1 class="ui-heading doc-h1">{{ title() }}</h1>
      <p class="doc-lead">{{ lead() }}</p>
      <p class="doc-story">
        <span class="doc-story__label">The scene</span>
        {{ story }}
      </p>
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

  private readonly path = inject(Router).url.split(/[?#]/)[0];
  protected readonly story = STORIES[this.path] ?? DEFAULT_STORY;
  protected readonly chapter = this.findChapter();

  constructor() {
    const title = inject(Title);
    queueMicrotask(() => title.setTitle(`${this.title()} · Enigma UI`));
  }

  private findChapter(): { title: string; number: string } {
    const index = NAV.findIndex((g) =>
      g.links.some((l) => l.path === this.path),
    );
    const at = Math.max(index, 0);
    return {
      title: NAV[at].title,
      number: String(at + 1).padStart(2, '0'),
    };
  }
}
