/**
 * Quick Sort (Lomuto partition). Picks the last element of a range as the
 * pivot, partitions smaller elements to its left, then recurses on each side.
 */
import type { SortAlgorithm } from '../types';
import { createTraceBuilder } from '../trace/traceBuilder';

export const quickSort: SortAlgorithm = (input) => {
  const builder = createTraceBuilder(input);
  const arr = [...input];

  const partition = (lo: number, hi: number): number => {
    const pivot = arr[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      builder.compare([j, hi], `Compare value ${arr[j]} at ${j} with pivot ${pivot}.`, 4);
      if (arr[j] < pivot) {
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          builder.move([...arr], [i, j], `Swap ${arr[j]} and ${arr[i]} around the pivot.`, 5);
        }
        i++;
      }
    }
    if (i !== hi) {
      [arr[i], arr[hi]] = [arr[hi], arr[i]];
      builder.move([...arr], [i, hi], `Move pivot ${pivot} into position ${i}.`, 6);
    }
    return i;
  };

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) {
      if (lo === hi) builder.markSorted([lo]);
      return;
    }
    const p = partition(lo, hi);
    builder.markSorted([p]);
    sort(lo, p - 1);
    sort(p + 1, hi);
  };

  sort(0, arr.length - 1);

  return builder.build();
};
