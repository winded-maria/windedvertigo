'use client';

import { useState } from 'react';
import type { GameSession } from '@/lib/session';
import { CHARACTERS } from '@/lib/characters';
import PixelButton from '@/components/ui/PixelButton';

interface Props {
  session: GameSession;
}

export default function PostcardScreen({ session }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lastImageUrl = session.visits.at(-1)?.imageUrl;

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Postcard */}
        <div
          className="pixel-panel overflow-hidden"
          style={{ background: '#f5f0e0', color: '#2e1a14' }}
        >
          {/* Header */}
          <div className="px-7 pt-7 pb-4 border-b-[3px] border-[#c8624e]/30">
            <p className="pixel-prose-sm text-[#8a3828] mb-2">&ldquo;{session.seedPhrase}&rdquo;</p>
            {session.seedName && (
              <p className="font-display text-xl sm:text-2xl text-[#2e1a14] mt-3 break-words">
                {session.seedName}
              </p>
            )}
          </div>

          {/* Seed image */}
          {(session.seedImageUrl || lastImageUrl) && (
            <div className="w-full">
              <img
                src={session.seedImageUrl ?? lastImageUrl}
                alt="The world"
                className="w-full pixelated"
              />
            </div>
          )}

          {/* Visit panels */}
          <div className="px-7 py-6 space-y-4">
            {session.visits.map((visit, i) => {
              const char = CHARACTERS[visit.character];
              return (
                <div
                  key={i}
                  className="border-l-[4px] pl-4 py-1"
                  style={{ borderColor: char.accentColor }}
                >
                  <div className="font-display text-[0.55rem] uppercase tracking-wider text-[#8a3828] mb-1.5">
                    {char.name}
                  </div>
                  <p className="pixel-prose-sm text-[#3a2a1a]">
                    {visit.playerText}
                    {visit.secondText && (
                      <span className="block mt-1 text-[#8a3828]">/ {visit.secondText}</span>
                    )}
                  </p>
                  <p className="font-body text-base text-[#8a3828]/70 mt-1">— {visit.feltSense}</p>
                </div>
              );
            })}
          </div>

          {/* Final evolved image */}
          {lastImageUrl && lastImageUrl !== session.seedImageUrl && (
            <div className="w-full border-t-[3px] border-[#c8624e]/30">
              <img src={lastImageUrl} alt="The evolved world" className="w-full pixelated" />
            </div>
          )}

          {/* Closing text */}
          <div className="px-7 py-8 border-t-[3px] border-[#c8624e]/30">
            <div className="pixel-prose-sm text-[#3a2a1a] space-y-1.5">
              <p>It moved when you spoke.</p>
              <p>It made room for who wasn&apos;t there.</p>
              <p>It survived being inverted.</p>
              <p className="text-[#8a3828]">That&apos;s how we know it&apos;s alive.</p>
            </div>
            <p className="font-body text-base text-[#8a3828]/70 mt-6">
              — sent into the world by w.v., who care about moments when everything feels connected.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <PixelButton arrow="none" onClick={handleCopyLink}>
            {copied ? 'link copied ✓' : 'copy link'}
          </PixelButton>
          <PixelButton variant="ghost" arrow="none" onClick={() => (window.location.href = '/')}>
            play again
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
