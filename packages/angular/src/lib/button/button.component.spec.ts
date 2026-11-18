import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `<button
    ui-button
    [variant]="variant()"
    [loading]="loading()"
    data-testid="btn"
  >
    Save
  </button>`,
})
class HostComponent {
  readonly variant = signal<'primary' | 'danger'>('primary');
  readonly loading = signal(false);
}

describe('ButtonComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="btn"]',
    );
    return { fixture, button };
  }

  it('applies the variant and size classes to the native button', async () => {
    const { fixture, button } = await setup();
    expect([...button.classList].sort()).toEqual([
      'ui-button',
      'ui-button--md',
      'ui-button--primary',
    ]);

    fixture.componentInstance.variant.set('danger');
    await fixture.whenStable();
    expect(button.classList).toContain('ui-button--danger');
  });

  it('disables the button and marks it busy while loading', async () => {
    const { fixture, button } = await setup();
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute('aria-busy')).toBe(false);

    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.ui-spinner')).not.toBeNull();
    expect(button.textContent?.trim()).toBe('Save');
  });
});
