import { Component, signal } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-motion',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="Motion"
      lead="Motion shows where something came from and where it went: a dialog rising, a drawer sliding in, a switch moving. Nothing moves for decoration, nothing takes longer than 200ms, and with reduced motion turned on nothing moves at all."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Durations</h2>
        <button
          type="button"
          class="ui-button ui-button--secondary ui-button--md doc-motion__play"
          [attr.aria-pressed]="moved()"
          (click)="moved.set(!moved())"
        >
          Play
        </button>
        <div class="doc-motion" [class.doc-motion--moved]="moved()">
          @for (d of durations; track d.token) {
            <div class="doc-motion__row">
              <code>{{ d.token }}</code>
              <span>{{ d.value }}</span>
              <span class="doc-motion__track">
                <span
                  class="doc-motion__dot"
                  [style.transition-duration]="'var(' + d.token + ')'"
                ></span>
              </span>
              <span class="doc-muted">{{ d.use }}</span>
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Easing</h2>
        <p>
          One curve, <code>--ui-ease</code> (<code
            >cubic-bezier(0.2, 0.8, 0.2, 1)</code
          >): quick to start and soft to land, so the motion is felt at once and
          the result reads still. Loading loops (spinner, progress band,
          skeleton) run linear or ease-in-out at their own slow speed.
        </p>
        <app-code-block [text]="usage" caption="CSS" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Animate opacity, transforms and colour only; never size or place
            (width, height, margins, top), which shifts the page around.
          </li>
          <li>
            Reduced motion turns off every animation and transition in the kit.
            The spinner becomes a still, half-drawn ring and the progress band
            stops, so "busy" is still shown.
          </li>
          <li>
            Closing never waits: a dialog leaves at once, so the next action is
            never blocked by an animation.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class MotionComponent {
  protected readonly moved = signal(false);

  protected readonly durations = [
    {
      token: '--ui-duration-fast',
      value: '120ms',
      use: 'A change in place: the switch knob.',
    },
    {
      token: '--ui-duration',
      value: '160ms',
      use: 'Fades: dialog, backdrop, accordion arrow.',
    },
    {
      token: '--ui-duration-slow',
      value: '200ms',
      use: 'Panels that travel: drawer, sheet, toast.',
    },
  ];

  protected readonly usage = `.my-panel {
  animation: my-panel-in var(--ui-duration-slow) var(--ui-ease);
}
@media (prefers-reduced-motion: reduce) {
  .my-panel {
    animation: none;
  }
}`;
}
