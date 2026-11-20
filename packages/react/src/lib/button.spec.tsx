import { render, screen } from '@testing-library/react';
import { Button } from './button.js';

describe('Button', () => {
  it('renders a native button with the variant and size classes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toBe('ui-button ui-button--danger ui-button--lg');
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it('disables the button, marks it busy and shows a spinner while loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveProperty('disabled', true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(
      button.querySelector('.ui-spinner[aria-hidden="true"]'),
    ).not.toBeNull();
  });
});
