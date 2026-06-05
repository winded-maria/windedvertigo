'use client';

import { useEffect, useRef, useState } from 'react';
import { drawCharacter } from '@/lib/canvas/drawCharacter';
import type { CharacterKey } from '@/lib/session';

interface Props {
  characterKey: CharacterKey;
  className?: string;
  style?: React.CSSProperties;
}

/** Renders a witness pixel sprite and runs a two-step walk cycle. */
export default function CharacterSprite({ characterKey, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f ? 0 : 1)), 240);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 32, 32);
    drawCharacter(ctx, characterKey, frame);
  }, [characterKey, frame]);

  return (
    <canvas
      ref={ref}
      width={32}
      height={32}
      className={className}
      style={{ imageRendering: 'pixelated', ...style }}
    />
  );
}
