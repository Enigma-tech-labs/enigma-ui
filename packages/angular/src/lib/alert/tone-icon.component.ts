import { Component, input } from '@angular/core';
import type { AlertTone } from '../dialog/alert-dialog';

/** The tone's icon: an i, a tick, a warning sign or a cross. Shape tells the tones apart, not only colour. */
@Component({
  selector: 'svg[ui-tone-icon]',
  host: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  },
  template: `
    @switch (tone()) {
      @case ('success') {
        <svg:path d="M5 12.5l4.5 4.5L19 7.5" />
      }
      @case ('warning') {
        <svg:path d="M12 4l9 16H3z" />
        <svg:path d="M12 10v4M12 17h.01" />
      }
      @case ('danger') {
        <svg:circle cx="12" cy="12" r="9" />
        <svg:path d="M9 9l6 6M15 9l-6 6" />
      }
      @default {
        <svg:circle cx="12" cy="12" r="9" />
        <svg:path d="M12 11v5M12 8h.01" />
      }
    }
  `,
})
export class ToneIconComponent {
  readonly tone = input<AlertTone>('info');
}
