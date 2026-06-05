'use client';

import { useState, useEffect } from 'react';
import PixelNav from '@/components/ui/PixelNav';

interface Props {
  onNext: () => void;
  onBack?: () => void;
}

const LINES = [
  "you don't have to be ready.",
  "you don't have to be right.",
  'you can stop after any visitor.',
];

export default function PermissionsScreen({ onNext, onBack }: Props) {
  const [visible, setVisible] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const timers = LINES.map((_, i) =>
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 450)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 pb-32">
      <div className="max-w-md w-full text-center space-y-8">
        {LINES.map((line, i) => (
          <p
            key={line}
            className="font-display text-white/80 text-sm sm:text-base leading-relaxed transition-all duration-500"
            style={{
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? 'translateY(0)' : 'translateY(6px)',
            }}
          >
            {line}
          </p>
        ))}
      </div>

      <PixelNav onBack={onBack} onNext={onNext} nextLabel="begin" />
    </div>
  );
}
