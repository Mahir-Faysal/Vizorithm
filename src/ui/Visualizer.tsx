/**
 * SortLab — App shell. Canvas takes center stage, controls below.
 */
import { VisualizerProvider, useVisualizer } from '../adapters/useVisualizerState';
import { AlgorithmSelector } from './AlgorithmSelector';
import { InputControls } from './InputControls';
import { SortingVisualizer } from './SortingVisualizer';
import { PlaybackControls } from './PlaybackControls';
import { AlgorithmInfoPanel } from './AlgorithmInfoPanel';
import { StatsPanel } from './StatsPanel';
import { Notice } from './Notice';
import { ThemeToggle } from './ThemeToggle';
import { CodePanel } from './CodePanel';
import './visualizer.css';

function VisualizerLayout() {
  const { loadError, currentStep, playback, trace } = useVisualizer();
  const stepIndex = playback.state.stepIndex;
  const totalSteps = trace.length;

  return (
    <main className="app">
      <div className="app__main">
        <header className="app__header">
          <h1 className="app__title">Vizorithm</h1>
          <div className="app__header-right">
            <span className="app__status">
              Step {stepIndex + 1} / {totalSteps}
            </span>
            <ThemeToggle />
          </div>
        </header>

        <Notice message={loadError} variant="error" />

        <section className="canvas" aria-label="Visualization">
          <p className="canvas__step-description">{currentStep.description}</p>
          <SortingVisualizer />
        </section>

        <div className="panel">
          <AlgorithmSelector />

          <div className="controls-area">
            <div className="controls">
              <PlaybackControls />
              <InputControls />
            </div>
            <StatsPanel />
          </div>
        </div>

        <AlgorithmInfoPanel />
      </div>

      <CodePanel />
    </main>
  );
}

export function Visualizer() {
  return (
    <VisualizerProvider>
      <VisualizerLayout />
    </VisualizerProvider>
  );
}
