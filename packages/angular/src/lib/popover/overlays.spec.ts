import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AccordionComponent,
  AccordionItemComponent,
} from '../accordion/accordion.component';
import { ButtonComponent } from '../button/button.component';
import { TooltipDirective } from '../tooltip/tooltip';
import { PopoverTriggerDirective } from './popover';

@Component({
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    TooltipDirective,
    PopoverTriggerDirective,
    ButtonComponent,
  ],
  template: `
    <ui-accordion single>
      <details ui-accordion-item heading="Can I change my order?" open>
        <p>Yes, until it ships.</p>
      </details>
      <details ui-accordion-item heading="How do refunds work?">
        <p>Within 14 days.</p>
      </details>
    </ui-accordion>
    <button ui-button data-testid="copy" uiTooltip="Copy link">Copy</button>
    <button ui-button data-testid="fee" [uiPopoverTrigger]="info">Fee</button>
    <ng-template #info>
      <p>Free over EGP 500.</p>
      <button ui-button data-testid="inside">Got it</button>
    </ng-template>
  `,
})
class HostComponent {}

describe('accordion, tooltip and popover', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const get = (id: string) =>
      document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
    return { fixture, root, get };
  }

  it('renders native details that share a name in single mode', async () => {
    const { root } = await setup();
    const items = root.querySelectorAll('details');
    expect(items[0].open).toBe(true);
    expect(items[1].open).toBe(false);
    expect(items[0].querySelector('summary')?.textContent).toBe(
      'Can I change my order?',
    );
    expect(items[0].getAttribute('name')).toBeTruthy();
    expect(items[0].getAttribute('name')).toBe(items[1].getAttribute('name'));
  });

  it('describes the control with the tooltip and shows it on focus until Escape', async () => {
    const { fixture, get } = await setup();
    const copy = get('copy');
    const description = document.getElementById(
      copy.getAttribute('aria-describedby')!,
    );
    expect(description?.textContent).toBe('Copy link');

    copy.dispatchEvent(new FocusEvent('focus'));
    await fixture.whenStable();
    const tooltip = document.querySelector('[role="tooltip"]');
    expect(tooltip?.textContent).toBe('Copy link');

    copy.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('opens the popover named by its button, moves focus in, and closes on Escape', async () => {
    const { fixture, get } = await setup();
    const fee = get('fee');
    expect(fee.getAttribute('aria-haspopup')).toBe('dialog');
    fee.click();
    await fixture.whenStable();

    const panel = document.querySelector<HTMLElement>('ui-popover')!;
    expect(fee.getAttribute('aria-expanded')).toBe('true');
    expect(fee.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-labelledby')).toBe(fee.id);
    expect(document.activeElement).toBe(get('inside'));

    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(document.querySelector('ui-popover')).toBeNull();
    expect(fee.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(fee);
  });
});
