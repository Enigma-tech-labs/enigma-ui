import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SelectComponent, type SelectOption } from './select.component';

const cities: SelectOption<string>[] = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
  { value: 'gza', label: 'Giza' },
  { value: 'lxr', label: 'Luxor' },
  { value: 'asw', label: 'Aswan (no delivery)', disabled: true },
];

const meta: Meta<SelectComponent<string>> = {
  title: 'Select',
  component: SelectComponent,
  decorators: [moduleMetadata({ imports: [ReactiveFormsModule] })],
  args: {
    label: 'City',
    placeholder: 'Choose a city',
    options: cities,
    error: '',
  },
  render: (args) => ({
    props: { ...args, control: new FormControl<string | null>(null) },
    template: `
      <div style="max-inline-size: 24rem">
        <ui-select [label]="label" [placeholder]="placeholder" [options]="options" [error]="error" [formControl]="control" />
        <p>Value: {{ control.value ?? 'none' }}</p>
      </div>`,
  }),
};
export default meta;

type Story = StoryObj<SelectComponent<string>>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Choose the city we deliver to.' },
};
