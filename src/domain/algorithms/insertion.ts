/**
 * Insertion Sort. Grows a sorted prefix one element at a time by taking the
 * next element and shifting larger elements right to open a slot for it.
 */
import type { SortAlgorithm } from '../types';
import { createTraceBuilder } from '../trace/traceBuilder';

export const insertionSort: SortAlgorithm = (input) => {
  const builder = createTraceBuilder(input);
  const arr = [...input];
  const n = arr.length;

  builder.markSorted([0]);

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    builder.compare([i, j], `Select position ${i} (value ${key}) to insert.`, 2);

    while (j >= 0 && arr[j] > key) {
      builder.compare([j, j + 1], `Value ${arr[j]} at ${j} is greater than ${key}; shift right.`, 4);
      arr[j + 1] = arr[j];
      builder.move([...arr], [j, j + 1], `Shift value ${arr[j]} from ${j} to ${j + 1}.`, 5);
      j--;
    }
    arr[j + 1] = key;
    builder.move([...arr], [j + 1], `Insert value ${key} at position ${j + 1}.`, 7);
  }

  return builder.build();
};
