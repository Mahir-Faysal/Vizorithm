/**
 * CodePanel — shows the selected algorithm's source with the currently
 * executing line highlighted as playback advances. Lightweight, dependency-free
 * syntax highlighting keeps it on-theme in both Sage light and dark.
 */
import { Fragment } from 'react';
import { useVisualizer } from '../adapters/useVisualizerState';

// Keywords worth coloring in the pseudo-source shown here.
const KEYWORDS = new Set([
  'for', 'while', 'if', 'else', 'return', 'function', 'in', 'and', 'or',
  'not', 'break', 'true', 'false', 'swap',
]);

// One token = a run that renders as a single <span>. Splitting on word
// boundaries and symbols lets us classify each piece independently.
const TOKEN_RE = /([A-Za-z_]\w*|\d+|[^A-Za-z_\d\s]+|\s+)/g;

function classFor(token: string): string {
  if (/^\s+$/.test(token)) return '';
  if (/^\d+$/.test(token)) return 'code__tok--num';
  if (KEYWORDS.has(token)) return 'code__tok--kw';
  if (/^[^A-Za-z_\d\s]+$/.test(token)) return 'code__tok--op';
  return '';
}

function highlight(line: string) {
  const tokens = line.match(TOKEN_RE) ?? [];
  return tokens.map((tok, idx) => {
    const cls = classFor(tok);
    return cls ? (
      <span key={idx} className={cls}>
        {tok}
      </span>
    ) : (
      <Fragment key={idx}>{tok}</Fragment>
    );
  });
}

export function CodePanel() {
  const { meta, currentStep } = useVisualizer();
  const activeLine = currentStep.line; // 1-based, or undefined

  return (
    <aside className="code" aria-label="Algorithm source">
      <div className="code__head">
        <span className="code__label">Pseudocode</span>
        <span className="code__name">{meta.name}</span>
      </div>
      <pre className="code__body">
        {meta.code.map((line, idx) => {
          const lineNo = idx + 1;
          const isActive = lineNo === activeLine;
          return (
            <code
              key={lineNo}
              className={`code__line${isActive ? ' code__line--active' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="code__gutter" aria-hidden="true">
                {lineNo}
              </span>
              <span className="code__text">
                {line ? highlight(line) : ' '}
              </span>
            </code>
          );
        })}
      </pre>
    </aside>
  );
}
