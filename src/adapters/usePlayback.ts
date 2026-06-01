/**
 * usePlayback drives the requestAnimationFrame playback loop.
 *
 * It owns the playback reducer state and converts the configured steps/sec into
 * `TICK` actions using a time accumulator, so a slow algorithm and a fast speed
 * both behave correctly. The current speed is read from a ref so a speed change
 * applies on the very next frame. Playback pauses automatically at the final
 * step.
 */
import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { PlaybackState } from '../domain/types';
import { playbackReducer } from '../domain/playback/reducer';
import { clampSpeed } from '../domain/playback/selectors';
import { DEFAULT_SPEED } from '../domain/constants';

export interface PlaybackApi {
  state: PlaybackState;
  play(): void;
  pause(): void;
  stepForward(): void;
  stepBackward(): void;
  reset(): void;
  setSpeed(raw: number): { applied: number; wasClamped: boolean };
  loadTrace(traceLength: number): void;
}

const INITIAL_STATE: PlaybackState = {
  stepIndex: 0,
  isPlaying: false,
  speed: DEFAULT_SPEED,
};

export function usePlayback(traceLength: number): PlaybackApi {
  const lengthRef = useRef(traceLength);
  lengthRef.current = traceLength;

  const [state, rawDispatch] = useReducer(
    (s: PlaybackState, a: Parameters<typeof playbackReducer>[1]) =>
      playbackReducer(s, a, lengthRef.current),
    INITIAL_STATE,
  );

  // Keep the loop reading the latest speed / isPlaying / index without
  // re-subscribing the rAF effect on every change.
  const speedRef = useRef(state.speed);
  speedRef.current = state.speed;
  const playingRef = useRef(state.isPlaying);
  playingRef.current = state.isPlaying;
  const indexRef = useRef(state.stepIndex);
  indexRef.current = state.stepIndex;

  const play = useCallback(() => rawDispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => rawDispatch({ type: 'PAUSE' }), []);
  const stepForward = useCallback(() => rawDispatch({ type: 'STEP_FORWARD' }), []);
  const stepBackward = useCallback(() => rawDispatch({ type: 'STEP_BACKWARD' }), []);
  const reset = useCallback(() => rawDispatch({ type: 'RESET' }), []);
  const loadTrace = useCallback(
    (length: number) => rawDispatch({ type: 'LOAD_TRACE', traceLength: length }),
    [],
  );

  const setSpeed = useCallback((raw: number) => {
    const applied = clampSpeed(raw);
    rawDispatch({ type: 'SET_SPEED', speed: raw });
    return { applied, wasClamped: applied !== raw };
  }, []);

  // The rAF loop. Mounted once; reads live state from refs.
  useEffect(() => {
    let rafId = 0;
    let last = 0;
    let accumulator = 0;

    const loop = (now: number) => {
      if (!playingRef.current) {
        rafId = requestAnimationFrame(loop);
        last = now;
        return;
      }
      if (last === 0) last = now;
      accumulator += now - last;
      last = now;

      const interval = 1000 / speedRef.current;
      const stepsDue = Math.floor(accumulator / interval);
      if (stepsDue > 0) {
        accumulator -= stepsDue * interval;
        rawDispatch({ type: 'TICK', steps: stepsDue });
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return { state, play, pause, stepForward, stepBackward, reset, setSpeed, loadTrace };
}
