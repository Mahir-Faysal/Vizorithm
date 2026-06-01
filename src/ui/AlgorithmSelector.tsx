/**
 * Pill-style algorithm selector. Uppercase, monospace, minimal.
 */
import { ALGORITHMS, ALGORITHM_ORDER } from '../domain/algorithms';
import { useVisualizer } from '../adapters/useVisualizerState';

export function AlgorithmSelector() {
  const { selectedId, selectAlgorithm } = useVisualizer();

  return (
    <div className="selector" role="radiogroup" aria-label="Sorting algorithm">
      {ALGORITHM_ORDER.map((id) => {
        const meta = ALGORITHMS[id];
        const isSelected = id === selectedId;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`selector__item${isSelected ? ' selector__item--selected' : ''}`}
            onClick={() => selectAlgorithm(id)}
          >
            {meta.name}
          </button>
        );
      })}
    </div>
  );
}
