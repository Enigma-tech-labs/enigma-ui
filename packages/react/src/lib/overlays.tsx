'use client';

import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Dialog,
  DialogTrigger,
  Focusable,
  Popover as AriaPopover,
  Pressable,
  Tooltip as AriaTooltip,
  TooltipTrigger,
} from 'react-aria-components';
import { cx } from './class-names.js';

// React Aria types the child as a bare DOM element, but a component that forwards its ref
// and spreads its props (Button) works the same at runtime.
type AriaChild = Parameters<typeof Pressable>[0]['children'];

const AccordionName = createContext<string | undefined>(undefined);

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  /** Keeps one section open at a time: opening one closes the others. */
  single?: boolean;
}

/**
 * A stack of sections that open and close, such as questions and answers. Native
 * `<details>`, so it opens with Enter and Space and works without script.
 *
 * ```tsx
 * <Accordion single>
 *   <AccordionItem heading="Can I change my order?">Yes, until it ships.</AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({ single, className, ...div }: AccordionProps) {
  const name = useId();
  return (
    <AccordionName.Provider value={single ? name : undefined}>
      <div {...div} className={cx('ui-accordion', className)} />
    </AccordionName.Provider>
  );
}

export interface AccordionItemProps extends ComponentPropsWithRef<'details'> {
  /** The text of the summary that opens it. */
  heading: string;
}

/** One section of an accordion. Every other prop goes to the `<details>`: open, onToggle. */
export function AccordionItem({
  heading,
  className,
  children,
  ...details
}: AccordionItemProps) {
  const name = useContext(AccordionName);
  return (
    <details
      name={name}
      {...details}
      className={cx('ui-accordion__item', className)}
    >
      <summary>{heading}</summary>
      <div className="ui-accordion__content">{children}</div>
    </details>
  );
}

export interface TooltipProps {
  /** The short label. */
  text: string;
  /** One focusable element that takes a ref and spreads its props, such as Button. */
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'start' | 'end';
}

/**
 * A short label for a control, shown on hover and keyboard focus and read as its
 * description, on React Aria. Touch screens never show it, so never hide something needed
 * in a tooltip; an icon-only button still needs its own `aria-label`.
 *
 * ```tsx
 * <Tooltip text="Copy link"><Button variant="ghost" aria-label="Copy link">…</Button></Tooltip>
 * ```
 */
export function Tooltip({ text, children, placement = 'top' }: TooltipProps) {
  return (
    <TooltipTrigger delay={300}>
      <Focusable>{children as AriaChild}</Focusable>
      <AriaTooltip className="ui-tooltip" placement={placement} offset={8}>
        {text}
      </AriaTooltip>
    </TooltipTrigger>
  );
}

export interface PopoverProps {
  /** One pressable element that takes a ref and spreads its props, such as Button. */
  trigger: ReactElement;
  children?: ReactNode;
  placement?: 'bottom start' | 'top start' | 'bottom end' | 'top end';
}

/**
 * A small panel next to its button, for a few details or settings, on React Aria. Not
 * modal: focus moves into it, Escape or a click outside closes it and focus returns to the
 * button. The panel is named after the button.
 *
 * ```tsx
 * <Popover trigger={<Button variant="secondary">Delivery fee</Button>}>
 *   <p>Free over EGP 500.</p>
 * </Popover>
 * ```
 */
export function Popover({
  trigger,
  children,
  placement = 'bottom start',
}: PopoverProps) {
  return (
    <DialogTrigger>
      <Pressable>{trigger as AriaChild}</Pressable>
      <AriaPopover placement={placement} offset={8}>
        <Dialog className="ui-popover">{children}</Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
