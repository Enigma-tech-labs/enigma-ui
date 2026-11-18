import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

/** Frameworks the docs show code for. Add 'vue' here when its package exists. */
export const FRAMEWORKS = [
  { id: 'angular', label: 'Angular' },
  { id: 'react', label: 'React' },
  { id: 'html', label: 'HTML + CSS' },
] as const;
export type Framework = (typeof FRAMEWORKS)[number]['id'];

export const THEMES = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
] as const;
export type Theme = (typeof THEMES)[number]['id'];

/** Code for each framework; a missing framework shows a "not yet" note. */
export type FrameworkCode = Partial<Record<Framework, string>>;

function read<T extends string>(
  key: string,
  allowed: readonly { id: T }[],
  fallback: T,
): T {
  try {
    const value = localStorage.getItem(key);
    return allowed.some((a) => a.id === value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private window): the choice lasts for this visit only.
  }
}

/** The reader's framework and theme, remembered in this browser. */
@Injectable({ providedIn: 'root' })
export class DocsSettings {
  readonly framework = signal<Framework>(
    read('enigma-ui:framework', FRAMEWORKS, 'angular'),
  );
  readonly theme = signal<Theme>(read('enigma-ui:theme', THEMES, 'system'));

  constructor() {
    const root = inject(DOCUMENT).documentElement;
    effect(() => write('enigma-ui:framework', this.framework()));
    effect(() => {
      const theme = this.theme();
      write('enigma-ui:theme', theme);
      if (theme === 'system') delete root.dataset['theme'];
      else root.dataset['theme'] = theme;
    });
  }
}
