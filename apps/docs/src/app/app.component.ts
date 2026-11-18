import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  DocsSettings,
  FRAMEWORKS,
  THEMES,
  type Framework,
  type Theme,
} from './shared/docs-settings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <a class="doc-skip" href="#main">Skip to content</a>
    <header class="doc-header">
      <a class="doc-brand" routerLink="/">
        <img
          class="doc-logo-light"
          src="lockup.svg"
          alt="Enigma Technology Lab"
        />
        <img
          class="doc-logo-dark"
          src="lockup-on-ink.svg"
          alt="Enigma Technology Lab"
        />
        <span class="doc-brand__product">UI</span>
      </a>
      <div class="doc-settings">
        <fieldset class="doc-choice">
          <legend class="ui-label">Framework</legend>
          @for (f of frameworks; track f.id) {
            <label>
              <input
                type="radio"
                name="framework"
                [value]="f.id"
                [checked]="settings.framework() === f.id"
                (change)="setFramework(f.id)"
              />
              {{ f.label }}
            </label>
          }
        </fieldset>
        <fieldset class="doc-choice">
          <legend class="ui-label">Theme</legend>
          @for (t of themes; track t.id) {
            <label>
              <input
                type="radio"
                name="theme"
                [value]="t.id"
                [checked]="settings.theme() === t.id"
                (change)="setTheme(t.id)"
              />
              {{ t.label }}
            </label>
          }
        </fieldset>
      </div>
    </header>
    <div class="doc-layout">
      <nav class="doc-nav" aria-label="Docs">
        @for (group of nav; track group.title) {
          <h2 class="ui-label doc-nav__title">{{ group.title }}</h2>
          <ul>
            @for (link of group.links; track link.path) {
              <li>
                <a
                  [routerLink]="link.path"
                  routerLinkActive
                  ariaCurrentWhenActive="page"
                  [routerLinkActiveOptions]="{ exact: true }"
                  >{{ link.label }}</a
                >
              </li>
            }
          </ul>
        }
      </nav>
      <main class="doc-main" id="main" tabindex="-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  protected readonly settings = inject(DocsSettings);
  protected readonly frameworks = FRAMEWORKS;
  protected readonly themes = THEMES;
  protected readonly nav = [
    { title: 'Start', links: [{ path: '/', label: 'Getting started' }] },
    {
      title: 'Foundations',
      links: [
        { path: '/foundations/colour', label: 'Colour' },
        { path: '/foundations/type', label: 'Type' },
        { path: '/foundations/space', label: 'Space and shape' },
      ],
    },
    {
      title: 'Forms',
      links: [
        { path: '/components/button', label: 'Button' },
        { path: '/components/checkbox', label: 'Checkbox' },
        { path: '/components/combobox', label: 'Combobox' },
        { path: '/components/date-field', label: 'Date and number' },
        { path: '/components/fieldset', label: 'Fieldset' },
        { path: '/components/file-field', label: 'File field' },
        { path: '/components/radio-group', label: 'Radio group' },
        { path: '/components/select', label: 'Select' },
        { path: '/components/switch', label: 'Switch' },
        { path: '/components/text-field', label: 'Text field' },
        { path: '/components/textarea', label: 'Textarea' },
      ],
    },
    {
      title: 'Feedback',
      links: [
        { path: '/components/alert', label: 'Alert' },
        { path: '/components/badge', label: 'Badge' },
        { path: '/components/progress', label: 'Progress' },
        { path: '/components/skeleton', label: 'Skeleton' },
        { path: '/components/spinner', label: 'Spinner' },
        { path: '/components/toast', label: 'Toast' },
      ],
    },
    {
      title: 'Navigation',
      links: [
        { path: '/components/breadcrumbs', label: 'Breadcrumbs' },
        { path: '/components/menu', label: 'Menu' },
        { path: '/components/nav', label: 'Navigation' },
        { path: '/components/pagination', label: 'Pagination' },
        { path: '/components/tabs', label: 'Tabs' },
      ],
    },
    {
      title: 'Overlays',
      links: [
        { path: '/components/alert-dialog', label: 'Alert dialog' },
        { path: '/components/bottom-sheet', label: 'Bottom sheet' },
        { path: '/components/dialog', label: 'Dialog' },
        { path: '/components/drawer', label: 'Drawer' },
        { path: '/components/popover', label: 'Popover' },
        { path: '/components/tooltip', label: 'Tooltip' },
      ],
    },
    {
      title: 'Content',
      links: [
        { path: '/components/accordion', label: 'Accordion' },
        { path: '/components/avatar', label: 'Avatar' },
        { path: '/components/card', label: 'Card' },
        { path: '/components/data-table', label: 'Data table' },
        { path: '/components/divider', label: 'Divider' },
        { path: '/components/empty-state', label: 'Empty state' },
        { path: '/components/stat', label: 'Stat' },
        { path: '/components/tag', label: 'Tag' },
      ],
    },
  ];

  protected setFramework(id: Framework): void {
    this.settings.framework.set(id);
  }

  protected setTheme(id: Theme): void {
    this.settings.theme.set(id);
  }
}
