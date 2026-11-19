import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  SelectComponent,
  SwitchComponent,
  TextFieldComponent,
  UiToast,
} from '@enigma-tech-lab/angular';
import { CodeBlockComponent } from '../shared/code-block.component';
import {
  DocsSettings,
  FRAMEWORKS,
  type Framework,
} from '../shared/docs-settings';
import { NAV } from '../shared/nav';

type Lang = 'en' | 'ar';
type StageTheme = 'light' | 'dark';
type Brand = 'enigma' | 'client';

const TEXT = {
  en: {
    title: 'Site visit',
    badge: 'New',
    name: 'Full name',
    city: 'City',
    pick: 'Choose a city',
    cities: ['Cairo', 'Alexandria', 'Giza'],
    updates: 'Text me when the engineer is near',
    book: 'Book the visit',
    booked: 'Visit booked',
  },
  ar: {
    title: 'زيارة موقع',
    badge: 'جديد',
    name: 'الاسم بالكامل',
    city: 'المدينة',
    pick: 'اختر المدينة',
    cities: ['القاهرة', 'الإسكندرية', 'الجيزة'],
    updates: 'أرسل لي رسالة عند اقتراب المهندس',
    book: 'احجز الزيارة',
    booked: 'تم حجز الزيارة',
  },
};

/** Primary colours of the re-brand example on the Getting started page (7:1 pairs). */
const CLIENT_BRAND = {
  '--ui-primary': 'light-dark(#0f5132, #6ee7b7)',
  '--ui-on-primary': 'light-dark(#ffffff, #0b1020)',
  '--ui-focus': 'light-dark(#0f5132, #6ee7b7)',
  '--ui-highlight': 'light-dark(#d1fae5, #064e3b)',
  '--ui-on-highlight': 'light-dark(#0b1020, #f6f7fb)',
};

const componentCount = NAV.filter(
  (g) => g.title !== 'Start' && g.title !== 'Foundations',
).reduce((n, g) => n + g.links.length, 0);
const foundationCount =
  NAV.find((g) => g.title === 'Foundations')?.links.length ?? 0;

/** The landing page: one interactive hero. The same live card, in every framework's code. */
@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    CodeBlockComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    SelectComponent,
    SwitchComponent,
    TextFieldComponent,
  ],
  host: { class: 'doc-home' },
  template: `
    <section
      class="doc-home__hero"
      aria-labelledby="home-title"
      (pointermove)="tilt($event)"
      (pointerleave)="tilt(null)"
      [style.--tx]="tx()"
      [style.--ty]="ty()"
    >
      <div class="doc-home__intro">
        <p class="ui-label doc-home__eyebrow">
          Enigma Technology Lab · Design system
        </p>
        <h1 id="home-title" class="ui-head-3xl doc-home__title">
          One look.<br /><span class="doc-home__accent"
            >Every
            <span class="doc-home__underlined"
              >frontend.<svg
                class="doc-home__scribble"
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  class="doc-draw"
                  pathLength="1"
                  d="M4 14 C 60 4, 120 4, 170 10 S 260 18, 296 6"
                /></svg></span
          ></span>
        </h1>
        <p class="ui-body-lg doc-home__lead">
          Accessible components for Angular, React and plain HTML, drawn from
          one stylesheet. Arabic and English, light and dark, from the first
          line.
        </p>
        <div class="doc-home__actions">
          <a
            class="ui-button ui-button--primary ui-button--lg"
            routerLink="/getting-started"
            >Get started</a
          >
          <a
            class="ui-button ui-button--secondary ui-button--lg"
            href="#play-title"
            >Try it live</a
          >
        </div>
        <dl class="doc-home__counts">
          @for (c of counts; track c.label) {
            <div class="doc-home__count">
              <dt class="ui-label">{{ c.label }}</dt>
              <dd class="ui-head-xl">{{ c.value }}</dd>
            </div>
          }
        </dl>
      </div>

      <!-- Decorative: the Enigma mark extruded in 3D, orbited by pieces of the kit. -->
      <div class="doc-scene" aria-hidden="true" inert>
        <div class="doc-scene__world">
          <svg class="doc-scene__floor" viewBox="0 0 400 400">
            @for (i of grid; track i) {
              <line
                class="doc-draw"
                pathLength="1"
                [attr.x1]="i * 50"
                y1="0"
                [attr.x2]="i * 50"
                y2="400"
                [style.--d]="i"
              />
              <line
                class="doc-draw"
                pathLength="1"
                x1="0"
                [attr.y1]="i * 50"
                x2="400"
                [attr.y2]="i * 50"
                [style.--d]="i"
              />
            }
          </svg>

          <div class="doc-scene__orbit doc-scene__orbit--a">
            <svg viewBox="0 0 100 100">
              <circle class="doc-draw" pathLength="1" cx="50" cy="50" r="48" />
              <circle class="doc-scene__moon" cx="50" cy="2" r="2.2" />
            </svg>
          </div>
          <div class="doc-scene__orbit doc-scene__orbit--b">
            <svg viewBox="0 0 100 100">
              <circle class="doc-draw" pathLength="1" cx="50" cy="50" r="48" />
              <circle class="doc-scene__moon" cx="50" cy="98" r="1.8" />
            </svg>
          </div>

          <div class="doc-scene__mark">
            @for (part of parts; track part.id) {
              <div class="doc-scene__part doc-scene__part--{{ part.id }}">
                @for (i of layers; track i) {
                  <svg viewBox="255 318 515 390" [style.--i]="i">
                    <polygon
                      [attr.points]="part.points"
                      [attr.fill]="part.fill"
                    />
                  </svg>
                }
              </div>
            }
          </div>

          <span
            class="doc-chip doc-chip--button"
            style="--x: 4cqi; --y: 14cqi; --z: 9cqi"
            >Book the visit</span
          >
          <span
            class="doc-chip doc-chip--switch"
            style="--x: 60cqi; --y: 8cqi; --z: 5cqi"
            ><span class="doc-chip__track"><span></span></span>Dark mode</span
          >
          <span
            class="doc-chip"
            lang="ar"
            dir="rtl"
            style="--x: 70cqi; --y: 62cqi; --z: 12cqi"
            ><span class="doc-chip__dot"></span>جديد</span
          >
          <span
            class="doc-chip doc-chip--contrast"
            style="--x: 2cqi; --y: 70cqi; --z: 3cqi"
            ><b>7:1</b> AAA text</span
          >
          <span
            class="doc-chip doc-chip--slider"
            style="--x: 34cqi; --y: 86cqi; --z: 7cqi"
            ><span class="doc-chip__rail"><span></span></span
          ></span>
          <code
            class="doc-chip doc-chip--code"
            style="--x: 70cqi; --y: 30cqi; --z: 6cqi"
            >&lt;ui-card&gt;</code
          >
        </div>
      </div>
    </section>

    <section class="doc-home__play" aria-labelledby="play-title">
      <div class="doc-home__play-intro">
        <p class="ui-label doc-home__eyebrow">Playground</p>
        <h2 id="play-title" class="ui-head-xl">
          Change anything. It is the real kit.
        </h2>
        <p class="ui-body-md doc-home__lead">
          Flip the language, theme or brand and watch the same card, and its
          code, follow in the framework you pick.
        </p>
      </div>
      <div class="doc-home__stage">
        <div class="doc-home__controls">
          <fieldset class="doc-picker">
            <legend class="ui-label doc-picker__legend">Code</legend>
            <div class="doc-segmented">
              @for (f of frameworks; track f.id) {
                <label class="doc-segment">
                  <input
                    class="ui-visually-hidden"
                    type="radio"
                    name="home-framework"
                    [checked]="settings.framework() === f.id"
                    (change)="setFramework(f.id)"
                  />{{ f.label }}
                </label>
              }
            </div>
          </fieldset>
          <fieldset class="doc-picker">
            <legend class="ui-label doc-picker__legend">Language</legend>
            <div class="doc-segmented">
              <label class="doc-segment">
                <input
                  class="ui-visually-hidden"
                  type="radio"
                  name="home-lang"
                  [checked]="lang() === 'en'"
                  (change)="lang.set('en')"
                />English
              </label>
              <label class="doc-segment" lang="ar">
                <input
                  class="ui-visually-hidden"
                  type="radio"
                  name="home-lang"
                  [checked]="lang() === 'ar'"
                  (change)="lang.set('ar')"
                />العربية
              </label>
            </div>
          </fieldset>
          <fieldset class="doc-picker">
            <legend class="ui-label doc-picker__legend">Card theme</legend>
            <div class="doc-segmented">
              @for (t of stageThemes; track t.id) {
                <label class="doc-segment">
                  <input
                    class="ui-visually-hidden"
                    type="radio"
                    name="home-theme"
                    [checked]="stageTheme() === t.id"
                    (change)="stageTheme.set(t.id)"
                  />{{ t.label }}
                </label>
              }
            </div>
          </fieldset>
          <fieldset class="doc-picker">
            <legend class="ui-label doc-picker__legend">Brand</legend>
            <div class="doc-segmented">
              @for (b of brands; track b.id) {
                <label class="doc-segment">
                  <input
                    class="ui-visually-hidden"
                    type="radio"
                    name="home-brand"
                    [checked]="brand() === b.id"
                    (change)="brand.set(b.id)"
                  />
                  <span
                    class="doc-home__swatch"
                    [class.doc-home__swatch--client]="b.id === 'client'"
                    aria-hidden="true"
                  ></span
                  >{{ b.label }}
                </label>
              }
            </div>
          </fieldset>
        </div>

        <div
          class="doc-home__preview"
          [attr.dir]="lang() === 'ar' ? 'rtl' : 'ltr'"
          [attr.lang]="lang()"
          [attr.data-theme]="stageTheme()"
          [style]="brand() === 'client' ? clientBrand : null"
        >
          <ui-card [title]="t().title" [level]="3">
            <div class="doc-home__card">
              <ui-badge variant="info">{{ t().badge }}</ui-badge>
              <ui-text-field [label]="t().name" autocomplete="name" />
              <ui-select
                [label]="t().city"
                [placeholder]="t().pick"
                [options]="cities()"
              />
              <ui-switch [label]="t().updates" />
              <button ui-button type="button" (click)="book()">
                {{ t().book }}
              </button>
            </div>
          </ui-card>
        </div>

        <app-code-block [code]="code()" />
      </div>
    </section>
  `,
})
export class HomeComponent {
  protected readonly settings = inject(DocsSettings);
  private readonly toast = inject(UiToast);
  protected readonly frameworks = FRAMEWORKS;
  protected readonly clientBrand = CLIENT_BRAND;
  protected readonly stageThemes = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
  ] as const;
  protected readonly brands = [
    { id: 'enigma', label: 'Enigma' },
    { id: 'client', label: 'A client' },
  ] as const;
  protected readonly counts = [
    { label: 'Components', value: componentCount },
    { label: 'Foundations', value: foundationCount },
    { label: 'Frameworks', value: FRAMEWORKS.length },
    { label: 'Text contrast', value: '7:1' },
  ];

  protected readonly grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  protected readonly layers = Array.from({ length: 14 }, (_, i) => i);
  protected readonly parts = [
    {
      id: 'red',
      fill: '#DC4B4B',
      points: '255,318 620,318 564,400 410,400 486,513 352,708 255,708 388,513',
    },
    {
      id: 'blue',
      fill: '#0059FF',
      points: '770,708 405,708 461,626 615,626 539,513 673,318 770,318 637,513',
    },
  ];
  /** Pointer tilt of the 3D scene, in degrees; stays 0 for reduced motion. */
  protected readonly tx = signal(0);
  protected readonly ty = signal(0);
  private readonly still = matchMedia('(prefers-reduced-motion: reduce)');

  protected readonly lang = signal<Lang>('en');
  /** Starts as the page's theme and follows it when the header changes; the card switch overrides it. */
  protected readonly stageTheme = linkedSignal<StageTheme>(() => {
    const page = this.settings.theme();
    if (page !== 'system') return page;
    return matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  protected readonly brand = signal<Brand>('enigma');
  protected readonly t = computed(() => TEXT[this.lang()]);
  protected readonly cities = computed(() =>
    this.t().cities.map((label, i) => ({ value: String(i), label })),
  );

  /** The card above, written for each framework, in the chosen language. */
  protected readonly code = computed(() => {
    const t = this.t();
    const ar = this.lang() === 'ar';
    const wrap = (open: string, close: string, body: string) =>
      ar ? `${open}\n${body.replace(/^/gm, '  ')}\n${close}` : body;
    return {
      angular: wrap(
        '<div dir="rtl" lang="ar">',
        '</div>',
        `<ui-card title="${t.title}" [level]="2">
  <ui-badge variant="info">${t.badge}</ui-badge>
  <ui-text-field label="${t.name}" autocomplete="name" formControlName="name" />
  <ui-select label="${t.city}" placeholder="${t.pick}" [options]="cities" formControlName="city" />
  <ui-switch label="${t.updates}" formControlName="updates" />
  <button ui-button (click)="book()">${t.book}</button>
</ui-card>`,
      ),
      react: wrap(
        '<div dir="rtl" lang="ar">',
        '</div>',
        `<Card title="${t.title}" level={2}>
  <Badge variant="info">${t.badge}</Badge>
  <TextField label="${t.name}" autoComplete="name" name="name" />
  <Select label="${t.city}" placeholder="${t.pick}" options={cities} value={city} onChange={setCity} />
  <Switch label="${t.updates}" name="updates" />
  <Button onClick={book}>${t.book}</Button>
</Card>`,
      ),
      html: wrap(
        '<div dir="rtl" lang="ar">',
        '</div>',
        `<div class="ui-card">
  <h2 class="ui-card__title">${t.title}</h2>
  <span class="ui-badge ui-badge--info">${t.badge}</span>
  <div class="ui-field">
    <label class="ui-field__label" for="name">${t.name}</label>
    <input class="ui-input" id="name" autocomplete="name" />
  </div>
  <div class="ui-field">
    <label class="ui-field__label" for="city">${t.city}</label>
    <select class="ui-input" id="city">
${t.cities.map((c) => `      <option>${c}</option>`).join('\n')}
    </select>
  </div>
  <label class="ui-switch">
    ${t.updates}
    <input type="checkbox" role="switch" class="ui-switch__input" />
  </label>
  <button class="ui-button ui-button--primary ui-button--md">${t.book}</button>
</div>`,
      ),
    } satisfies Record<Framework, string>;
  });

  constructor() {
    inject(Title).setTitle('Enigma UI · One look, every frontend');
  }

  protected tilt(e: PointerEvent | null): void {
    if (!e || this.still.matches || e.pointerType !== 'mouse') {
      this.tx.set(0);
      this.ty.set(0);
      return;
    }
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.tx.set(Math.round(((e.clientX - r.left) / r.width - 0.5) * 30));
    this.ty.set(Math.round(((e.clientY - r.top) / r.height - 0.5) * -20));
  }

  protected setFramework(id: Framework): void {
    this.settings.framework.set(id);
  }

  protected book(): void {
    this.toast.show(this.t().booked, { tone: 'success' });
  }
}
