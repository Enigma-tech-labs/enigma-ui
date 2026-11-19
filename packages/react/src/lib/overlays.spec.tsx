import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { Button } from './button.js';
import { Accordion, AccordionItem, Popover, Tooltip } from './overlays.js';

describe('Accordion', () => {
  function renderFaq() {
    const mounted = vi.fn();
    function Invoices() {
      useEffect(() => mounted(), []);
      return <p>Loaded</p>;
    }
    const { container } = render(
      <Accordion single>
        <AccordionItem heading="Can I change my order?" defaultOpen>
          Yes, until it ships.
        </AccordionItem>
        <AccordionItem heading="How do refunds work?">Within 14 days.</AccordionItem>
        <AccordionItem heading="Invoices" lazy>
          <Invoices />
        </AccordionItem>
        <AccordionItem heading="Archived" disabled>
          Old orders.
        </AccordionItem>
      </Accordion>,
    );
    return { items: container.querySelectorAll('details'), mounted };
  }

  it('keeps one section open in single mode, closing the other after its motion', async () => {
    const { items } = renderFaq();
    expect(items[0].open).toBe(true);
    expect(items[0].querySelector('summary')?.textContent).toBe(
      'Can I change my order?',
    );
    act(() => {
      items[1].open = true;
      items[1].dispatchEvent(new Event('toggle'));
    });
    await waitFor(() => expect(items[0].open).toBe(false));
    expect(items[1].open).toBe(true);
  });

  it('mounts lazy children on first open and keeps them', async () => {
    const { items, mounted } = renderFaq();
    expect(mounted).not.toHaveBeenCalled();
    act(() => {
      items[2].open = true;
      items[2].dispatchEvent(new Event('toggle'));
    });
    expect(screen.getByText('Loaded')).toBeTruthy();
    await userEvent.click(items[2].querySelector('summary')!);
    await waitFor(() => expect(items[2].open).toBe(false));
    expect(screen.getByText('Loaded')).toBeTruthy();
    expect(mounted).toHaveBeenCalledTimes(1);
  });

  it('does not open a disabled section, and arrows move between headings', async () => {
    const { items } = renderFaq();
    const summaries = [...items].map((d) => d.querySelector('summary')!);
    expect(summaries[3].getAttribute('aria-disabled')).toBe('true');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    summaries[3].dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);

    summaries[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(summaries[1]);
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(summaries[3]);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(summaries[0]);
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
