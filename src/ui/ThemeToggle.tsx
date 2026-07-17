/**
 * Theme toggle. Flips document[data-theme] between dark (default) and light,
 * persisting the choice to localStorage. The initial attribute is set by an
 * inline script in index.html to avoid a flash before React mounts.
 *
 * On toggle it uses the native View Transitions API to reveal the new theme
 * with a circle expanding from the click point. Browsers without the API
 * (e.g. Firefox), or users who prefer reduced motion, get an instant swap.
 */
import { useState } from 'react';

type Theme = 'dark' | 'light';

function current(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(current);

  const apply = (next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fallback: no View Transitions support or reduced motion → instant swap.
    if (reduce || !('startViewTransition' in document)) {
      apply(next);
      return;
    }

    // Origin = click point; radius = farthest corner so the circle covers all.
    const x = e.clientX;
    const y = e.clientY;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const root = document.documentElement;
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', `${radius}px`);
    root.dataset.vt = 'circle';

    const vt = (
      document as Document & {
        startViewTransition(cb: () => void): { finished: Promise<void> };
      }
    ).startViewTransition(() => apply(next));

    vt.finished.finally(() => {
      delete root.dataset.vt;
    });
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title="Toggle theme"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
