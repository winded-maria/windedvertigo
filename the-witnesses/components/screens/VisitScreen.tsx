'use client';

import { useState, useEffect } from 'react';
import type { GameSession, CharacterKey, Visit } from '@/lib/session';
import { CHARACTERS } from '@/lib/characters';
import WorldCanvas from '@/components/WorldCanvas';
import VisitorCard from '@/components/VisitorCard';

interface Props {
  session: GameSession;
  currentVisitIndex: number;
  onVisitComplete: (visit: Visit) => void;
  isImageLoading?: boolean;
}

export default function VisitScreen({ session, currentVisitIndex, onVisitComplete, isImageLoading }: Props) {
  const [playerWord, setPlayerWord] = useState<string | undefined>(undefined);
  const characterKey: CharacterKey = session.visitOrder[currentVisitIndex];
  const character = CHARACTERS[characterKey];
  const currentImage = session.visits.at(-1)?.imageUrl ?? session.seedImageUrl;

  const arrivalLineIndex = currentVisitIndex % 3; // deterministic per visit

  useEffect(() => {
    // Extract word from seed phrase for characters that need [PLAYER_WORD]
    if (characterKey === 'explorer' || characterKey === 'trickster') {
      fetch('/api/extract-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: session.seedPhrase }),
      })
        .then((r) => r.json())
        .then((d) => setPlayerWord(d.word ?? 'thing'))
        .catch(() => setPlayerWord('thing'));
    }
  }, [characterKey, session.seedPhrase]);

  const handleComplete = (data: {
    playerText: string;
    secondText?: string;
    feltSense: string;
    objectChoice?: 'lamp' | 'blanket' | 'mug';
    erasedElement?: string;
  }) => {
    const visit: Visit = {
      character: characterKey,
      arrivalLineIndex,
      playerText: data.playerText,
      secondText: data.secondText,
      feltSense: data.feltSense,
      objectChoice: data.objectChoice,
      erasedElement: data.erasedElement,
    };
    onVisitComplete(visit);
  };

  const visitNumber = currentVisitIndex + 1;
  const totalVisits = session.visitOrder.length;

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center py-6 px-4 gap-6">
      {/* Progress HUD — pixel hearts/blocks */}
      <div className="w-full max-w-2xl flex items-center gap-3">
        <span className="font-display text-[0.55rem] text-white/45 whitespace-nowrap">
          {visitNumber}/{totalVisits}
        </span>
        <div className="flex-1 flex gap-1.5" aria-label={`visitor ${visitNumber} of ${totalVisits}`}>
          {Array.from({ length: totalVisits }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-3 border-2 border-white/20"
              style={{
                background: i < visitNumber ? 'rgba(240,180,64,0.85)' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      {/* World canvas in a pixel frame */}
      <div className="w-full max-w-3xl pixel-frame">
        <WorldCanvas
          imageUrl={currentImage}
          isLoading={isImageLoading}
          showGhostOverlay={characterKey === 'ghost' && !currentImage}
        />
      </div>

      {/* Visitor card */}
      <VisitorCard
        key={`${characterKey}-${currentVisitIndex}`}
        character={character}
        arrivalLineIndex={arrivalLineIndex}
        playerWord={playerWord}
        seedPhrase={session.seedPhrase}
        onComplete={handleComplete}
      />
    </div>
  );
}
