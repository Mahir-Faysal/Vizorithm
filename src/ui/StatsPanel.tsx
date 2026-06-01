/**
 * Live stats: comparisons, swaps, array size. Monospace, tabular numbers.
 */
import { useVisualizer } from '../adapters/useVisualizerState';

export function StatsPanel() {
  const { currentStep, size } = useVisualizer();

  return (
    <div className="stats" aria-label="Algorithm statistics">
      <div className="stat">
        <span className="stat__label">Comparisons</span>
        <span className="stat__value">{currentStep.comparisons.toLocaleString()}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Swaps</span>
        <span className="stat__value">{currentStep.swaps.toLocaleString()}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Array Size</span>
        <span className="stat__value">{size}</span>
      </div>
    </div>
  );
}
