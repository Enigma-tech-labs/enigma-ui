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
  {
    path: 'components/badge',
    loadComponent: () =>
      import('./pages/badge-page.component').then((m) => m.BadgePageComponent),
  },
  {
    path: 'components/card',
    loadComponent: () =>
      import('./pages/card-page.component').then((m) => m.CardPageComponent),
  },
  {
    path: 'components/textarea',
    loadComponent: () =>
      import('./pages/textarea-page.component').then(
        (m) => m.TextareaPageComponent,
      ),
  },
  {
    path: 'components/alert-dialog',
    loadComponent: () =>
      import('./pages/alert-dialog-page.component').then(
        (m) => m.AlertDialogPageComponent,
      ),
  },
  {
    path: 'components/data-table',
    loadComponent: () =>
      import('./pages/data-table-page.component').then(
        (m) => m.DataTablePageComponent,
      ),
  },
  {
    path: 'components/pagination',
    loadComponent: () =>
      import('./pages/pagination-page.component').then(
        (m) => m.PaginationPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
