/**
 * Algorithm registry: the single source of truth for the selectable algorithms,
 * their display metadata, complexity characteristics, and sort functions.
 */
import type { AlgorithmRegistry } from '../types';
import { ALGORITHM_ORDER } from '../constants';
import { bubbleSort } from './bubble';
import { insertionSort } from './insertion';
import { selectionSort } from './selection';
import { mergeSort } from './merge';
import { quickSort } from './quick';

export const ALGORITHMS: AlgorithmRegistry = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    description:
      'Bubble Sort repeatedly steps through the list, comparing adjacent elements and swapping them if they are in the wrong order. With each pass the largest remaining element "bubbles up" to its final position at the end.',
    complexity: { averageTime: 'O(n^2)', worstTime: 'O(n^2)', space: 'O(1)' },
    code: [
      'for pass in 0..n-1:',
      '  swapped = false',
      '  for i in 0..n-1-pass:',
      '    if a[i] > a[i+1]:',
      '      swap(a[i], a[i+1])',
      '      swapped = true',
      '  if not swapped: break',
    ],
    sort: bubbleSort,
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    description:
      'Insertion Sort builds the sorted array one item at a time. It takes each new element and inserts it into its correct place within the already-sorted portion by shifting larger elements to the right.',
    complexity: { averageTime: 'O(n^2)', worstTime: 'O(n^2)', space: 'O(1)' },
    code: [
      'for i in 1..n-1:',
      '  key = a[i]; j = i-1',
      '',
      '  while j>=0 and a[j]>key:',
      '    a[j+1] = a[j]',
      '    j = j - 1',
      '  a[j+1] = key',
    ],
    sort: insertionSort,
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    description:
      'Selection Sort divides the array into a sorted and unsorted region. On each pass it scans the unsorted region for the smallest element and swaps it into the next sorted position.',
    complexity: { averageTime: 'O(n^2)', worstTime: 'O(n^2)', space: 'O(1)' },
    code: [
      'for i in 0..n-1:',
      '  min = i',
      '  for j in i+1..n:',
      '    if a[j] < a[min]:',
      '      min = j',
      '  if min != i:',
      '    swap(a[i], a[min])',
    ],
    sort: selectionSort,
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    description:
      'Merge Sort is a divide-and-conquer algorithm that recursively splits the array into halves, sorts each half, and then merges the sorted halves back together in linear time.',
    complexity: { averageTime: 'O(n log n)', worstTime: 'O(n log n)', space: 'O(n)' },
    code: [
      'merge(lo, mid, hi):',
      '  L = a[lo..mid]',
      '  R = a[mid+1..hi]',
      '  i = j = 0; k = lo',
      '  while i<|L| and j<|R|:',
      '    if L[i] <= R[j]:',
      '      a[k++] = L[i++]',
      '    else:',
      '      a[k++] = R[j++]',
      '  drain L into a[k++]',
      '  drain R into a[k++]',
    ],
    sort: mergeSort,
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    description:
      'Quick Sort picks a pivot element and partitions the array so that smaller values come before it and larger values after it, then recursively sorts the partitions. It is fast on average but degrades on already-ordered input.',
    complexity: { averageTime: 'O(n log n)', worstTime: 'O(n^2)', space: 'O(log n)' },
    code: [
      'partition(lo, hi):',
      '  pivot = a[hi]; i = lo',
      '  for j in lo..hi-1:',
      '    if a[j] < pivot:',
      '      swap(a[i], a[j]); i++',
      '  swap(a[i], a[hi])',
      '  return i',
    ],
    sort: quickSort,
  },
};

export { ALGORITHM_ORDER };
