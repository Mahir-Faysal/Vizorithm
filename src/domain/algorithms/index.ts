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
    sort: bubbleSort,
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    description:
      'Insertion Sort builds the sorted array one item at a time. It takes each new element and inserts it into its correct place within the already-sorted portion by shifting larger elements to the right.',
    complexity: { averageTime: 'O(n^2)', worstTime: 'O(n^2)', space: 'O(1)' },
    sort: insertionSort,
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    description:
      'Selection Sort divides the array into a sorted and unsorted region. On each pass it scans the unsorted region for the smallest element and swaps it into the next sorted position.',
    complexity: { averageTime: 'O(n^2)', worstTime: 'O(n^2)', space: 'O(1)' },
    sort: selectionSort,
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    description:
      'Merge Sort is a divide-and-conquer algorithm that recursively splits the array into halves, sorts each half, and then merges the sorted halves back together in linear time.',
    complexity: { averageTime: 'O(n log n)', worstTime: 'O(n log n)', space: 'O(n)' },
    sort: mergeSort,
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    description:
      'Quick Sort picks a pivot element and partitions the array so that smaller values come before it and larger values after it, then recursively sorts the partitions. It is fast on average but degrades on already-ordered input.',
    complexity: { averageTime: 'O(n log n)', worstTime: 'O(n^2)', space: 'O(log n)' },
    sort: quickSort,
  },
};

export { ALGORITHM_ORDER };
