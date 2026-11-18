import { Component } from '@angular/core';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-space',
  imports: [PageComponent],
  template: `
    <app-page
      title="Space and shape"
      lead="One spacing scale, one radius and one shadow. Small steps for inside a control, large steps between sections."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Spacing</h2>
        <div class="doc-space">
          @for (s of space; track s.token) {
            <div class="doc-space__row">
              <code>{{ s.token }}</code>
              <span>{{ s.size }}</span>
              <span
                class="doc-space__bar"
                [style.inline-size]="'var(' + s.token + ')'"
              ></span>
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Shape and depth</h2>
        <div class="doc-swatches">
          @for (s of shapes; track s.token) {
            <div class="doc-swatch">
              <div
                class="doc-swatch__chip doc-swatch__chip--surface"
                [style]="s.style"
              ></div>
              <strong>{{ s.name }}</strong>
              <code>{{ s.token }}</code>
              <span class="doc-muted">{{ s.use }}</span>
            </div>
          }
        </div>
      </section>
    </app-page>
  `,
})
export class SpaceComponent {
  protected readonly space = [
    { token: '--ui-space-1', size: '0.25rem' },
    { token: '--ui-space-2', size: '0.5rem' },
    { token: '--ui-space-3', size: '0.75rem' },
    { token: '--ui-space-4', size: '1rem' },
    { token: '--ui-space-6', size: '1.5rem' },
    { token: '--ui-space-8', size: '2rem' },
    { token: '--ui-space-12', size: '3rem' },
  ];

  protected readonly shapes = [
    {
      name: 'Radius',
      token: '--ui-radius',
      style: 'border-radius: var(--ui-radius)',
      use: '0.5rem. Controls; dialogs use twice this.',
    },
    {
      name: 'Shadow',
      token: '--ui-shadow',
      style: 'box-shadow: var(--ui-shadow)',
      use: 'Floating layers only: lists, menus, dialogs.',
    },
    {
      name: 'Control height',
      token: '--ui-control-height',
      style: 'block-size: var(--ui-control-height)',
      use: '2.75rem, 44 pixels: the smallest touch target.',
    },
  ];
}
