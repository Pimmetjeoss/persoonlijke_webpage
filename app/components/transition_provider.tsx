'use client';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SliderTransition } from './slider_transition';

interface TransitionContextValue {
  /**
   * Start a page transition with the slider animation
   * @param targetUrl - The URL to navigate to after the screen is covered
   */
  startTransition: (targetUrl: string) => void;

  /**
   * Whether a transition is currently in progress
   */
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue | undefined>(undefined);

export interface TransitionProviderProps {
  children: React.ReactNode;
  /**
   * Colors for the 3 sliding blocks
   */
  colors?: [string, string, string];
  /**
   * Duration of each block animation in seconds
   */
  duration?: number;
  /**
   * Stagger delay between blocks in seconds
   */
  stagger?: number;
  /**
   * Animation direction
   */
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * TransitionProvider - Manages page transitions with slider animations
 *
 * This component should be placed in the root layout to persist across page changes.
 * It provides a context for triggering smooth page transitions with the slider effect.
 */
export const TransitionProvider: React.FC<TransitionProviderProps> = ({
  children,
  colors = [
    'hsl(141, 78.9%, 85.1%)',
    'hsl(142.1, 76.2%, 36.3%)',
    'hsl(144.9, 80.4%, 10%)'
  ],
  duration = 2,
  stagger = 0.4,
  direction = 'up',
}) => {
  const [triggerTransition, setTriggerTransition] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const targetUrlRef = useRef<string | null>(null);
  const router = useRouter();

  const startTransition = useCallback((targetUrl: string) => {
    // Store the target URL
    targetUrlRef.current = targetUrl;

    // Mark as transitioning
    setIsTransitioning(true);

    // Trigger the slider animation
    setTriggerTransition(true);
  }, []);

  const handleTransitionCover = useCallback(() => {
    // Navigate when screen is fully covered
    if (targetUrlRef.current) {
      router.push(targetUrlRef.current);
      targetUrlRef.current = null;
    }
  }, [router]);

  const handleTransitionComplete = useCallback(() => {
    // Reset transition state after animation completes
    setIsTransitioning(false);
    setTriggerTransition(false);
  }, []);

  const contextValue: TransitionContextValue = {
    startTransition,
    isTransitioning,
  };

  return (
    <TransitionContext.Provider value={contextValue}>
      {/* Slider blocks at layout level - persist across page changes */}
      <SliderTransition
        colors={colors}
        trigger={triggerTransition}
        onCover={handleTransitionCover}
        onComplete={handleTransitionComplete}
        duration={duration}
        stagger={stagger}
        direction={direction}
        initialDelay={0}
      >
        {/* Page content */}
        {children}
      </SliderTransition>
    </TransitionContext.Provider>
  );
};

/**
 * Hook to access the transition context
 *
 * Usage:
 * ```tsx
 * const { startTransition, isTransitioning } = useTransition();
 *
 * const handleClick = () => {
 *   startTransition('/portfolio');
 * };
 * ```
 */
export const useTransition = (): TransitionContextValue => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

export default TransitionProvider;
