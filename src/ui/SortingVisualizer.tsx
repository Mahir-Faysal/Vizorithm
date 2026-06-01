/**
 * SortingVisualizer renders bars with value labels. Completion sweep animates
 * bars turning green left-to-right after the sort finishes.
 */
import { useEffect, useRef, useState } from 'react';
import { useVisualizer } from '../adapters/useVisualizerState';
import { classifyBar, type BarState } from '../domain/rendering/barState';
import { barHeight } from '../domain/rendering/barHeight';
import { VALUE_MAX } from '../domain/constants';

export function SortingVisualizer() {
  const { currentStep, trace, playback, size } = useVisualizer();
  const array = currentStep.array;
  const maxValue = array.length > 0 ? Math.max(...array, VALUE_MAX) : VALUE_MAX;

  const isLastStep = playback.state.stepIndex >= trace.length - 1 && trace.length > 1;

  // Completion sweep
  const [sweepIndex, setSweepIndex] = useState(-1);
  const sweepRaf = useRef<number>(0);
  const sweepStart = useRef(0);

  useEffect(() => {
    if (isLastStep) {
      setSweepIndex(0);
      sweepStart.current = performance.now();
      const perBar = 600 / Math.max(array.length, 1);

      const animate = (now: number) => {
        const reached = Math.floor((now - sweepStart.current) / perBar);
        if (reached >= array.length) {
          setSweepIndex(array.length);
          return;
        }
        setSweepIndex(reached);
        sweepRaf.current = requestAnimationFrame(animate);
      };
      sweepRaf.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(sweepRaf.current);
    } else {
      setSweepIndex(-1);
    }
  }, [isLastStep, array.length]);

  const getBarState = (index: number): BarState => {
    if (isLastStep) {
      return index < sweepIndex ? 'completion' : 'neutral';
    }
    return classifyBar(index, currentStep);
  };

  // Only show value labels for smaller arrays so they stay readable
  const showValues = size <= 50;

  return (
    <div className="canvas__bars" role="img" aria-label="Sorting visualization">
      {array.map((value, index) => {
        const state = getBarState(index);
        const heightPct = barHeight(value, maxValue, 100);
        return (
          <div key={index} className="bar-col">
            <div
              className={`bar bar--${state}`}
              style={{ height: `${heightPct}%` }}
            />
            {showValues && <span className="bar__value">{value}</span>}
          </div>
        );
      })}
    </div>
  );
}
