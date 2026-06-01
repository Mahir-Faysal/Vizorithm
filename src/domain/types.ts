/**
 * Core domain types for the Algorithm Visualizer.
 *
 * The domain layer is pure and framework-free: no React, no DOM. Algorithms
 * are pure functions that turn an input array into an immutable, ordered
 * sequence of `AlgorithmStep` snapshots (a "trace"). Playback is a cursor over
 * that trace; rendering is a pure view of the current step.
 */

/** Stable identifier for each supported sorting algorithm. */
export type AlgorithmId = 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick';

/**
 * One discrete state in an algorithm's execution. Rendering one step produces
 * exactly one animation frame.
 */
export interface AlgorithmStep {
  /** Full snapshot of the array at this step. `array.length === input.length`. */
  array: readonly number[];
  /** Indices currently being compared. */
  comparing: readonly number[];
  /** Indices currently being swapped/moved. */
  moving: readonly number[];
  /** Indices known to be in their final sorted position. */
  sorted: readonly number[];
  /** Human-readable explanation of the action at this step. */
  description: string;
  /** Cumulative comparison count up to and including this step. */
  comparisons: number;
  /** Cumulative swap/move count up to and including this step. */
  swaps: number;
}

/** An immutable, ordered sequence of steps produced by running an algorithm. */
export type AlgorithmTrace = readonly AlgorithmStep[];

/**
 * A pure sorting function. Given an input array it returns the complete,
 * ordered trace of steps. It MUST NOT mutate the input. The first step's array
 * equals the input; the last step is fully sorted.
 */
export type SortAlgorithm = (input: readonly number[]) => AlgorithmStep[];

/** Static, display-oriented metadata plus the algorithm function. */
export interface AlgorithmMeta {
  id: AlgorithmId;
  /** Display name, e.g. "Bubble Sort". */
  name: string;
  /** Prose explanation of how the algorithm works. */
  description: string;
  complexity: {
    /** Average-case time complexity in Big-O, e.g. "O(n^2)". */
    averageTime: string;
    /** Worst-case time complexity in Big-O. */
    worstTime: string;
    /** Space complexity in Big-O. */
    space: string;
  };
  sort: SortAlgorithm;
}

/** The registry is the single source of truth for the selectable algorithms. */
export type AlgorithmRegistry = Record<AlgorithmId, AlgorithmMeta>;

/** Playback state: a cursor into a trace plus play/speed flags. */
export interface PlaybackState {
  /** Cursor into the trace; always within `[0, traceLength - 1]`. */
  stepIndex: number;
  /** Whether the animation is currently advancing. */
  isPlaying: boolean;
  /** Steps per second; always within `[SPEED_MIN, SPEED_MAX]`. */
  speed: number;
}

/** Actions accepted by the playback reducer. */
export type PlaybackAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'RESET' }
  | { type: 'TICK'; steps: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'LOAD_TRACE'; traceLength: number };
