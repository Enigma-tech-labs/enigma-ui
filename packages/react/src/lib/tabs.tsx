'use client';

import type { ReactNode } from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  type Key,
} from 'react-aria-components';
import { cx } from './class-names.js';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** Names the tab list, such as the thing the tabs are about. */
  label: string;
  tabs: readonly TabItem[];
  /** The chosen tab's id, when you control it. */
  selected?: string;
  defaultSelected?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * Views of one thing side by side, on React Aria: arrow keys move between tabs and show
 * each one, Home and End go to the first and last. Arrow keys follow the locale's direction,
 * so wrap Arabic pages in `<I18nProvider locale="ar">` from react-aria-components.
 *
 * ```tsx
 * <Tabs label="Order 1042" tabs={[{ id: 'details', label: 'Details', content: <Details /> }]} />
 * ```
 */
export function Tabs({
  label,
  tabs,
  selected,
  defaultSelected,
  onChange,
  className,
}: TabsProps) {
  return (
    <AriaTabs
      className={cx('ui-tabs', className)}
      selectedKey={selected}
      defaultSelectedKey={defaultSelected}
      onSelectionChange={(key: Key) => onChange?.(String(key))}
      disabledKeys={tabs.filter((t) => t.disabled).map((t) => t.id)}
    >
      <TabList aria-label={label} className="ui-tabs__list">
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} className="ui-tab">
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} className="ui-tabs__panel">
          {tab.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
