'use client';

import PixelNav from '@/components/ui/PixelNav';

interface Props {
  recipientName?: string;
  onNext: () => void;
  onBack?: () => void;
}

export default function LetterScreen({ recipientName, onNext, onBack }: Props) {
  const name = recipientName || 'friend';

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6 pb-32">
      <div className="max-w-lg w-full">
        <div
          className="pixel-panel p-7 md:p-10"
          style={{ background: '#f5f0e0', color: '#2e1a14' }}
        >
          <p className="font-display text-[0.7rem] mb-6 text-[#8a3828]">dear {name},</p>
          <div className="pixel-prose-sm space-y-3 text-[#3a2a1a]">
            <p>
              We&apos;re winded.vertigo — a learning design collective stoked on creating experiences,
              tools, and research that reveal moments when everything feels connected.
            </p>
            <p>
              We wanted to play a small game with you. Picture something new that&apos;s just arrived
              in your world. Maybe you made it. Maybe it found you. Maybe you&apos;re still dreaming it up.
            </p>
            <p className="text-[#8a3828]">It plays. It makes room. It&apos;s alive.</p>
            <p>
              Six visitors are coming to meet it. We&apos;re hoping you&apos;ll show us back what they said.
            </p>
            <p>No pressure. No grade. Stop anytime.</p>
          </div>
          <p className="font-display text-[0.6rem] mt-8 text-[#3a2a1a]">— w.v.</p>
        </div>
      </div>

      <PixelNav onBack={onBack} onNext={onNext} nextLabel="continue" />
    </div>
  );
}
