/**
 * Input controls: shuffle button + array size slider.
 */
import { useState } from 'react';
import { useVisualizer } from '../adapters/useVisualizerState';
import { SIZE_MIN, SIZE_MAX } from '../domain/constants';
import { Notice } from './Notice';

export function InputControls() {
  const { size, setSize, regenerate } = useVisualizer();
  const [sizeNotice, setSizeNotice] = useState<string | null>(null);

  const onSizeChange = (raw: number) => {
    const { applied, wasClamped } = setSize(raw);
    setSizeNotice(wasClamped ? `Clamped to ${applied}` : null);
  };

  return (
    <>
      <button type="button" className="btn" onClick={regenerate} aria-label="Shuffle array">
        SHUFFLE
      </button>

      <div className="slider-group">
        <span className="slider-label">Size</span>
        <input
          type="range"
          min={SIZE_MIN}
          max={SIZE_MAX}
          step={1}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          aria-label="Array size"
        />
        <span className="slider-value">{size}</span>
      </div>

      <Notice message={sizeNotice} />
    </>
  );
}
