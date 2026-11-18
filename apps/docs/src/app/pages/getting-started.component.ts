import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-getting-started',
  imports: [PageComponent, CodeBlockComponent, RouterLink],
  template: `
    <app-page
      title="Enigma UI"
      lead="The design system of Enigma Technology Lab. Accessible, Arabic and English from the start, and one look across every frontend. Pick your framework at the top: every code sample on this site follows it."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Install</h2>
        <app-code-block [code]="install" caption="Terminal" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Load the styles once</h2>
        <p>
          One stylesheet holds the fonts, the colours and every component style.
          Load it once, before your own styles.
        </p>
        <app-code-block [code]="styles" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Use a component</h2>
        <app-code-block [code]="first" />
        <p>
          Each component page shows every option, live, with the code for your
          framework.
        </p>
        <ul class="doc-list">
          <li><a routerLink="/components/button">Button</a></li>
          <li><a routerLink="/components/text-field">Text field</a></li>
          <li><a routerLink="/components/select">Select</a></li>
          <li><a routerLink="/components/dialog">Dialog</a></li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Light, dark and right to left</h2>
        <p>
          The theme follows the reader's system setting. To force one, set
          <code>data-theme="light"</code> or <code>data-theme="dark"</code> on
          any ancestor. All spacing uses logical properties, so
          <code>dir="rtl"</code> on the page is enough for Arabic.
        </p>
        <app-code-block
          text='<html lang="ar" dir="rtl" data-theme="dark">'
          caption="HTML"
        />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Re-brand for a client</h2>
        <p>
          Override the primary colours after the stylesheet. Keep the "on"
          colour at 7:1 against its ground, and check the focus colour reaches
          3:1 against the page.
        </p>
        <app-code-block [text]="rebrand" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What every component promises</h2>
        <ul class="doc-list">
          <li>
            Text reaches 7:1 contrast in both themes; borders and focus rings
            reach 3:1. A test fails the build otherwise.
          </li>
          <li>
            Every control works with the keyboard alone and shows a visible
            focus ring.
          </li>
          <li>
            Labels, errors and hints are tied to their control, so screen
            readers read them.
          </li>
          <li>
            Colour never carries meaning alone: errors also have text, a thicker
            border and <code>aria-invalid</code>.
          </li>
          <li>Touch targets are at least 44 pixels high.</li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Frameworks</h2>
        <p>
          Angular and plain HTML + CSS are ready. React (on React Aria) and Vue
          (on Reka UI) are next. Every framework uses the same stylesheet, so
          the components look the same everywhere.
        </p>
      </section>
    </app-page>
  `,
})
export class GettingStartedComponent {
  protected readonly install = {
    angular: 'pnpm add @enigma-tech-lab/angular @angular/cdk',
    html: 'pnpm add @enigma-tech-lab/css',
  };

  protected readonly styles = {
    angular: `/* src/styles.css */
@import '@enigma-tech-lab/css/ui.css';
@import '@angular/cdk/overlay-prebuilt.css';`,
    html: `<!-- or with a bundler: @import '@enigma-tech-lab/css/ui.css'; -->
<link rel="stylesheet" href="node_modules/@enigma-tech-lab/css/ui.css" />`,
  };

  protected readonly first = {
    angular: `import { Component } from '@angular/core';
import { ButtonComponent } from '@enigma-tech-lab/angular';

@Component({
  selector: 'app-save-bar',
  imports: [ButtonComponent],
  template: \`<button ui-button>Save</button>\`,
})
export class SaveBarComponent {}`,
    html: `<button class="ui-button ui-button--primary ui-button--md">Save</button>`,
  };

  protected readonly rebrand = `:root {
  --ui-primary: light-dark(#0f5132, #6ee7b7);
  --ui-on-primary: light-dark(#ffffff, #0b1020);
  --ui-focus: light-dark(#0f5132, #6ee7b7);
  --ui-highlight: light-dark(#d1fae5, #064e3b);
  --ui-on-highlight: light-dark(#0b1020, #f6f7fb);
}`;
}
