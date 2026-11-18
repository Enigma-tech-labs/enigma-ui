import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button/button.component';
import { SelectComponent, type SelectOption } from './select/select.component';
import { TextFieldComponent } from './text-field/text-field.component';

/** The same components in Arabic, right to left, inside one Reactive Form. */
@Component({
  selector: 'ui-arabic-form',
  imports: [
    ReactiveFormsModule,
    TextFieldComponent,
    SelectComponent,
    ButtonComponent,
  ],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="submitted.set(true)"
      style="display: grid; gap: 1rem; max-inline-size: 24rem"
    >
      <ui-text-field
        label="الاسم بالكامل"
        formControlName="name"
        autocomplete="name"
        [error]="
          submitted() && form.controls.name.invalid ? 'اكتب اسمك' : undefined
        "
      />
      <ui-text-field
        label="البريد الإلكتروني"
        type="email"
        formControlName="email"
        autocomplete="email"
        hint="نرسل عليه الفاتورة فقط"
        [error]="
          submitted() && form.controls.email.invalid
            ? 'اكتب بريدًا إلكترونيًا صحيحًا'
            : undefined
        "
      />
      <ui-select
        label="المدينة"
        placeholder="اختر مدينة"
        [options]="cities"
        formControlName="city"
        [error]="
          submitted() && form.controls.city.invalid ? 'اختر المدينة' : undefined
        "
      />
      <div style="display: flex; gap: 0.75rem">
        <button ui-button type="submit">حفظ</button>
        <button ui-button variant="secondary" type="reset">إلغاء</button>
      </div>
    </form>
  `,
})
class ArabicForm {
  protected readonly submitted = signal(false);
  protected readonly cities: SelectOption<string>[] = [
    { value: 'cai', label: 'القاهرة' },
    { value: 'alx', label: 'الإسكندرية' },
    { value: 'lxr', label: 'الأقصر' },
  ];
  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    city: new FormControl<string | null>(null, Validators.required),
  });
}

const meta: Meta<ArabicForm> = {
  title: 'Right to left/Arabic form',
  component: ArabicForm,
  parameters: { dir: 'rtl' },
};
export default meta;

export const Form: StoryObj<ArabicForm> = {};
