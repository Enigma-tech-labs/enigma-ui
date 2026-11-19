import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button.js';
import { Accordion, AccordionItem, Popover, Tooltip } from './overlays.js';

describe('Accordion', () => {
  it('renders native details that share a name in single mode', () => {
    const { container } = render(
      <Accordion single>
        <AccordionItem heading="Can I change my order?" open>
          Yes, until it ships.
        </AccordionItem>
        <AccordionItem heading="How do refunds work?">
          Within 14 days.
        </AccordionItem>
      </Accordion>,
    );
    const items = container.querySelectorAll('details');
    expect(items[0].open).toBe(true);
    expect(items[0].querySelector('summary')?.textContent).toBe(
      'Can I change my order?',
    );
    expect(items[0].getAttribute('name')).toBeTruthy();
    expect(items[0].getAttribute('name')).toBe(items[1].getAttribute('name'));
  });
});

describe('Tooltip', () => {
  it('shows on keyboard focus and describes the button', async () => {
    render(
      <Tooltip text="Copy link">
        <Button variant="ghost" aria-label="Copy">
          ⧉
        </Button>
      </Tooltip>,
    );
    await userEvent.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toBe('Copy link');
    expect(
      screen.getByRole('button', { name: 'Copy' }).getAttribute('aria-describedby'),
    ).toBe(tooltip.id);
  });
});

describe('Popover', () => {
  it('opens a dialog named by its button and closes on Escape', async () => {
    render(
      <Popover trigger={<Button variant="secondary">Delivery fee</Button>}>
        <p>Free over EGP 500.</p>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Delivery fee' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Delivery fee' });
    expect(dialog.textContent).toContain('Free over EGP 500.');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
