'use client';

import { useState } from 'react';
import PixelNav from '@/components/ui/PixelNav';

interface Props {
  recipientName?: string;
  onSubmit: (seedPhrase: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const HINTS = [
  'a community library that stays open all night',
  'a free public bookcart',
  "a repair café where neighbors fix each other's things",
];

export default function SeedScreen({ onSubmit, onBack, isLoading }: Props) {
  const [text, setText] = useState('');
  const [showHints, setShowHints] = useState(false);

  const canSubmit = text.trim().length >= 3 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(text.trim());
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6 pb-32">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8 space-y-3">
          <p className="font-display text-white/85 text-sm sm:text-base leading-relaxed">
            something awesome has just<br />been launched into the world.
          </p>
          <p className="pixel-prose-sm text-white/60">It&apos;s still warm from your hands.</p>
          <p className="pixel-prose-sm text-[#f0b440]">It plays. It makes room. It&apos;s alive.</p>
          <p className="pixel-prose-sm text-white/50 max-w-sm mx-auto">
            Six visitors are coming to meet it. They won&apos;t all agree with you,
            and they won&apos;t all agree with each other. That&apos;s the point.
          </p>
          <p className="font-display text-white/75 text-xs pt-2">tell us — what did you make?</p>
        </div>

        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="pixel-input resize-none min-h-[110px]"
            placeholder="Describe what you made, found, or dreamed…"
            maxLength={300}
          />

          <div className="text-sm text-white/30 font-body text-right">
            {text.length} chars {text.length < 60 ? '(try 60–140)' : ''}
          </div>

          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="font-body text-lg text-white/35 hover:text-white/70 transition-colors"
          >
            {showHints ? 'hide hints ↑' : 'stuck? try one of these… ↓'}
          </button>

          {showHints && (
            <div className="space-y-2">
              {HINTS.map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => {
                    setText(hint);
                    setShowHints(false);
                  }}
                  className="pixel-option block w-full text-left"
                >
                  {hint}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <PixelNav
        onBack={onBack}
        onNext={handleSubmit}
        nextLabel={isLoading ? 'planting…' : 'plant it'}
        nextDisabled={!canSubmit}
      />
    </div>
  );
}
