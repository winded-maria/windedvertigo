'use client';

import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  arrow?: 'left' | 'right' | 'none';
  accentColor?: string;
};

/**
 * Chunky 8-bit button: hard pixel border + offset shadow + press effect.
 * Use `arrow` to append a ◀ / ▶ glyph for directional navigation.
 */
export default function PixelButton({
  variant = 'primary',
  arrow = 'right',
  accentColor,
  className = '',
  children,
  style,
  ...rest
}: Props) {
  const cls = variant === 'ghost' ? 'pixel-btn pixel-btn--ghost' : 'pixel-btn';
  const accentStyle =
    accentColor && variant !== 'ghost'
      ? { background: accentColor, borderColor: 'var(--ink)', ...style }
      : style;

  return (
    <button className={`${cls} ${className}`} style={accentStyle} {...rest}>
      {arrow === 'left' && <span aria-hidden>◀</span>}
      <span>{children}</span>
      {arrow === 'right' && <span aria-hidden>▶</span>}
    </button>
  );
}
