/**
 * Selection Sort. On each pass, scans the unsorted suffix to find the minimum
 * and swaps it into the first unsorted position.
 */
import type { SortAlgorithm } from '../types';
import { createTraceBuilder } from '../trace/traceBuilder';

export const selectionSort: SortAlgorithm = (input) => {
  const builder = createTraceBuilder(input);
  const arr = [...input];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      builder.compare([minIndex, j], `Compare current minimum at ${minIndex} with position ${j}.`);
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      builder.move([...arr], [i, minIndex], `Swap minimum into position ${i}.`);
    }
    builder.markSorted([i]);
  }
  builder.markSorted([n - 1]);

  return builder.build();
};
