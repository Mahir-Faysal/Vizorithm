/**
 * Pure playback state machine.
 *
 * The reducer holds only a cursor (`stepIndex`) plus `isPlaying` and `speed`.
 * `traceLength` is supplied per call so the reducer can clamp the cursor
 * without holding the trace itself. Every cursor-moving action clamps to
 * `[0, traceLength - 1]`, making out-of-bounds indices impossible by
 * construction.
 */
import type { PlaybackState, PlaybackAction } from '../types';
import { clampSpeed } from './selectors';

const clampIndex = (index: number, traceLength: number): number => {
  const max = Math.max(0, traceLength - 1);
  if (index < 0) return 0;
  if (index > max) return max;
  return index;
};

const isFinal = (index: number, traceLength: number): boolean =>
  index >= traceLength - 1;

export function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction,
  traceLength: number,
): PlaybackState {
  switch (action.type) {
    case 'PLAY': {
      // Cannot play from the final step.
      if (isFinal(state.stepIndex, traceLength)) return state;
      return { ...state, isPlaying: true };
    }

    case 'PAUSE': {
      return { ...state, isPlaying: false };
    }

    case 'STEP_FORWARD': {
      return {
        ...state,
        isPlaying: false,
        stepIndex: clampIndex(state.stepIndex + 1, traceLength),
      };
    }

    case 'STEP_BACKWARD': {
      return {
        ...state,
        isPlaying: false,
        stepIndex: clampIndex(state.stepIndex - 1, traceLength),
      };
    }

    case 'RESET': {
      return { ...state, isPlaying: false, stepIndex: 0 };
    }

    case 'TICK': {
      const next = clampIndex(state.stepIndex + action.steps, traceLength);
      // Stop advancing when we reach the final step.
      const playing = isFinal(next, traceLength) ? false : state.isPlaying;
      return { ...state, stepIndex: next, isPlaying: playing };
    }

    case 'SET_SPEED': {
      return { ...state, speed: clampSpeed(action.speed) };
    }

    case 'LOAD_TRACE': {
      return { ...state, stepIndex: 0, isPlaying: false };
    }

    default:
      return state;
  }
}
