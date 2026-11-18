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
    path: 'components/bottom-sheet',
    loadComponent: () =>
      import('./pages/bottom-sheet-page.component').then(
        (m) => m.BottomSheetPageComponent,
      ),
  },
  {
    path: 'components/drawer',
    loadComponent: () =>
      import('./pages/drawer-page.component').then(
        (m) => m.DrawerPageComponent,
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
  {
    path: 'components/checkbox',
    loadComponent: () =>
      import('./pages/checkbox-page.component').then(
        (m) => m.CheckboxPageComponent,
      ),
  },
  {
    path: 'components/radio-group',
    loadComponent: () =>
      import('./pages/radio-group-page.component').then(
        (m) => m.RadioGroupPageComponent,
      ),
  },
  {
    path: 'components/switch',
    loadComponent: () =>
      import('./pages/switch-page.component').then(
        (m) => m.SwitchPageComponent,
      ),
  },
  {
    path: 'components/fieldset',
    loadComponent: () =>
      import('./pages/fieldset-page.component').then(
        (m) => m.FieldsetPageComponent,
      ),
  },
  {
    path: 'components/combobox',
    loadComponent: () =>
      import('./pages/combobox-page.component').then(
        (m) => m.ComboboxPageComponent,
      ),
  },
  {
    path: 'components/date-field',
    loadComponent: () =>
      import('./pages/date-field-page.component').then(
        (m) => m.DateFieldPageComponent,
      ),
  },
  {
    path: 'components/file-field',
    loadComponent: () =>
      import('./pages/file-field-page.component').then(
        (m) => m.FileFieldPageComponent,
      ),
  },
  {
    path: 'components/alert',
    loadComponent: () =>
      import('./pages/alert-page.component').then((m) => m.AlertPageComponent),
  },
  {
    path: 'components/toast',
    loadComponent: () =>
      import('./pages/toast-page.component').then((m) => m.ToastPageComponent),
  },
  {
    path: 'components/spinner',
    loadComponent: () =>
      import('./pages/spinner-page.component').then(
        (m) => m.SpinnerPageComponent,
      ),
  },
  {
    path: 'components/progress',
    loadComponent: () =>
      import('./pages/progress-page.component').then(
        (m) => m.ProgressPageComponent,
      ),
  },
  {
    path: 'components/skeleton',
    loadComponent: () =>
      import('./pages/skeleton-page.component').then(
        (m) => m.SkeletonPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
