import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Button',
  component: ButtonComponent,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { variant: 'primary', size: 'md', loading: false, disabled: false },
  render: (args) => ({
    props: args,
    template: `<button ui-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">Save changes</button>`,
  }),
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem">
        <button ui-button>Primary</button>
        <button ui-button variant="secondary">Secondary</button>
        <button ui-button variant="ghost">Ghost</button>
        <button ui-button variant="danger">Delete</button>
      </div>`,
  }),
};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };
