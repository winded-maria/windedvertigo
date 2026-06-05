'use client';

import { useState } from 'react';
import PixelNav from '@/components/ui/PixelNav';

interface Props {
  onSubmit: (seedName: string) => void;
  isLoading?: boolean;
}

export default function SeedNamingScreen({ onSubmit, isLoading }: Props) {
  const [name, setName] = useState('');

  const word = name.trim().split(/\s+/)[0];
  const canSubmit = !!word && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(word);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6 pb-32">
      <div className="max-w-sm w-full text-center">
        <p className="font-display text-white/85 text-sm sm:text-base leading-relaxed mb-10">
          name your seed<br />in one word.
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          className="pixel-input text-center text-2xl"
          placeholder="…"
          autoFocus
          maxLength={30}
        />
      </div>

      <PixelNav
        onNext={handleSubmit}
        nextLabel={isLoading ? 'saving…' : 'done'}
        nextDisabled={!canSubmit}
        hideBack
      />
    </div>
  );
}
