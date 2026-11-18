import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/getting-started.component').then(
        (m) => m.GettingStartedComponent,
      ),
  },
  {
    path: 'foundations/colour',
    loadComponent: () =>
      import('./pages/colour.component').then((m) => m.ColourComponent),
  },
  {
    path: 'foundations/type',
    loadComponent: () =>
      import('./pages/type.component').then((m) => m.TypeComponent),
  },
  {
    path: 'foundations/space',
    loadComponent: () =>
      import('./pages/space.component').then((m) => m.SpaceComponent),
  },
  {
    path: 'components/button',
    loadComponent: () =>
      import('./pages/button-page.component').then(
        (m) => m.ButtonPageComponent,
      ),
  },
  {
    path: 'components/text-field',
    loadComponent: () =>
      import('./pages/text-field-page.component').then(
        (m) => m.TextFieldPageComponent,
      ),
  },
  {
    path: 'components/select',
    loadComponent: () =>
      import('./pages/select-page.component').then(
        (m) => m.SelectPageComponent,
      ),
  },
  {
    path: 'components/dialog',
    loadComponent: () =>
      import('./pages/dialog-page.component').then(
        (m) => m.DialogPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
