/**
 * useVisualizerState owns the top-level application state and exposes it through
 * React Context: the selected algorithm, the current data set, the derived
 * (memoized) trace, the current step, any load error, and the playback API.
 *
 * The trace is recomputed whenever the selected algorithm or data set changes,
 * and the playback cursor is reset to step 0 via LOAD_TRACE. Computing a trace
 * is wrapped in a try/catch so a thrown algorithm error becomes a typed failure
 * that preserves the previously rendered view instead of crashing.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AlgorithmId, AlgorithmMeta, AlgorithmStep, AlgorithmTrace } from '../domain/types';
import { ALGORITHMS } from '../domain/algorithms';
import { DEFAULT_ALGORITHM, DEFAULT_SIZE } from '../domain/constants';
import { clampSize, generateDataSet } from '../domain/dataset';
import { usePlayback, type PlaybackApi } from './usePlayback';

export interface ClampResult {
  applied: number;
  wasClamped: boolean;
}

export interface VisualizerState {
  selectedId: AlgorithmId;
  selectAlgorithm(id: AlgorithmId): void;
  meta: AlgorithmMeta;
  dataSet: readonly number[];
  size: number;
  setSize(requested: number): ClampResult;
  regenerate(): void;
  trace: AlgorithmTrace;
  currentStep: AlgorithmStep;
  loadError: string | null;
  playback: PlaybackApi;
}

const EMPTY_STEP: AlgorithmStep = {
  array: [],
  comparing: [],
  moving: [],
  sorted: [],
  description: '',
  comparisons: 0,
  swaps: 0,
};

const VisualizerContext = createContext<VisualizerState | null>(null);

export function VisualizerProvider({ children }: { children: ReactNode }) {
  const value = useVisualizerStateInternal();
  return <VisualizerContext.Provider value={value}>{children}</VisualizerContext.Provider>;
}

export function useVisualizer(): VisualizerState {
  const ctx = useContext(VisualizerContext);
  if (!ctx) {
    throw new Error('useVisualizer must be used within a VisualizerProvider.');
  }
  return ctx;
}

function useVisualizerStateInternal(): VisualizerState {
  const [selectedId, setSelectedId] = useState<AlgorithmId>(DEFAULT_ALGORITHM);
  const [size, setSizeState] = useState<number>(DEFAULT_SIZE);
  const [dataSet, setDataSet] = useState<readonly number[]>(() => generateDataSet(DEFAULT_SIZE));
  const [loadError, setLoadError] = useState<string | null>(null);

  // The last successfully computed trace, retained if a recompute fails.
  const lastGoodTrace = useRef<AlgorithmTrace>([EMPTY_STEP]);

  // Compute the trace once; on failure, keep the previous good trace and flag
  // the error. `failed` is derived in the same pass to avoid double work.
  const { trace, failed } = useMemo<{ trace: AlgorithmTrace; failed: boolean }>(() => {
    const meta = ALGORITHMS[selectedId];
    try {
      const computed = meta.sort(dataSet);
      const result = computed.length > 0 ? computed : [EMPTY_STEP];
      lastGoodTrace.current = result;
      return { trace: result, failed: false };
    } catch {
      return { trace: lastGoodTrace.current, failed: true };
    }
  }, [selectedId, dataSet]);

  useEffect(() => {
    setLoadError(
      failed ? `Failed to load the visualization for ${ALGORITHMS[selectedId].name}.` : null,
    );
  }, [failed, selectedId]);

  const playback = usePlayback(trace.length);
  const { loadTrace } = playback;

  // Reset the cursor whenever the trace identity changes.
  useEffect(() => {
    loadTrace(trace.length);
  }, [trace, loadTrace]);

  const selectAlgorithm = useCallback((id: AlgorithmId) => {
    setSelectedId(id);
  }, []);

  const regenerate = useCallback(() => {
    setDataSet(generateDataSet(size));
  }, [size]);

  const setSize = useCallback((requested: number): ClampResult => {
    const applied = clampSize(requested);
    setSizeState(applied);
    setDataSet(generateDataSet(applied));
    return { applied, wasClamped: applied !== requested };
  }, []);

  const meta = ALGORITHMS[selectedId];
  const currentStep =
    trace[Math.min(playback.state.stepIndex, trace.length - 1)] ?? EMPTY_STEP;

  return {
    selectedId,
    selectAlgorithm,
    meta,
    dataSet,
    size,
    setSize,
    regenerate,
    trace,
    currentStep,
    loadError,
    playback,
  };
}
