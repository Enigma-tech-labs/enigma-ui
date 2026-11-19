import {
  createFlexibleConnectedPositionStrategy,
  createOverlayRef,
  createRepositionScrollStrategy,
  type ConnectedPosition,
  type OverlayRef,
} from '@angular/cdk/overlay';
import type { Injector } from '@angular/core';

/** An overlay pinned to `origin`, trying each position in turn and following the page as it scrolls. */
export function anchoredOverlay(
  injector: Injector,
  origin: HTMLElement,
  positions: ConnectedPosition[],
): OverlayRef {
  return createOverlayRef(injector, {
    positionStrategy: createFlexibleConnectedPositionStrategy(injector, origin)
      .withPositions(positions)
      .withViewportMargin(8)
      .withPush(false),
    scrollStrategy: createRepositionScrollStrategy(injector),
  });
}
