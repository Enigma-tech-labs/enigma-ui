import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepperComponent } from './stepper.component';

@Component({
  imports: [StepperComponent],
  template: `<ui-stepper
    label="Checkout"
    [steps]="['Cart', 'Address', 'Pay']"
    [current]="1"
  />`,
})
class HostComponent {}

describe('StepperComponent', () => {
  it('marks done steps in words and the current one with aria-current', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const list: HTMLElement = fixture.nativeElement.querySelector('ol');
    expect(list.getAttribute('aria-label')).toBe('Checkout');
    const items = list.querySelectorAll('li');
    expect(items[0].className).toContain('ui-steps__item--done');
    expect(items[0].textContent!.replace(/\s+/g, ' ').trim()).toBe(
      'Done: Cart',
    );
    expect(items[1].getAttribute('aria-current')).toBe('step');
    expect(items[2].getAttribute('aria-current')).toBeNull();
  });
});
