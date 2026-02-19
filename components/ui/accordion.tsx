'use client';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

export function AccordionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-1', className)}>{children}</div>
  );
}

export function AccordionWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('', className)}>{children}</div>;
}

export function Accordion({
  children,
  multiple = false,
  defaultValue = [],
  className,
}: {
  children: ReactNode;
  multiple?: boolean;
  defaultValue?: string[];
  className?: string;
}) {
  const [activeItems, setActiveItems] = useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    setActiveItems((prev) => {
      if (multiple) {
        return prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];
      } else {
        return prev.includes(value) ? [] : [value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem }}>
      <div className={cn('', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  value,
  className,
  unstyled = false,
}: {
  children: ReactNode;
  value: string;
  className?: string;
  unstyled?: boolean;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');

  const isActive = context.activeItems.includes(value);

  return (
    <div
      className={cn(
        !unstyled && 'rounded-md mb-2 overflow-hidden border-2',
        className
      )}
      style={!unstyled ? {
        borderColor: 'hsl(144.9 80.4% 10%)',
        backgroundColor: 'hsl(144.9 80.4% 10%)'
      } : undefined}
      data-active={isActive ? 'true' : undefined}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, { value })
          : child
      )}
    </div>
  );
}

export function AccordionHeader({
  children,
  value,
  className,
  customIcon,
  unstyled = false,
}: {
  children: ReactNode;
  value?: string;
  className?: string;
  customIcon?: boolean;
  unstyled?: boolean;
}) {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error('AccordionHeader must be used within Accordion');

  const isActive = value ? context.activeItems.includes(value) : false;

  return (
    <button
      className={cn(
        'flex w-full items-center justify-between p-4 text-left font-medium transition-colors group',
        className
      )}
      style={!unstyled ? {
        color: 'white',
        backgroundColor: 'hsl(144.9 80.4% 10%)'
      } : undefined}
      onClick={() => value && context.toggleItem(value)}
      data-active={isActive ? 'true' : undefined}
    >
      {children}
      {!customIcon && (
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform duration-200 text-white',
            isActive && 'rotate-180'
          )}
        />
      )}
    </button>
  );
}

export function AccordionPanel({
  children,
  value,
  className,
}: {
  children: ReactNode;
  value?: string;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionPanel must be used within Accordion');

  const isActive = value ? context.activeItems.includes(value) : false;

  return (
    <AnimatePresence initial={false}>
      {isActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { type: 'spring', stiffness: 500, damping: 40 },
              opacity: { duration: 0.2 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { type: 'spring', stiffness: 500, damping: 40 },
              opacity: { duration: 0.15 },
            },
          }}
          className="overflow-hidden"
        >
          <div
            className={cn('p-4 pt-0', className)}
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
