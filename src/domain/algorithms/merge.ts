/**
 * Merge Sort (bottom-up friendly, implemented top-down). Recursively splits the
 * array into halves, then merges sorted halves back together by repeatedly
 * taking the smaller front element.
 */
import type { SortAlgorithm } from '../types';
import { createTraceBuilder } from '../trace/traceBuilder';

export const mergeSort: SortAlgorithm = (input) => {
  const builder = createTraceBuilder(input);
  const arr = [...input];

  const merge = (lo: number, mid: number, hi: number): void => {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;

    while (i < left.length && j < right.length) {
      builder.compare([lo + i, mid + 1 + j], `Compare ${left[i]} and ${right[j]} while merging.`, 6);
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        builder.move([...arr], [k], `Place ${left[i]} into position ${k}.`, 7);
        i++;
      } else {
        arr[k] = right[j];
        builder.move([...arr], [k], `Place ${right[j]} into position ${k}.`, 9);
        j++;
      }
      k++;
    }
    while (i < left.length) {
      arr[k] = left[i];
      builder.move([...arr], [k], `Place remaining ${left[i]} into position ${k}.`, 10);
      i++;
      k++;
    }
    while (j < right.length) {
      arr[k] = right[j];
      builder.move([...arr], [k], `Place remaining ${right[j]} into position ${k}.`, 11);
      j++;
      k++;
    }
  };

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  };

  sort(0, arr.length - 1);

  return builder.build();
};
