/**
 * Bar-state classifier.
 *
 * Each index in a step is assigned exactly one visual state using a fixed
 * precedence so the four states are pairwise distinguishable:
 *
 *   completion > moving > comparing > neutral
 *
 * "completion" applies at the final step where every index is sorted; until
 * then a sorted index renders as "neutral" unless it is actively comparing or
 * moving (sorted styling for partially-finalized regions is handled separately
 * by the view via the step's `sorted` set if desired).
 */
import type { AlgorithmStep } from '../types';

export type BarState = 'completion' | 'moving' | 'comparing' | 'sorted' | 'neutral';

/**
 * Classify a single index within a step.
 *
 * @param index position in the array
 * @param step  the current algorithm step
 */
export function classifyBar(index: number, step: AlgorithmStep): BarState {
  const allSorted = step.sorted.length === step.array.length && step.array.length > 0;
  if (allSorted) return 'completion';
  if (step.moving.includes(index)) return 'moving';
  if (step.comparing.includes(index)) return 'comparing';
  if (step.sorted.includes(index)) return 'sorted';
  return 'neutral';
}

/** Classify every index of a step, returning an array aligned with `step.array`. */
export function classifyAll(step: AlgorithmStep): BarState[] {
  return step.array.map((_, i) => classifyBar(i, step));
}
