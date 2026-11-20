'use client';

import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Menu as AriaMenu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import type { ButtonVariant } from './button.js';
import { cx } from './class-names.js';

export interface MenuAction {
  id: string;
  label: string;
  /** For an action that destroys something: brand red text. */
  danger?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  /** The button's content. */
  label: ReactNode;
  /** The button's name when its content is only an icon. */
  'aria-label'?: string;
  items: readonly MenuAction[];
  /** Called with the chosen action's id; the menu then closes. */
  onAction: (id: string) => void;
  variant?: ButtonVariant;
  /** data-testid on the button. */
  testId?: string;
  /** Match the menu panel's width to its trigger. */
  matchTriggerWidth?: boolean;
}

/**
 * A list of actions that opens from a button, on React Aria: Enter, Space or the down
 * arrow open it, arrow keys and typing move through it, Escape closes it and focus returns
 * to the button.
 *
 * ```tsx
 * <Menu label="Actions" items={[{ id: 'edit', label: 'Edit' }]} onAction={run} />
 * ```
 */
export function Menu({
  label,
  'aria-label': ariaLabel,
  items,
  onAction,
  variant = 'secondary',
  testId,
  matchTriggerWidth,
}: MenuProps) {
  return (
    <MenuTrigger>
      <AriaButton
        className={cx('ui-button', `ui-button--${variant}`, 'ui-button--md')}
        aria-label={ariaLabel}
        data-testid={testId}
      >
        {label}
      </AriaButton>
      <Popover
        placement="bottom start"
        offset={0}
        style={{
          inlineSize: matchTriggerWidth ? 'var(--trigger-width)' : undefined,
          zIndex: 'var(--ui-layer-popover)',
        }}
      >
        <AriaMenu
          className={cx(
            'ui-menu',
            matchTriggerWidth && 'ui-menu--trigger-width',
          )}
          onAction={(key) => onAction(String(key))}
          disabledKeys={items.filter((i) => i.disabled).map((i) => i.id)}
        >
          {items.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              className={cx(
                'ui-menu__item',
                item.danger && 'ui-menu__item--danger',
              )}
            >
              {item.label}
            </MenuItem>
          ))}
        </AriaMenu>
      </Popover>
    </MenuTrigger>
  );
}
