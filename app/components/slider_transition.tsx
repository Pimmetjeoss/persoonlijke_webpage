'use client';
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface SliderTransitionProps {
  /**
   * Array of 3 colors for the sliding blocks (CSS color strings)
   * Can be HSL, hex, rgb, or any valid CSS color
   * Example: ['hsl(141, 78.9%, 85.1%)', 'hsl(142.1, 76.2%, 36.3%)', 'hsl(144.9, 80.4%, 10%)']
   */
  colors?: [string, string, string];

  /**
   * Trigger the animation when this prop changes to true
   */
  trigger?: boolean;

  /**
   * Callback when animation completes (all blocks have exited)
   */
  onComplete?: () => void;

  /**
   * Callback when screen is fully covered (best time for page transitions)
   * This fires when the last block reaches the center of the screen
   */
  onCover?: () => void;

  /**
   * Base duration for each block animation in seconds
   * @default 2
   */
  duration?: number;

  /**
   * Delay between each block starting in seconds
   * @default 0.4
   */
  stagger?: number;

  /**
   * Initial delay before animation starts in seconds
   * @default 1
   */
  initialDelay?: number;

  /**
   * Animation direction
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right';

  /**
   * Easing function for the animation
   * @default 'power2.inOut'
   */
  ease?: string;

  /**
   * z-index for the overlay blocks
   * @default 99999
   */
  zIndex?: number;

  /**
   * Content to display under the sliding blocks
   */
  children?: React.ReactNode;
}

/**
 * SliderTransition - A reusable component for 3-block sliding transitions
 *
 * Usage:
 * ```tsx
 * const [startAnimation, setStartAnimation] = useState(false);
 *
 * <SliderTransition
 *   colors={['hsl(141, 78.9%, 85.1%)', 'hsl(142.1, 76.2%, 36.3%)', 'hsl(144.9, 80.4%, 10%)']}
 *   trigger={startAnimation}
 *   onComplete={() => console.log('Animation done!')}
 * >
 *   <YourContent />
 * </SliderTransition>
 * ```
 */
export const SliderTransition: React.FC<SliderTransitionProps> = ({
  colors = ['hsl(141, 78.9%, 85.1%)', 'hsl(142.1, 76.2%, 36.3%)', 'hsl(144.9, 80.4%, 10%)'],
  trigger = false,
  onComplete,
  onCover,
  duration = 2,
  stagger = 0.4,
  initialDelay = 0,
  direction = 'up',
  ease = 'power2.inOut',
  zIndex = 99999,
  children,
}) => {
  const slider1Ref = useRef<HTMLDivElement>(null);
  const slider2Ref = useRef<HTMLDivElement>(null);
  const slider3Ref = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // Calculate transform values based on direction
  const getTransformValue = () => {
    switch (direction) {
      case 'up':
        return { start: '100%', end: '-100%', axis: 'y' };
      case 'down':
        return { start: '-100%', end: '100%', axis: 'y' };
      case 'left':
        return { start: '100%', end: '-100%', axis: 'x' };
      case 'right':
        return { start: '-100%', end: '100%', axis: 'x' };
      default:
        return { start: '100%', end: '-100%', axis: 'y' };
    }
  };

  const { start, end, axis } = getTransformValue();

  // Set initial position when component mounts
  useEffect(() => {
    if (slider1Ref.current && slider2Ref.current && slider3Ref.current) {
      gsap.set([slider1Ref.current, slider2Ref.current, slider3Ref.current], {
        [axis]: start,
      });
    }
  }, [axis, start]);

  useEffect(() => {
    if (!trigger || hasAnimatedRef.current) return;

    const timeline = gsap.timeline({
      onComplete: () => {
        hasAnimatedRef.current = true;
        onComplete?.();
      },
    });

    // Animate the three sliders with staggered delays
    // They slide from start position (100%) through the screen (0%) to end position (-100%)
    timeline
      .to(slider1Ref.current, {
        [axis]: end,
        duration,
        delay: initialDelay,
        ease,
      })
      .to(
        slider2Ref.current,
        {
          [axis]: end,
          duration,
          ease,
        },
        `-=${duration - stagger}` // Start before previous animation ends
      )
      .to(
        slider3Ref.current,
        {
          [axis]: end,
          duration,
          ease,
          onUpdate: function() {
            // Call onCover at 40% to give new page more time to load
            if (this.progress() >= 0.4 && onCover) {
              onCover();
              // Set to null to prevent multiple calls
              onCover = null as any;
            }
          }
        },
        `-=${duration - stagger}` // Start before previous animation ends
      );

    return () => {
      timeline.kill();
    };
  }, [trigger, duration, stagger, initialDelay, ease, start, end, axis, onComplete, onCover]);

  // Reset animation state when trigger becomes false
  useEffect(() => {
    if (!trigger && hasAnimatedRef.current) {
      hasAnimatedRef.current = false;

      // Reset positions to start
      gsap.set([slider1Ref.current, slider2Ref.current, slider3Ref.current], {
        [axis]: start,
      });
    }
  }, [trigger, axis, start]);

  const getPositionStyle = (): React.CSSProperties => {
    const isHorizontal = direction === 'left' || direction === 'right';
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      width: isHorizontal ? '100vw' : '100%',
      height: isHorizontal ? '100%' : '100vh',
      zIndex,
    };
  };

  return (
    <>
      {/* Slider blocks - always rendered, positioned off-screen initially */}
      <div
        ref={slider1Ref}
        className="slider-block-1"
        style={{
          ...getPositionStyle(),
          backgroundColor: colors[0],
          zIndex: zIndex + 3,
          opacity: 1,
        }}
      />
      <div
        ref={slider2Ref}
        className="slider-block-2"
        style={{
          ...getPositionStyle(),
          backgroundColor: colors[1],
          zIndex: zIndex + 2,
          opacity: 1,
        }}
      />
      <div
        ref={slider3Ref}
        className="slider-block-3"
        style={{
          ...getPositionStyle(),
          backgroundColor: colors[2],
          zIndex: zIndex + 1,
          opacity: 1,
        }}
      />

      {/* Content that appears after/underneath the transition */}
      {children}
    </>
  );
};

export default SliderTransition;
