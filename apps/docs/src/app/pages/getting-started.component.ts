import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../shared/code-block.component';
import { DocsSettings, FRAMEWORKS } from '../shared/docs-settings';
import { PageComponent } from '../shared/page.component';

/** The setup guide: numbered steps, each one required, for the reader's framework. */
@Component({
  selector: 'app-getting-started',
  imports: [PageComponent, CodeBlockComponent, RouterLink],
  template: `
    <app-page
      title="Getting started"
      lead="Follow every step, in order, and skip none: each one is required. The steps and the code follow the framework picked at the top of the page."
    >
      <p class="doc-note">
        Setting up for <strong>{{ frameworkLabel() }}</strong>. Using another
        framework? Pick it at the top first.
      </p>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2" id="gs-requirements">
          Step 1. Check the requirements
        </h2>
        <p>
          Every line must be true before you install. Older versions are not
          supported.
        </p>
        <div
          class="ui-table-wrap"
          tabindex="0"
          role="region"
          aria-labelledby="gs-requirements"
        >
          <table class="ui-table">
            <thead>
              <tr>
                <th scope="col">What</th>
                <th scope="col">Minimum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Node.js</th>
                <td>22</td>
              </tr>
              @switch (settings.framework()) {
                @case ('angular') {
                  <tr>
                    <th scope="row">Angular (core, common, forms, router)</th>
                    <td>22.2</td>
                  </tr>
                  <tr>
                    <th scope="row">Angular CDK</th>
                    <td>22.2, the same major version as Angular</td>
                  </tr>
                  <tr>
                    <th scope="row">RxJS</th>
                    <td>7.8</td>
                  </tr>
                }
                @case ('react') {
                  <tr>
                    <th scope="row">React and React DOM</th>
                    <td>19</td>
                  </tr>
                }
                @case ('html') {
                  <tr>
                    <th scope="row">Build</th>
                    <td>
                      A bundler that resolves CSS imports from node_modules
                      (Vite, webpack, Angular CLI), or a server that serves the
                      package folder as it is
                    </td>
                  </tr>
                }
              }
              <tr>
                <th scope="row">Browsers</th>
                <td>Chrome and Edge 123, Firefox 125, Safari 17.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Step 2. Install the packages</h2>
        <app-code-block [code]="install" caption="Terminal" />
        <ul class="doc-list">
          <li>
            Install <code>&#64;enigma-tech-lab/css</code> yourself, even though
            the framework package depends on it. With pnpm, a package you did
            not add is not visible to your own imports, and step 3 imports it.
          </li>
          <li>
            Keep every <code>&#64;enigma-tech-lab/*</code> package on the same
            version. Update them together, never one alone.
          </li>
          @if (settings.framework() === 'angular') {
            <li>
              <code>&#64;angular/cdk</code> must have the same major version as
              <code>&#64;angular/core</code>.
            </li>
          }
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Step 3. Load the stylesheet once</h2>
        <p>
          <code>ui.css</code> holds the fonts, the colours and every component
          style. Load it exactly once, globally, before any of your own styles.
        </p>
        <app-code-block [code]="styles" />
        <ul class="doc-list">
          @switch (settings.framework()) {
            @case ('angular') {
              <li>
                Put it in the global stylesheet listed under
                <code>styles</code> in <code>angular.json</code> (or
                <code>project.json</code>). Never in a component's
                <code>styles</code> or <code>styleUrl</code>.
              </li>
              <li>
                The CDK overlay stylesheet is required: select, combobox, menu,
                popover and tooltip float on it.
              </li>
            }
            @case ('react') {
              <li>
                Import it in the entry file only (<code>main.tsx</code>, or the
                root <code>app/layout.tsx</code> in Next.js), above every other
                CSS import.
              </li>
            }
            @case ('html') {
              <li>
                The fonts load from <code>./fonts/</code> next to
                <code>ui.css</code>. If you copy the file, copy the
                <code>fonts</code> folder beside it, or the text falls back to
                the system font.
              </li>
            }
          }
          <li>
            Load any CSS reset before <code>ui.css</code>, never after it: a
            reset after it undoes the component styles.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">
          Step 4. Set the language and direction
        </h2>
        <p>
          <code>lang</code> and <code>dir</code> on <code>&lt;html&gt;</code>
          are required. Fonts, spacing and keyboard direction all read them.
          When the reader switches language, change both together.
        </p>
        <app-code-block [text]="htmlTag" caption="index.html" />
        @if (settings.framework() === 'react') {
          <p>
            For Arabic, also wrap the app in React Aria's
            <code>I18nProvider</code>, so arrow keys in tabs, menus and lists
            follow the direction. It needs <code>react-aria-components</code> as
            your own dependency.
          </p>
          <app-code-block [text]="i18n" caption="React" />
        }
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Step 5. Add the app-wide parts</h2>
        @switch (settings.framework()) {
          @case ('angular') {
            <p>
              Nothing to provide: <code>UiDialog</code>,
              <code>UiAlertDialog</code> and <code>UiToast</code> are provided
              in root, so inject them where you need them. In an Arabic app, set
              the toast labels once at start-up.
            </p>
          }
          @case ('react') {
            <p>
              Using toasts? Wrap the app in <code>ToastProvider</code>, or
              <code>useToast()</code> throws.
              <code>useAlertDialog()</code> needs no provider: render the
              <code>dialog</code> it returns.
            </p>
          }
          @case ('html') {
            <p>
              The CSS package ships no JavaScript. Behaviour is yours to write:
              each component page lists the elements and attributes it needs.
              Open dialogs with <code>showModal()</code>, never
              <code>show()</code>.
            </p>
          }
        }
        <app-code-block [code]="appWide" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Step 6. Use a component</h2>
        <app-code-block [code]="first" />
        <p>
          Every component page shows each option live, with the code for your
          framework. Start with the
          <a routerLink="/components/button">button</a>.
        </p>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Step 7. Check that it works</h2>
        <p>
          Run the app and check each line. Stop at the first one that fails and
          find it in the table below.
        </p>
        <ol class="doc-list">
          <li>
            The text is in IBM Plex Sans (DevTools, Computed, Rendered fonts).
          </li>
          <li>The primary button is Enigma blue with white text.</li>
          <li>Pressing Tab to the button shows a focus ring around it.</li>
          <li>
            <code>data-theme="dark"</code> on <code>&lt;html&gt;</code> turns
            the page dark.
          </li>
          <li>
            <code>dir="rtl"</code> on <code>&lt;html&gt;</code> mirrors the
            layout.
          </li>
          @if (settings.framework() !== 'html') {
            <li>An open select shows its list right under the field.</li>
          }
        </ol>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2" id="gs-fix">When a check fails</h2>
        <div
          class="ui-table-wrap"
          tabindex="0"
          role="region"
          aria-labelledby="gs-fix"
        >
          <table class="ui-table">
            <thead>
              <tr>
                <th scope="col">What you see</th>
                <th scope="col">Cause and fix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">No styles at all</th>
                <td>
                  <code>ui.css</code> is not loaded. Redo step 3; with pnpm,
                  check that step 2 added <code>&#64;enigma-tech-lab/css</code>.
                </td>
              </tr>
              <tr>
                <th scope="row">System font instead of Plex</th>
                <td>
                  The font files return 404 (Network tab, filter
                  <code>woff2</code>). Keep <code>fonts</code> next to
                  <code>ui.css</code>.
                </td>
              </tr>
              <tr>
                <th scope="row">Components look wrong in places</th>
                <td>
                  A reset or your own CSS loads after <code>ui.css</code>, or
                  overrides a <code>.ui-*</code> class. Load it before, and
                  restyle through tokens only.
                </td>
              </tr>
              @if (settings.framework() === 'angular') {
                <tr>
                  <th scope="row">
                    A select list shows at the bottom of the page
                  </th>
                  <td>
                    <code>&#64;angular/cdk/overlay-prebuilt.css</code> is
                    missing from the global stylesheet (step 3).
                  </td>
                </tr>
              }
              @if (settings.framework() === 'react') {
                <tr>
                  <th scope="row">
                    "useToast() needs a &lt;ToastProvider&gt;"
                  </th>
                  <td>Wrap the app in <code>ToastProvider</code> (step 5).</td>
                </tr>
                <tr>
                  <th scope="row">Arrow keys go the wrong way in Arabic</th>
                  <td>Add <code>I18nProvider locale="ar"</code> (step 4).</td>
                </tr>
              }
              <tr>
                <th scope="row">Arabic shows in the Latin font</th>
                <td><code>lang="ar"</code> is missing (step 4).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Restyle only through the <code>--ui-*</code> tokens, set after
            <code>ui.css</code>. Never override a <code>.ui-*</code> class or
            the classes of the libraries underneath (<code>cdk-*</code>,
            <code>data-*</code>): they change without notice.
          </li>
          <li>
            Never copy <code>ui.css</code> into your project. Update the package
            instead, so fixes reach you.
          </li>
          <li>Never let colour carry meaning alone: an error also has text.</li>
          <li>
            In an Arabic app, translate every label the components show: close
            buttons, the toast region, pagination.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Re-brand for a client</h2>
        <p>
          Override the primary colours after the stylesheet. The "on" colour
          must reach 7:1 against its ground, and the focus colour 3:1 against
          the page, in both themes.
        </p>
        <app-code-block [text]="rebrand" caption="CSS" />
      </section>
    </app-page>
  `,
})
export class GettingStartedComponent {
  protected readonly settings = inject(DocsSettings);
  protected readonly frameworkLabel = computed(
    () => FRAMEWORKS.find((f) => f.id === this.settings.framework())?.label,
  );

  protected readonly install = {
    angular:
      'pnpm add @enigma-tech-lab/angular @enigma-tech-lab/css @angular/cdk@^22.2.0',
    react: 'pnpm add @enigma-tech-lab/react @enigma-tech-lab/css',
    html: 'pnpm add @enigma-tech-lab/css',
  };

  protected readonly styles = {
    angular: `/* src/styles.css: the global stylesheet, first lines */
@import '@enigma-tech-lab/css/ui.css';
@import '@angular/cdk/overlay-prebuilt.css';

/* your own styles below */`,
    react: `// main.tsx: before every other CSS import
import '@enigma-tech-lab/css/ui.css';
import './app.css';`,
    html: `<!-- with a bundler, in your main CSS file: @import '@enigma-tech-lab/css/ui.css'; -->
<link rel="stylesheet" href="/node_modules/@enigma-tech-lab/css/ui.css" />
<link rel="stylesheet" href="/app.css" />`,
  };

  protected readonly htmlTag = `<!-- English -->
<html lang="en" dir="ltr">

<!-- Arabic -->
<html lang="ar" dir="rtl">`;

  protected readonly i18n = `import { I18nProvider } from 'react-aria-components';

<I18nProvider locale="ar">
  <App />
</I18nProvider>`;

  protected readonly appWide = {
    angular: `// app.component.ts, Arabic apps only
import { inject } from '@angular/core';
import { UiToast } from '@enigma-tech-lab/angular';

constructor() {
  inject(UiToast).labels.set({ region: 'الإشعارات', close: 'إخفاء' });
}`,
    react: `// main.tsx
import { ToastProvider } from '@enigma-tech-lab/react';

createRoot(root).render(
  <ToastProvider label="Notifications" closeLabel="Dismiss">
    <App />
  </ToastProvider>,
);`,
    html: `<button class="ui-button ui-button--primary ui-button--md" type="button"
  onclick="document.getElementById('edit').showModal()">Edit</button>
<dialog class="ui-dialog" closedby="any" id="edit" aria-labelledby="edit-title">…</dialog>`,
  };

  protected readonly first = {
    react: `import { Button } from '@enigma-tech-lab/react';

export function SaveBar() {
  return <Button>Save</Button>;
}`,
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
