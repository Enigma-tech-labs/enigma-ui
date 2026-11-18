import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TextFieldComponent } from './text-field.component';

const meta: Meta<TextFieldComponent> = {
  title: 'Text field',
  component: TextFieldComponent,
  decorators: [moduleMetadata({ imports: [ReactiveFormsModule] })],
  args: {
    label: 'Email',
    type: 'email',
    hint: 'We only use it to send receipts.',
    error: '',
  },
  render: (args) => ({
    props: { ...args, control: new FormControl('', { nonNullable: true }) },
    template: `
      <div style="max-inline-size: 24rem">
        <ui-text-field [label]="label" [type]="type" [hint]="hint" [error]="error" [formControl]="control" autocomplete="email" />
      </div>`,
  }),
};
export default meta;

type Story = StoryObj<TextFieldComponent>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Enter an email address like name@example.com.' },
};

export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl({ value: 'name@example.com', disabled: true }),
    },
    template: `<div style="max-inline-size: 24rem"><ui-text-field [label]="label" [formControl]="control" /></div>`,
  }),
};
