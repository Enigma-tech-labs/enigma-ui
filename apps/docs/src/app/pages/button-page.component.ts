import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@enigma-tech-lab/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-button-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Button"
      lead="Styles the native button, so it keeps everything the browser gives a button: focus, Enter and Space, form submit. Four variants and three sizes."
      [usage]="usage"
    >
      <app-example
        title="Variants"
        description="One primary action per screen. Danger is for actions that destroy something."
        [code]="variants"
      >
        <button ui-button>Save</button>
        <button ui-button variant="secondary">Cancel</button>
        <button ui-button variant="ghost">Skip</button>
        <button ui-button variant="danger">Delete</button>
      </app-example>

      <app-example
        title="Sizes"
        description="Even the small size stays 44 pixels high, the smallest comfortable touch target."
        [code]="sizes"
      >
        <button ui-button size="sm">Small</button>
        <button ui-button>Medium</button>
        <button ui-button size="lg">Large</button>
      </app-example>

      <app-example
        title="Loading"
        description="Disables the button, marks it busy for screen readers and shows a spinner."
        [code]="loading"
      >
        <button ui-button [loading]="saving()" (click)="save()">
          Save changes
        </button>
      </app-example>

      <app-example title="Disabled" [code]="disabled">
        <button ui-button disabled>Save</button>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <button ui-button>حفظ</button>
        <button ui-button variant="secondary">إلغاء</button>
      </app-example>

      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ButtonPageComponent {
  protected readonly saving = signal(false);

  protected save(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }

  protected readonly usage = {
    react: `import { Button } from '@enigma-tech-lab/react';`,
    angular: `import { ButtonComponent } from '@enigma-tech-lab/angular';`,
    html: `<button class="ui-button ui-button--primary ui-button--md">Save</button>`,
  };

  protected readonly variants = {
    react: `<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Delete</Button>`,
    angular: `<button ui-button>Save</button>
<button ui-button variant="secondary">Cancel</button>
<button ui-button variant="ghost">Skip</button>
<button ui-button variant="danger">Delete</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--md">Save</button>
<button class="ui-button ui-button--secondary ui-button--md">Cancel</button>
<button class="ui-button ui-button--ghost ui-button--md">Skip</button>
<button class="ui-button ui-button--danger ui-button--md">Delete</button>`,
  };

  protected readonly sizes = {
    react: `<Button size="sm">Small</Button>
<Button>Medium</Button>
<Button size="lg">Large</Button>`,
    angular: `<button ui-button size="sm">Small</button>
<button ui-button>Medium</button>
<button ui-button size="lg">Large</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--sm">Small</button>
<button class="ui-button ui-button--primary ui-button--md">Medium</button>
<button class="ui-button ui-button--primary ui-button--lg">Large</button>`,
  };

  protected readonly loading = {
    react: `<Button loading={saving} onClick={save}>
  Save changes
</Button>`,
    angular: `<button ui-button [loading]="saving()" (click)="save()">Save changes</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--md" disabled aria-busy="true">
  <span class="ui-spinner" aria-hidden="true"></span>
  Save changes
</button>`,
  };

  protected readonly disabled = {
    react: `<Button disabled>Save</Button>`,
    angular: `<button ui-button disabled>Save</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--md" disabled>Save</button>`,
  };

  protected readonly arabic = {
    react: `{/* dir="rtl" on the page or any ancestor */}
<Button>حفظ</Button>
<Button variant="secondary">إلغاء</Button>`,
    angular: `<!-- dir="rtl" on the page or any ancestor -->
<button ui-button>حفظ</button>
<button ui-button variant="secondary">إلغاء</button>`,
    html: `<!-- dir="rtl" on the page or any ancestor -->
<button class="ui-button ui-button--primary ui-button--md">حفظ</button>
<button class="ui-button ui-button--secondary ui-button--md">إلغاء</button>`,
  };

  protected readonly api = {
    react: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        default: "'primary'",
        description: 'How much the button stands out.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Padding and text size. Height never drops under 44 pixels.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Disables the button, sets aria-busy and shows a spinner.',
      },
      {
        name: '...props',
        type: 'button props',
        description:
          'Every native button prop: type, onClick, disabled, form, ref.',
      },
    ],
    angular: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        default: "'primary'",
        description: 'How much the button stands out.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Padding and text size. Height never drops under 44 pixels.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Disables the button, sets aria-busy and shows a spinner.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the button.',
      },
    ],
    html: [
      {
        name: 'ui-button',
        type: 'class',
        description: 'Required on every button.',
      },
      {
        name: 'ui-button--primary | --secondary | --ghost | --danger',
        type: 'class',
        description: 'The variant. Use exactly one.',
      },
      {
        name: 'ui-button--sm | --md | --lg',
        type: 'class',
        description: 'The size. Use exactly one.',
      },
      {
        name: 'aria-busy="true" + disabled',
        type: 'attribute',
        description:
          'Loading state; add a span.ui-spinner with aria-hidden="true" before the label.',
      },
    ],
  };
}
