'use client';

import { GHOST_ERASABLE_ELEMENTS } from '@/lib/characters';

interface Props {
  selectedElement: string | null;
  onSelect: (element: string) => void;
}

export default function GhostEraser({ selectedElement, onSelect }: Props) {
  return (
    <div className="mt-4">
      <p className="font-display text-[0.55rem] text-white/50 uppercase tracking-wider mb-3">
        tap something to erase:
      </p>
      <div className="flex flex-wrap gap-2">
        {GHOST_ERASABLE_ELEMENTS.map((el) => (
          <button
            key={el.key}
            onClick={() => onSelect(el.key)}
            className="pixel-option"
            data-selected={selectedElement === el.key}
          >
            {el.label}
          </button>
        ))}
      </div>
    </div>
  );
}
