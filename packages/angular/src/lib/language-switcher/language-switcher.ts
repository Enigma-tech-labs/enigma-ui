import { CdkMenu, CdkMenuItemRadio, CdkMenuTrigger } from '@angular/cdk/menu';
import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { ButtonComponent, type ButtonSize } from '../button/button.component';

export interface Language {
  /** The language tag, such as 'en' or 'ar'. */
  code: string;
  /** The language's name in that language: 'English', 'عربي'. */
  name: string;
}

/**
 * Switches the interface language. With two languages it is one button that names the
 * other one in that language (a reader of it can find it); with more it opens a menu with
 * the current one checked. Each name carries its `lang`, so screen readers say it right.
 * Set `<html lang dir>` yourself when `current` changes.
 *
 * ```html
 * <ui-language-switcher [languages]="languages" [(current)]="language" />
 * ```
 */
@Component({
  selector: 'ui-language-switcher',
  imports: [
    ButtonComponent,
    CdkMenu,
    CdkMenuItemRadio,
    CdkMenuTrigger,
    NgTemplateOutlet,
  ],
  template: `
    <ng-template #globe>
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <circle cx="8" cy="8" r="6.25" />
        <path
          d="M1.75 8h12.5M8 1.75C6.1 3.75 5.25 5.75 5.25 8S6.1 12.25 8 14.25M8 1.75c1.9 2 2.75 4 2.75 6.25S9.9 12.25 8 14.25"
        />
      </svg>
    </ng-template>
    @if (other(); as other) {
      <button
        ui-button
        variant="secondary"
        type="button"
        [size]="size()"
        [attr.lang]="other.code"
        (click)="current.set(other.code)"
      >
        <ng-container [ngTemplateOutlet]="globe" />
        {{ other.name }}
      </button>
    } @else {
      <button
        ui-button
        variant="secondary"
        type="button"
        [size]="size()"
        [cdkMenuTriggerFor]="list"
      >
        <ng-container [ngTemplateOutlet]="globe" />
        <span class="ui-visually-hidden">{{ label() }}: </span>
        <span [attr.lang]="active()?.code">{{ active()?.name }}</span>
      </button>
      <ng-template #list>
        <div cdkMenu class="ui-menu" [attr.aria-label]="label()">
          @for (language of languages(); track language.code) {
            <button
              cdkMenuItemRadio
              class="ui-menu__item"
              type="button"
              [cdkMenuItemChecked]="language.code === current()"
              [attr.lang]="language.code"
              (cdkMenuItemTriggered)="current.set(language.code)"
            >
              {{ language.name }}
            </button>
          }
        </div>
      </ng-template>
    }
  `,
})
export class LanguageSwitcherComponent {
  /** The languages, each named in itself. */
  readonly languages = input.required<readonly Language[]>();
  /** The current language's code; two-way with `[(current)]`. */
  readonly current = model.required<string>();
  /** The menu's name, for three or more languages; translate it. */
  readonly label = input('Language');
  readonly size = input<ButtonSize>('md');

  protected readonly other = computed(() => {
    const languages = this.languages();
    return languages.length === 2
      ? languages.find((l) => l.code !== this.current())
      : undefined;
  });
  protected readonly active = computed(() =>
    this.languages().find((l) => l.code === this.current()),
  );
}
