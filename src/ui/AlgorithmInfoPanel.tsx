/**
 * Algorithm info: name, one-line description, complexity. Compact and editorial.
 */
import { useVisualizer } from '../adapters/useVisualizerState';

export function AlgorithmInfoPanel() {
  const { meta } = useVisualizer();

  return (
    <aside className="info" aria-label="Algorithm information">
      <h2 className="info__name">{meta.name}</h2>
      <p className="info__description">{meta.description}</p>

      <dl className="info__complexity">
        <div>
          <dt>Avg</dt>
          <dd>{meta.complexity.averageTime}</dd>
        </div>
        <div>
          <dt>Worst</dt>
          <dd>{meta.complexity.worstTime}</dd>
        </div>
        <div>
          <dt>Space</dt>
          <dd>{meta.complexity.space}</dd>
        </div>
      </dl>
    </aside>
  );
}
