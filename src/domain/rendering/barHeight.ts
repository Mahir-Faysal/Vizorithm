/**
 * Pure bar-height mapping used by the SortingVisualizer.
 *
 * Guarantees:
 *  - equal values map to equal heights,
 *  - a larger value never maps to a shorter height than a smaller value.
 */
export function barHeight(value: number, maxValue: number, availableHeightPx: number): number {
  if (maxValue <= 0) return 0;
  return (value / maxValue) * availableHeightPx;
}
