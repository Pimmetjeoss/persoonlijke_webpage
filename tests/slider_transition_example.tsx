'use client';
import React, { useState } from 'react';
import { SliderTransition } from '../app/components/slider_transition';

/**
 * Example component demonstrating different uses of SliderTransition
 */
export const SliderTransitionExample: React.FC = () => {
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  return (
    <div className="relative w-screen h-screen">
      {/* Example 1: Basic usage with your custom green colors */}
      <SliderTransition
        colors={[
          'hsl(141, 78.9%, 85.1%)', // Light green
          'hsl(142.1, 76.2%, 36.3%)', // Medium green
          'hsl(144.9, 80.4%, 10%)', // Dark green
        ]}
        trigger={triggerAnimation}
        onComplete={() => {
          console.log('Animation completed!');
        }}
        duration={2}
        stagger={0.4}
        direction="up"
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-900">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-8">Welcome to Code-Lieshout</h1>
            <button
              onClick={() => setTriggerAnimation(!triggerAnimation)}
              className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {triggerAnimation ? 'Reset Animation' : 'Start Animation'}
            </button>
          </div>
        </div>
      </SliderTransition>
    </div>
  );
};

/**
 * Example with different color schemes
 */
export const SliderTransitionVariants: React.FC = () => {
  const [activeVariant, setActiveVariant] = useState<
    'green' | 'blue' | 'orange' | null
  >('green');

  const colorSchemes = {
    green: [
      'hsl(141, 78.9%, 85.1%)',
      'hsl(142.1, 76.2%, 36.3%)',
      'hsl(144.9, 80.4%, 10%)',
    ] as [string, string, string],
    blue: [
      'hsl(200, 80%, 85%)',
      'hsl(210, 75%, 50%)',
      'hsl(220, 80%, 20%)',
    ] as [string, string, string],
    orange: [
      'hsl(30, 90%, 85%)',
      'hsl(25, 85%, 55%)',
      'hsl(20, 80%, 25%)',
    ] as [string, string, string],
  };

  return (
    <div className="relative w-screen h-screen">
      <SliderTransition
        colors={colorSchemes[activeVariant || 'green']}
        trigger={activeVariant !== null}
        onComplete={() => {
          console.log(`${activeVariant} animation completed!`);
        }}
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-900">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-8">Color Variants</h1>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActiveVariant('green')}
                className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600"
              >
                Green
              </button>
              <button
                onClick={() => setActiveVariant('blue')}
                className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Blue
              </button>
              <button
                onClick={() => setActiveVariant('orange')}
                className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Orange
              </button>
            </div>
          </div>
        </div>
      </SliderTransition>
    </div>
  );
};

export default SliderTransitionExample;
