import { render, screen } from '@testing-library/react';
import { Stepper } from './stepper.js';

describe('Stepper', () => {
  it('marks done steps in words and the current one with aria-current', () => {
    render(
      <Stepper
        label="Checkout"
        steps={['Cart', 'Address', 'Pay']}
        current={1}
      />,
    );
    const items = screen
      .getByRole('list', { name: 'Checkout' })
      .querySelectorAll('li');
    expect(items[0].textContent).toBe('Done: Cart');
    expect(items[1].getAttribute('aria-current')).toBe('step');
    expect(items[2].className).toBe('ui-steps__item');
    expect(items[2].textContent).toBe('3Pay');
  });
});
