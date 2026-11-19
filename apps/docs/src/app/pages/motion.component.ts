import { Component, computed, signal } from '@angular/core';
import type { FrameworkCode } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

const durations = [
  ['--ui-duration-fast', '120ms', 'A change in place: the switch knob.'],
  ['--ui-duration', '160ms', 'Fades: dialog, backdrop, accordion arrow.'],
  ['--ui-duration-slow', '200ms', 'Panels that travel: drawer, sheet, toast.'],
].map(([token, value, use]) => ({ token, value, use }));

@Component({
  selector: 'app-motion',
  imports: [
    PageComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Motion"
      lead="Motion shows where something came from. Nothing over 200ms, nothing with reduced motion on."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Tokens</h2>
        <p>Three durations and one curve, quick to start and soft to land.</p>
        <app-token-table label="Motion tokens" [rows]="rows" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the durations</h2>
        <p>Pick a token, then press Play: all three move at that speed.</p>
        <app-step
          label="Duration"
          [max]="durations.length - 1"
          [valuetext]="duration().token + ', ' + duration().value"
          [(value)]="index"
        >
          <code>{{ duration().token }}</code> · {{ duration().value }}
        </app-step>

        <app-example
          title="Switch, panel and fade"
          [description]="duration().use"
          [code]="demoCode()"
        >
          <div
            class="doc-motion-demo"
            [class.doc-motion-demo--on]="moved()"
            [style.--doc-duration]="'var(' + duration().token + ')'"
          >
            <button
              type="button"
              class="ui-button ui-button--primary"
              [attr.aria-pressed]="moved()"
              (click)="moved.set(!moved())"
            >
              Play
            </button>
            <span class="doc-motion-demo__switch" aria-hidden="true">
              <span class="doc-motion-demo__knob"></span>
            </span>
            <span class="doc-motion-demo__track" aria-hidden="true">
              <span class="doc-motion-demo__panel">Panel</span>
            </span>
            <span class="doc-motion-demo__fade doc-block" aria-hidden="true"
              >Fade</span
            >
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Animate opacity, transform and colour; never size or position.
          </li>
          <li>Reduced motion stops everything; the spinner holds still.</li>
          <li>Closing never waits for an animation.</li>
        </ul>
      </section>
    </app-page>
  `,
})
export class MotionComponent {
  protected readonly durations = durations;
  protected readonly rows: TokenRow[] = [
    ...durations,
    {
      token: '--ui-ease',
      value: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      use: 'Every transition. Loading loops run linear at their own speed.',
    },
  ];

  protected readonly moved = signal(false);
  /** Starts at --ui-duration. */
  protected readonly index = signal(1);
  protected readonly duration = computed(() => durations[this.index()]);
  protected readonly demoCode = computed((): FrameworkCode => {
    const css = `.my-panel {
  transition: translate var(${this.duration().token}) var(--ui-ease);
}
@media (prefers-reduced-motion: reduce) {
  .my-panel {
    transition: none;
  }
}`;
    return { angular: css, react: css, html: css };
  });
}
