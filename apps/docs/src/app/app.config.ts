import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  RouteReuseStrategy,
  withInMemoryScrolling,
} from '@angular/router';
import { KeepRouteStrategy } from '@enigma-ui/angular';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
        anchorScrolling: 'enabled',
      }),
    ),
    // The tabs page keeps its Security tab between visits.
    { provide: RouteReuseStrategy, useClass: KeepRouteStrategy },
  ],
};
