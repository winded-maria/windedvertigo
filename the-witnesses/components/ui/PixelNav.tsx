'use client';

import { useEffect } from 'react';

interface Props {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  /** Allow ←/→/Enter keys to drive navigation (desktop convenience). */
  keyboard?: boolean;
}

/**
 * Fixed bottom navigation bar with large ◀ / ▶ pixel controls.
 * Built for thumbs: 56px+ tap targets, honours the iOS safe-area inset,
 * and mirrors the on-screen arrows to the keyboard arrow keys on desktop.
 */
export default function PixelNav({
  onBack,
  onNext,
  nextLabel = 'next',
  nextDisabled = false,
  hideBack = false,
  keyboard = true,
}: Props) {
  useEffect(() => {
    if (!keyboard) return;
    const handler = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if ((e.key === 'ArrowRight' || e.key === 'Enter') && onNext && !nextDisabled) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' && onBack && !hideBack) {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack, onNext, nextDisabled, hideBack, keyboard]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-4 px-4 py-3 border-t-[3px] border-[#2e1a14] bg-[#0a0a1a]/92 backdrop-blur-sm"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      {!hideBack && (
        <button
          type="button"
          className="pixel-arrow"
          aria-label="Go back"
          onClick={onBack}
          disabled={!onBack}
        >
          ◀
        </button>
      )}
      {onNext && (
        <button
          type="button"
          className="pixel-btn"
          onClick={onNext}
          disabled={nextDisabled}
        >
          <span>{nextLabel}</span>
          <span aria-hidden>▶</span>
        </button>
      )}
    </nav>
  );
}
