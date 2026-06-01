/**
 * Pure playback selectors and the speed clamp.
 */
import type { PlaybackState } from '../types';
import { SPEED_MIN, SPEED_MAX } from '../constants';

/** Step-backward is available only when not at the first step. */
export function canStepBackward(s: PlaybackState): boolean {
  return s.stepIndex > 0;
}

/** Step-forward is available only when not at the final step. */
export function canStepForward(s: PlaybackState, traceLength: number): boolean {
  return s.stepIndex < traceLength - 1;
}

/** Play is available only when not at the final step. */
export function canPlay(s: PlaybackState, traceLength: number): boolean {
  return s.stepIndex < traceLength - 1;
}

/** Clamp a raw speed value to the inclusive supported range. */
export function clampSpeed(raw: number): number {
  if (Number.isNaN(raw)) return SPEED_MIN;
  if (raw < SPEED_MIN) return SPEED_MIN;
  if (raw > SPEED_MAX) return SPEED_MAX;
  return raw;
}
