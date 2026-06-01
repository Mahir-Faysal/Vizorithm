/**
 * Playback controls: play/pause (prominent), step, reset, speed slider.
 */
import { useState } from 'react';
import { useVisualizer } from '../adapters/useVisualizerState';
import { canPlay, canStepBackward, canStepForward } from '../domain/playback/selectors';
import { SPEED_MIN, SPEED_MAX } from '../domain/constants';
import { Notice } from './Notice';

export function PlaybackControls() {
  const { playback, trace } = useVisualizer();
  const { state, play, pause, stepForward, stepBackward, reset, setSpeed } = playback;
  const [speedNotice, setSpeedNotice] = useState<string | null>(null);

  const len = trace.length;
  const atStart = !canStepBackward(state);
  const atEnd = !canStepForward(state, len);

  const onSpeedChange = (raw: number) => {
    const { applied, wasClamped } = setSpeed(raw);
    setSpeedNotice(wasClamped ? `Clamped to ${applied}` : null);
  };

  return (
    <>
      <div className="controls__buttons">
        <button type="button" className="btn" onClick={reset} disabled={atStart} aria-label="Reset">
          ⟲
        </button>
        <button type="button" className="btn" onClick={stepBackward} disabled={atStart} aria-label="Step back">
          ◂
        </button>
        {state.isPlaying ? (
          <button type="button" className="btn btn--play" onClick={pause} aria-label="Pause">
            PAUSE
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--play"
            onClick={play}
            disabled={!canPlay(state, len)}
            aria-label="Play"
          >
            PLAY
          </button>
        )}
        <button type="button" className="btn" onClick={stepForward} disabled={atEnd} aria-label="Step forward">
          ▸
        </button>
      </div>

      <div className="slider-group">
        <span className="slider-label">Speed</span>
        <input
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={1}
          value={state.speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          aria-label="Playback speed"
        />
        <span className="slider-value">{state.speed}×</span>
      </div>

      <Notice message={speedNotice} />
    </>
  );
}
