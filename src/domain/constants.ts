/**
 * Shared domain constants. These pin down the bounds and defaults referenced
 * throughout the app (data set size, value range, playback speed, default
 * algorithm) so there is a single source of truth.
 */
import type { AlgorithmId } from './types';

/** Inclusive minimum number of elements in a data set. */
export const SIZE_MIN = 5;
/** Inclusive maximum number of elements in a data set. */
export const SIZE_MAX = 100;
/** Default data set size on first load. */
export const DEFAULT_SIZE = 15;

/** Inclusive minimum generated value. */
export const VALUE_MIN = 1;
/** Inclusive maximum generated value. */
export const VALUE_MAX = 100;

/** Inclusive minimum playback speed in steps per second. */
export const SPEED_MIN = 1;
/** Inclusive maximum playback speed in steps per second. */
export const SPEED_MAX = 60;
/** Default playback speed in steps per second. */
export const DEFAULT_SPEED = 1;

/** Algorithm selected on first load. */
export const DEFAULT_ALGORITHM: AlgorithmId = 'bubble';

/** Declared order of algorithms in the selection list. */
export const ALGORITHM_ORDER: readonly AlgorithmId[] = [
  'bubble',
  'insertion',
  'selection',
  'merge',
  'quick',
];
