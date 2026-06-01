/**
 * Data set utilities: generation and size clamping.
 *
 * `generateDataSet` takes an injectable RNG so it is deterministic in tests and
 * defaults to `Math.random` in the app.
 */
import { SIZE_MIN, SIZE_MAX, VALUE_MIN, VALUE_MAX } from './constants';

/** Clamp a requested size to the inclusive Supported_Size_Range. */
export function clampSize(requested: number): number {
  if (Number.isNaN(requested)) return SIZE_MIN;
  const rounded = Math.round(requested);
  if (rounded < SIZE_MIN) return SIZE_MIN;
  if (rounded > SIZE_MAX) return SIZE_MAX;
  return rounded;
}

/**
 * Generate a data set of exactly `size` integers, each uniformly random in the
 * inclusive range `[VALUE_MIN, VALUE_MAX]`.
 *
 * @param size number of elements (assumed already within range)
 * @param rng  source of randomness in `[0, 1)`; defaults to `Math.random`
 */
export function generateDataSet(size: number, rng: () => number = Math.random): number[] {
  const span = VALUE_MAX - VALUE_MIN + 1;
  const result: number[] = new Array(size);
  for (let i = 0; i < size; i++) {
    result[i] = VALUE_MIN + Math.floor(rng() * span);
  }
  return result;
}
