import { ViewportScroller } from '@angular/common';
import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import {
  provideRouter,
  Router,
  RouteReuseStrategy,
  Scroll,
  withInMemoryScrolling,
} from '@angular/router';
import { KeepRouteStrategy } from '@enigma-tech-lab/angular';
import { appRoutes } from './app.routes';

/** The docs page a URL belongs to: its first two segments, so a routed tabs demo stays one page. */
const pageOf = (url: string) =>
  url.split(/[?#]/)[0].split('/').slice(0, 3).join('/');

/** Goes to the top on a new page, but stays put when a demo only changes its tab. */
function scrollToTopOnNewPage(): void {
  const router = inject(Router);
  const scroller = inject(ViewportScroller);
  let page = '';
  router.events.subscribe((event) => {
    if (!(event instanceof Scroll) || event.anchor) return;
    const next = pageOf(router.url);
    if (next !== page) scroller.scrollToPosition([0, 0]);
    page = next;
  });
}

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
    provideEnvironmentInitializer(scrollToTopOnNewPage),
    // The tabs page keeps its Security tab between visits.
    { provide: RouteReuseStrategy, useClass: KeepRouteStrategy },
  ],
};
