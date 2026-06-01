/**
 * Bubble Sort. Repeatedly steps through the array, comparing adjacent pairs and
 * swapping them when out of order, "bubbling" the largest unsorted value to the
 * end on each pass.
 */
import type { SortAlgorithm } from '../types';
import { createTraceBuilder } from '../trace/traceBuilder';

export const bubbleSort: SortAlgorithm = (input) => {
  const builder = createTraceBuilder(input);
  const arr = [...input];
  const n = arr.length;

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      builder.compare([i, i + 1], `Compare positions ${i} and ${i + 1}.`);
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        builder.move([...arr], [i, i + 1], `Swap positions ${i} and ${i + 1}.`);
        swapped = true;
      }
    }
    // The largest remaining value is now in its final position.
    builder.markSorted([n - 1 - pass]);
    if (!swapped) break;
  }

  return builder.build();
};
