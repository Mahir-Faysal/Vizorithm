/**
 * TraceBuilder records the step-by-step execution of a sorting algorithm.
 *
 * Algorithms read like ordinary sorts while emitting steps through this
 * builder. The builder enforces three structural invariants uniformly so each
 * algorithm only worries about its own logic:
 *   1. The first emitted step's array equals the input.
 *   2. Every step's array has the same length as the input.
 *   3. `build()` appends a final completion step marking all indices sorted.
 *
 * It also tracks cumulative comparison and swap counts per step.
 */
import type { AlgorithmStep } from '../types';

export interface TraceBuilder {
  /** Record a comparison of the given indices, with a description and source line. */
  compare(indices: number[], description: string, line?: number): void;
  /** Record a write/move/swap that mutates the working array, with a description and source line. */
  move(nextArray: number[], movingIndices: number[], description: string, line?: number): void;
  /** Mark indices as finalized (sorted) for all subsequent steps. */
  markSorted(indices: number[]): void;
  /** Produce the immutable trace, appending a completion step (all sorted). */
  build(): AlgorithmStep[];
}

export function createTraceBuilder(input: readonly number[]): TraceBuilder {
  const length = input.length;
  let current: number[] = [...input];
  const sortedSet = new Set<number>();
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  const snapshot = (
    array: number[],
    comparing: number[],
    moving: number[],
    description: string,
    line?: number,
  ): AlgorithmStep => ({
    array: [...array],
    comparing: [...comparing],
    moving: [...moving],
    sorted: [...sortedSet].sort((a, b) => a - b),
    description,
    comparisons,
    swaps,
    line,
  });

  // Seed with the initial state so the first step always equals the input.
  steps.push(snapshot(current, [], [], 'Initial unsorted array.'));

  return {
    compare(indices, description, line) {
      comparisons++;
      steps.push(snapshot(current, indices, [], description, line));
    },

    move(nextArray, movingIndices, description, line) {
      if (nextArray.length !== length) {
        throw new Error(
          `TraceBuilder.move: array length ${nextArray.length} does not match input length ${length}.`,
        );
      }
      swaps++;
      current = [...nextArray];
      steps.push(snapshot(current, [], movingIndices, description, line));
    },

    markSorted(indices) {
      for (const i of indices) {
        sortedSet.add(i);
      }
    },

    build() {
      for (let i = 0; i < length; i++) {
        sortedSet.add(i);
      }
      steps.push(snapshot(current, [], [], 'Array is fully sorted.'));
      return steps;
    },
  };
}
